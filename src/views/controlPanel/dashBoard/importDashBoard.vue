<template>
  <div class="app-container import-dashaboard-container">
    <add-base-form :show-template-selector="false" @submit="handleSubmit" @close="handleClose"></add-base-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import addBaseForm from './components/addBaseForm.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { importBoardApi } from '@/api/controlPanel/index'
import { useDashBoardStore } from '@/store/modules/dashBoard'
import { useUserStore } from '@/store/modules/useAuthStore'
const UserStore = useUserStore()
const dashBoardState = useDashBoardStore()

const router = useRouter()
const dialogPanel = ref('')

const handleClose = (done: () => void) => {
  router.go(-1)
  localStorage.removeItem('dashBoardState')
}
const handleSubmit = async (ruleForm) => {
  try {
    dialogPanel.value = ElLoading.service({
      text: 'Loading...',
      background: 'rgba(0,0,0,0.7)',
    })
    const res = await importBoardApi({
      ...ruleForm,
      userOrg: { ...UserStore.userInfo },
    })
    if (res.message == 'fail') {
      ElMessage.error(res.data || '提交失败')
      return false
    }
    ElMessage.success('新增成功！')
    dashBoardState.openIframe(res.data.board.basicInfo, UserStore.userInfo, router)
  } catch (error) {
    console.log(error)
  } finally {
    dialogPanel.value.close()
  }
}
</script>

<style scoped lang="scss">
.import-dashaboard-container {
  margin: 38px;
  background: linear-gradient(180deg, #f4faff 0%, #ffffff 21.63%, #ffffff 100%);
  border-radius: 20px;

  .el-form {
    margin: 40px;
    width: 50%;
  }
}
</style>
