<template>
  <div class="report-log-page">
    <ReportFilter
      ref="filterRef"
      :button-config="{
        text: '批量删除',
        onClick: handleBatchDelete,
      }"
      :show-refresh="false"
      :expand-field="'module'"
      :extra-fields="extraFilterFields"
      @query="handleQuery"
      @reset="handleReset"
    />
    <ReportTable
      ref="reportTableRef"
      :columns="columns"
      :filter-values="filterValues"
      :list-api="getReportLogList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ReportTable from '../components/ReportTable'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import ReportFilter from '../components/ReportFilter'
import {
  getReportLogList,
  deleteReportLog,
  batchDeleteReportLog,
  resendReport,
  getReportTypes,
  getReportModules,
} from '@/api/reportCenter'

import { createColumns } from './columns'

const filterRef = ref()
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref<any[]>([])
const reportTypes = ref<Array<{ id: number; label: string }>>([])
const reportModules = ref<Array<{ id: number; label: string }>>([])
const reportTableRef = ref<any>(null)

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const filterValues = computed(() => {
  return filterRef.value?.getFormValues() || {}
})

const extraFilterFields: Array<{
  field: string
  label: string
  type: 'select' | 'date' | 'daterange'
  options?: Array<{ label: string; value: any }>
}> = [
  {
    field: 'sendStatus',
    label: '发送状态',
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
    field: 'sendTime',
    label: '发送时间',
    type: 'daterange' as const,
  },
]

// 获取报告类型和模块
const fetchOptions = async () => {
  try {
    const [typesRes, modulesRes] = await Promise.all([getReportTypes(), getReportModules()])
    if (typesRes.code === 200 && typesRes.data?.list) {
      reportTypes.value = typesRes.data.list
    }
    if (modulesRes.code === 200 && modulesRes.data?.list) {
      reportModules.value = modulesRes.data.list
    }
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

// 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const filterValues = filterRef.value?.getFormValues() || {}
    const params: any = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      reportName: filterValues.reportName || undefined,
      reportType: filterValues.reportType || undefined,
      moduleType: filterValues.module || undefined,
      sendStatus: filterValues.sendStatus || undefined,
    }
    // 处理时间范围
    if (
      filterValues.sendTime &&
      Array.isArray(filterValues.sendTime) &&
      filterValues.sendTime.length === 2
    ) {
      params.startTimestamp = new Date(filterValues.sendTime[0]).getTime()
      params.endTimestamp = new Date(filterValues.sendTime[1]).getTime()
    }
    const res = await getReportLogList(params)
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      pagination.value.total = res.data?.pagination?.total || 0
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  pagination.value.page = 1
  reportTableRef.value.fetchList()
}

const handleReset = () => {
  pagination.value.page = 1
  handleQuery()
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.page = 1
  handleQuery()
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  handleQuery()
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const ids = selectedRows.value.map((row) => row.id)
    await batchDeleteReportLog(ids)
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    handleQuery()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await deleteReportLog(row.id)
    if (res.code === 200 && res.data?.success) {
      ElMessage.success('删除成功')
      handleQuery()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleResend = async (row: any) => {
  try {
    const res = await resendReport(row.id)
    if (res.code === 200 && res.data?.success) {
      ElMessage.success('重新发送成功')
      handleQuery()
    } else {
      ElMessage.error('重新发送失败')
    }
  } catch (error) {
    console.error('重新发送失败:', error)
    ElMessage.error('重新发送失败')
  }
}

const columns = createColumns({ handleDelete, handleResend })
onMounted(() => {
  fetchOptions()
  handleQuery()
})
</script>

<style scoped lang="scss">
.report-log-page {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
