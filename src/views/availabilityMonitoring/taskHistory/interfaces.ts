import { Protocol } from '~/api/availabilityMonitoring/constants'
import { BasicTabs } from '~/views/availabilityMonitoring/detail/formSectionsSchema/defineRequest/constants'

/** getSchema入参 */
export interface IGetSchemaParams {
  /** 协议类型 */
  protocol: Protocol
  /** 显示失败原因 */
  showFailReason: boolean
  /** 失败原因简介 */
  failSummary: string
  /** 成功 */
  isPassed: boolean
  /** 检查类型 */
  checkType: BasicTabs
}
