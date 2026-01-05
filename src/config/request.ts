import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { errorCodeType } from '../api/errorCodeType'
import { PROXY } from './constants'
import { filterEmptyParams } from './utils'

import type { AxiosInstance } from 'axios'
import { useUserStore } from '@/store/modules/useAuthStore'
// import { useTagsViewStore } from '~/store/modules/tagsView'
import { usePermissionStore } from '~/store/modules/permission'
import { loginOut } from '~/api/login'
// import { useRouter } from 'vue-router'

/** 根据模块获取请求实例 */
const getReqByProxyModule = ({
  proxyModule,
}: {
  proxyModule: keyof typeof PROXY
}): AxiosInstance => {
  // 创建axios实例 进行基本参数配置
  const axiosInstance = axios.create({
    // 默认请求地址，根据环境的不同可在.env 文件中进行修改
    baseURL: proxyModule,
    // 设置接口访问超时时间
    timeout: 20000, // request timeout，
    // 跨域时候允许携带凭证
    withCredentials: true,
  })

  //  request interceptor 接口请求拦截
  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (config.params) config.params = filterEmptyParams(config.params)
      if (config.data) config.data = filterEmptyParams(config.data)
      if (config.method === 'get' && config.params) {
        config.paramsSerializer = (params) => {
          return qs.stringify(params, { arrayFormat: 'brackets', allowDots: true }) // 你也可以改成 indices/dot
        }
      }
      /**
       * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
       * token 存储在本地储存中（storage）、vuex、pinia
       */
      const userStore = useUserStore()
      const token: string = userStore.userInfo?.token // TODO: error
      // 自定义请求头
      if (token) {
        // TODO: error
        config.headers['Authorization'] = `Bearer ${token}`
      }
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }
      return config
    },
    (error: AxiosError) => {
      // 请求错误，这里可以用全局提示框进行提示
      return Promise.reject(error)
    },
  )

  //  response interceptor 接口响应拦截
  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      const authStore = useUserStore()
      const businessStatusCode = res.data?.code
      if (Boolean(businessStatusCode) && businessStatusCode !== 200) {
        if (qiankunWindow.__POWERED_BY_QIANKUN__) {
          if ([401, 403].includes(businessStatusCode)) {
            authStore.resetApp?.()
          }
        } else {
          if (res.data.code === 401 || res.data.code === 403) {
            const UserStore = useUserStore()
            UserStore.clearInfo()
            // 延迟加载 router，避免循环依赖
            import('@/routers').then(({ default: router }) => {
              const redirect = window.location.pathname + window.location.search
              router.push({
                path: '/login',
                query: { redirect }
              })
            })
            // 弹出提示
            ElMessage.error('登录已过期，请重新登录')
            return Promise.reject(new Error(res.data.message || '登录已过期'))
          }
        }
        ElMessage.error(res.data.message)
        return Promise.reject(res)
      }
      return res.data
    },
    async (error: AxiosError) => {
      const authStore = useUserStore()
      const status = error.response?.status || 500
      const message = errorCodeType(status.toString())

      // 特殊处理401（未授权）
      if (status === 401 || status === 403) {
        // // const router = useRouter()
        // const UserStore = useUserStore()
        // // const TagsViewStore = useTagsViewStore()
        // // const PermissionStore = usePermissionStore()
        // // TagsViewStore.clearVisitedView()
        // // PermissionStore.clearRoutes()
        // removeToken()
        // UserStore.clearInfo()
        // // router.push('/login')
        if (qiankunWindow.__POWERED_BY_QIANKUN__) {
          authStore.resetApp?.()
        } else {
          const UserStore = useUserStore()
          UserStore.clearInfo()
          // 延迟加载 router，避免循环依赖
          import('@/routers').then(({ default: router }) => {
            const redirect = window.location.pathname + window.location.search
            router.push({
              path: '/login',
              query: { redirect }
            })
          })
          // 弹出提示
          ElMessage.error('登录已过期，请重新登录')
        }
      } else {
        const customMessage = (error?.response?.data as Record<string, any>)?.message
        ElMessage.error(`${message} ${customMessage ? `原因：${customMessage}` : ''}`)
      }

      return Promise.reject(error)
    },
  )

  return axiosInstance
}

// /**
//  * @description 显示错误消息
//  * opt 传入参数
//  * err 错误信息
//  * type 消息类型
//  * duration 消息持续时间
//  */
// function showErrMessage(opt, err, type: any = 'error', duration = 5000) {
//   ElMessage({
//     message: err.msg,
//     type: type,
//     duration: duration,
//   });
// }

export default getReqByProxyModule
