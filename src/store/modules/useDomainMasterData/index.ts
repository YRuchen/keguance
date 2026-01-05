import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFrequencyApi, TaskType } from '~/api/domainManagement/common'
import { getChatIdListApi, getTokenListApi } from '~/api/configManagement/notifierManagement'

import type { IMasterData, IRes } from './interfaces'

const formatter = (res = []) => {
  return res.map(v => (v?.list || []).map(v => ({
    label: v.name || v.label,
    value: v.id,
  })))
}
/** 可用性监测主数据 */
export const useDomainMasterData = defineStore<'useDomainMasterData', IRes>('useDomainMasterData', () => {
  /** 主数据 */
  const masterData = ref<IMasterData>({})
  /** 获取主数据 */
  const getMasterData = async () => {
    try {
      const [
        dnsFrequency,
        domainFrequency,
        hijackFrequency,
        icpFrequency,
        pollutionFrequency,
        sslFrequency,
        wallFrequency,
        chatIdList,
        tokenList,
      ] = formatter(
        await Promise.all([
          getFrequencyApi(TaskType.TASK_TYPE_DNS),
          getFrequencyApi(TaskType.TASK_TYPE_DOMAIN),
          getFrequencyApi(TaskType.TASK_TYPE_HIJACK),
          getFrequencyApi(TaskType.TASK_TYPE_ICP),
          getFrequencyApi(TaskType.TASK_TYPE_POLLUTION),
          getFrequencyApi(TaskType.TASK_TYPE_SSL),
          getFrequencyApi(TaskType.TASK_TYPE_WALL),
          getChatIdListApi(),
          getTokenListApi(),
        ])
      )
      masterData.value = {
        taskFrequencies: {
          dnsFrequency,
          domainFrequency,
          hijackFrequency,
          icpFrequency,
          pollutionFrequency,
          sslFrequency,
          wallFrequency,
        },
        chatIdList,
        tokenList,
      }
    } catch (error: any) {
      console.error(`主数据获取失败，失败原因：${error}`)
    }
  }
  return {
    masterData,
    getMasterData,
  }
})
