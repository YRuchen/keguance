import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDetailApi } from '~/api/domainManagement/sslInspect'
import { getFrequencyApi, TaskType } from '~/api/domainManagement/common'
import { CommonOverviewPage } from '~/businessComponents'
import { NoticeChannel } from '../../../common/constants'
import { getTabsSchema, Tabs, tabsActiveNames } from './constants'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/sectionTitle/index.module.scss'

import type { Form } from '@formily/core'

export default defineComponent({
  name: 'OverviewPage',
  setup() {
    const route = useRoute()
    const commonOverviewPageRef = ref()
    const basicData = ref({})
    const init = async () => {
      try {
        const res = await getDetailApi({ id: route.query.id })
        const res1 = await getFrequencyApi(TaskType.TASK_TYPE_SSL)
        const options = (res1.list).map(v => ({
          label: v.label,
          value: v.id,
        }))
        const componentRefs = commonOverviewPageRef.value?.getComponentRefs()
        if (!componentRefs) {
          return
        }
        const formRef = componentRefs.Detail.formRef as Form
        formRef.readPretty = true
        formRef.values = {
          ...res,
          noticeMode: [NoticeChannel.TELEGRAM],
        }
        basicData.value = {
          name: res?.inspectName,
          status: res?.taskStatus,
          domain: {
            label: '监控对象',
            value: res?.domain,
          },
          frequency: {
            label: '监测频率',
            value: options.find(v => v.value === res?.frequencyId)?.label,
          },
        }
      } catch (error: any) {
        console.error(`获取详情失败，失败原因：${error}`)
      }
    }
    onMounted(() => {
      init()
    })
    return () => (
      <CommonOverviewPage
        ref={commonOverviewPageRef}
        schema={getTabsSchema()}
        tabsActiveNames={tabsActiveNames}
        defaultActiveName={Tabs.TaskHistory}
        basicData={basicData.value}
      />
    )
  }
})
