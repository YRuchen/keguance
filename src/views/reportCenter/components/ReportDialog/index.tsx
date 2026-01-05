import { defineComponent, ref, computed, watch } from 'vue'
import {
  ElDialog,
  ElButton,
  ElScrollbar,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
} from 'element-plus'
import { useUserStore } from '@/store/modules/useAuthStore'
import { getReportTypes, getReportModules } from '@/api/reportCenter'
import styles from './index.module.scss'
import BaseDialog from '~/basicComponents/dialog'
import { FormData } from './interfance'

const props = {
  modelValue: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'SubscribeReportDialog',
  props,
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit }) {
    const userStore = useUserStore()
    const formRef = ref()
    const reportTypes = ref<Array<{ id: number; label: string }>>([])
    const reportModules = ref<Array<{ id: number; label: string }>>([])
    const loading = ref(false)
    const formData = ref<FormData>({
      reportType: undefined,
      module: undefined,
      subscriber: {
        userId: Number(userStore.userInfo.userId),
        username: userStore.userInfo.username,
      },
    })

    const dialogVisible = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })

    // 获取报告类型
    const fetchReportTypes = async () => {
      try {
        const res = await getReportTypes()
        if (res.code === 200 && res.data?.list) {
          reportTypes.value = res.data.list
          formData.value.reportType = reportTypes.value[0].id
        }
      } catch (error) {
        console.error('获取报告类型失败:', error)
      }
    }

    // 获取所属模块
    const fetchReportModules = async () => {
      try {
        const res = await getReportModules()
        if (res.code === 200 && res.data?.list) {
          reportModules.value = res.data.list
          formData.value.module = reportModules.value[0].id
        }
      } catch (error) {
        console.error('获取所属模块失败:', error)
      }
    }

    // 初始化数据
    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          fetchReportTypes()
          fetchReportModules()
          formData.value.subscriber = {
            userId: userStore.userInfo.userId,
            username: userStore.userInfo.username,
          }
        } else {
          formData.value = {
            reportType: '',
            module: '',
            subscriber: {
              userId: userStore.userInfo.userId,
              username: userStore.userInfo.username,
            },
          }
          formRef.value?.resetFields()
        }
      },
      { immediate: true },
    )

    const handleConfirm = async () => {
      try {
        await formRef.value?.validate()
        loading.value = true
        emit('confirm', formData.value)
        dialogVisible.value = false
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      dialogVisible.value = false
      formRef.value?.resetFields()
    }

    return () => (
      <BaseDialog
        modelValue={dialogVisible.value}
        onUpdate:modelValue={(val) => (dialogVisible.value = val)}
        title='订阅报告'
        width='600px'
        class={styles.container}
        close-on-click-modal={false}
      >
        <ElScrollbar class={styles.content}>
          <ElForm ref={formRef} model={formData.value} label-width='100px'>
            <ElFormItem
              label='报告类型'
              prop='reportType'
              rules={[{ required: true, message: '请选择报告类型', trigger: 'change' }]}
            >
              <ElSelect
                v-model={formData.value.reportType}
                placeholder='请选择报告类型'
                disabled
                style='width: 100%'
              >
                {reportTypes.value.map((item) => (
                  <ElOption key={item.id} label={item.label} value={item.id} />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label='所属模块'
              prop='module'
              rules={[{ required: true, message: '请选择所属模块', trigger: 'change' }]}
            >
              <ElSelect
                v-model={formData.value.module}
                placeholder='请选择所属模块'
                disabled
                style='width: 100%'
              >
                {reportModules.value.map((item) => (
                  <ElOption key={item.id} label={item.label} value={item.id} />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem
              label='订阅人'
              prop='subscriber'
              rules={[{ required: true, message: '请选择订阅人', trigger: 'change' }]}
            >
              <ElSelect
                v-model={formData.value.subscriber}
                placeholder='请选择订阅人'
                disabled
                style='width: 100%'
              >
                <ElOption
                  label={userStore.userInfo.username}
                  value={{
                    userId: userStore.userInfo.userId,
                    username: userStore.userInfo.username,
                  }}
                />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </ElScrollbar>
        <div class={styles.footer}>
          <ElButton onClick={handleCancel}>取消</ElButton>
          <ElButton type='primary' loading={loading.value} onClick={handleConfirm}>
            确定
          </ElButton>
        </div>
      </BaseDialog>
    )
  },
})
