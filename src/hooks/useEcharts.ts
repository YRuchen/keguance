import { ref, Ref, watch, onMounted, onBeforeUnmount, nextTick, onActivated, onDeactivated } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export const useEcharts = (
  chartRef: Ref<HTMLDivElement | undefined>,
  option: Ref<EChartsOption | undefined>,
) => {
  let chart: echarts.ECharts | null = null
  const resizeHandler = () => chart?.resize()
  let resizeObserver: ResizeObserver | null = null
  const renderChart = () => {
    if (!chartRef.value) return
    if (!chart) {
      chart = echarts.init(chartRef.value)
    }
    if (option.value) {
      chart.setOption(option.value, true)
    }
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

  watch(
    () => option.value,
    () => {
      if (chart && option.value) {
        chart.setOption(option.value, true)
      }
    },
    { deep: true }
  )

  onMounted(() => {
    nextTick(() => {
      renderChart()
      setupResizeObserver()
    })
    window.addEventListener('resize', resizeHandler)
  })


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
