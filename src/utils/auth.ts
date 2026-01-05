import { useUserStore } from '~/store/modules/useAuthStore'

export const hasPermission = (permissions: string[] = []) => {
  const userStore = useUserStore()
  return permissions.some(v => userStore.userInfo.roles.includes(v))
}
