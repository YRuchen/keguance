import type { Ref } from 'vue'
import type { IOptionItem } from '~/interfaces/common'

/** 域名主数据 */
export interface IMasterData {
  /** 各模块任务频率集合 */
  taskFrequencies?: Record<string, IOptionItem[]>
  /** chatIdList */
  chatIdList?: Record<string, IOptionItem[]>
  /** tokenList */
  tokenList?: Record<string, IOptionItem[]>
}

/** 域名主数据Store出参 */
export interface IRes {
  /** 域名主数据 */
  masterData: Ref<IMasterData>
  /** 获取域名频率、ChatId、Token主数据 */
  getMasterData: () => Promise<void>
}
