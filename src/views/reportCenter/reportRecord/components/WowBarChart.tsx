import { defineComponent, ref, computed } from 'vue'
import { useEcharts } from '~/hooks/useEcharts'
import type { EChartsOption } from 'echarts'
import styles from './WowBarChart.module.scss'
import * as echarts from 'echarts'
import MyPopover from '@/views/availabilityMonitoring/situationAwareness/myPopover'

interface WeekData {
  data?: number[]
  name?: string
}

interface WowBarChartData {
  category?: string[]
  path?: string[] // 升降说明，如 'up', 'down'
  per?: number[] // 增长率
  series?: WeekData[]
}

interface Props {
  title: string
  tip?: string
  data: WowBarChartData | null
  loading?: boolean
}

export default defineComponent({
  name: 'WowBarChart',
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
      type: Object as () => WowBarChartData | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (
        !props.data ||
        !props.data.category ||
        !props.data.series ||
        props.data.series.length === 0
      ) {
        return {}
      }

      const linearGradient = (offset0: string, offset1: string) => {
        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: offset0 },
          { offset: 1, color: offset1 },
        ])
      }

      // 浅灰色和蓝色渐变
      const colors = [
        linearGradient('#E5E5E5', '#D0D0D0'), // 上周 - 浅灰色
        linearGradient('#7BB8FF', '#007DFF'), // 本周 - 蓝色
      ]

      const categories = props.data.category || []
      const series = props.data.series || []
      // const series = [
      //   { data: [340, 0, 0, 0, 0, 0, 0, 0], name: '上周告警任务数(0001-01-01-0001-01-01)' },
      //   { data: [263, 38, 0, 0, 14, 0, 116, 0], name: '本此告警任务数(0001-01-01-0001-01-01)' },
      // ]
      const paths = props.data.path || []
      const pers = props.data.per || []

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: series.map((s) => s.name || ''),
          bottom: 0,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: series.map((s, seriesIndex) => {
          // 如果是本周的数据（第二个系列），需要在柱子上方显示增长/下降指示器
          const showLabel = seriesIndex === 1 && paths.length > 0 && pers.length > 0

          // 构建rich配置
          const rich: Record<string, any> = {}
          if (showLabel) {
            categories.forEach((_, index) => {
              if (index < paths.length && index < pers.length) {
                const path = paths[index]
                const per = pers[index]
                rich[`label${index}`] = {
                  color: path === 'up' ? '#F56C6C' : '#47C1C1',
                  fontSize: 12,
                  fontWeight: 'bold',
                }
              }
            })
          }

          return {
            name: s.name || '',
            type: 'bar',
            data: (s.data || []).map((value, index) => {
              const dataItem: any = {
                value,
              }

              // 如果是本周数据且有增长/下降信息，添加label
              if (showLabel && index < paths.length && index < pers.length) {
                const path = paths[index]
                const per = pers[index]
                const perText = per !== undefined ? `${Math.abs(per).toFixed(1)}%` : ''
                const isTrend = path === 'up' || path === 'down'
                const triangle = path === 'up' ? '▲' : '▼'

                dataItem.label = {
                  show: true,
                  position: 'top',
                  formatter: isTrend
                    ? `{triangle|${triangle}} {text|${perText}}`
                    : `{normal|${perText}}`,
                  rich: {
                    triangle: {
                      color: path === 'up' ? '#F56C6C' : '#47C1C1',
                      fontSize: 12,
                      fontWeight: 'bold',
                    },
                    text: {
                      color: '#303133',
                      fontSize: 12,
                      fontWeight: 'bold',
                    },
                    normal: {
                      color: '#909399',
                      fontSize: 12,
                      fontWeight: 'normal',
                    },
                  },
                }
              }

              return dataItem
            }),
            barWidth: 18,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: colors[seriesIndex],
            },
            emphasis: {
              focus: 'series',
            },
          }
        }),
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.wowBarChart}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            {props.tip && <MyPopover content={props.tip}></MyPopover>}
          </div>
        </div>
        <div ref={chartRef} class={styles.chartContainer}></div>
      </div>
    )
  },
})
