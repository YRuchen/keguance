import { defineComponent, ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useEcharts } from '~/hooks/useEcharts'
import type { ILineChartResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './LineChart.module.scss'
import * as echarts from 'echarts'
import MyPopover from '../myPopover'

interface Props {
  title: string
  tip?: string
  data: ILineChartResponse | null
  loading?: boolean
  isStacked?: boolean
  minHeight?: number
}

export default defineComponent({
  name: 'LineChart',
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
      type: Object as () => ILineChartResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isStacked: {
      type: Boolean,
      default: false,
    },

    minHeight: {
      type: Number,
      default: 240,
    },
  },
  setup(props: Props) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data || !props.data.series || props.data.series.length === 0) {
        return {}
      }
      const linearGradient = (offset0, offset1) => {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }
      const colors = [
        linearGradient('#007DFF', '#7BB8FF'),
        linearGradient('#47C1C1', '#A8EBEB'),
        linearGradient('#F56C6C', '#FFB6B7'),
        linearGradient('#21C0FFCC', '#21C0FF99'),
        linearGradient('#007DFFCC', '#007DFF99'),
        linearGradient('#C29CFFCC', '#C29CFF99'),
        linearGradient('#7E6EE3CC', '#7E6EE399'),
        linearGradient('#21C0FFCC', '#21C0FF99'),
      ]
      const firstSeries = props.data.series[0]
      if (!firstSeries || !firstSeries.data || firstSeries.data.length === 0) {
        return {}
      }

      const timeData = firstSeries.data.map((item) => item.time)

      return {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: props.data.series.map((s) => s.name),
          bottom: 0,
          itemWidth: 12,
          itemHeight: 12,
          icon: 'circle',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: props.data.series.length > 5 ? '20%' : '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeData,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: props.data.series
          .filter((s) => s.data && s.data.length > 0)
          .map((s, index) => ({
            name: s.name,
            type: 'line',
            stack: props.isStacked ? 'Total' : undefined,
            areaStyle: props.isStacked ? {} : undefined,
            data: s.data.map((item) => item.value),
            itemStyle: {
              color: colors[index % colors.length] || '#5470c6',
            },
            lineStyle: {
              color: colors[index % colors.length] || '#5470c6',
            },
            smooth: true,
          })),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.lineChart}>
        <div class={styles.chartHeader}>
          <span class={styles.chartTitle}>{props.title}</span>
          {props.tip && <MyPopover content={props.tip}></MyPopover>}
        </div>
        <div
          ref={chartRef}
          class={styles.chartContainer}
          style={{
            minHeight: `${props.minHeight}px`,
          }}
        ></div>
      </div>
    )
  },
})
