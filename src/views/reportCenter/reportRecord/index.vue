<template>
  <div class="report-record-page">
    <ReportFilter
      ref="filterRef"
      :button-config="{
        text: '订阅报告',
        onClick: handleSubscribe,
      }"
      :show-refresh="true"
      :expand-field="'module'"
      :extra-fields="extraFilterFields"
      @query="handleQuery"
      @reset="handleReset"
      @refresh="handleRefresh"
    />
    <ReportTable
      ref="reportTableRef"
      :columns="columns"
      :filter-values="filterValues"
      :list-api="getReportRecordList"
    />
    <SubscribeReportDialog v-model="subscribeDialogVisible" @confirm="handleSubscribeConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessage } from 'element-plus'
import ReportFilter from '../components/ReportFilter'
import SubscribeReportDialog from '../components/ReportDialog'
import {
  getReportRecordList,
  previewReport,
  exportReport,
  regenerateReport,
  getReportTypes,
  getReportModules,
  subscribeReport,
} from '@/api/reportCenter'
import { createColumns } from './columns'
import ReportTable from '../components/ReportTable'

const router = useRouter()
const filterRef = ref()
const loading = ref(false)
const tableData = ref([])
const reportTableRef = ref<any>(null)
const subscribeDialogVisible = ref(false)
const reportTypes = ref<Array<{ id: number; label: string }>>([])
const reportModules = ref<Array<{ id: number; label: string }>>([])

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const extraFilterFields: Array<{
  field: string
  label: string
  type: 'select' | 'date' | 'daterange'
  options?: Array<{ label: string; value: any }>
}> = [
  {
    field: 'generateStatus',
    label: '报告状态',
    type: 'select' as const,
    options: [
      { label: '全部', value: '' },
      { label: '生产', value: 1 },
      { label: '预生产', value: 2 },
      { label: '测试', value: 3 },
      { label: '开发', value: 4 },
    ],
  },
  {
    field: 'createTime',
    label: '创建时间',
    type: 'daterange' as const,
  },
]

const filterValues = computed(() => {
  return filterRef.value?.getFormValues() || {}
})
// 获取报告类型和模块
const fetchOptions = async () => {
  try {
    const [typesRes, modulesRes] = await Promise.all([getReportTypes(), getReportModules()])
    reportTypes.value = typesRes.data.list
    reportModules.value = modulesRes.data.list
    // if (typesRes.code === 200 && typesRes.data?.list) {
    // }
    // if (modulesRes.code === 200 && modulesRes.data?.list) {
    // }
  } catch (error) {
    console.error('获取选项失败:', error)
  }
}

const getReportTypeLabel = (label?: string) => {
  return label || '-'
}

const getModuleLabel = (label?: string) => {
  return label || '-'
}

const getStatusLabel = (status?: number) => {
  const map: Record<number, string> = {
    1: '生产',
    2: '预生产',
    3: '测试',
    4: '开发',
  }
  return map[status || 0] || status || '-'
}

const handleQuery = () => {
  pagination.value.page = 1
  reportTableRef.value.fetchList()
}

const handleReset = () => {
  pagination.value.page = 1
  handleQuery()
}

const handleRefresh = () => {
  handleQuery()
}

const handleSubscribe = () => {
  subscribeDialogVisible.value = true
}

const handleSubscribeConfirm = async (data: any) => {
  try {
    await subscribeReport({
      reportTypeId: data.reportType,
      moduleTypeId: data.module,
      subscriber: data.subscriber.userId || data.subscriber,
    })
    ElMessage.success('订阅成功')
    subscribeDialogVisible.value = false
    handleQuery()
  } catch (error) {
    console.error('订阅失败:', error)
    ElMessage.error('订阅失败')
  }
}

const handlePreview = (row: any) => {
  router.push({
    path: '/reportCenter/previewReport',
    query: { id: row.id },
  })
}

const handleExport = async (row: any) => {
  try {
    const res = await exportReport(row.id)
    // 创建下载链接
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${row.reportName || 'report'}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const handleRegenerate = async (row: any) => {
  try {
    const res = await regenerateReport(row.id)
    if (res.code === 200 && res.data?.success) {
      ElMessage.success('重新生成成功')
      handleQuery()
    } else {
      ElMessage.error('重新生成失败')
    }
  } catch (error) {
    console.error('重新生成失败:', error)
    ElMessage.error('重新生成失败')
  }
}

const columns = createColumns({ handleRegenerate, handleExport, handlePreview })
onMounted(() => {
  fetchOptions()
  handleQuery()
})
</script>

<style scoped lang="scss">
.report-record-page {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
