import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElScrollbar, ElMenu } from 'element-plus'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { Space } from '~/KeepUp'
import { useSettingStore } from '~/store/modules/setting'
import { usePermissionStore } from '~/store/modules/permission'
import Logo from './components/logo'
import UserProfile from './components/userProfile'
import ControlPanel from './components/controlPanel'
import SubItem from '../subMenu/subItem'
import { RouterKey, routeKeyMap } from '../../constants'
import styles from './index.module.scss'
import './index.scss'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute()
    const PermissionStore = usePermissionStore()
    const SettingStore = useSettingStore()
    const isCollapse = computed(() => !SettingStore.isCollapse) // 折叠
    const themeConfig = computed(() => SettingStore.themeConfig) // 设置
    const permissionRoutes = computed(() => PermissionStore.permissionRoutes) // 获取路由
    const activeMenu = computed(() => {
      const { meta, path } = route
      const activeName = meta?.highlightMenuName || route.name
      return activeName ?? path
    })
    return () => (
      <div
        class={[
          'sidebar-container',
          styles.sidebarContainer,
          themeConfig.value.showLogo && 'has-logo',
        ]}
      >
        {themeConfig.value.showLogo && <Logo isCollapse={isCollapse.value} />}
        <ElScrollbar wrap-class="scrollbar-wrapper">
          <ElMenu
            defaultActive={activeMenu.value}
            collapse={isCollapse.value}
            uniqueOpened={SettingStore.themeConfig.uniqueOpened}
            collapseTransition={true}
            text-color="#bfcbd9"
            background-color="#F0F3F7"
          >
            {permissionRoutes.value.map(v => (
              <SubItem key={v[routeKeyMap[RouterKey.NAME]]} item={v} />
            ))}
          </ElMenu>
        </ElScrollbar>
        <Space direction='column' size={16}>
          {qiankunWindow.__POWERED_BY_QIANKUN__ ? null : <UserProfile isCollapse={isCollapse.value} />}
          <ControlPanel isCollapse={isCollapse.value} />
        </Space>
      </div>
    )
  }
})
