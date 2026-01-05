import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Big from 'big.js'
import { TraceView, useVisibleData, Space } from '~/KeepUp'
import { getDetailApi, getLogApi } from '~/api/trace/traceExploration'
import { toDataQueryResponse } from './utils'
import Log from './components/log'
import TraceOverviewChart from './components/traceOverviewChart'
import { basicDataField } from './constants'
import styles from './index.module.scss'

import type { Ref } from 'vue'
import type { ISpanItem } from '~/KeepUp'
import type { ILogExpose, ILogData } from './components/log/interfaces'

/** 获取前后一分钟的时间 */
const getStepTime = (time: number) => {
  const step = 60 * 1000
  const prev = new Big(time).minus(step).round(0)
  const next = new Big(time).plus(step).round(0)
  return {
    from: prev,
    to: next,
  }
}

export default defineComponent({
  name: 'Detail',
  setup() {
    const route = useRoute()
    const traceOverviewChartRef = ref()
    const logRef = ref<ILogExpose>()
    const logLoading = ref(false)
    const data = ref<ISpanItem[]>([])
    const logData = ref<ILogData>({
      basicData: null,
      log: [],
    })
    const init = async () => {
      try {
        const queries = [
          {
            query: route.query?.id,
            queryType: 'traceId',
            refId: 'A',
            limit: 20,
            tableType: 'traces',
            metricsQueryType: 'range',
            datasource: {
              type: 'tempo',
              uid: 'tempo'
            },
            serviceMapQuery: '',
            datasourceId: 2,
            intervalMs: 5000,
            maxDataPoints: 524
          }
        ]
        const params = {
          queries,
          from: '0',
          to: '0'
        }
        const res: any = await getDetailApi(params)
        const res1 = toDataQueryResponse(
          res,
          queries,
        )
        data.value = res1.custom as any
      } catch (error: any) {
        console.error(`初始化数据失败：${error}`)
      }
    }
    init()
    const refreshOverViewChart = async () => {
      setTimeout(() => {
        traceOverviewChartRef.value?.refresh()
      }, 100)
    }
    const openLogPanel = async ({ span }: Record<'span', ISpanItem>) => {
      try {
        logLoading.value = true
        logRef.value?.open()
        refreshOverViewChart()
        const queries = [
          {
            query: `"\"${span.spanID}\" AND \"${route.query?.id}\""`,
            refId: 'A',
            metrics: [
              {
                id: '1',
                type: 'logs'
              }
            ],
            queryType: 'lucene',
            luceneQueryType: 'Logs',
            alias: '',
            bucketAggs: [
              {
                type: 'date_histogram',
                id: '2',
                settings: {
                  interval: 'auto'
                },
                field: '@timestamp'
              }
            ],
            format: 'table',
            timeField: '@timestamp',
            datasource: {
              type: 'grafana-opensearch-datasource',
              uid: 'opensearch'
            },
            datasourceId: 3,
            intervalMs: 5000,
            maxDataPoints: 514,
          }
        ]
        const params = {
          queries,
          ...getStepTime(span.startTime),
        }
        const res = await getLogApi(params)
        const res1 = toDataQueryResponse(
          res,
          queries,
        )
        logData.value = {
          basicData: Object.fromEntries(
            Object.entries(span)
              .filter(([k, v]) => basicDataField.includes(k))
          ),
          log: res1.custom,
        }
        // refreshOverViewChart()
      } catch (error: any) {
        console.error(`打开日志失败，失败原因：${error}`)
      } finally {
        logLoading.value = false
      }
    }
    const {
      visibleData,
    } = useVisibleData(data as Ref<ISpanItem[]>, ref(new Set([])))
    const rootSpan = computed(() => data.value.find(v => !v?.parentSpanID))
    /** 刻度区间（分为几个区间） */
    const axisesIntervalCount = computed(() => 5 - 1)
    /** 刻度总数（共有几个刻度点） */
    const totalAxises = computed(() => 5 + 1)
    /** 时间步长 */
    const timeStep = computed(() => new Big(rootSpan.value?.duration || 0).div(axisesIntervalCount.value).round(4))
    /** 时间轴刻度点 */
    const axises = computed(() => new Array(totalAxises.value).fill(0).map((_, i) => `${timeStep.value.times(i)}ms`)) 
    return () => (
      <Space fill>
        <Space class={styles.trace} style={{ flex: 1, width: 'auto' }} direction='column'>
          <TraceOverviewChart 
            ref={traceOverviewChartRef} data={visibleData.value} 
            axises={axises.value} 
            timeStep={timeStep.value}
            timeColumns={5}
          />
          <TraceView
            data={data.value}
            timeColumns={5}
            onOpenLogPanel={openLogPanel}
          />
        </Space>
        <Log
          vLoading={logLoading.value}
          ref={logRef}
          data={logData.value}
          onClosed={refreshOverViewChart}
        />
      </Space>
    )
  }
})
