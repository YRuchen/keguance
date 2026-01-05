<template>
  <div class="chat-dialog">
    <!-- 欢迎语 -->
    <section class="chat-welcome">
      <h3>Hi 你好</h3>
      <p>我汇集了StarView各项智能服务，可以帮助你回答各类疑问，现在开始进行提问吧～</p>
    </section>

    <!-- 聊天区 -->
    <el-scrollbar
      class="chat-content"
      ref="scrollRef"
      :style="{ marginBottom: inputHeight + 'px' }"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="msg.role === ROLE.ASSISTANT ? 'assistant' : 'user'"
      >
        <!-- 头像 -->
        <img v-if="msg.role === ROLE.USER" class="avatar" src="@/icons/svg/chat_user_head.svg" />
        <img v-else class="avatar" src="@/icons/svg/chat_ai_head.svg" />

        <!-- 气泡 + 复制按钮 -->
        <div class="bubble-wrapper">
          <img
            v-if="msg.role === ROLE.USER"
            src="@/icons/svg/chat_copy_icon.svg"
            class="copy-btn copy-btn-left"
            @click="copyText(msg.message)"
          />
          <div
            v-if="typeof msg.message === 'string'"
            class="bubble"
            v-html="renderMarkdown(msg.message)"
          ></div>
          <img
            v-if="msg.role === ROLE.ASSISTANT"
            src="@/icons/svg/chat_copy_icon.svg"
            class="copy-btn"
            @click="copyText(msg.message)"
          />
        </div>
      </div>
    </el-scrollbar>

    <!-- 输入区 -->
    <footer class="chat-footer" ref="inputWrapperRef">
      <el-input
        v-model="input"
        placeholder="在这里输入问题，回车键发送"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        resize="none"
        ref="textareaRef"
        @keyup.enter.exact.prevent="sendMessage"
        @input="updateHeight"
      />
      <img
        v-if="isGenerating"
        src="@/icons/svg/chat_stop_icon.svg"
        class="sendIcon"
        @click="sendMessage"
      />
      <img v-else src="@/icons/svg/chat_send_icon.svg" class="sendIcon" @click="sendMessage" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed, VNode } from 'vue'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-bash.js'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'
import { useMarkdown } from '~/hooks/useMarkdown'
import { PROXY } from '~/config/constants'
import { createSessionApi, getSessionDetailApi, getSessionListApi } from '@/api/domainManagement/ai'
import { CHAT_SCENE, CHAT_SCENE_NAME, ROLE } from '~/api/domainManagement/ai/constants'
import { useSSEChat } from '~/views/ai/component/useSSEChat'
import { ChatMsg } from '@/api/domainManagement/ai/interfaces'

const messages = ref<ChatMsg[]>([])
const input = ref('')
const scrollRef = ref()
const isGenerating = ref(false)
const textareaRef = ref()
const inputWrapperRef = ref<HTMLElement | null>(null)
const inputHeight = ref(54) // 初始高度
const abortController = ref<AbortController | null>(null)

// 当前会话ID
const currentSessionId = ref<number | null>(null)

const isLoading = ref(false)

const { renderMarkdown } = useMarkdown()

// 更新 marginBottom
const updateHeight = () => {
  if (inputWrapperRef.value) {
    inputHeight.value = inputWrapperRef.value.offsetHeight
  }
}

