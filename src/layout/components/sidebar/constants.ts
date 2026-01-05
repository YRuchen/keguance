import { ElMessageBox, ElMessage } from 'element-plus'

export const getActions = (router, UserStore, TagsViewStore, PermissionStore) => [
  {
    label: '账户信息',
    click: () => {
      router.push({ name: 'basicInfo' })
    },
  },
  {
    label: '退出登录',
    click: () => {
      ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await UserStore.logout({ userId: UserStore.userInfo.userId })
          if (res.code == 200 && res.message == 'success') {
            TagsViewStore.clearVisitedView()
            PermissionStore.clearRoutes()
            ElMessage({
              type: 'success',
              message: '退出登录成功！',
            })
          }
          router.push('/login')
          UserStore.clearInfo()
        })
        .catch((error) => {
          console.error(`退出登陆失败，失败原因：${error}`)
        })
    },
  },
]
