import { defineComponent, ref, computed } from 'vue'
import { useEcharts } from '~/hooks/useEcharts'
import type { EChartsOption } from 'echarts'
import styles from './TaskTop10BarChart.module.scss'
import * as echarts from 'echarts'

interface Props {
  title: string
  data: any | null
  loading?: boolean
  unit?: string
}

export default defineComponent({
  name: 'TaskTop10BarChart',
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      default: '%',
    },
  },
  setup(props: Props) {
    const chartRef = ref<HTMLDivElement>()

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data || !props.data.details || props.data.details.length === 0) {
        return {}
      }

      const top10 = props.data.details.slice(0, 10)
      const category = top10.map((item: any) => item.taskName || '-')

      // 根据任务类型返回不同的值
      const data = top10.map((item: any) => {
        if (props.data.taskType === '2') {
          // DNS检测返回响应时间（如果有leftTime字段，单位是ms）
          const leftTimeStr = item.leftTime || '0'
          const leftTimeNum = parseFloat(leftTimeStr.toString().replace('ms', '')) || 0
          return leftTimeNum
        } else {
          // 其他类型返回占比（percent可能是0-1之间的小数，需要转换为百分比）
          const percent = parseFloat(item.percent?.toString() || '0') || 0
          return percent > 1 ? percent : percent * 100
        }
      })

      // 创建渐变颜色
      const linearGradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#AFD6FF' },
        { offset: 1, color: '#E0EFFF' },
      ])

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: any) => {
            const param = params[0]
            const index = param.dataIndex
            const item = top10[index]
            const domain = item?.domain || '-'
            const value = param.value
            const unit = props.unit || '%'
            return `${param.name}<br/>${value}${unit}<br/>${domain}`
          },
        },
        grid: {
          left: '3%',
          right: '15%',
          bottom: '3%',
          top: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: category,
          inverse: true,
          axisLabel: {
            formatter: (value: string) => {
              // 如果任务名称太长，截断显示
              return value.length > 15 ? value.substring(0, 15) + '...' : value
            },
          },
        },
        series: [
          {
            name: props.data.taskType === '2' ? '平均响应时间' : '占比',
            type: 'bar',
            data: data,
            itemStyle: {
              color: linearGradient,
              borderRadius: [0, 4, 4, 0],
            },
            barWidth: '18',
            label: {
              show: true,
              position: 'insideLeft',
              formatter: (params: any) => {
                const index = params.dataIndex
                const item = top10[index]
                const domain = item?.domain || '-'
                return `${params.value.toFixed(2)}${props.unit} ${domain}`
              },
              color: '#333',
            },
            emphasis: {
              focus: 'series',
            },
          },
        ],
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.taskTop10BarChart}>
        <div class={styles.chartHeader}>
          <span class={styles.chartTitle}>{props.title}</span>
        </div>
        <div ref={chartRef} class={styles.chartContainer}></div>
      </div>
    )
  },
})
