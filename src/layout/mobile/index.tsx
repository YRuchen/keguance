import { defineComponent, computed } from 'vue'
import { useSettingStore } from '~/store/modules/setting'
import MobileMask from '../components/mobile/mask'
import Sidebar from '../components/sidebar'
import Header from './header'
import Main from '../components/main'

export default defineComponent({
  name: 'MobileLayout',
  setup() {
    const SettingStore = useSettingStore()
    const isCollapse = computed(() => !SettingStore.isCollapse) // 折叠
    return () => (
      <>
        {!isCollapse.value && <MobileMask />}
        <Sidebar />
        <div class='main-container'>
          <Header />
          <Main />
        </div>
      </>
    )
  },
})
