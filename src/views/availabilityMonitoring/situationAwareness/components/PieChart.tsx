import { defineComponent, ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useEcharts } from '~/hooks/useEcharts'
import type { IPieChartResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import type { EChartsOption } from 'echarts'
import styles from './PieChart.module.scss'
import warningRed from '@/assets/image/warning_red.png'
import MyPopover from '../myPopover'

interface Props {
  title?: string
  tip: string
  data: IPieChartResponse | null
  loading?: boolean
  isHalf?: boolean
  showTitle?: boolean
  radius?: string[]
  center?: string[]
}

export default defineComponent({
  name: 'PieChart',
  props: {
    title: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      required: true,
    },
    data: {
      type: Object as () => IPieChartResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isHalf: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    radius: {
      type: Array,
      default: () => ['40%', '90%'],
    },
    center: {
      type: Array,
      default: () => ['50%', '50%'],
    },
  },
  setup(props: Props, { slots }) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data || !props.data.data || props.data.data.length === 0) {
        return { series: [] }
      }

      const colors = ['#7E6EE3', '#AE7BFF', '#004B99', '#007DFF', '#83C0FF', '#009EDD']

      const pieData = props.data.data.map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: colors[index % colors.length],
        },
      }))

      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          show: false,
        },

        series: [
          {
            type: 'pie',
            // radius: props.isHalf ? ['140%', '160%'] : ['40%', '100%'],
            // center: props.isHalf ? ['50%', '100%'] : ['50%', '50%'],
            radius: props.radius,
            center: props.center,
            startAngle: props.isHalf ? 180 : 0,
            endAngle: props.isHalf ? 360 : 360,

            label: {
              alignTo: 'edge',
              formatter: '{name|{b}}\n{count|{c} ({d}%)}',
              minMargin: 5,
              edgeDistance: 0,
              lineHeight: 15,
              rich: {
                count: {
                  fontSize: 12,
                  color: '#606266',
                },
                name: {
                  fontSize: 12,
                  color: '#606266',
                },
              },
            },
            labelLine: {
              length: 15,
              length2: 0,
              maxSurfaceAngle: 80,
            },
            labelLayout: function (params: any) {
              let chartWidth = chartInstance?.getWidth()
              if (!chartWidth && chartRef.value) {
                chartWidth = chartRef.value.clientWidth
              }
              const isLeft = params.labelRect.x < chartWidth / 2
              const points = params.labelLinePoints
              if (points) {
                points[2][0] = isLeft
                  ? params.labelRect.x
                  : params.labelRect.x + params.labelRect.width
              }
              // Update the end point.
              return {
                labelLinePoints: points,
              }
            },
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2,
            },
            data: pieData,
          },
        ],
      }
    })

    const { getChart } = useEcharts(chartRef, chartOption)
    const chartInstance = getChart()
    return () => (
      <div class={styles.pieChart}>
        {props.showTitle && props.title && (
          <div class={styles.chartHeader}>
            <div class={[styles.chartHeader, styles.gap]}>
              <span class={styles.chartTitle}>{props.title}</span>
              <MyPopover content={props.tip}></MyPopover>
            </div>
            {slots.default?.()}
          </div>
        )}
        {props.data && <div class={styles.fullPieTotal}>{props.data.total}</div>}
        <div class={styles.chartContent}>
          {props.isHalf && <img src={warningRed} class={styles.warnImg} />}
          <div
            ref={chartRef}
            class={styles.chartContainer}
            style={{ maxWidth: '37.5rem', minWidth: '25rem', margin: '0 auto' }}
          ></div>
        </div>
      </div>
    )
  },
})
