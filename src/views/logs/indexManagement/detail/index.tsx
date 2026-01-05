import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElMessage } from 'element-plus'
import { getIndexTemplateDetailApi, createIndexTemplateApi, editIndexTemplateApi } from '~/api/logs/indexManagement'
import { Space, FormilyForm } from '~/KeepUp'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import { getSchema } from './formSectionsSchema/schema'
import { getEffects } from './effectHooks'
import styles from './index.module.scss'

import type { Form } from '@formily/core'
import type { IFormilyFormExpose } from '~/KeepUp'

export default defineComponent({
  name: 'Detail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEdit = computed(() => route.query?.type === 'edit')
    const id = computed(() => route.query?.id as string)
    const formilyForm = ref<IFormilyFormExpose>()
    const formRef = computed<Form>(() => formilyForm.value?.formRef)
    const init = async () => {
      if (isEdit.value) {
        const res = await getIndexTemplateDetailApi(id.value)
        formRef.value.values = res
      }
    }
    const confirm = async () => {
      try {
        await formRef.value?.submit()
        isEdit.value
          ? await editIndexTemplateApi({
              ...(formRef.value.values || {}),
              templateId: id.value,
            })
          : await createIndexTemplateApi(formRef.value.values)
        ElMessage.success(`${isEdit.value ? '编辑' : '新增'}索引模版成功`)
        router.back()
      } catch (error: any) {
        console.error(`新增索引模版失败，失败原因：${JSON.stringify(error)}`)
      }
    }
    onMounted(() => {
      init()
    })
    return () => (
      <Space class={styles.container} direction='column' fill>
        <FormilyForm
          ref={formilyForm}
          config={getSchema(isEdit)}
          effectHooks={getEffects()}
        />
        <Space class={styles.btnGroup} fill justify='end'>
          <ElButton
            onClick={() => {
              router.back()
            }}
          >
            取消
          </ElButton>
          <ElButton type='primary' onClick={confirm}>
            保存
          </ElButton>
        </Space>
      </Space>
    )
  }
})
