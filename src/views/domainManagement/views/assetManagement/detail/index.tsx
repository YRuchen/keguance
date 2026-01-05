import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElTag } from 'element-plus'
import { getDetailApi } from '~/api/domainManagement/assetManagement'
import FormilyForm from '~/basicComponents/formilyCmps/formilyForm'
import { FormilyCommonJsonPretty } from '~/businessComponents/commonJsonPretty'
import schema from './schema'
import styles from './index.module.scss'

import type { IDetail } from '~/api/domainManagement/assetManagement/interfaces'
import type { IFormilyFormExpose } from '~/basicComponents/formilyCmps/formilyForm'

export default defineComponent({
  name: 'Detail',
  setup() {
    const route = useRoute()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formData = ref<IDetail | {}>({})
    const init = async () => {
      try {
        formData.value = await getDetailApi({ id: route.query?.id })
      } catch (error: any) {
        console.error(`详情获取失败，失败原因：${error}`)
      }
    }
    onMounted(async () => {
      await init()
      formilyFormRef.value.formRef.values = formData.value
      formilyFormRef.value.formRef.readPretty = true
    })
    return () => (
      <FormilyForm
        ref={formilyFormRef}
        class={styles.container}
        config={schema}
        components={{ CommonJsonPretty: FormilyCommonJsonPretty, ElTag }}
      />
    )
  }
})
