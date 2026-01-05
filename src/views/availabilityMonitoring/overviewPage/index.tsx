import { defineComponent, ref, h } from 'vue'
import { useRoute } from 'vue-router'
import { ElTabs } from 'element-plus'
import { getTaskBasicDataApi } from '~/api/availabilityMonitoring'
import Space from '~/basicComponents/space'
import BasicDataPane from './basicDataPane'
import { tabsSchema, Tabs } from './constants'
import styles from './index.module.scss'
import './index.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/sectionTitle/index.module.scss'

import type { IBasicTaskData } from '~/api/availabilityMonitoring/interfaces'

export default defineComponent({
  name: 'OverviewPage',
  setup() {
    const route = useRoute()
    const activeName = ref(route.query?.activeKey || Tabs.Detail)
    const basicData = ref<Partial<IBasicTaskData>>({})
    const init = async () => {
      basicData.value = await getTaskBasicDataApi({ testId: route.query.testId as string })
    }
    init()
    return () => (
      <Space class={styles.container} direction='column'>
        <BasicDataPane basicData={basicData.value} />
        <ElTabs
          class='tabs'
          style={{ width: '100%' }}
          modelValue={activeName.value}
          onUpdate:modelValue={(val: string) => { activeName.value = val }}
        >
          {tabsSchema.map(v => (
            h(
              v['x-decorator'],
              {
                label: v.title,
                name: v.name,
                ...(v['x-decorator-props'] || {}),
              },
              [
                h(
                  v['x-component'],
                  { ...(v['x-component-props'] || {}), basicData: basicData.value },
                ),
              ],
            )
          ))}
        </ElTabs>
      </Space>
    )
  }
})
