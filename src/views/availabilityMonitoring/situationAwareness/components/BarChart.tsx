import { defineComponent, ref, computed } from 'vue'
import { useEcharts } from '~/hooks/useEcharts'
import type { IBarChartResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './BarChart.module.scss'
import * as echarts from 'echarts'
import MyPopover from '../myPopover'

interface Props {
  title: string
  tip: string
  data: IBarChartResponse | null
  loading?: boolean
  layout?: 'row' | 'column' // 布局方向：row 左右排列，column 上下排列
}

export default defineComponent({
  name: 'BarChart',
  props: {
    title: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
    data: {
      type: Object as () => IBarChartResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String as () => 'row' | 'column',
      default: 'row',
    },
  },
  setup(props: Props, { slots }) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data) {
        return {}
      }
      const linearGradient = (offset0, offset1) => {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }
      const colors = {
        全部: linearGradient('#007DFF', '#7BB8FF'),
        正常: linearGradient('#47C1C1', '#A8EBEB'),
        告警: linearGradient('#F56C6C', '#FFB6B7'),
      }

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: props.data.series.map((s) => s.name),
          bottom: 0,
        },
        grid: {
          top: '3%',
          left: 0,
          right: '5%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: props.data.category,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
          },
          show: props.data.category.length > 0,
        },
        yAxis: {
          type: 'value',
        },
        series: props.data.series.map((s) => ({
          name: s.name,
          type: 'bar',
          data: s.data,
          barWidth: 18,
          itemStyle: {
            color: colors[s.name as keyof typeof colors],
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            focus: 'series',
          },
        })),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.barChart}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            <MyPopover content={props.tip}></MyPopover>
          </div>
          {slots.chartHeaed?.()}
        </div>
        <div class={[styles.chartWrapper, props.layout === 'column' && styles.chartWrapperColumn]}>
          <div class={styles.chartContent}>
            <div ref={chartRef} class={styles.chartContainer}></div>
          </div>
          {slots.default && slots.default()}
        </div>
      </div>
    )
  },
})
