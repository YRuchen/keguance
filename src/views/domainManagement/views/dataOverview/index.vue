<script setup lang="tsx">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { IconFont } from '~/KeepUp'
import CardSection from './component/cardSection.vue'
import ServiceCharts from './component/serviceChart.vue'
import DetectionChart from './component/detectionChart.vue'
import {
  timeTypeOptions,
  TimeType,
  taskTypeOptions,
  TaskType,
  DetectionStat,
  DetectionCard,
  InspectTypeMap,
} from './constants'
import {
  IOverviewAlarmItem,
  IOverviewTaskHistogramHist,
} from '~/api/domainManagement/dataOverview/interfaces'
import {
  getOverviewAlarmListApi,
  getOverviewRecordHistogramApi,
  getOverviewSummaryApi,
  getOverviewTaskHistogramApi,
  getTackInfoApi,
  exportApi,
} from '~/api/domainManagement/dataOverview'
import { useDownload } from '@/hooks/useDownload'
import { useRouter } from 'vue-router'
import { number } from 'echarts'

const activeRange = ref<TimeType>(TimeType.RECENT_7_DAYS)
const selectedDetectType = ref<TaskType>(TaskType.TASK_TYPE_ALL)
const { download, loading: buttonLoading } = useDownload()

const alarmList = ref<IOverviewAlarmItem[]>([])
const summaryCards = ref<DetectionCard[]>([])
const serviceStats = ref<IOverviewTaskHistogramHist[]>([])
const detectionStats = ref<DetectionStat[]>([])
const router = useRouter()

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

const loading = reactive({
  alarm: false,
})

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchAlarmList()
}

const handleViewDetail = async (row: IOverviewAlarmItem) => {
  const res = await getTackInfoApi(row.taskId)
  let query = {
    id: row.taskId,
    inspectName: row.taskName,
    domain: row.domain,
  }
  if (res?.data?.frequencyId) {
    query['frequencyId'] = res.data.frequencyId
  }
  router.push({ path: InspectTypeMap[row.type]?.url || '', query: query })
  localStorage.setItem(
    InspectTypeMap[row.type]?.localStorageName || '',
    JSON.stringify({ nodeName: row.region, startTime: row.time, endTime: row.time }),
  )
}

const buildCommonParams = () => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  activeRange: activeRange.value,
  inspectType: selectedDetectType.value,
})

const fetchAlarmList = async () => {
  loading.alarm = true
  try {
    const res = await getOverviewAlarmListApi(buildCommonParams())
    alarmList.value = res?.list || []
    pagination.total = res?.pagination.total || alarmList.value.length
  } catch (error) {
    console.error('获取告警列表失败：', error)
  } finally {
    loading.alarm = false
  }
}

const fetchSummary = async () => {
  try {
    const res = await getOverviewSummaryApi({
      activeRange: activeRange.value,
    })
    summaryCards.value =
      res?.list?.map((item) => ({
        key: item.key as TaskType,
        title: item.title || '',
        status: item.status === 'error' ? 'error' : 'normal',
        errorCount: item.errorCount,
        iconName: InspectTypeMap[item.key as TaskType].iconName,
      })) || []
  } catch (error) {
    console.error('获取汇总数据失败：', error)
  }
}

const fetchTaskHistogram = async () => {
  try {
    const res = await getOverviewTaskHistogramApi({
      activeRange: activeRange.value,
    })
    serviceStats.value =
      res?.list?.map((item) => ({
        name: item.name || '',
        open: item.open || 0,
        disabled: item.disabled || 0,
      })) || []
  } catch (error) {
    console.error('获取任务柱状图失败：', error)
  }
}

const fetchRecordHistogram = async () => {
  try {
    const res = await getOverviewRecordHistogramApi({
      activeRange: activeRange.value,
    })
    detectionStats.value =
      res?.list?.map((item) => ({
        name: item.name || '',
        total: item.total || 0,
        failed: item.failed || 0,
      })) || []
  } catch (error) {
    console.error('获取探测次数柱状图失败：', error)
  }
}

const loadAll = async () => {
  await Promise.all([
    fetchSummary(),
    fetchAlarmList(),
    fetchTaskHistogram(),
    fetchRecordHistogram(),
  ])
}

