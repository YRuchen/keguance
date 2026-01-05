<template>
  <div v-loading="loading" class="preview-report-page">
    <!-- 第一行：标题 -->
    <div class="report-title">{{ statistics?.name || '域名监测周巡检报告' }}</div>

    <!-- 第二行：报告周期和统计数据 -->
    <div class="report-info-row">
      <div class="report-period">
        <span class="label">报告周期</span>
        <span class="value">
          <IconFont name="menu_logs" color="#a8abb2"></IconFont>
          {{ statistics?.startDate || '-' }}
          <span class="tips small-m">至</span>
          {{ statistics?.endDate || '-' }}
        </span>
      </div>
      <div class="report-statistics">
        <div class="stat-item">
          <span class="label">本周告警任务数</span>
          <div class="item-flex">
            <IconFont name="e911_emergency" class="gradientRed"></IconFont>
            <span class="value abnormal">{{ statistics?.abnormalNum || 0 }}</span>
            <span class="unit abnormal">个</span>
            <span class="tips">较上周</span>
            <span
              v-if="statistics?.wow !== undefined"
              class="wow-indicator"
              :class="statistics.wow >= 0 ? 'up' : 'down'"
            >
              {{ statistics.wow >= 0 ? '▲' : '▼' }}{{ Math.abs(statistics.wow || 0).toFixed(1) }}%
            </span>
          </div>
        </div>
        <div class="stat-item">
          <span class="label">本周任务总数</span>
          <div class="item-flex">
            <span class="value">{{ statistics?.totalNum || 0 }}</span>
            <span class="unit">个</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="label">本周正常任务数</span>
          <div class="item-flex">
            <span class="value">{{ statistics?.normalNum || 0 }}</span>
            <span class="unit">个</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三行：两个并列图表 -->
    <ChartWrap :chart-num="2" :min-height="324">
      <DataTable
        title="各检测类型告警任务占比"
        :columns="columns"
        :data="tableData"
        :loading="loading"
      />
      <WowBarChart title="各检测类型告警任务数同比环比图" :data="wowData" :loading="loading" />
    </ChartWrap>

    <!-- 第四行：折线图 -->
    <ChartWrap :chart-num="1" :min-height="378">
      <LineChart
        title="各检测类型告警任务数时间趋势图"
        :min-height="316"
        :data="trendData"
        :loading="loading"
      />
    </ChartWrap>

    <!-- 第五行：异常任务详情 -->
    <div class="abnormal-details-section">
      <div class="section-title">异常任务详情</div>
      <div v-for="(detail, taskType) in detailData" :key="taskType" class="detail-module">
        <div class="detail-module-title">{{ taskType }}</div>
        <ChartWrap :chart-num="2" :min-height="400">
          <!-- 横向柱状图 -->
          <TaskTop10BarChart
            class="no-shadow"
            :title="taskType + '占比任务TOP10'"
            :data="detail"
            :loading="loading"
            :unit="taskType === '2' ? 'ms' : '%'"
          />
          <!-- 表格 -->
          <DataTable
            class="no-shadow"
            :max-height="360"
            :title="taskType + '占比任务TOP10'"
            :columns="t10Columns"
            :data="detail.details"
            :loading="loading"
          />
        </ChartWrap>
      </div>
    </div>

    <!-- 第六行：AI智能建议 -->
    <div class="ai-suggestions-section">
      <div class="section-title">AI智能建议</div>
      <div class="ai-content-block">
        <div class="ai-content-title">AI智能诊断总结</div>
        <div class="ai-content-body">
          <div v-if="aiAnalyzeData?.conclusion" class="ai-content-item">
            <div class="ai-content-label">AI 本周巡检结论：</div>
            <div class="ai-content-text" v-html="renderMarkdown(aiAnalyzeData.conclusion)"></div>
          </div>
          <div v-if="aiAnalyzeData?.suggestion" class="ai-content-item">
            <div class="ai-content-label">AI 优化建议：</div>
            <div class="ai-content-text" v-html="renderMarkdown(aiAnalyzeData.suggestion)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ChartWrap from '@/views/availabilityMonitoring/situationAwareness/chartWrap'
import DataTable from './components/DataTable'
import LineChart from '@/views/availabilityMonitoring/situationAwareness/components/LineChart'
import TaskTop10BarChart from './components/TaskTop10BarChart'
import WowBarChart from './components/WowBarChart'
import {
  getConfigManagerReportPreview,
  geConfigManagerReportWow,
  getConfigManagerReportTrend,
  getConfigManagerReportDetail,
  getConfigManagerReportAiAnalyze,
} from '@/api/reportCenter'
import { useMarkdown } from '~/hooks/useMarkdown'
import type {
  ITableResponse,
  ILineChartResponse,
  IOperatorResponseTimeResponse,
} from '@/api/availabilityMonitoring/situationAwareness/interfaces'
import ReportTable from '../components/ReportTable'
import { countColumns, getT10Columns } from './columns'
import IconFont from '@/KeepUp/packages/basicComponents/iconFont'

