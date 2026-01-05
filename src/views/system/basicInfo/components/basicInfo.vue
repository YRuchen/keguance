<template>
  <div class="m-user-table">
    <p class="m-user-table-title">基本设置</p>
    <el-form ref="ruleFormRef" :model="userInfo" class="m-user-table-form">
      <el-row :gutter="20">
        <el-col :span="24">
          <p class="item-title">邮箱</p>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="email">
            <el-input v-model="userInfo.email" placeholder="请输入邮箱" :disabled="true" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-button size="large" @click="openDialog(ruleFormRef.email)">修改</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p class="item-title">用户名</p>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="username">
            <el-input v-model="userInfo.username" placeholder="请输入用户名" :disabled="true" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <p class="item-title">密码</p>
        </el-col>
        <el-col :span="7">
          <el-form-item label="" prop="password">
            <el-input v-model="userInfo.password" placeholder="请输入密码" :disabled="true" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-button size="large" @click="goToResetPsw()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-dialog v-model="dialogVisible" title="修改邮箱" width="500" :before-close="handleClose">
    <el-form ref="ruleEmailFormRef" :model="editEmailForm" :rules="rules">
      <el-form-item label="旧邮箱" prop="oldEmail">
        <el-input v-model="editEmailForm.oldEmail" placeholder="请输入邮箱" :disabled="true" size="large" />
      </el-form-item>
      <el-form-item label="新邮箱" prop="newEmail">
        <el-input v-model="editEmailForm.newEmail" placeholder="请输入新邮箱" size="large" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item label="邮箱验证码" prop="emailCode">
            <el-input v-model="editEmailForm.emailCode" placeholder="请输入验证码" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button :disabled="isSending" size="large" @click="editEmail(editEmailForm.newEmail)">
            {{ isSending ? '发送验证码(' + timeoutNum + ')' : '发送验证码' }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit(ruleEmailFormRef)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { sendEmail, changeEmailApi, infoApi } from '@/api/login/index'
import { ElMessageBox, ElMessage, FormInstance, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/useAuthStore'
const UserStore = useUserStore()
const userInfo = computed(() => ({ ...UserStore.userInfo, password: '********' }))
const validateEmail = (rule: any, value: any, callback: any) => {
  const emialRge =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!value) {
    return callback(new Error('请输入邮箱'))
  } else if (!emialRge.test(value)) {
    return callback(new Error('输入正确的邮箱'))
  } else {
    callback()
  }
}
const router = useRouter()
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleEmailFormRef = ref<FormInstance>()
const currentPage1 = ref(1)
const formInline = reactive({})

const isSending = ref<boolean>(false)
const timeoutNum = ref<number>(60)

interface EditEmailForm {
  oldEmail: string
  newEmail: string
  emailCode: string
}
const editEmailForm = reactive<EditEmailForm>({
  oldEmail: '',
  newEmail: '',
  emailCode: '',
})
const rules = reactive<FormRules<editEmailForm>>({
  newEmail: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 方法
const openDialog = (email: string) => {
  dialogVisible.value = true
  editEmailForm.oldEmail = userInfo.value.email
}
const goToResetPsw = () => {
  router.push({
    path: '/resetPsw',
  })
}

const handleClose = () => {
  dialogVisible.value = false
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      console.log('error submit!', fields)
      return false
    } else {
      try {
        const res = await changeEmailApi({
          uid: UserStore.userInfo.userId,
          email: editEmailForm.newEmail,
          code: editEmailForm.emailCode,
        })
        dialogVisible.value = false
        if (res.message == 'success') {
          ElMessage.success('修改邮箱成功')
          const infoRes = await infoApi(UserStore.userInfo.userId)
          UserStore.setUserEmail(infoRes.data.email)
        } else {
          ElMessage.error('修改邮箱失败！')
        }
      } catch (error) {
        ElMessage.error('修改邮箱失败！')
      }
    }
  })
}

// 获取验证码
const editEmail = async (email) => {
  if (email) {
    await sendEmail({ channel: 'CODE_CHANNEL_TYPE_EMAIL_AWS_SES', recipient: email, type: 'CODE_BUSINESS_TYPE_CHANGE_EMAIL' })
    isSending.value = true
    timeoutNum.value = 60
    let timeOut = setInterval(() => {
      timeoutNum.value--
      if (timeoutNum.value <= 0) {
        clearInterval(timeOut)
        isSending.value = false
        timeOut = null
      }
    }, 1000)
    ElMessage.success('验证码发送成功！')
  } else {
    ElMessage.error('请输入邮箱')
  }
}
const changeStatus = (row) => {
  ElMessageBox.confirm(`确定要${!row.status ? '禁用' : '启用'} ${row.username} 账户吗？`, '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => { })
    .catch(() => {
      row.status = !row.status
    })
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  currentPage1.value = val
}

onMounted(() => { })
</script>
<style lang="scss" scoped>
@import '../index';
</style>
