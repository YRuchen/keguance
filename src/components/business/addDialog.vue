<template>
  <el-dialog ref="dialogRef" v-model="isOpen" :title="title" width="50%" :close-on-click-modal="false" destroy-on-close
    @close="handleClose">
    <add-base-form ref="baseFormRef" :show-template-selector="true" @submit="handleSubmit" @close="close" />

    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElLoading } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modules/dialogModal'
import { ElMessage } from 'element-plus'
import { createBoardApi } from '@/api/controlPanel/index'
import { useUserStore } from '@/store/modules/useAuthStore'
import { useRouter } from 'vue-router'
import addBaseForm from '@/views/controlPanel/dashBoard/components/addBaseForm.vue'
import { useDashBoardStore } from '@/store/modules/dashBoard'
const dashBoardState = useDashBoardStore()

// 初始化必要依赖
const router = useRouter()
const modalStore = useModalStore()
const userStore = useUserStore()

// 从 store 获取状态
const { isOpen, title } = storeToRefs(modalStore)
const { close } = modalStore

const baseFormRef = ref()
const dialogPanel = ref()
const dialogRef = ref()

// 处理弹窗关闭
const handleClose = () => {
  close()
}

// 处理表单提交
const handleSubmit = async (ruleForm: any) => {
  try {
    dialogPanel.value = ElLoading.service({
      target: dialogRef.value.dialogRef,
      text: 'Loading...',
      background: 'rgba(0,0,0,0.7)',
    })
    const { userId, orgId, tenantId } = userStore.userInfo
    const res = await createBoardApi({
      ...ruleForm,
      userOrg: { userId, orgId, tenantId },
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
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
