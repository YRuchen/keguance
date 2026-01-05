import IconFont from '@/KeepUp/packages/basicComponents/iconFont'
import { ElMessage, ElTabPane, ElTabs, ElSelect, ElOption } from 'element-plus'
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getPanelDataApi } from '~/api/availabilityMonitoring/situationAwareness'
import type {
  IBarChartResponse,
  IChartRequest,
  ILineChartResponse,
  IMapResponse,
  IOperatorResponseTimeResponse,
  IPieChartResponse,
  ITableResponse,
} from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import BarChart from './components/BarChart'
import DataTable from './components/DataTable'
import FilterPanel from './components/FilterPanel'
import LineChart from './components/LineChart'
import MapChart from './components/MapChart'
import PieChart from './components/PieChart'
import StackedBarChart from './components/StackedBarChart'
import ChartWrap from './chartWrap'

import {
  PanelId,
  ProtocolType,
  protocolOptions,
  RefreshRate,
  TimeType,
  chartTips,
  protocolTabs,
  refreshRateToMs,
} from './constants'
import styles from './index.module.scss'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'SituationAwareness',
  setup() {
    const router = useRouter()

    // 筛选条件
    const filterParams = reactive<IChartRequest>({
      time: TimeType.TODAY,
    })
    const timeRange = ref<[string, string] | null>([
      dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ])
    const refreshRate = ref<RefreshRate>(RefreshRate.HOUR_1)
    const lastUpdateTime = ref<string>('')
    const selectedProtocol = ref<ProtocolType>(ProtocolType.HTTP)
    const top10Filter = ref<ProtocolType | 'ALL'>(ProtocolType.ALL)

    // 自动刷新定时器
    let refreshTimer: ReturnType<typeof setInterval> | null = null
    // 防抖定时器
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    // 请求锁，防止重复请求
    let isRefreshing = false
    let isRefreshingProtocol = false
    // table的筛选
    const allOptions = [...protocolOptions]

    // 图表数据
    const insight1Data = ref<IPieChartResponse | null>(null)
    const insight2Data = ref<IPieChartResponse | null>(null)
    const insight3Data = ref<IPieChartResponse | null>(null)
    const insight4Data = ref<IPieChartResponse | null>(null)
    const insight5Data = ref<IBarChartResponse | null>(null)
    const insight6Data = ref<IBarChartResponse | null>(null)
    const insight7Data = ref<ITableResponse | null>(null)
    const mapData = ref<IMapResponse | null>(null)
    const insight9Data = ref<ILineChartResponse | null>(null)
    const insight10Data = ref<ILineChartResponse | null>(null)
    const insight11Data = ref<IOperatorResponseTimeResponse | null>(null)

    // 加载状态
    const loading = reactive({
      insight1: false,
      insight2: false,
      insight3: false,
      insight4: false,
      insight5: false,
      insight6: false,
      insight7: false,
      map: false,
      insight9: false,
      insight10: false,
      insight11: false,
    })

    // 构建请求参数
    const buildRequestParams = (
      panelId?: string,
      additionalParams?: Record<string, any>,
    ): IChartRequest => {
      const params: IChartRequest = {
        ...filterParams,
        ...additionalParams,
      }

      // 如果选择了自定义时间，使用自定义时间范围
      if (filterParams.time === TimeType.CUSTOM && timeRange.value) {
        params.fromTime = new Date(timeRange.value[0]).toISOString()
        params.toTime = new Date(timeRange.value[1]).toISOString()
        delete params.time
      } else if (filterParams.time) {
        // 映射时间类型值
        if (filterParams.time === TimeType.TODAY) {
          params.time = 'TODAY'
        } else if (filterParams.time === TimeType.LAST_30_DAYS) {
          params.time = '30d'
        } else if (filterParams.time === 'YESTERDAY') {
          params.time = 'YESTERDAY'
        }
      }

      if (panelId) {
        delete params.panelId
      }

      return params
    }

    // 获取面板数据
    const fetchPanelData = async (
      panelId: string,
      additionalParams?: Record<string, any>,
      useFilter: boolean = true,
    ) => {
      const loadingKey = panelId.replace('-', '') as keyof typeof loading
      if (loading[loadingKey] !== undefined) {
        loading[loadingKey] = true
      }

      try {
        const params = useFilter
          ? buildRequestParams(panelId, additionalParams)
          : additionalParams || {}
        localStorage.setItem('alarmParams', JSON.stringify(params))
        const data = await getPanelDataApi(panelId, params)
        localStorage.setItem('alarmParams', JSON.stringify(params))
        return data
      } catch (error) {
        ElMessage.error('获取数据失败')
        return null
      } finally {
        if (loadingKey in loading) {
          loading[loadingKey] = false
        }
      }
    }

    // 初始化三个饼图（不传筛选参数）
    const initFirstThreeCharts = async () => {
      const [data1, data2, data3] = await Promise.all([
        fetchPanelData(PanelId.INSIGHT_1, undefined, false),
        fetchPanelData(PanelId.INSIGHT_2, undefined, false),
        fetchPanelData(PanelId.INSIGHT_3, undefined, false),
      ])
      insight1Data.value = data1 as IPieChartResponse
      insight2Data.value = data2 as IPieChartResponse
      insight3Data.value = data3 as IPieChartResponse
    }

    // 刷新所有图表数据
    const refreshAllCharts = async () => {
      lastUpdateTime.value = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      // 第一块：三个饼图（不需要筛选参数）
      await initFirstThreeCharts()

      // 刷新筛选相关的8个图表
      await refreshFilterCharts()
    }

    // 刷新筛选相关的8个图表
    const refreshFilterCharts = async () => {
      // 如果正在刷新，直接返回，防止重复请求
      if (isRefreshing) {
        return
      }

      isRefreshing = true
      try {
        lastUpdateTime.value = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })

        // 第三块：两个图表
        const [data4, data5] = await Promise.all([
          fetchPanelData(PanelId.INSIGHT_4),
          fetchPanelData(PanelId.INSIGHT_5),
        ])
        insight4Data.value = data4 as IPieChartResponse
        insight5Data.value = data5 as IBarChartResponse

        // 第四块：两个图表
        const [data6, data7] = await Promise.all([
          fetchPanelData(PanelId.INSIGHT_6),
          fetchPanelData(PanelId.INSIGHT_7, {
            subType: top10Filter.value === ProtocolType.ALL ? undefined : top10Filter.value,
          }),
        ])
        insight6Data.value = data6 as IBarChartResponse
        insight7Data.value = data7 as ITableResponse

        // 根据协议刷新图表
        await refreshProtocolCharts()
      } finally {
        isRefreshing = false
      }
    }

    // 刷新协议相关图表
    const refreshProtocolCharts = async () => {
      // 如果正在刷新，直接返回，防止重复请求
      if (isRefreshingProtocol) {
        return
      }

      isRefreshingProtocol = true
      try {
        const protocolParams = {
          subType: selectedProtocol.value,
        }

        const [dataMap, data9, data10, data11] = await Promise.all([
          fetchPanelData(PanelId.RESPONSE_TIME_MAP, protocolParams),
          fetchPanelData(PanelId.INSIGHT_9, protocolParams),
          fetchPanelData(PanelId.INSIGHT_10, protocolParams),
          fetchPanelData(PanelId.INSIGHT_11, protocolParams),
        ])

        mapData.value = dataMap as IMapResponse
        insight9Data.value = data9 as ILineChartResponse
        insight10Data.value = data10 as ILineChartResponse
        const processed = data11 as IOperatorResponseTimeResponse
        insight11Data.value = {
          ...data11,
          series: processed.series.filter((v) => !v.name.includes('最快响应时间')),
        } as IOperatorResponseTimeResponse
      } finally {
        isRefreshingProtocol = false
      }
    }

    // 刷新TOP10表格
    const refreshTop10 = async () => {
      insight7Data.value = (await fetchPanelData(PanelId.INSIGHT_7, {
        subType: top10Filter.value === ProtocolType.ALL ? undefined : top10Filter.value,
      })) as ITableResponse | null
    }

    // 手动刷新
    const handleRefresh = () => {
      refreshFilterCharts()
    }

    // 导出报告
    const handleExport = () => {
      ElMessage.success('已触发导出，请在导出中心查看进度')
    }

    // 查看详情
    const handleViewDetail = () => {
      router.push('alarm')
    }

    // 时间筛选变化
    const handleTimeChange = (value: string) => {
      filterParams.time = value as TimeType
      if (value === TimeType.CUSTOM) {
        timeRange.value = [
          dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        ]
      } else {
        timeRange.value = null
      }

      // 清除之前的防抖定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }

      // 使用防抖，避免快速切换时重复请求
      debounceTimer = setTimeout(() => {
        refreshFilterCharts()
      }, 100)
    }

    // 自定义时间变化
    const handleTimeRangeChange = (value: [string, string] | null) => {
      timeRange.value = value

      if (value) {
        // 清除之前的防抖定时器
        if (debounceTimer) {
          clearTimeout(debounceTimer)
          debounceTimer = null
        }

        // 使用防抖，避免快速切换时重复请求
        debounceTimer = setTimeout(() => {
          refreshFilterCharts()
        }, 100)
      }
    }

    // 刷新频率变化
    const handleRefreshRateChange = (value: RefreshRate) => {
      refreshRate.value = value
      setupAutoRefresh()
    }

    // 协议Tab变化
    const handleProtocolChange = () => {
      refreshProtocolCharts()
    }

    // 设置自动刷新
    const setupAutoRefresh = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
      }

      const ms = refreshRateToMs(refreshRate.value)
      refreshTimer = setInterval(() => {
        refreshFilterCharts()
      }, ms)
    }

    onMounted(() => {
      // 初始化所有图表
      initFirstThreeCharts()
      refreshFilterCharts()
      setupAutoRefresh()
    })

    // TOP10筛选变化
    watch(
      () => top10Filter.value,
      () => {
        refreshTop10()
      },
    )
    onBeforeUnmount(() => {
      if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }
    })

    return () => (
      <div class={styles.container}>
        {/* 第一块：三个饼图 */}
        <ChartWrap
          chartNum={3}
          cardBgColors={[
            'linear-gradient(180deg, #FFFFFF 50%, #C1DFFF 100%)',
            'linear-gradient(180deg, #FFFFFF 50%, #C1DFFF 100%)',
            'linear-gradient(180deg, #FFFFFF 50.48%, #FFCCCC 100%)',
          ]}
        >
          <PieChart
            title='监测总任务数'
            tip={chartTips[PanelId.INSIGHT_1]}
            data={insight1Data.value}
            loading={loading.insight1}
            isHalf={false}
          />
          <PieChart
            title='监测域名/地址'
            tip={chartTips[PanelId.INSIGHT_2]}
            data={insight2Data.value}
            loading={loading.insight2}
            isHalf={false}
          />
          <PieChart
            title='监测异常次数'
            tip={chartTips[PanelId.INSIGHT_3]}
            data={insight3Data.value}
            loading={loading.insight3}
            isHalf={true}
            radius={['140%', '160%']}
            center={['50%', '100%']}
          />
        </ChartWrap>

        {/* 第二块：筛选区域 */}
        <div class={styles.section}>
          <FilterPanel
            timeValue={filterParams.time || TimeType.TODAY}
            timeRange={timeRange.value}
            refreshRate={refreshRate.value}
            lastUpdateTime={lastUpdateTime.value}
            onTimeChange={handleTimeChange}
            onTimeRangeChange={handleTimeRangeChange}
            onRefreshRateChange={handleRefreshRateChange}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </div>

        {/* 第三块：两个图表 */}
        <ChartWrap chartNum={2}>
          <PieChart
            tip={chartTips[PanelId.INSIGHT_4]}
            data={insight4Data.value}
            loading={loading.insight4}
            isHalf={false}
            title='总告警实例数'
            radius={['40%', '100%']}
          >
            <span class={styles.viewDetailLink} onClick={handleViewDetail}>
              查看详情 →
            </span>
          </PieChart>
          <BarChart
            title='不同运营商异常统计'
            tip={chartTips[PanelId.INSIGHT_5]}
            data={insight5Data.value}
            loading={loading.insight5}
          >
            <div class={[styles.targe5, styles.red]}>
              <div class={styles.targeKey} style={{ marginBottom: '15px' }}>
                <IconFont name='error' class={styles.gradientRed}></IconFont>
                <span>异常占比</span>
              </div>
              {insight5Data.value?.summary?.map((summary) => (
                <span class={styles.targeKey} style={{ gap: '20px' }}>
                  <span class={styles.black} style={{ marginLeft: '2px' }}>
                    {summary.key.substring(0, 2)}
                  </span>
                  <span class={styles.numText}>{summary.value}</span>
                </span>
              ))}
            </div>
          </BarChart>
        </ChartWrap>

        {/* 第四块：两个图表 */}
        <ChartWrap chartNum={2}>
          <BarChart
            title='不同协议异常统计'
            tip={chartTips[PanelId.INSIGHT_6]}
            data={insight6Data.value}
            loading={loading.insight6}
          >
            {{
              chartHeaed: () => (
                <span class={styles.viewDetailLink} onClick={handleViewDetail}>
                  查看详情 →
                </span>
              ),
              default: () => (
                <div class={styles.targe6}>
                  {insight6Data.value?.summary?.map((summary) => {
                    const max = summary.key.includes('最大')
                    return (
                      <div class={[styles.targeContent, max ? styles.red : styles.blue]}>
                        <div class={styles.targeKey}>
                          <IconFont
                            name={max ? 'error' : 'award_star'}
                            class={[
                              styles.iconColor,
                              max ? styles.gradientRed : styles.gradientBlue,
                            ]}
                          ></IconFont>
                          <span class={styles.black}>{summary.key}</span>
                        </div>
                        <span class={styles.numText}>{summary.value}</span>
                      </div>
                    )
                  })}
                </div>
              ),
            }}
          </BarChart>
          <DataTable
            title='异常域名/地址 TOP10'
            tip={chartTips[PanelId.INSIGHT_7]}
            data={insight7Data.value}
            loading={loading.insight7}
          >
            <ElSelect v-model={top10Filter.value} class={styles.filterSelect}>
              {allOptions.map((option) => (
                <ElOption key={option.value} label={option.label} value={option.value} />
              ))}
            </ElSelect>
          </DataTable>
        </ChartWrap>

        {/* 第五块：协议Tabs */}
        <div class={styles.section}>
          <ElTabs
            v-model={selectedProtocol.value}
            class='demo-tabs'
            onTabChange={handleProtocolChange}
          >
            {protocolTabs.map((t) => (
              <ElTabPane label={t.label} name={t.value}></ElTabPane>
            ))}
          </ElTabs>
        </div>

        {/* 第六块：地图和折线图 */}
        <ChartWrap chartNum={2}>
          <MapChart
            title='不同地区平均响应时间'
            tip={chartTips[PanelId.RESPONSE_TIME_MAP]}
            data={mapData.value}
            loading={loading.map}
          >
            <div class={styles.mapData}>
              <div class={[styles.targeContent, styles.blue]}>
                <div class={styles.grid}>
                  <span>检测节点</span>
                  <span>{mapData.value?.num ?? 0}个</span>
                </div>
                <span>平均响应时间{mapData.value?.avg ?? 0}ms</span>
              </div>
              <div class={[styles.targeContent, styles.green, styles.targeContent2]}>
                <div class={styles.targeKey}>
                  <IconFont name='rocket_launch'></IconFont>
                  <span>响应时间最快</span>
                </div>
                <span>
                  {mapData.value?.fastest?.city}
                  {mapData.value?.fastest?.isp}({mapData.value?.fastest?.value ?? 0}ms)
                </span>
              </div>
              <div class={[styles.targeContent, styles.red, styles.targeContent2]}>
                <div class={styles.targeKey}>
                  <IconFont name='error' class={styles.iconRed}></IconFont>
                  <span>响应时间最慢</span>
                </div>
                <span>
                  {mapData.value?.slowest?.city}
                  {mapData.value?.slowest?.isp}({mapData.value?.slowest?.value}ms)
                </span>
              </div>
            </div>
          </MapChart>
          <LineChart
            title='平均响应时间趋势图'
            tip={chartTips[PanelId.INSIGHT_9]}
            data={insight9Data.value}
            loading={loading.insight9}
          />
        </ChartWrap>

        {/* 第七块：折线图和堆叠条形图 */}
        <ChartWrap chartNum={2}>
          <LineChart
            title='平均耗时分析统计图'
            tip={chartTips[PanelId.INSIGHT_10]}
            data={insight10Data.value}
            loading={loading.insight10}
            isStacked={true}
          />
          <StackedBarChart
            title='不同运营商平均响应时间'
            tip={chartTips[PanelId.INSIGHT_11]}
            data={insight11Data.value}
            loading={loading.insight11}
            unit='ms'
          />
        </ChartWrap>
      </div>
    )
  },
})
