import { defineComponent, ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useEcharts } from '~/hooks/useEcharts'
import type { IOperatorResponseTimeResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './StackedBarChart.module.scss'
import * as echarts from 'echarts'
import MyPopover from '../myPopover'

interface Props {
  title: string
  tip?: string
  data: IOperatorResponseTimeResponse | null
  loading?: boolean
  showxAxis?: boolean
  unit?: string
}

export default defineComponent({
  name: 'StackedBarChart',
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
      type: Object as () => IOperatorResponseTimeResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showxAxis: {
      type: Boolean,
      default: true,
    },
    unit: {
      type: String,
      default: '',
    },
  },
  setup(props: Props) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data || !props.data.category || !props.data.series) {
        return {}
      }

      const linearGradient = (offset0, offset1) => {
        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }
      const colors = {
        平均响应时间: linearGradient('#7BB8FF', '#007DFF'),
        最慢响应时间: linearGradient('#FFB6B7', '#F56C6C'),
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
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}' + props.unit,
          },
          show: props.showxAxis,
        },
        yAxis: {
          type: 'category',
          show: props.data.category.length > 0,
          data: props.data.category,
        },
        series: props.data.series.map((s) => ({
          name: s.name,
          type: 'bar',
          data: s.data,
          itemStyle: {
            color: colors[s.name as keyof typeof colors] || linearGradient('#FFB6B7', '#F56C6C'),
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              return params.value + props.unit
            },
          },
          emphasis: {
            focus: 'series',
          },
        })),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.stackedBarChart}>
        <div class={styles.chartHeader}>
          <span class={styles.chartTitle}>{props.title}</span>

          {props.tip && <MyPopover content={props.tip}></MyPopover>}
        </div>
        <div ref={chartRef} class={styles.chartContainer}></div>
      </div>
    )
  },
})
