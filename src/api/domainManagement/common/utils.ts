import { ICommonObj } from '~/KeepUp'

/** 监控节点过滤方法 */
export const formatNodes = (list: ICommonObj[] = []) => {
  return Object.entries(list).map(v => ({ [v?.[0]]: v?.[1].list }))
}
