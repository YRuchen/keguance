<script setup lang="tsx">
import { computed, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useEcharts } from './useEcharts'
import { IOverviewTaskHistogramHist } from '~/api/domainManagement/dataOverview/interfaces'

const props = defineProps<{
  data?: IOverviewTaskHistogramHist[]
}>()

const chartRef = ref<HTMLDivElement>()
const chartStats = computed<IOverviewTaskHistogramHist[]>(() => props.data || [])

const getOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(0,0,0,0.8)',
    textStyle: {
      color: '#fff',
    },
    borderColor: 'transparent',
    formatter: (params: any[]) => {
      if (!params?.length) return ''
      return params.map((item) => `${item.seriesName}: ${item.value}`).join('<br/>')
    },
  },
  legend: {
    bottom: 0,
    icon: 'rect',
    itemWidth: 12,
    itemHeight: 8,
    textStyle: {
      fontSize: 12,
      color: '#6B778C',
    },
  },
  grid: {
    left: 20,
    right: 20,
    top: 20,
    bottom: 40,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: chartStats.value.map((item) => item.name),
    axisLine: { lineStyle: { color: '#D8DFEB' } },
    axisLabel: { color: '#6B778C', fontSize: 12, interval: 0, rotate: 45 },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#D8DFEB' } },
    splitLine: { lineStyle: { color: '#EFF3FA' } },
    axisLabel: { color: '#6B778C', fontSize: 12 },
  },
  series: [
    {
      name: '开启任务数',
      type: 'bar',
      data: chartStats.value.map((item) => item.open),
      barWidth: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#2F88FF' },
          { offset: 1, color: '#79b7ff' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: '禁用任务数',
      type: 'bar',
      data: chartStats.value.map((item) => item.disabled),
      barWidth: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#c8c9cc' },
          { offset: 1, color: '#D5DBE7' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}))
useEcharts(chartRef, getOption)
</script>
<template>
  <div ref="chartRef" class="chart-wrapper" />
</template>

<style scoped lang="scss">
.chart-wrapper {
  width: 100%;
  height: 261px;
}
</style>
