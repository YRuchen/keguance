import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  getOverview0ChartApi,
  getResponseTime,
  getOverview8ChartApi,
  getAvailability,
  getOverviewChartApi,
} from '~/api/availabilityMonitoring/overview'
import { aliyunChinaMap } from '~/utils/aliyunChinaMap'
import { provinceMap, emptyProvinceData } from '~/utils/provinceMap'
import {
  buildMapOption,
  buildLineOption,
  getOverview1Options,
  getOverview3Options,
  getOverview4Options,
  getOverview5Options,
  getOverview6Options,
} from './chartOptions'

import type { Ref, ComputedRef } from 'vue'
import type { Form } from '@formily/core'
import type { ILineModuleGetLineChartRes, ILineModuleGetBarChartRes } from '~/interfaces/common'
import type { IChartsDataItem } from './interfaces'

export const normalizeMapData = (apiData) => {
  const subdivisions = apiData?.subdivisions ?? {}
  const result = JSON.parse(JSON.stringify(emptyProvinceData))
  Object.keys(subdivisions).forEach((key) => {
    const fullName = provinceMap[key] || key
    if (result[fullName]) {
      result[fullName].avg = subdivisions[key].avg ?? 0
      result[fullName].detail = subdivisions[key].detail ?? []
    }
  })
  return result
}
export const useEcharts = (chartRefs: Ref<HTMLElement>[], formRef: ComputedRef<Form>) => {
  const nodeCountResponse = ref(0)
  const nodeCountAvailability = ref(0)
  // 响应时间字段
  const avgRespTime = ref(0)
  const fastResp = ref({ city: '-', isp: '-', value: 0 })
  const slowResp = ref({ city: '-', isp: '-', value: 0 })
  // 可用率字段
  const avgAvail = ref(0)
  const bestAvail = ref(0)
  const worstAvail = ref(0)
  const charts = []
  const chartData = ref<IChartsDataItem>({
    overview1: null,
    overview2: null,
    overview3: null,
    overview4: null,
    overview5: null,
    overview6: null,
    overview7: null,
    overview8: null,
  })
  /** 更新图表 */
  const updateEcharts = async () => {
    try {
      const formData = {
        ...(formRef.value?.values || {}),
        fromTime: formRef.value?.values.fromTime
          ? new Date(formRef.value?.values.fromTime).toISOString()
          : undefined,
        toTime: formRef.value?.values.toTime
          ? new Date(formRef.value?.values.toTime).toISOString()
          : undefined,
      }
      const chartParams = {
        time: formRef.value?.values.time,
        fromTime: formRef.value?.values.fromTime,
        toTime: formRef.value?.values.toTime,
        subType: formRef.value?.values.subType,
        testId: formRef.value?.values.testId,
        domain: formRef.value?.values.domain,
        panelWidth: 200,
      }
      const [
        overview1,
        overview2,
        overview3,
        overview4,
        overview5,
        overview6,
        overview7,
        overview8,
        respLine,
        availLine,
      ] = await Promise.all([
        getOverview0ChartApi(formData),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-2',
        ),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-3',
        ),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-4',
        ),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-5',
        ),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-6',
        ),
        getOverviewChartApi(
          {
            ...chartParams,
            fromTime: chartParams.fromTime
              ? new Date(chartParams.fromTime).toISOString()
              : undefined,
            toTime: chartParams.toTime ? new Date(chartParams.toTime).toISOString() : undefined,
          },
          'overview-7',
        ),
        getOverview8ChartApi(formData),
        getResponseTime(formData),
        getAvailability(formData),
      ])
      chartData.value = {
        overview1,
        overview2: overview2 as ILineModuleGetBarChartRes,
        overview3: overview3 as ILineModuleGetBarChartRes,
        overview4: overview4 as ILineModuleGetBarChartRes,
        overview5: overview5 as ILineModuleGetBarChartRes,
        overview6: overview6 as ILineModuleGetLineChartRes,
        overview7: overview7 as ILineModuleGetLineChartRes,
        overview8,
      }
      nodeCountResponse.value = overview1.num ?? 0
      nodeCountAvailability.value = overview8.num ?? 0
      const map1 = normalizeMapData(overview1)
      const map2 = normalizeMapData(overview8)
      avgRespTime.value = overview1.avg ?? 0
      fastResp.value =
        typeof overview1.fastest === 'object' && overview1.fastest !== null
          ? overview1.fastest
          : {
              city: '-',
              isp: '-',
              value: typeof overview1.fastest === 'number' ? overview1.fastest : 0,
            }
      slowResp.value =
        typeof overview1.slowest === 'object' && overview1.slowest !== null
          ? overview1.slowest
          : {
              city: '-',
              isp: '-',
              value: typeof overview1.slowest === 'number' ? overview1.slowest : 0,
            }
      avgAvail.value = overview8.value ?? 0
      bestAvail.value = overview8.abnormalNum ?? 0
      worstAvail.value = overview8.normalNum ?? 0
      const mapOption1 = buildMapOption(map1, 'ms', true)
      // 覆盖地图配置：调大尺寸并向右偏移
      if (mapOption1.series && mapOption1.series[0]) {
        mapOption1.series[0].layoutCenter = ['65%', '60%']
        mapOption1.series[0].layoutSize = '120%'
      }
      charts[0].setOption(mapOption1)
      charts[1].setOption(
        getOverview1Options(
          chartData.value.overview2.category,
          chartData.value.overview2.series?.[0]?.name,
          chartData.value.overview2.series?.[0]?.data,
        ),
        true,
      )
      charts[2].setOption(
        getOverview1Options(
          chartData.value.overview3.category,
          chartData.value.overview3.series?.[0]?.name,
          chartData.value.overview3.series?.[0]?.data,
        ),
        true,
      )
      charts[3].setOption(
        getOverview3Options(
          chartData.value.overview4.category,
          (chartData.value.overview4.series || []).map((v) => ({
            name: v.name,
            type: 'bar',
            label: {
              show: true,
              position: 'right', // ← 值显示在柱子右侧（横向图的“顶部”）
              fontSize: 12,
              fontWeight: 600,
              formatter: (params) => `${params.value} ms`,
            },
            data: v.data,
          })),
        ),
        true,
      )
      charts[4].setOption(
        getOverview4Options(
          chartData.value.overview5.category,
          (chartData.value.overview5.series || []).map((v) => ({
            name: v.name,
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: { show: true, formatter: '{c}' },
            data: v.data,
          })),
        ),
        true,
      )
      charts[5].setOption(getOverview5Options(overview6.series || []), true)
      charts[6].setOption(
        getOverview6Options(
          (chartData.value.overview7.series?.[0]?.data || []).map((v) => v.time),
          (chartData.value.overview7.series || []).map((v) => ({
            name: v.name,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: { focus: 'series' },
            data: v.data,
          })),
        ),
        true,
      )
      const mapOption2 = buildMapOption(map2, '%', false)
      // 覆盖地图配置：调大尺寸并向右偏移
      if (mapOption2.series && mapOption2.series[0]) {
        mapOption2.series[0].layoutCenter = ['65%', '60%']
        mapOption2.series[0].layoutSize = '120%'
      }
      charts[7].setOption(mapOption2)
      charts[8].setOption(buildLineOption(availLine.values || [], '#4CAF50', '可用率', '%'), true)
    } catch (error: any) {
      console.error(`更新图表错误，错误原因：${error}`)
    }
  }
  const updateOverview2Options = async () => {
    await nextTick()
    charts[1]?.resize()
    charts[2]?.resize()
    charts[1].setOption(
      getOverview1Options(
        chartData.value.overview2.category,
        chartData.value.overview2.series?.[0]?.name,
        chartData.value.overview2.series?.[0]?.data,
      ),
      true,
    )
    charts[2].setOption(
      getOverview1Options(
        chartData.value.overview3.category,
        chartData.value.overview3.series?.[0]?.name,
        chartData.value.overview3.series?.[0]?.data,
      ),
      true,
    )
  }
  const loadGeoJson = async () => {
    echarts.registerMap('china', aliyunChinaMap as any)
  }
  const initCharts = async () => {
    await loadGeoJson()
    charts.length = 0
    chartRefs.forEach((el) => {
      if (!el.value) return
      const chart = echarts.init(el.value)
      charts.push(chart)
    })
  }
  onMounted(async () => {
    await initCharts()
  })
  onBeforeUnmount(() => {
    charts.forEach((c) => c.dispose())
  })
  return {
    updateEcharts,
    updateOverview2Options,
    nodeCountResponse,
    nodeCountAvailability,
    avgRespTime,
    fastResp,
    slowResp,
    avgAvail,
    bestAvail,
    worstAvail,
    chartData,
  }
}
