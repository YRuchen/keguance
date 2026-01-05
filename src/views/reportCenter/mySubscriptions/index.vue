<template>
  <div class="my-subscriptions-page">
    <ReportFilter
      ref="filterRef"
      :button-config="{
        text: '订阅报告',
        onClick: handleSubscribe,
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
      :list-api="getMySubscriptionsList"
    />
    <SubscribeReportDialog v-model="subscribeDialogVisible" @confirm="handleSubscribeConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import ReportFilter from '../components/ReportFilter'
import SubscribeReportDialog from '../components/ReportDialog'
import {
  getMySubscriptionsList,
  subscribeReport,
  subscribeAction,
  getReportTypes,
  getReportModules,
} from '@/api/reportCenter'
import ReportTable from '../components/ReportTable'
import { createColumns } from './columns'

const filterRef = ref()
const loading = ref(false)
const tableData = ref([])
const subscribeDialogVisible = ref(false)
const reportTypes = ref<Array<{ id: number; label: string }>>([])
const reportModules = ref<Array<{ id: number; label: string }>>([])
const reportTableRef = ref<any>(null)

const filterValues = computed(() => {
  return filterRef.value?.getFormValues() || {}
})
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
    field: 'subscribing',
    label: '订阅状态',
    type: 'select' as const,
    options: [
      { label: '全部', value: '' },
      { label: '订阅中', value: true },
      { label: '已停止', value: false },
    ],
  },
]

// 获取报告类型和模块
const fetchOptions = async () => {
  try {
    const [typesRes, modulesRes] = await Promise.all([getReportTypes(), getReportModules()])
    if ((typesRes as any).code === 200 && (typesRes as any).data?.list) {
      reportTypes.value = (typesRes as any).data.list
    }
    if ((modulesRes as any).code === 200 && (modulesRes as any).data?.list) {
      reportModules.value = (modulesRes as any).data.list
    }
  } catch (error) {
    console.error('获取选项失败:', error)
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

const handleStopSubscribe = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要停止订阅吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = (await subscribeAction({
      id: row.id,
      action: 'ACTION_TYPE_CANCEL',
    })) as any
    if (res.code === 200 && res.data?.success) {
      ElMessage.success('停止订阅成功')
      handleQuery()
    } else {
      ElMessage.error('停止订阅失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('停止订阅失败:', error)
      ElMessage.error('停止订阅失败')
    }
  }
}

const handleResubscribe = async (row: any) => {
  try {
    const res = (await subscribeAction({
      id: row.id,
      action: 'ACTION_TYPE_RESUBSCRIBE',
    })) as any
    if (res.code === 200 && res.data?.success) {
      ElMessage.success('重新订阅成功')
      handleQuery()
    } else {
      ElMessage.error('重新订阅失败')
    }
  } catch (error) {
    console.error('重新订阅失败:', error)
    ElMessage.error('重新订阅失败')
  }
}

const columns = createColumns({ handleStopSubscribe, handleResubscribe })

onMounted(() => {
  fetchOptions()
  handleQuery()
})
</script>

<style scoped lang="scss">
.my-subscriptions-page {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
