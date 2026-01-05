import { defineComponent, ref, computed, onMounted } from 'vue'
import { useSettingStore } from '~/store/modules/setting'
import { useRect } from '~/store/modules/useRect'
import { DeviceType } from '~/constants/common'
import { deviceToLayoutMap } from './constants'
import styles from './index.module.scss'

export default defineComponent({
  name: 'Layout',
  setup() {
    const containerRef = ref()
    const rectStore = useRect()
    const SettingStore = useSettingStore()
    const classMap = computed(() => ({
      hideSidebar: !SettingStore.isCollapse,
      openSidebar: SettingStore.isCollapse,
      mobile: SettingStore.device === DeviceType.MOBILE,
      [styles.container]: true
    }))
    /** 只有PC端 */
    const layout = computed(() => deviceToLayoutMap[DeviceType.PC])
    onMounted(() => {
      rectStore.appHeight = containerRef.value?.clientHeight
    })
    return () => (
      <div ref={containerRef} class={[classMap.value, 'obs-container']}>
        <layout.value />
      </div>
    )
  }
})