watch(
  () => selectedDetectType.value,
  () => {
    pagination.page = 1
    fetchAlarmList()
  },
)

watch(
  () => activeRange.value,
  () => {
    loadAll()
  },
)

onMounted(() => {
  loadAll()
})

const exportReport = async () => {
  const res = await exportApi(buildCommonParams())
  await download(res, '域名检测报告.html')
}

const handleChangeCard = (key: TaskType) => {
  selectedDetectType.value = key
}
const handleChangeActive = () => {
  selectedDetectType.value = TaskType.TASK_TYPE_ALL
}
</script>

<template>
  <div class="data-overview">
    <div class="overview-header">
      <div class="overview-actions">
        <el-radio-group v-model="activeRange" @change="handleChangeActive">
          <el-radio-button v-for="item in timeTypeOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-button :loading="buttonLoading" @click="exportReport">
        <IconFont name="article_shortcut"></IconFont>
        <span style="margin-left: 3px">导出报告</span>
      </el-button>
    </div>
    <CardSection class="panel" :data="summaryCards" @change="handleChangeCard" />
    <section class="overview-body">
      <div class="panel alarm-body">
        <div class="alarm-panel">
          <div class="panel-header">
            <div class="panel-title">告警列表</div>
            <div class="panel-filter">
              <label>检测类型</label>
              <el-select v-model="selectedDetectType" placeholder="全部" style="width: 140px">
                <el-option
                  v-for="item in taskTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <el-table
            :data="alarmList"
            :loading="loading.alarm"
            stripe
            class="alarm-table"
            height="580"
          >
            <el-table-column prop="typeLabel" label="检测类型" min-width="120" />
            <el-table-column prop="time" label="告警时间" min-width="160" />
            <el-table-column
              prop="taskName"
              label="任务名称"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column prop="region" label="区域" min-width="160" show-overflow-tooltip />
            <el-table-column label="操作" min-width="100" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleViewDetail(row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="panel-footer">
            <span class="total">共 {{ pagination.total }} 条数据</span>
            <el-pagination
              :current-page="pagination.page"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              :pager-count="4"
              layout="prev, pager, next, jumper"
              background
              large
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>

      <div class="charts-panel">
        <div class="panel chart-card">
          <div class="panel-header panel-title">服务任务数</div>
          <ServiceCharts :data="serviceStats" />
        </div>
        <div class="panel chart-card">
          <div class="panel-header panel-title">探测次数</div>
          <div class="chart-wrapper">
            <div class="side left">总探测次数</div>
            <DetectionChart :data="detectionStats" />
            <div class="side right">失败次数</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
}

.overview-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-bottom: 20px;
}

.data-overview {
  padding: 10px;
  width: 100vw;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #1f2c4c;
    font-weight: 600;
  }
}

.overview-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.alarm-body {
  // flex: 0 1 50%;
  height: 674px;
  overflow: hidden;
  position: relative;
}
.alarm-panel {
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  height: 32px;
}

.panel-title {
  font-size: 18px;
}

.panel-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;

  label {
    color: #6b778c;
  }
}

.alarm-table {
  :deep(.el-table__cell) {
    font-size: 13px;
    color: #1f2c4c;
    padding: 10px 0;
  }

  :deep(.el-table__header-wrapper th) {
    background: #f5f7fb;
    color: #6b778c;
    font-weight: 500;
    height: 40px;
    line-height: 40px;
  }

  :deep(.el-table__body-wrapper tr) {
    height: 32px;
    line-height: 32px;
  }
}

.panel-footer {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #6b778c;
  margin-top: 12px;
  position: absolute;
  bottom: 16px;
  right: 16px;
  .total {
    white-space: nowrap;
  }
}

.charts-panel {
  width: 100%;
  // flex: 0 1 43%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card {
  // flex: 1;
}
.chart-wrapper {
  display: grid;
  grid-template-columns: 5% 90% 5%;
  min-width: 0;
}

.side {
  flex: 0 0 2.5rem;
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  writing-mode: vertical-rl;
}

@media screen and (max-width: 1280px) {
  .overview-body {
    flex-direction: column;
  }

  .charts-panel {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .chart-card {
    flex: 1 1 100%;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
