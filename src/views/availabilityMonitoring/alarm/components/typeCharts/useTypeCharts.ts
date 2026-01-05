import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPanelDataApi } from '~/api/availabilityMonitoring/situationAwareness'
import { PanelId, ProtocolType } from './constants'
import type {
  IBarChartResponse,
  ITableResponse,
  IChartRequest,
} from '~/api/availabilityMonitoring/situationAwareness/interfaces'

export const useTypeCharts = () => {
  // 从 localStorage 获取筛选参数
  const getFilterParams = (): IChartRequest => {
    try {
      const paramsStr = localStorage.getItem('alarmFilterParams')
      if (paramsStr) {
        return JSON.parse(paramsStr)
      }
    } catch (error) {
      console.error('解析筛选参数失败', error)
    }
    return {}
  }


  // 请求锁，防止重复请求
  let isRefreshing = false

  // 图表数据
  const alert4Data = ref<ITableResponse | null>(null)
  const alert5Data = ref<IBarChartResponse | null>(null)
  const alert6Data = ref<IBarChartResponse | null>(null)

  // 加载状态
  const loading = reactive({
    alert4: false,
    alert5: false,
    alert6: false,
  })

  // 获取面板数据
  const fetchPanelData = async (
    panelId: string,
    additionalParams?: Record<string, any>,
  ) => {
    const loadingKey = panelId.replace('-', '') as keyof typeof loading
    if (loading[loadingKey] !== undefined) {
      loading[loadingKey] = true
    }

    try {
      const filterParams = getFilterParams()
      const params: IChartRequest = {
        ...Object.fromEntries(
          Object.entries(filterParams).filter(
            ([k, v]) => !['node', 'page', 'pageSize', 'total'].includes(k),
          ),
        ),
        ...additionalParams,
        probeSubdivision: filterParams?.node?.[1],
        probeRegionName: filterParams?.node?.[0],
        fromTime: filterParams.fromTime ? new Date(filterParams.fromTime).toISOString() : undefined,
        toTime: filterParams.toTime ? new Date(filterParams.toTime).toISOString() : undefined,
      }
      localStorage.setItem('alarmParams', JSON.stringify(params))
      const data = await getPanelDataApi(panelId, params)
      return data
    } catch (error) {
      return null
    } finally {
      if (loadingKey in loading) {
        loading[loadingKey] = false
      }
    }
  }

  // 刷新所有图表数据
  const refreshAllCharts = async () => {
    if (isRefreshing) {
      return
    }

    isRefreshing = true
    try {
      const [data4, data5, data6] = await Promise.all([
        fetchPanelData(PanelId.ALERT_4),
        fetchPanelData(PanelId.ALERT_5),
        fetchPanelData(PanelId.ALERT_6),
      ])
      alert4Data.value = data4 as ITableResponse
      alert5Data.value = data5 as IBarChartResponse
      alert6Data.value = data6 as IBarChartResponse
    } finally {
      isRefreshing = false
    }
  }


  return {
    alert4Data,
    alert5Data,
    alert6Data,
    loading,
    refreshAllCharts,
  }
}