const route = useRoute()
const loading = ref(false)
const { renderMarkdown } = useMarkdown()

const columns = countColumns()
const t10Columns = getT10Columns()
// 统计数据
const statistics = ref<{
  name?: string
  startDate?: string
  endDate?: string
  abnormalNum?: number
  totalNum?: number
  normalNum?: number
  wow?: number
} | null>(null)

// 表格数据（各检测类型告警任务占比）
const tableData = ref<ITableResponse | null>(null)

// 柱状图数据（同比环比）
const wowData = ref<any>(null)

// 折线图数据
const trendData = ref<ILineChartResponse | null>(null)

// 异常任务详情数据
const detailData = ref<Record<string, any>>({})

// AI智能分析数据
const aiAnalyzeData = ref<{
  conclusion?: string
  suggestion?: string
} | null>(null)

// 获取报告ID
const reportId = computed(() => {
  return route.query.id as string
})

// 获取任务类型标签
const getTaskTypeLabel = (taskType: string) => {
  const typeMap: Record<string, string> = {
    '1': '劫持检测',
    '2': 'DNS检测',
    '3': '被墙检测',
    '4': '污染检测',
    '5': 'SSL检测',
    '6': '域名过期检测',
    '7': 'ICP备案检测',
  }
  return typeMap[taskType] || taskType
}

// 获取横向柱状图标题
const getStackedBarTitle = (taskType: string) => {
  const titleMap: Record<string, string> = {
    '1': '劫持异常节点占比任务TOP10',
    '2': '任务平均响应时间TOP10',
    '3': '被墙检测异常任务TOP10',
    '4': '污染检测异常任务TOP10',
    '5': 'SSL检测异常任务TOP10',
    '6': '域名过期检测异常任务TOP10',
    '7': 'ICP备案检测异常任务TOP10',
  }
  return titleMap[taskType] || '异常任务TOP10'
}

// 获取横向柱状图提示
const getStackedBarTip = (taskType: string) => {
  return `${getStackedBarTitle(taskType)}说明`
}

// 获取表格标题
const getTableTitle = (taskType: string) => {
  const titleMap: Record<string, string> = {
    '1': '劫持检测告警任务TOP10',
    '2': 'DNS检测告警任务TOP10',
    '3': '被墙检测告警任务TOP10',
    '4': '污染检测告警任务TOP10',
    '5': 'SSL检测告警任务TOP10',
    '6': '域名过期检测告警任务TOP10',
    '7': 'ICP备案检测告警任务TOP10',
  }
  return titleMap[taskType] || '告警任务TOP10'
}

// 获取表格提示
const getTableTip = (taskType: string) => {
  return `${getTableTitle(taskType)}说明`
}

// 转换横向柱状图数据
const getStackedBarData = (detail: any): IOperatorResponseTimeResponse | null => {
  if (!detail || !detail.details || detail.details.length === 0) {
    return null
  }

  const top10 = detail.details.slice(0, 10)
  const category = top10.map((item: any) => item.taskName || '-')
  const data = top10.map((item: any) => {
    // 根据任务类型返回不同的值
    if (detail.taskType === '2') {
      // DNS检测返回响应时间（如果有leftTime字段，单位是ms）
      // leftTime可能是字符串格式如 "113.45ms"，需要解析
      const leftTimeStr = item.leftTime || '0'
      const leftTimeNum = parseFloat(leftTimeStr.toString().replace('ms', '')) || 0
      return leftTimeNum
    } else {
      // 其他类型返回占比（percent可能是0-1之间的小数，需要转换为百分比）
      const percent = parseFloat(item.percent?.toString() || '0') || 0
      // 如果percent小于1，说明是小数形式，需要转换为百分比
      return percent > 1 ? percent : percent * 100
    }
  })

  return {
    category,
    series: [
      {
        name: detail.taskType === '2' ? '平均响应时间' : '占比',
        data,
      },
    ],
  }
}

// 转换表格数据
const getTableData = (detail: any): ITableResponse | null => {
  if (!detail || !detail.details || detail.details.length === 0) {
    return null
  }

  const list = detail.details.slice(0, 10).map((item: any, index: number) => ({
    rank: index + 1,
    domain: item.domain || '-',
    count: item.abnormal || 0,
  }))

  return { list }
}

// 转换折线图数据
const convertTrendData = (data: any): ILineChartResponse | null => {
  if (!data || !data.series || data.series.length === 0) {
    return null
  }

  return {
    series: data.series.map((item: any) => ({
      name: item.taskName || '',
      data: (item.data || []).map((d: any) => ({
        time: d.time || '',
        value: d.value || 0,
      })),
    })),
  }
}

// 转换表格数据（各检测类型告警任务占比）
const convertTableData = (abnormalList: any[]): any => {
  if (!abnormalList || abnormalList.length === 0) {
    return null
  }

  const list = abnormalList.map((item, index) => ({
    ...item,
    proportion: (item.proportion * 100).toFixed(2),
    // abnormalNum: parseInt(item.abnormalNum || '0', 10),
  }))
  return list
}

