import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { IMapResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import { useEcharts } from '~/hooks/useEcharts'
import { aliyunChinaMap } from '~/utils/aliyunChinaMap'
import { emptyProvinceData, provinceMap } from '~/utils/provinceMap'
import { buildMapOption } from '~/views/availabilityMonitoring/overview/chartOptions'
import MyPopover from '../myPopover'
import styles from './MapChart.module.scss'

interface Props {
  title: string
  tip: string
  data: IMapResponse | null
  loading?: boolean
}

let mapRegistered = false

export default defineComponent({
  name: 'MapChart',
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
      type: Object as () => IMapResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { slots }) {
    const chartRef = ref<HTMLDivElement>()

    const normalizeMapData = (apiData: IMapResponse | null) => {
      if (!apiData) {
        return emptyProvinceData
      }

      const subdivisions = apiData.subdivisions || {}
      const result = JSON.parse(JSON.stringify(emptyProvinceData))

      Object.keys(subdivisions).forEach((key) => {
        const fullName = provinceMap[key] || key
        if (result[fullName]) {
          result[fullName].avg = subdivisions[key].avg || 0
          result[fullName].detail = subdivisions[key].detail || []
        }
      })
      return result
    }

    const chartOption = computed<EChartsOption>(() => {
      if (!props.data) {
        return {}
      }

      if (!mapRegistered) {
        echarts.registerMap('china', aliyunChinaMap as any)
        mapRegistered = true
      }

      const mapData = normalizeMapData(props.data)
      return buildMapOption(mapData, 'ms', true)
    })

    // 确保在地图注册后再初始化图表
    onMounted(() => {
      if (!mapRegistered) {
        echarts.registerMap('china', aliyunChinaMap as any)
        mapRegistered = true
      }
    })

    useEcharts(chartRef, chartOption)

    return () => (
      <div class={styles.mapChart}>
        <div class={styles.chartHeader}>
          <span class={styles.chartTitle}>{props.title}</span>
          <MyPopover content={props.tip}></MyPopover>
        </div>
        <div class={styles.chartWrapper}>
          <div class={styles.chartContent}>
            <div ref={chartRef} class={styles.chartContainer}></div>
          </div>
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
