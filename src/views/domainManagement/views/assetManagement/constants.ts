import { STATUS, DOMAIN_TYPE } from '~/api/domainManagement/assetManagement/constants'

/** 使用中 */
export const isActiveOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
]

/** 状态 */
export const statusOptions = [
  { label: '正常', value: STATUS.NORMAL },
  { label: '未备案', value: STATUS.UNREG },
  { label: '快到期', value: STATUS.NEAR },
  { label: '已到期', value: STATUS.EXPIRED },
]

/** 状态到标题和状态的映射 */
export const statusMap = {
  [STATUS.NORMAL]: {
    label: '正常', type: 'primary',
  },
  [STATUS.UNREG]: {
    label: '未备案', type: 'info',
  },
  [STATUS.NEAR]: {
    label: '快到期', type: 'warning',
  },
  [STATUS.EXPIRED]: {
    label: '已到期', type: 'danger',
  },
}

/** 域名类型 */
export const domainTypeOptions = [
  { label: '生产', value: DOMAIN_TYPE.PRO },
  { label: '预生产', value: DOMAIN_TYPE.PRE_PRO },
  { label: '测试', value: DOMAIN_TYPE.TEST },
  { label: '开发', value: DOMAIN_TYPE.DEV },
]
