import { createSessionApi, getSessionDetailApi, getSessionListApi } from '@/api/domainManagement/ai'
import { ROLE } from '@/api/domainManagement/ai/constants'
import { ChatMsg } from '@/api/domainManagement/ai/interfaces'
import { ElMessage } from 'element-plus'
import { ref, VNode } from 'vue'
import type { ChatSession } from '~/api/domainManagement/ai/interfaces'
import { useLoading } from './useLoading/index'
import { useSSEChat } from './useSSEChat'

type UseAiChatOptions = {
  chatScene: string //  本次对话的类型
  closeHistory?: boolean // 是否需要更新history
  onScrollToBottom?: () => void
  onError?: (err: unknown) => void
  /** 加载动画实例 */
  loading?: VNode
}

type SendStreamOptions = {
  /** 用户输入内容，若为重新生成回答不需要 */
  text?: string
  /** 重新生成的消息对象 */
  regenerateFrom?: ChatMsg
  /** 会话数据携带 */
  metaData?: any
}

export function useChatStream(props: UseAiChatOptions) {
  const abortController = ref<AbortController | null>(null)
  const messages = ref<ChatMsg[]>([])
  // 当前会话ID
  const currentSessionId = ref<number | null>(null)
  // 当前正在重新生成的消息
  const curMessage = ref<ChatMsg | null>(null)
  // 加载状态
  const isLoading = ref(false)
  // 恢复失败文本
  const RESEND_FAIL_TEXT = 'AI 回复失败，请稍后重试～'
  // 对话历史列表 - 使用 ChatSession 类型
  const chatHistory = ref<ChatSession[]>([])

  const loadingVNode = props.loading ?? useLoading(24, '#409EFF')
  // 发送流式消息
  const sendStream = async (options: SendStreamOptions) => {
    const { text, regenerateFrom, metaData } = options
    const isRegenerate = !!regenerateFrom
    let messageContent: string | null = null

    if (!isRegenerate) {
      // 判断是否为重新生成
      if (!text.trim()) {
        return
      }
      messageContent = text.trim()
      const userMessage: ChatMsg = {
        messageId: Date.now(),
        role: ROLE.USER,
        message: messageContent,
      }
      messages.value.push(userMessage)
      props.onScrollToBottom()
    } else {
      messageContent = null
    }
    // 如果已有请求在进行，先中断
    if (abortController.value) {
      stopStream()
    }
    // 添加加载中的消息（初始内容为空字符串，用于累加）
    const loadingMessage: ChatMsg = {
      messageId: Date.now() + 1,
      role: ROLE.ASSISTANT,
      message: loadingVNode,
      loading: (isLoading.value = true),
    }
    messages.value.push(loadingMessage)

    try {
      // 如果是第一次进入或没有会话ID，先创建会话
      if (!currentSessionId.value) {
        const sessionName =
          (metaData?.domain ? metaData?.domain : messageContent) +
          ' ' +
          new Date().toLocaleString('zh-CN')
        // 创建会话
        const sessionRes = await createSessionApi({
          chatScene: props.chatScene,
          metaData: JSON.stringify(metaData) || '',
          sessionName: sessionName,
        })
        currentSessionId.value = sessionRes.sessionId

        // 更新会话历史，
        if (!props.closeHistory) {
          const sessionListRes = await getSessionListApi(props.chatScene)
          if (sessionListRes.list) {
            chatHistory.value = sessionListRes.list
          }
        }
      }
      // 发送流式数据请求
      const requestParams: any = {
        sessionId: Number(currentSessionId.value),
        message: messageContent,
      }
      // 重新生成时传递 messageId
      if (isRegenerate) {
        requestParams.messageId = Number(curMessage.value.messageId)
        delete requestParams.message
      }
      let hasMessage = false
      abortController.value = useSSEChat(requestParams, {
        onMessage({ messageId, message }) {
          hasMessage = true
          const idx = messages.value.findIndex((m) => m.loading)

          if (idx !== -1) {
            messages.value[idx] = {
              ...messages.value[idx],
              message,
              loading: false,
              messageId,
            }
          } else {
            messages.value[messages.value.length - 1].message += message
          }
          // 实时滚动到底部
          props.onScrollToBottom()
        },
        onError(error) {
          const idx = messages.value.findIndex((m) => m.loading)
          if (idx !== -1) {
            if (!hasMessage) {
              messages.value[idx] = {
                ...messages.value[idx],
                message: RESEND_FAIL_TEXT,
                loading: false,
              }
            } else {
              // 正常完成
              messages.value[idx].loading = false
            }
          }
          isLoading.value = false
          // 重置重新生成标记
          curMessage.value = null
        },
        onComplete() {
          const idx = messages.value.findIndex((m) => m.loading)
          if (idx !== -1) {
            if (!hasMessage) {
              messages.value[idx] = {
                ...messages.value[idx],
                message: 'AI 暂无回复',
                loading: false,
              }
            } else {
              // 正常完成
              messages.value[idx].loading = false
            }
          }
          isLoading.value = false
          abortController.value = null
          // 重置重新生成标记
          curMessage.value = null
          props.onScrollToBottom()
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 重新生成
  const handleRefresh = (msg: ChatMsg) => {
    const msgIndex = messages.value.findIndex((m) => m.messageId === msg.messageId)
    if (msgIndex === -1) return
    messages.value.splice(msgIndex)
    curMessage.value = {
      ...msg,
      messageId: Number(msg.messageId),
    }

    sendStream({ regenerateFrom: curMessage.value })
  }
  // 停止流
  const stopStream = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
      isLoading.value = false
      // 更新加载状态
      const loadingMsg = messages.value.find((m) => m.loading)
      if (loadingMsg) {
        loadingMsg.loading = false
        loadingMsg.message = '（已停止生成）'
      }
    }
  }

  // 获取会话历史列表
  const fetchSessionList = async () => {
    try {
      const res = await getSessionListApi(props.chatScene)
      if (res.list && res.list.length > 0) {
        chatHistory.value = res.list
      } else {
        chatHistory.value = []
      }
    } catch (error) {
      ElMessage.error('获取会话历史失败')
      chatHistory.value = []
      currentSessionId.value = null
    }
  }
  // 获取会话详情
  const getSessionDetail = async (sessionId) => {
    await fetchSessionList()
    const res = await getSessionDetailApi(sessionId)
    messages.value = res?.list
    currentSessionId.value = sessionId
    props.onScrollToBottom()
  }

  const resetSession = () => {
    currentSessionId.value = null
    messages.value = []
  }

  return {
    sendStream,
    stopStream,
    handleRefresh,
    fetchSessionList,
    getSessionDetail,
    resetSession,
    chatHistory,
    isLoading,
    messages,
  }
}
