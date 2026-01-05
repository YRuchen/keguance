import { defineStore } from 'pinia'
import { listFolderApi, vistApi } from '@/api/controlPanel/index'

import { decrypt } from '@/utils/decrypt'
export const useDashBoardStore = defineStore({
  id: 'dashBoardState',
  // state: 返回对象的函数
  state: () => ({
    menuData: [],
    systemFolders: [],
    customFolders: [],
  }),
  actions: {
    async fetchMenuData(userOrg) {
      const res = await listFolderApi({ userId: userOrg.userId })
      this.menuData = res.data?.systemFolders || []
      this.customFolders = res.data?.customFolders || []
      this.menuData = [...(res.data?.systemFolders || []), ...(res.data?.customFolders || [])]
      return this.menuData
    },
    async openIframe(row, userOrg, router) {
      try {
        const res = await vistApi({
          userOrg: userOrg,
          boardId: row.boardId,
          userBoard: row.userBoard
        })
        router.push({
          path: '/controlPanel/dashBoardIframe',
        })
        sessionStorage.setItem('iframeUrl', decrypt(row.url))
      } catch (error) {
        console.log(error)
      }
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'dashBoardState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
