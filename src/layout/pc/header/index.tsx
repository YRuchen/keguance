import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingStore } from '~/store/modules/setting'
import { headerModeToCmpMap, HeaderMode } from '../../constants'
import HeightSpacer from '../../components/header/heightSpacer'
import styles from './index.module.scss'

export default defineComponent({
  name: 'Header',
  setup() {
    const route = useRoute()
    const SettingStore = useSettingStore()
    const themeConfig = computed(() => SettingStore.themeConfig) // 主题配置
    const isCollapse = computed(() => !SettingStore.isCollapse)
    const headerTsx = computed(
      () =>
        headerModeToCmpMap[
          (route.matched[route.matched.length - 1]?.meta?.headerMode as HeaderMode | undefined) ||
            HeaderMode.BREADCRUMB
        ],
    ) // 显示子菜单
    return () => (
      <>
        <HeightSpacer />
        <div
          class={[
            styles.mLayoutHeader,
            {
              [styles.fixedHeader]: themeConfig.value.fixedHeader,
              [styles.noCollapse]: themeConfig.value.fixedHeader && !isCollapse,
              collapse: themeConfig.value.fixedHeader && isCollapse,
            },
          ]}
        >
          <div class={styles.headerInner}>
            <headerTsx.value />
          </div>
        </div>
      </>
    )
  },
})
