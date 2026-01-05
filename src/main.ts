import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { registerElIcons } from '~/plugins/ElIcons'
import SvgIcon from '~/components/SvgIcon/index.vue'
import { useUserStore } from '@/store/modules/useAuthStore'
import App from './App.vue'
import router from './routers'
import pinia from './store'
import './permission'

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'

const generatorApp = () => {
  const app = createApp(App)
  registerElIcons(app)
  app.component('SvgIcon', SvgIcon)
  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)
  return app
}

/** 项目实例 */
let app = null
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  generatorApp()?.mount('#app')
} else {
  renderWithQiankun({
    mount(props) {
      try {
        app = generatorApp()
        app?.mount(props.container)
        const authStore = useUserStore()
        props.onGlobalStateChange((state: any) => {
          console.log('子应用接收到的全局状态：', state)
          authStore.userInfo = state.userInfo
          authStore.resetApp = state.resetApp
        }, true)
      } catch (error: any) {
        console.error(`${props.name}mount失败，失败原因：${error}`)
      }
    },
    bootstrap() {
      console.log({ bootstrap: 'bootstrap' })
    },
    update() {
      console.log({ update: 'update' })
    },
    unmount(props) {
      try {
        if (app) {
          app.unmount?.()
          app = null
        }
      } catch (error: any) {
        console.error(`${props.name}unmount失败，失败原因：${error}`)
      }
    },
  })
}
