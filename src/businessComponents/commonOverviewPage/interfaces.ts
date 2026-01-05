import { ResultStatus } from './constants'

import type { IOptionItem } from '~/KeepUp'

/** 基础信息的固定字段 */
export interface IRawData {
  /** id */
  id: string
  /** 状态 */
  status: ResultStatus
  /** 名称 */
  name: string
}

/** 基础信息 */
export type IBasicData = IRawData 
  & Record<string, IOptionItem>