// 获取预览数据
const fetchPreviewData = async () => {
  if (!reportId.value) {
    ElMessage.error('报告ID不能为空')
    return
  }
  loading.value = true
  try {
    const res = (await getConfigManagerReportPreview(reportId.value)) as any
    if (res.code === 200 && res.data) {
      statistics.value = res.data.statistics || {}
      tableData.value = convertTableData(res.data.abnormalList || [])
    } else {
      ElMessage.error(res.message || '获取预览数据失败')
    }
  } catch (error) {
    console.error('获取预览数据失败:', error)
    ElMessage.error('获取预览数据失败')
  } finally {
    loading.value = false
  }
}

// 获取同比环比数据
const fetchWowData = async () => {
  if (!reportId.value) return

  try {
    const res = (await geConfigManagerReportWow(reportId.value)) as any
    if (res.code === 200 && res.data) {
      wowData.value = res.data
    }
  } catch (error) {
    console.error('获取同比环比数据失败:', error)
  }
}

// 获取趋势数据
const fetchTrendData = async () => {
  if (!reportId.value) return

  try {
    const res = (await getConfigManagerReportTrend(reportId.value)) as any
    if (res.code === 200 && res.data) {
      trendData.value = convertTrendData(res.data)
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
  }
}

// 获取详情数据
const fetchDetailData = async () => {
  if (!reportId.value) return

  try {
    const res = (await getConfigManagerReportDetail(reportId.value)) as any
    if (res.code === 200 && res.data?.result) {
      // 为每个任务类型添加taskType字段
      const result: Record<string, any> = {}
      Object.keys(res.data.result).forEach((key) => {
        result[key] = {
          ...res.data.result[key],
          taskType: key,
        }
      })
      detailData.value = result
    }
  } catch (error) {
    console.error('获取详情数据失败:', error)
  }
}

// 获取AI智能分析数据
const fetchAiAnalyzeData = async () => {
  if (!reportId.value) return

  try {
    const res = (await getConfigManagerReportAiAnalyze(reportId.value)) as any
    if (res.code === 200 && res.data) {
      aiAnalyzeData.value = {
        conclusion: res.data.conclusion || '',
        suggestion: res.data.suggestion || '',
      }
    }
  } catch (error) {
    console.error('获取AI智能分析数据失败:', error)
  }
}

// 初始化数据
const initData = async () => {
  await Promise.all([
    fetchPreviewData(),
    fetchWowData(),
    fetchTrendData(),
    fetchDetailData(),
    fetchAiAnalyzeData(),
  ])
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.preview-report-page {
  width: 100%;
  max-width: 100%;
  padding: 20px;
  background: #f5f7fa;
  // min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;

  .report-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  .report-info-row {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: 92px;

    .gradientRed {
      background: linear-gradient(180deg, #ff0000 0%, #ffb6b7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tips {
      color: #a8abb2;
      margin: auto 14px auto 16px;
      &.small-m {
        margin: auto 10px;
      }
    }

    .report-period {
      width: 283px;
      padding: 12px 16px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 14px;
      background-color: #ffffff;
      border-radius: $borderRadiusLarge;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

      .label {
        margin-right: 8px;
        font-size: 16px;
      }

      .value {
        font-weight: 500;
        display: flex;
        align-items: center;
      }
    }

    .report-statistics {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      background-color: #ffffff;
      border-radius: $borderRadiusLarge;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

      .stat-item {
        padding: 12px 19px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .item-flex {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .label {
          font-weight: bold;
          font-size: 16px;
        }

        .value {
          font-weight: 600;
          font-size: 22px;

          &.abnormal {
            color: #f56c6c;
          }

          &.normal {
            color: #47c1c1;
          }
        }
        .unit {
          &.abnormal {
            color: #f56c6c;
          }
        }

        .wow-indicator {
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;

          &.up {
            color: #f56c6c;
          }

          &.down {
            color: #47c1c1;
            background-color: #47c1c11a;
          }
        }
      }
    }
  }

  .abnormal-details-section {
    margin-top: 16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .detail-module {
      border-radius: $borderRadiusLarge;
      margin-bottom: 16px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;

      .detail-module-title {
        padding: 15px 0 6px 16px;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 6px;
      }
    }
  }

  .ai-suggestions-section {
    margin-top: 16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .ai-content-block {
      background-color: #ffffff;
      border-radius: $borderRadiusLarge;
      padding: 12px 16px 31px 16px;
      box-sizing: border-box;
      color: #303133;

      .ai-content-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .ai-content-body {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .ai-content-item {
          .ai-content-label {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #303133;
          }

          .ai-content-text {
            line-height: 1.6;
            word-wrap: break-word;
          }
        }
      }
    }
  }
}
:deep(.no-shadow) {
  box-shadow: none !important;
  padding-top: 0;
  background-color: unset;
}
</style>
