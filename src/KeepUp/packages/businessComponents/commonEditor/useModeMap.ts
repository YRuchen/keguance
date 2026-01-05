import type { IUseModeMapParams, IUseModeMapRes } from './interfaces'

/** 模式 */
const useModeMap = ({ createApi, editApi }: IUseModeMapParams): IUseModeMapRes => ({
  VIEW: {
    text: '查看',
    api: undefined,
  },
  CREATE: {
    text: '创建',
    api: createApi,
  },
  EDIT: {
    text: '编辑',
    api: editApi,
  },
})

export default useModeMap
