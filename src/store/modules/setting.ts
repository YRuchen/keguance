import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { DeviceType } from '~/constants/common'
import { LayoutType } from '~/constants/theme'
import { PRIMARY_COLOR } from '../../config'

/** 根据mode改变body的class */
const updateBodyClassByMode = (mode: LayoutType) => {
  const body = document.body as HTMLElement
  body.setAttribute('class', `layout-${mode}`)
}

export const useSettingStore = defineStore('settingState', () => {
  const isCollapse = ref(true) // 折叠
  const device = ref<DeviceType>(DeviceType.PC)
  const isReload = ref(true)
  const isMobile = computed(() => device.value === DeviceType.MOBILE)
  const themeConfig = reactive({
    showSetting: false, // 显示设置
    mode: LayoutType.VERTICAL, // 菜单展示模式 horizontal / vertical / columns
    showTag: false, // tagsView 是否展示
    footer: true, // 页脚
    isDark: false, // 深色模式
    showLogo: true, // 显示侧边栏Logo
    primary: PRIMARY_COLOR, // 主题颜色
    globalComSize: 'default', // element组件大小
    uniqueOpened: false, // 是否只保持一个子菜单的展开
    fixedHeader: true, // 固定header
    gray: false, // 灰色模式
    weak: false, // 色弱模式
  })

  updateBodyClassByMode(themeConfig.mode)

  const setThemeConfig = <K extends keyof typeof themeConfig>(
    key: K, 
    val: typeof themeConfig[K],
  ) => {
    themeConfig[key] = val
    if (key === 'mode') {
      updateBodyClassByMode(themeConfig.mode)
    }
  }

  const setCollapse = (value: boolean) => {
    isCollapse.value = value
  }

  const closeSideBar = () => {
    isCollapse.value = false
  }

  const toggleDevice = (val: DeviceType) => {
    device.value = val
  }

  const setReload = () => {
    isReload.value = false
    setTimeout(() => {
      isReload.value = true
    }, 50)
  }

  return {
    isCollapse,
    device,
    isMobile,
    isReload,
    themeConfig,
    setThemeConfig,
    setCollapse,
    closeSideBar,
    toggleDevice,
    setReload,
  }
})
