import { defineComponent, computed } from 'vue'
import { useSettingStore } from '~/store/modules/setting'
import { useRect } from '~/store/modules/useRect'

export default defineComponent({
  name: 'HeightSpacer',
  setup() {
    const SettingStore = useSettingStore()
    const rectStore = useRect()
    const themeConfig = computed(() => SettingStore.themeConfig)
    return () => (
      themeConfig.value.fixedHeader 
        && <div
          style={{ height: `${themeConfig.value.showTag ? 90 : rectStore.headerHeight}px` }}
        > </div>
    )
  }
})
