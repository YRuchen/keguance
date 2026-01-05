<template>
  <div v-if="visible" class="chat-sidebar" :class="classObj">
    <!-- 侧边栏主体 -->
    <div class="chat-panel">
      <header class="chat-header">
        <img src="@/icons/svg/chat_logo.svg" class="chatIcon" />
        <el-button text @click="close">✕</el-button>
      </header>
      <section class="chat-body">
        <slot />
      </section>
    </div>

    <!-- 遮罩层 -->
    <div class="chat-mask" @click="close"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import emitter from '@/utils/emitter'

const props = defineProps<{ visible: boolean }>()
const SettingStore = useSettingStore()
// 当屏幕切换的时候进行变换
const classObj = computed(() => {
  return {
    chatSidebarHide: !SettingStore.isCollapse,
  }
})
const close = () => {
  emitter.emit('closeChat')
}
</script>

<style lang="scss" scoped>
.chat-sidebar {
  position: fixed;
  top: 0;
  left: var(--el-menu-width, 220px); // 紧贴菜单栏右侧
  height: 100%;
  width: calc(100% - var(--el-menu-width, 220px));
  display: flex;
  z-index: 2000;

  .chat-panel {
    width: 600px;
    height: 100%;
    background: url('@/assets/image/chat_bg.png') no-repeat center center;
    background-size: cover;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2001;

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 25px;
      height: 80px;
      img {
        width: 198px;
      }
    }

    .chat-body {
      flex: 1;
      overflow: auto;
    }
  }

  .chat-mask {
    flex: 1;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2000;
  }
}
.chatSidebarHide {
  left: var(--el-menu-width, 60px); // 紧贴菜单栏右侧
  width: calc(100% - var(--el-menu-width, 60px));
}
:deep(.el-button > span) {
  font-size: 20px;
}
</style>
