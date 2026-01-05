<template>
  <div class="login-title">
    <img class="icon" src="@/assets/image/logo.png" alt="logo" />
    <!-- <h2 class="title">欢迎来到XXXX</h2> -->
  </div>
  <el-form v-if="router.currentRoute.value.path === '/login'" ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item label="" prop="username">
      <el-input v-model="ruleForm.username" placeholder="请输入用户名" auto-complete="on" style="position: relative">
        <template #prefix>
          <el-icon class="el-input__icon">
            <UserFilled />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input v-model="ruleForm.password" placeholder="请输入密码" auto-complete="on" :type="passwordType">
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled />
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
    </el-form-item>
    <div class="login-btn-wrap">
      <router-link class="link-type" :to="'/resetPsw'">忘记密码?</router-link>
      <div>
        <span>登录账号?</span>
        <router-link class="link-type" :to="'/register'">请先注册</router-link>
      </div>
    </div>
  </el-form>
  <el-form v-else-if="router.currentRoute.value.path === '/register'" ref="registerFormRef" :model="registerForm"
    :rules="registerRules">
    <el-form-item label="" prop="username">
      <el-input v-model="registerForm.username" placeholder="请输入用户名" auto-complete="on">
        <template #prefix>
          <el-icon class="el-input__icon">
            <UserFilled />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input v-model="registerForm.password" placeholder="请输入密码" auto-complete="on" :type="passwordType">
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled />
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="confirmPPassword">
      <el-input v-model="registerForm.confirmPPassword" placeholder="请再次输入密码" auto-complete="on" :type="passwordType">
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled />
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="email">
      <el-input v-model="registerForm.email" placeholder="请输入电子邮箱" auto-complete="on">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ChatDotRound />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form-item label="" prop="code">
          <el-input v-model="registerForm.code" placeholder="请输入邮箱验证码" />
        </el-form-item>
      </el-col>
      <el-col :span="8" style="padding-left: 0">
        <el-button :disabled="isSending" class="code-btn" @click="editEmail(registerForm.email)">
          {{ isSending ? '发送验证码(' + timeoutNum + ')' : '发送验证码' }}
        </el-button>
      </el-col>
    </el-row>

    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitRegisterForm(registerFormRef)">
        注册
      </el-button>
    </el-form-item>
    <div class="register-btn-wrap">
      <span>已有账号? ，去</span>
      <router-link class="link-type" :to="'/login'">登录</router-link>
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification, ElMessage } from 'element-plus'
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import { getTimeStateStr } from '@/utils/index'
import { registerUser, sendEmail, infoApi } from '@/api/login/index'
import { useUserStore } from '@/store/modules/useAuthStore'

const UserStore = useUserStore()

const validateConfirmPPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入确认密码'))
  } else if (value !== registerForm.password) {
    return callback(new Error('密码不一致'))
  } else {
    callback()
  }
}
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const passwordType = ref('password')
const loading = ref(false)
const register = ref(true)

const isSending = ref<boolean>(false)
const timeoutNum = ref<number>(60)

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '长度要求在 6 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度要求在 6 到 20 个字符', trigger: 'blur' },
  ],
})
const emailPattern =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '长度要求在 6 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度要求在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPPassword: [{ required: true, validator: validateConfirmPPassword, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    {
      min: 6,
      max: 100,
      message: '长度要求在 6 到 100 个字符',
      trigger: 'blur',
    },
    { pattern: emailPattern, message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 表单数据
const ruleForm = reactive({})

let registerForm = reactive({
  username: '',
  password: '',
  confirmPPassword: '',
  email: '',
  code: '',
})

// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
}
// 获取验证码
const editEmail = async (email) => {
  if (email) {
    await sendEmail({
      channel: 'CODE_CHANNEL_TYPE_EMAIL_AWS_SES',
      recipient: email,
      type: 'CODE_BUSINESS_TYPE_REGISTER',
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
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    const valid = await formEl.validate()
    if (!valid) {
      return false
    }
    loading.value = true
    await UserStore.login(ruleForm);
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
    const infoRes = await infoApi(UserStore.userInfo.userId)
    UserStore.getRoles()
    UserStore.setUserEmail(infoRes.data.email)
    ElNotification({
      title: getTimeStateStr(),
      message: '欢迎登录 ' + UserStore.userInfo.username,
      type: 'success',
      duration: 3000,
    })
  } catch (error) {
    ElNotification({
      title: 'error',
      message: '登录失败!',
      type: 'error',
      duration: 3000,
    })
  } finally {
    loading.value = false
  }
}
const submitRegisterForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!valid) {
      return false
    } else {
      loading.value = true
      try {
        const response = await registerUser(registerForm)

        if (response.code == 200 && response.message == 'success') {
          ElNotification({
            title: 'Success',
            message: '注册成功!',
            type: 'success',
            duration: 3000,
          })
          router.push('/login')
        } else {
          ElNotification({
            title: 'Error',
            message: response?.message || '注册失败，请稍后重试',
            type: 'error',
            duration: 3000,
          })
        }
      } catch (error) {
        console.log(error, 888)

        ElNotification({
          title: 'Error',
          message: error.response?.data?.message || '注册失败，请稍后重试',
          type: 'error',
          duration: 3000,
        })
      } finally {
        loading.value = false
      }
    }
  })
}
onBeforeRouteLeave(() => {
  Object.keys(registerForm).forEach((key) => {
    registerForm[key] = ''
  }) // 清空响应式表单数据
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
