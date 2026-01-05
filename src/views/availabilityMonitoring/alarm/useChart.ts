import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getEchartsLineApi, getLineChartApi, getBarChartApi } from '~/api/availabilityMonitoring/alarm'
import { getChat0Options, getChat1Options, getChat2Options } from './chartConfigs'

export const useChart = ({
  filterParams,
  chartRef,
  chartRef1,
  chartRef2,
}) => {
  /** 图表实例0 */
  const chart0Instance = ref<echarts.ECharts | null>()
  /** 图表实例1 */
  const chart1Instance = ref<echarts.ECharts | null>()
  /** 图表实例2 */
  const chart2Instance = ref<echarts.ECharts | null>()
  const updateChart0Options = async () => {
    try {
      initChart0()
      const { values = [] } = await getEchartsLineApi(filterParams.value)
      // 提取时间和数值数据
      const xAxisData = values.map((item: { time: string }) => item.time) // 获取所有的 time 字段
      const seriesData = values.map((item: { value: number }) => item.value) // 获取所有的 value 字段
      // 数据获取成功后，更新图表选项
      if (chart0Instance.value) {
        chart0Instance.value.setOption(getChat0Options(xAxisData, seriesData))
      }
    } catch (error: any) {
      console.error(`获取告警监控数据失败，失败原因：${error}`)
    }
  }
  const updateChart1Options = async () => {
    try {
      initChart1()
      const res = await getLineChartApi(
        {
          ...filterParams.value,
          fromTime: filterParams.value.fromTime ? new Date(filterParams.value.fromTime).toISOString() : undefined,
          toTime: filterParams.value.toTime ? new Date(filterParams.value.toTime).toISOString() : undefined,
        },
        'alert-2',
      )
      if (chart1Instance.value) {
        chart1Instance.value.setOption(getChat1Options(res.data))
      }
    } catch (error: any) {
      console.error(`更新告警占比图图表失败，失败原因：${error}`)
    }
  }
  const updateChart2Options = async () => {
    try {
      initChart2()
      const res = await getBarChartApi(
        {
          ...filterParams.value,
          fromTime: filterParams.value.fromTime ? new Date(filterParams.value.fromTime).toISOString() : undefined,
          toTime: filterParams.value.toTime ? new Date(filterParams.value.toTime).toISOString() : undefined,
        },
        'alert-3',
      )
      if (chart2Instance.value) {
        chart2Instance.value.setOption(
          getChat2Options(
            res.category, 
            res.series.map(v => ({ ...v, type: 'bar' })))
        )
      }
    } catch(error: any) {
      console.error(`更新不同协议告警统计图图表失败，失败原因：${error}`)
    }
  }
  /** 更新图表 */
  const updateChartsOptions = async () => {
    chartRef.value && await updateChart0Options()
    chartRef1.value && await updateChart1Options()
    chartRef2.value && await updateChart2Options()
  }
  const initChart0 = async () => {
    chart0Instance.value?.dispose()
    await nextTick()
    chart0Instance.value = echarts.init(chartRef.value)
  }
  const initChart1 = async() => {
    chart1Instance.value?.dispose()
    await nextTick()
    chart1Instance.value = echarts.init(chartRef1.value)
  }
  const initChart2 = async () => {
    chart2Instance.value?.dispose()
    await nextTick()
    chart2Instance.value = echarts.init(chartRef2.value)
  }
  const destroyChart0 = () => {
    if (chart0Instance.value) {
      chart0Instance.value.dispose()
    }
  }
  const destroyChart1 = () => {
    if (chart1Instance.value) {
      chart1Instance.value.dispose()
    }
  }
  const destroyChart2 = () => {
    if (chart2Instance.value) {
      chart2Instance.value.dispose()
    }
  }
  /** 初始化图表 */
  const initChart = async () => {
    if (!chartRef.value || !chartRef1.value || !chartRef2.value) return
    initChart0()
    initChart1()
    initChart2()
    await updateChartsOptions()
  }
  onMounted(async () => {
    await nextTick()
    setTimeout(async () => {
      await initChart() // 确保 DOM 渲染完成后初始化图表
    }, 500)
  })
  /** 销毁图表 */
  onBeforeUnmount(() => {
    // 组件销毁时，销毁 chart 实例
    destroyChart0()
    destroyChart1()
    destroyChart2()
  })
  return {
    updateChartsOptions,
  }
}
