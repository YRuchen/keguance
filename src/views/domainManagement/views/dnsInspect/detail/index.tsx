import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElMessage } from 'element-plus'
import { NoticeChannel } from '~/api/domainManagement/common'
import { getDetailApi, createApi, editApi } from '~/api/domainManagement/dnsInspect'
import { FormilyForm, CommonLocations, Space } from '~/KeepUp'
import getSchema from './schema'
import styles from './index.module.scss'

import type { IFormilyFormExpose } from '~/basicComponents/formilyCmps/formilyForm'

export default defineComponent({
  name: 'Detail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref<IFormilyFormExpose>()
    const schema = ref({})
    const isCreate = computed(() => route.path.includes('dnsInspectCreate'))
    const isView = computed(() => route.name === 'DnsInspectOverview')
    const isEdit = computed(() => route.name === 'DnsInspectEdit')
    const confirm = async () => {
      try {
        const formData = await formRef.value?.formRef?.submit()
        isCreate.value ? await createApi(formData) : await editApi(formData)
        router.back()
        ElMessage({
          message: `${isCreate ? '新增' : '编辑'}成功`,
          type: 'success'
        })
      } catch (error: any) {
        console.error(`提交失败，失败原因：${error}`)
      }
    }
    const init = async () => {
      schema.value = getSchema({ formRef, isEdit })
      if (!isCreate.value) {
        const res = await getDetailApi({ id: route.query.id })
        setTimeout(() => {
          formRef.value?.formRef?.setValues({ ...res, noticeMode: [NoticeChannel.TELEGRAM] })
        }, 500)
      } else {
        setTimeout(() => {
          formRef.value?.formRef?.setValues({ taskStatus: false, nodes: [] })
        }, 500)
      }
      if (isView.value) {
        formRef.value.formRef.readPretty = true
      }
    }
    onMounted(() => {
      init()
    })
    return () => (
      <Space direction='column' fill style={{ height: '100%' }}>
        <FormilyForm
          ref={formRef}
          class={styles.container}
          config={schema.value}
          components={{ CommonLocations }}
        />
        <Space class={styles.btnGroup} fill justify='end'>
          <ElButton onClick={() => { router.back() }}>取消</ElButton>
          <ElButton type='primary' onClick={confirm}>保存</ElButton>
        </Space>
      </Space>
    )
  }
})
