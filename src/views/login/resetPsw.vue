<template>
  <div class="reset-psw-container">
    <div class="reset-psw-content">
      <p class="reset-psw-title">{{ showSelection ? '重置密码' : '忘记密码' }}</p>
      <el-steps :active="active" align-center>
        <el-step v-for="item in dynamicSteps" :key="item.title" :title="item.title" />
      </el-steps>
      <div class="reset-psw-form">
        <div v-if="showSelection && active == 0" class="reset-psw-form-item">
          <el-radio-group v-model="type">
            <el-radio value="USERNAME" size="large">通过旧密码</el-radio>
            <el-radio value="EMAIL" size="large">通过绑定邮箱</el-radio>
          </el-radio-group>
        </div>
        <div v-if="(showSelection && active == 1) || (!showSelection && active == 0)" class="reset-psw-form-item">
          <el-form ref="oldFormRef" :model="oldForm" :rules="oldFormRules">
            <el-form-item v-if="showSelection && type == 'USERNAME'" label="原密码" prop="old">
              <el-input v-model="oldForm.old" placeholder="请输入原密码" size="large" />
            </el-form-item>
            <el-row v-else :gutter="20">
              <el-col :span="24">
                <el-form-item label="安全邮箱" prop="email">
                  <el-input v-model="oldForm.email" placeholder="请输入邮箱" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="验证码" prop="code">
                  <el-input v-model="oldForm.code" placeholder="请输入验证码" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button :disabled="isSending" size="large" @click="editEmail(oldForm.email)">
                  {{ isSending ? '发送验证码(' + timeoutNum + ')' : '发送验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-if="(showSelection && active == 2) || (!showSelection && active == 1)" class="reset-psw-form-item">
          <el-form ref="newFormRef" :inline="true" :model="newForm" :rules="newFormRules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="设置新密码" prop="new">
                  <el-input v-model="newForm.new" placeholder="请输入密码" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="确认密码" prop="comfirmPws">
                  <el-input v-model="newForm.comfirmPws" placeholder="再次输入密码" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class=""> </div>
        </div>
        <div class="reset-psw-form-btn">
          <el-button v-if="showSelection && active > 0 && active < 2" @click="back">上一步</el-button>
          <el-button v-if="active == 0" @click="goTOLogin">返回</el-button>
          <el-button @click="next">{{ active < dynamicSteps.length - 1 ? '下一步' : '完成' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FormInstance, FormRules, ElMessage, ElNotification } from 'element-plus'
import { checkApi, changePswApi, sendEmail, checkCodeApi, forgetPwsApi } from '@/api/login/index'
import { useUserStore } from '@/store/modules/useAuthStore'

import { loginOut } from '@/api/login/index'
const UserStore = useUserStore()

const showSelection = computed(() => (UserStore?.userInfo?.userId ? true : false))
const dynamicSteps = computed(() => {
  const baseSteps = [{ title: '账号验证' }, { title: '设置新密码' }]

  return !showSelection.value ? baseSteps : [{ title: '选择方式' }, ...baseSteps]
})
const validatePws = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请再次输入密码'))
  } else if (value !== newForm.new) {
    return callback(new Error('密码不一致'))
  } else {
    callback()
  }
}
const router = useRouter()
const active = ref(0)
const type = ref<string>('USERNAME')
const isSending = ref<boolean>(false)
const timeoutNum = ref<number>(60)
const oldForm = reactive({
  old: '',
  email: '',
  code: '',
})

const newForm = reactive({
  new: '',
  comfirmPws: '',
})

const oldFormRules = reactive<FormRules<typeof oldForm>>({
  old: [{ required: true, message: '请输入原密码', trigger: 'change' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'change' }],
})
const newFormRules = reactive<FormRules<typeof newForm>>({
  new: [{ required: true, message: '请输入密码', trigger: 'change' }],
  comfirmPws: [{ required: true, validator: validatePws, trigger: 'change' }],
})

const oldFormRef = ref<FormInstance>()
const newFormRef = ref<FormInstance>()
// 获取验证码
const editEmail = async (email) => {
  if (email) {
    await sendEmail({
      channel: 'CODE_CHANNEL_TYPE_EMAIL_AWS_SES',
      recipient: email,
      type: showSelection.value ? 'CODE_BUSINESS_TYPE_CHANGE_PWD' : 'CODE_BUSINESS_TYPE_FORGET_PWD',
    })
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
const next = async () => {
  if (showSelection.value && active.value == 0) {
    if (!type.value) {
      ElMessage.error('请选择验证方式！')
      return
    }
    active.value++
  } else if ((showSelection.value && active.value == 1) || (!showSelection.value && active.value == 0)) {
    try {
      let data = {}
      let apiReq = {}
      if (showSelection.value && active.value == 1) {
        data = type.value == 'EMAIL' ? { email: oldForm.email, code: oldForm.code } : { pwd: oldForm.old }
        data = { ...data, uid: UserStore.userInfo.userId, type: type.value }
        apiReq = checkApi
      } else {
        data = { email: oldForm.email, code: oldForm.code, type: 'CODE_BUSINESS_TYPE_FORGET_PWD' }
        apiReq = checkCodeApi
      }
      await oldFormRef.value?.validate()
      const res = await apiReq(data)
      if (res.message == 'fail') {
        ElMessage.warning(res?.data || '验证不通过！')
        return false
      }
      ElMessage.success('验证通过！')
      active.value++
    } catch (error) {
      ElMessage.warning('请检查信息完整性')
    }
  } else if ((showSelection.value && active.value == 2) || (!showSelection.value && active.value == 1)) {
    try {
      let data = {}
      let apiReq = {}
      if (showSelection.value && active.value == 2) {
        data = type.value == 'EMAIL' ? { email: oldForm.email, code: oldForm.code } : { old: oldForm.old }
        data = { ...data, type: type.value, uid: UserStore.userInfo.userId, new: newForm.new }
        apiReq = changePswApi
      } else {
        data = { email: oldForm.email, code: oldForm.code, pwd: newForm.new }
        apiReq = forgetPwsApi
      }
      await newFormRef.value?.validate()
      const res = await apiReq(data)
      if (res.code == 200 && res.message == 'success') {
        ElNotification({
          title: 'Success',
          message: '密码修改成功，即将跳转登录页重新登录!',
          type: 'success',
          duration: 3000,
        })
        await UserStore.logout({ userId: UserStore.userInfo.userId })
        await router.push('/login')
      } else {
        ElMessage.error(res.data || '密码修改失败')
      }
    } catch (error) {
      ElNotification({
        title: '错误',
        message: error.message || '密码修改失败',
        type: 'error',
        duration: 3000,
      })
    }
  }
}
const back = () => {
  active.value--
}
const goTOLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.reset-psw-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  & .reset-psw-content {
    width: 50%;
    height: 400px;
    background: #ffffff;
    text-align: center;

    & .reset-psw-title {
      font-size: 24px;
    }

    & .reset-psw-form {
      height: 80%;
      position: relative;
      text-align: left;
      width: 70%;
      margin: 0 auto;
      padding-top: 25px;

      & .reset-psw-form-item {
        margin: 0 auto;
        width: 50%;
        height: 50%;
      }
    }

    & .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      font-size: 0;
      flex-direction: column;
      align-items: stretch;
      align-content: center;
    }

    & .reset-psw-form-btn {
      text-align: right;
    }
  }
}
</style>
