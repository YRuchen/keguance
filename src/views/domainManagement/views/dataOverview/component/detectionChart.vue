<script setup lang="tsx">
import { computed, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { DetectionStat } from '../constants'
import { useEcharts } from './useEcharts'

const props = defineProps<{
  data?: DetectionStat[]
}>()

const chartRef = ref<HTMLDivElement>()
const chartStats = computed<DetectionStat[]>(() => props.data || [])

const getOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    backgroundColor: 'rgba(0,0,0,0.8)',
    textStyle: {
      color: '#fff',
    },
    borderColor: 'transparent',
    formatter: (params: any[]) => {
      if (!params?.length) return ''
      return params
        .map((item) => {
          const value =
            item.seriesName === '总探测次数' ? Number(item.value).toLocaleString() : item.value
          return `${item.seriesName}: ${value}`
        })
        .join('<br/>')
    },
  },
  legend: {
    bottom: 0,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: {
      fontSize: 12,
      color: '#6B778C',
    },
    data: [
      { name: '总探测次数', icon: 'rect' },
      { name: '失败次数', icon: 'circle' },
    ],
  },
  grid: {
    left: '3%',
    right: '3%',
    top: '5%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: chartStats.value.map((item) => item.name),
    axisLine: { lineStyle: { color: '#D8DFEB' } },
    axisLabel: { color: '#6B778C', fontSize: 12, interval: 0, rotate: 45 },
  },
  yAxis: [
    {
      type: 'value',
      // name: '总探测次数',
      nameLocation: 'middle',
      nameRotate: 90,
      offset: 0,
      nameGap: 45,
      nameTextStyle: {
        color: '#303133',
        fontSize: 14,
      },
      axisLine: { lineStyle: { color: '#D8DFEB' } },
      splitLine: { lineStyle: { color: '#EFF3FA' } },
      axisLabel: {
        color: '#2c3e50',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`
          }
          return value.toString()
        },
      },
    },
    {
      type: 'value',
      // name: '失败次数',
      nameLocation: 'middle',
      nameRotate: 90,
      offset: 0,
      nameGap: 40,
      nameTextStyle: {
        color: '#2c3e50',
        fontSize: 14,
      },
      axisLine: { lineStyle: { color: '#D8DFEB' } },
      splitLine: { show: false },
      axisLabel: { color: '#6B778C', fontSize: 12 },
    },
  ],
  series: [
    {
      name: '总探测次数',
      type: 'bar',
      data: chartStats.value.map((item) => item.total),
      barWidth: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#9e7fff' },
          { offset: 1, color: '#daccff' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: '失败次数',
      type: 'scatter',
      yAxisIndex: 1,
      data: chartStats.value.map((item) => item.failed),
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: { color: '#FF6B6B' },
    },
  ],
}))
useEcharts(chartRef, getOption)
</script>
<template>
  <div ref="chartRef" class="chart-wrapper1" />
</template>

<style scoped lang="scss">
.chart-wrapper1 {
  width: 100%;
  height: 261px;
}
</style>