// 发送流式数据
const sendMessage = async () => {
  const messageContent = input.value.trim()
  if (!messageContent) return
  const userMessage: ChatMsg = {
    messageId: Date.now(),
    role: ROLE.USER,
    message: messageContent,
  }

  messages.value.push(userMessage)

  if (isGenerating.value && abortController) {
    // 如果正在生成，点击按钮则停止生成
    abortController.value.abort() // TODO:替换成 stopStream 方法
    isGenerating.value = false
    return
  }

  // 添加加载中的消息（初始内容为空字符串，用于累加）
  const loadingMessage: ChatMsg = {
    messageId: Date.now() + 1,
    role: ROLE.ASSISTANT,
    message: '正在生成中',
    loading: (isLoading.value = true),
  }
  messages.value.push(loadingMessage)

  // 加载动画
  let dotCount = 0
  const loadingInterval = setInterval(() => {
    loadingMessage.message = '正在生成中' + '.'.repeat((dotCount % 3) + 1)
    dotCount++
    scrollToBottom()
  }, 500)

  try {
    // 每一次都是第一次进入
    const sessionRes = await createSessionApi({
      chatScene: CHAT_SCENE.GENERAL,
    })
    currentSessionId.value = sessionRes.sessionId

    // 发送流式数据请求参数
    const requestParams: any = {
      sessionId: Number(currentSessionId.value),
      message: messageContent,
    }

    abortController.value = useSSEChat(requestParams, {
      onMessage(data) {
        const target = messages.value.find((m) => m.messageId === loadingMessage.messageId)
        if (target) {
          if (typeof target.message !== 'string') {
            loadingMessage.message = ''
            target.message = ''
          }
          target.message += data.message
          target.messageId = data.messageId
          loadingMessage.messageId = data.messageId
          // 实时滚动到底部
          scrollToBottom()
        }
      },
      onError(error) {
        const target = messages.value.find((m) => m.messageId === loadingMessage.messageId)
        if (target) {
          target.loading = false
          if (!target.message) {
            target.message = 'AI 回复失败，请稍后重试～'
          }
        }
        isLoading.value = false
      },
      onComplete() {
        // 更新加载状态
        const target = messages.value.find((m) => m.messageId === loadingMessage.messageId)
        if (target) {
          target.loading = false
          // 如果内容为空，显示提示
          if (!target.message) {
            target.message = '暂无回复内容'
          }
        }
        isLoading.value = false
        abortController.value = null
        scrollToBottom()
      },
    })
  } catch (error: any) {
    // 移除加载中的消息
    const index = messages.value.findIndex((m) => m.messageId === loadingMessage.messageId)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
    isLoading.value = false
    abortController.value = null
  }
}

// 停止流式请求
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

const scrollToBottom = () => {
  nextTick(() => {
    // el-scrollbar 内部的实际滚动容器
    const wrapEl = scrollRef.value?.$el?.querySelector('.el-scrollbar__wrap') as HTMLElement
    if (wrapEl) {
      wrapEl.scrollTop = wrapEl.scrollHeight
    }
  })
}

const copyText = async (text: string | VNode) => {
  if (typeof text !== 'string') {
    ElMessage.error('当前内容不是纯文本，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}
</script>

<style lang="scss" scoped>
.chat-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chat-welcome {
    padding: 12px 16px;
    background: #ffffff;
    margin: 0 25px;
    border-radius: 20px;

    h3 {
      margin: 0;
      font-size: 20px;
      color: #0c0d0e;
    }

    p {
      margin: 4px 0 0;
      font-size: 14px;
      color: #41464f;
    }
  }

  .chat-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .message {
      display: flex;
      align-items: flex-end; // 关键点：让按钮和气泡底部对齐
      margin-bottom: 16px;

      &.user {
        flex-direction: row-reverse;

        .bubble {
          background: #1763ff;
          color: #fff;
        }
      }

      &.assistant {
        flex-direction: row;

        .bubble {
          color: #0c0d0e;
          background: #f6f8fa;
        }
      }

      .avatar {
        width: 35px;
        height: 35px;
        margin: 0 8px;
        align-self: flex-start;
        margin-top: 3px;
      }

      .bubble-wrapper {
        display: flex;
        align-items: flex-end;

        .bubble {
          padding: 0 14px;
          border-radius: 20px;
          line-height: 1.5;
          font-size: 14px;
          word-break: break-word;
        }

        .bubble pre {
          margin: 0;
          background: #2d2d2d;
          border-radius: 6px;
          padding: 10px;
          overflow-x: auto;
          word-break: break-word;
        }

        .bubble code {
          font-family: 'Fira Code', monospace;
          word-break: break-word;
        }

        .copy-btn {
          margin-left: 6px;
          font-size: 12px;
          color: #666;
          flex-shrink: 0;
          margin-bottom: 8px;
          align-self: flex-end;
        }

        .copy-btn-left {
          margin-left: 0;
          margin-right: 6px;
        }
      }
    }
  }

  .chat-footer {
    width: 96%;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);

    .el-textarea {
      flex: 1;
    }

    .sendIcon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  :deep(.el-textarea__inner) {
    min-height: 54px !important;
    max-height: 100px !important;
    line-height: 20px;
    padding: 17px 35px 14px 14px; // 留出右侧图标空间
    resize: none !important;
    overflow-y: auto;
    box-shadow: none;
  }
}
</style>
