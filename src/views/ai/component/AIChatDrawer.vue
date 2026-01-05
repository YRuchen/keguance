<script setup lang="ts">
import { createSessionApi, getSessionDetailApi, getSessionListApi } from '@/api/domainManagement/ai'
import { CHAT_SCENE, CHAT_SCENE_NAME, ROLE } from '@/api/domainManagement/ai/constants'
import { ChatMsg } from '@/api/domainManagement/ai/interfaces'
import chatBg from '@/assets/image/ai_welcome.png'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElDrawer, ElIcon, ElInput, ElMessage, ElScrollbar } from 'element-plus'
import { computed, isVNode, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ChatSession } from '~/api/domainManagement/ai/interfaces'
import { useMarkdown } from '~/hooks/useMarkdown'
import CopyIcon from './CopyIcon.vue'
import sidebar from './sideBar/sidebar'
import { useChatStream } from './useChatStream'
import { useChatScroll } from './useChatScroll'

const { renderMarkdown } = useMarkdown()

const props = defineProps({
  // 抽屉状态
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 会话类型
  chatScene: {
    type: String,
    default: CHAT_SCENE.GENERAL,
  },
})
// 滚动相关 ready
const scrollRef = ref()
// 获取会话json
const metaData = ref(null)
const { scrollToBottom } = useChatScroll({ ref: scrollRef })
const {
  sendStream,
  stopStream,
  handleRefresh,
  fetchSessionList,
  getSessionDetail,
  resetSession,
  chatHistory,
  messages,
} = useChatStream({
  chatScene: props.chatScene,
  onScrollToBottom: () => scrollToBottom(),
  onError: () => ElMessage.error('发送消息失败'),
})

// 左侧会话历史是否收起 ready
const sidebarCollapsed = ref(false)

const isFirstEnter = ref(true)

const inputValue = ref('')

// 操作抽屉
const emit = defineEmits(['update:modelValue'])
const updateVisible = (val: boolean) => {
  emit('update:modelValue', val)
}

const curMessage = ref<ChatMsg | null>(null)

// 搜索关键词
const searchKeyword = ref('')

// 过滤后的对话历史   ready
const filteredChatHistory = computed(() => {
  if (!searchKeyword.value.trim()) {
    return chatHistory.value
  }
  return chatHistory.value.filter((item) =>
    item.sessionName.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})
// 发送消息流式处理
const sendMsgStream = () => {
  if (!inputValue.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }
  isFirstEnter.value = false
  const msg = inputValue.value.trim()
  inputValue.value = ''
  sendStream({
    text: msg,
    metaData: metaData.value,
  })
}

// 切换左侧边栏收起/展开
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 侧边栏组件选中状态
const resetKey = ref<number>(0)
// 监听抽屉打开，获取会话历史
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      fetchSessionList()
      metaData.value = localStorage.getItem('metaData')
        ? JSON.parse(localStorage.getItem('metaData'))
        : null

      metaData.value?.domain
        ? (inputValue.value = `请分析${metaData.value?.domain ?? ''}这个${
            CHAT_SCENE_NAME[props.chatScene]
          }信息`)
        : null
    } else {
      resetKey.value++
    }
    resetSession()
    messages.value = []
  },
)

