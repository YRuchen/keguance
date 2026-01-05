import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import emitter from '~/utils/emitter'
import Sidebar from '../components/sidebar'
import Header from './header'
import Main from '../components/main'
import ChatSidebar from '../components/agent/ChatSidebar.vue'
import ChatDialog from '../components/agent/ChatDialog.vue'

export default defineComponent({
  name: 'PcLayout',
  setup() {
    const chatVisible = ref(false)
    onMounted(() => {
      emitter.on('openChat', () => {
        chatVisible.value = true
      })
      emitter.on('closeChat', () => {
        chatVisible.value = false
      })
    })
    onBeforeUnmount(() => {
      emitter.off('openChat')
      emitter.off('closeChat')
    })
    return () => (
      <>
        <Sidebar />
        <div class='main-container'>
          <Header />
          <Main />
        </div>
        {chatVisible.value && (
          <ChatSidebar visible={chatVisible}>
            <ChatDialog />
          </ChatSidebar>
        )}
      </>
    )
  },
})
