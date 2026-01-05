import type { ICommonGetListRes } from '~/interfaces/common'
import type { ISpanItem, ITraceInfo, IResList } from './interfaces'

/** 转为ICommonGetListRes格式 */
export const formatListRes = (res: IResList): ICommonGetListRes<ITraceInfo[]> => ({
  list: res.traces,
})

/** 转为ICommonGetListRes格式 */
export const formatSpansListRes = (res: IResList): ICommonGetListRes<ISpanItem[]> => ({
  list: res.traces.reduce((prev, acc) => {
    return [...prev, ...(acc.spanSet.spans || []).map(v => ({ ...v, traceID: acc.traceID }))]
  }, []),
})
