<template>
  <el-dialog v-model="dialogVisible" ref="dialogRef" :title="title" width="50%" @close="handleClose">
    <add-base-form :show-template-selector="true" @submit="handleSubmit" @close="handleClose"></add-base-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import addBaseForm from './addBaseForm.vue'
import { ElLoading, ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/useAuthStore'
import { useRouter } from 'vue-router'
import { createBoardApi } from '@/api/controlPanel/index'
import { useDashBoardStore } from '@/store/modules/dashBoard'

const dialogVisible = ref<boolean>(false)
const title = ref<string>('新增仪表盘')

const dialogPanel = ref()
const dialogRef = ref()
// 初始化必要依赖
const router = useRouter()
const userStore = useUserStore()
const dashBoardState = useDashBoardStore()

const show = (item = {}) => {
  title.value = '新增仪表盘'
  if (item.id) {
    title.value = '编辑仪表盘'
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}
const handleClose = async (done: () => void) => {
  dialogVisible.value = false
}
// 处理表单提交
const handleSubmit = async (ruleForm: any) => {
  try {
    dialogPanel.value = ElLoading.service({
      target: dialogRef.value.dialogRef,
      text: 'Loading...',
      background: 'rgba(0,0,0,0.7)',
    })
    const res = await createBoardApi({
      ...ruleForm,
      userOrg: { ...userStore.userInfo },
    })

    if (res.message === 'fail') {
      ElMessage.error(res.data || '提交失败')
      return
    }
    dashBoardState.openIframe(res.data.board.basicInfo, userStore.userInfo, router)
    ElMessage.success('新增成功！')
    close()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
    router.push('/controlPanel/dashBoard')
  } finally {
    dialogPanel.value.close()
  }
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
