import { defineComponent, onMounted, onBeforeUnmount, ref, watch, computed, PropType } from 'vue'
import Big from 'big.js'
import * as echarts from 'echarts'
import styles from './index.module.scss'

import type { IVisibleDataItem } from '~/KeepUp'

export default defineComponent({
  name: 'TraceOverviewChart',
  props: {
    data: {
      type: Array as () => IVisibleDataItem[],
      default: () => ([]),
    },
    axises: {
      type: Array as PropType<string[]>,
      default: () => ([]),
    },
    timeStep: {
      type: Number,
    },
    /** 时间轴刻度 */
    timeColumns: {
      type: Number,
      default: 5,
    },
  },
  setup(props, { expose }) {
    const chartRef = ref<HTMLDivElement>()
    let chart: echarts.ECharts | null = null
    const initChart = () => {
      if (!chartRef.value) {
        return
      }
      if (chart) {
        chart.dispose()
      }
      chart = echarts.init(chartRef.value)
      const spans = computed(() => (props.data || []).sort((a, b) => a.span.startTime - b.span.startTime))
      /** 时间轴基准数据 */
      const rootSpan = computed(() => spans.value.find(v => !v?.span?.parentSpanID))
      const option: echarts.EChartsOption = {
        animation: true,
        animationDuration: 800,         // 动画持续时间
        animationEasing: 'cubicOut',   // 缓动
        grid: {
          left: '0%',
          right: '0',
          bottom: '0%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          name: '',
          position: 'top', // ✅ x轴在顶部
          min: 0,
          alignTicks: true,
          max: rootSpan.value?.span.duration + 1,
          axisLine: { show: true },
          axisTick: { show: false },
          interval: Number(props.timeStep),
          axisLabel: {
            formatter: (v, idx) => {
              if (idx === 0) return `      ${Number(new Big(v).round(4))}ms`;         // 左边刻度文字右移一点
              if (idx === props.timeColumns - 1) return `${Number(new Big(v).round(4))}ms                `; // 右边刻度文字左移一点
              return `${Number(new Big(v).round(4))}ms     `;
            },
          },
          splitLine: {
            show: true,             // 显示竖向网格线
          },
        },
        yAxis: {
          type: 'category',
          data: props.data.map(v => v.span.spanID),
          inverse: true, // ✅ 顶部任务在上
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { show: false },
        },
        series: [
          {
            name: 'Start offset',
            type: 'bar',
            stack: 'total',
            itemStyle: { color: 'transparent' },
            emphasis: { itemStyle: { color: 'transparent' } },
            data: props.data.map(v => v.span.startTime - rootSpan.value.span.startTime),
            barWidth: 8, // ✅ 控制柱形宽度
          },
          {
            name: 'Duration',
            type: 'bar',
            stack: 'total',
            barWidth: 8, // ✅ 控制柱形宽度
            label: { show: false },
            data: props.data.map(v => ({
              value: v.span.duration,
              itemStyle: {
                color: v.color, // 每条不同颜色
              },
            })),
          },
        ],
      }
      chart.setOption(option)
    }
    const refresh = async () => {
      chart?.resize({ animation: { duration: 500, easing: 'cubicOut' } })
    }
    const resizeHandler = () => {
      chart?.resize()
    }
    onMounted(() => {
      initChart()
      window.addEventListener('resize', resizeHandler)
    })
    onBeforeUnmount(() => {
      chart?.dispose()
      window.removeEventListener('resize', resizeHandler)
    })
    watch(
      () => props.data,
      () => {
        initChart()
      },
      { deep: true }
    )
    expose({
      refresh,
    })
    return () => (<div ref={chartRef} class={styles.container} />)
  },
})
