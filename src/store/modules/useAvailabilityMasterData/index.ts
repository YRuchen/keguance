import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getNotifierAndVarApi, getLocationsApi, getMonitoringNodesApi } from '~/api/availabilityMonitoring'

import type { IMasterData, IRes } from './interface'

/** 可用性监测主数据 */
const useAvailabilityMasterData = defineStore<'useAvailabilityMasterData', IRes>('useAvailabilityMasterData', () => {
  /** 主数据 */
  const masterData = ref<IMasterData>({})
  /** 获取主数据 */
  const getMasterData = async () => {
    try {
      const [locations, notifierAndVar] = await Promise.all([getLocationsApi(), getNotifierAndVarApi()])
      masterData.value = {
        ...locations,
        ...Object.fromEntries(
          Object.entries(notifierAndVar)
            .map(([k, v]) => ([k, v.map((v1: Record<string, any>) => ({ ...v1, value: v1.key, label: v1.description }))]))
        ),
      }
    } catch (error: any) {
      console.error(`主数据获取失败，失败原因：${error}`)
    }
  }
  const getMonitoringNodes = async () => {
    try {
      const res = await getMonitoringNodesApi()
      masterData.value.monitoringNodes = res.locations
      masterData.value.monitoringIsps = res.isp
    } catch (error) {
      console.error(`获取监测节点列表失败，失败原因；${error}`)
    }
  }
  return {
    masterData,
    getMasterData,
    getMonitoringNodes,
  }
})

export default useAvailabilityMasterData