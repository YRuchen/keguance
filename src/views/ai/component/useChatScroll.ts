
import { ElDrawer, ElIcon, ElInput, ElMessage, ElScrollbar } from 'element-plus'
import { computed, isVNode, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
export function useChatScroll(props: { ref: any }) {

  const scrollToBottom = () => {
    nextTick(() => {
      // el-scrollbar 内部的实际滚动容器
      const wrapEl = props.ref.value?.$el?.querySelector('.el-scrollbar__wrap') as HTMLElement
      if (wrapEl) {
        wrapEl.scrollTop = wrapEl.scrollHeight
      }
    })
  }
  return {
    scrollToBottom
  };
}