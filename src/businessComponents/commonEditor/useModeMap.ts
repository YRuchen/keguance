import { MODE } from './constants'

import type { IUseModeMapParams, IUseModeMapRes } from './interfaces'

/** 模式 */
const useModeMap = ({ createApi, editApi }: IUseModeMapParams): IUseModeMapRes => ({
  [MODE.VIEW]: {
    text: '查看',
    api: undefined,
  },
  [MODE.CREATE]: {
    text: '创建',
    api: createApi,
  },
  [MODE.EDIT]: {
    text: '编辑',
    api: editApi,
  },
})

export default useModeMap