// 新建对话
const createNewChat = () => {
  localStorage.removeItem('metaData')
  metaData.value = null
  messages.value = []
  inputValue.value = ''
  resetSession()
}
// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendStream({ text: inputValue.value.trim() })
    inputValue.value = ''
  }
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  stopStream()
})
</script>
<template>
  <el-drawer
    :model-value="modelValue"
    :append-to-body="true"
    direction="rtl"
    size="70%"
    class="ai-chat-drawer"
    @update:model-value="updateVisible"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">AI诊断 - {{ CHAT_SCENE_NAME[props.chatScene] }}</h4>
    </template>
    <div class="ai-chat-container" :class="{ column: sidebarCollapsed }">
      <!-- 左侧边栏 -->
      <sidebar
        v-model:model-value="searchKeyword"
        :collapsed="sidebarCollapsed"
        :reset-key="resetKey"
        :chat-history="filteredChatHistory"
        @toggle="toggleSidebar"
        @new-chat="createNewChat"
        @session-detail="getSessionDetail"
        @refresh-list="fetchSessionList"
      />

      <!-- 右侧内容区域 -->
      <div class="ai-chat-main">
        <!-- 对话内容区域 -->
        <div
          class="chat-content-area"
          :style="{
            backgroundImage: messages.length === 0 ? `url(${chatBg})` : 'none',
            backgroundSize: messages.length === 0 ? 'contain' : 'auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }"
        >
          <el-scrollbar v-if="messages.length > 0" ref="scrollRef" class="messages-scrollbar">
            <div class="messages-container">
              <div
                v-for="msg in messages"
                :key="msg.messageId"
                class="message-item"
                :class="msg.role === ROLE.ASSISTANT ? 'assistant' : 'user'"
              >
                <img v-if="msg.role === ROLE.ASSISTANT" src="@/assets/image/ai_avatar.png" />
                <div
                  class="message-item-column"
                  :class="msg.role === ROLE.ASSISTANT ? 'assistant' : 'user'"
                >
                  <div class="message-content">
                    <component :is="msg.message" v-if="isVNode(msg.message)" />
                    <div v-else v-html="renderMarkdown(msg.message)"></div>
                  </div>
                  <div v-if="!msg.loading" style="margin-top: 10px">
                    <CopyIcon :text="msg.message" style="cursor: pointer" />

                    <el-icon
                      v-if="msg.role === ROLE.ASSISTANT"
                      style="cursor: pointer"
                      @click="() => handleRefresh(msg)"
                    >
                      <RefreshRight />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 输入框区域 -->
        <div class="chat-input-area">
          <el-input
            v-model="inputValue"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :placeholder="`询问任何${CHAT_SCENE_NAME[props.chatScene]}相关的问题`"
            resize="none"
            @keydown="handleKeydown"
          />
          <div class="send-icon" @click="sendMsgStream">
            <img src="@/assets/image/ai_send.png" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.ai-chat-drawer .el-drawer__body {
  padding-top: 0 !important;
}
.ai-chat-drawer .el-textarea__inner {
  border: unset;
  box-shadow: unset;
}

.ai-chat-container {
  display: flex;
  height: 100%;
  overflow: hidden;
  &.column {
    flex-direction: column;
  }
}

.ai-chat-sidebar {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s;
  background-color: #f0f2f5;
  width: 292px;
}

.sidebar-header {
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 56px;
}

.sidebar-expand-btn {
  padding: 2px;
  .collapse-icon {
    box-shadow: 0px 0px 10px 0px #00000026;
  }
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-actions {
  padding-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .el-button {
    .el-icon {
      padding-right: 6px;
    }
  }
}

.collapse-icon {
  width: 46px;
  height: 32px;
  background-color: #ffffff;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  border-radius: 8px;

  &:hover {
    background-color: #f3f4f6;
  }
}
.chat-history-scrollbar {
  flex: 1;
  padding: 8px 0;
}

.no-history {
  padding: 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.chat-history-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  .chat-history-title {
    font-size: 14px;
    color: #374151;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chat-history-time {
    font-size: 12px;
    color: #9ca3af;
  }
}

.ai-chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
}

.chat-content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.messages-scrollbar {
  height: 100%;
  padding: 20px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
  margin-bottom: 1rem;
}

.message-item {
  display: flex;
  align-items: flex-start;

  &.user {
    justify-content: flex-end;
    .message-item-column {
      align-items: flex-end;
      .message-content {
        padding: 2px 16px;
        background: linear-gradient(90deg, #ebedf0 0%, #f0f2f5 100%);
      }
    }
  }

  &.assistant {
    justify-content: flex-start;
    img {
      width: 42px;
      height: 42px;
      filter: drop-shadow(2px 6px 6px #007dff4d);
    }
    .message-item-column {
      align-items: flex-start;
      margin-left: 19px;
      .message-content {
        color: #1f2937;
      }
      .el-icon {
        margin-right: 10px;
      }
    }
  }
  .message-item-column {
    max-width: 70%;
    display: flex;
    flex-direction: column;

    .message-content {
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }
  }
}

.chat-input-area {
  padding: 16px;
  padding-right: 56px;
  background-color: #ffffff;
  position: relative;
  border-radius: 14px;
  margin-left: 28px;
  box-shadow: 0px 8px 16px 0px #00000029;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(90deg, #007dff, #a463ff);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .send-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
    background-color: transparent;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
