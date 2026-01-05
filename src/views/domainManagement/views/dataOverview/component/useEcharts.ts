import { Ref, onMounted, onBeforeUnmount, nextTick, onActivated, onDeactivated, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export const useEcharts = (
  chartRef: Ref<HTMLDivElement | undefined>,
  option: Ref<EChartsOption | undefined>,
) => {
  let chart: echarts.ECharts | null = null
  let resizeObserver: ResizeObserver | null = null

  const resizeHandler = () => chart?.resize()

  const renderChart = () => {
    if (!chartRef.value) return
    if (!chart) {
      chart = echarts.init(chartRef.value)
    }
    chart.setOption(option.value)
    // 初始化后立刻根据实际尺寸计算，避免容器初始宽度为 0 时压缩
    chart.resize()
  }

  const setupResizeObserver = () => {
    if (!chartRef.value || resizeObserver) return
    resizeObserver = new ResizeObserver(() => resizeHandler())
    resizeObserver.observe(chartRef.value)
  }

  const cleanupResizeObserver = () => {
    if (resizeObserver && chartRef.value) {
      resizeObserver.unobserve(chartRef.value)
    }
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  onMounted(() => {
    nextTick(() => {
      renderChart()
      setupResizeObserver()
    })
    window.addEventListener('resize', resizeHandler)
  })

  // 监听配置变化，及时刷新图表
  watch(
    option,
    () => {
      renderChart()
    },
    { deep: true },
  )

  // keep-alive 场景下激活时重新自适应
  onActivated(() => {
    nextTick(() => {
      renderChart()
    })
  })

  onDeactivated(() => {
    cleanupResizeObserver()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    cleanupResizeObserver()
    chart?.dispose()
  })
  return {
    getChart: () => chart, // 返回一个函数，父组件调用时拿到 chart
  }
}
