import { defineComponent, ref, nextTick } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { TabType, tabTypeOptions } from './constants'
import styles from './index.module.scss'

import type { IExpose } from '~/KeepUp'

export default defineComponent({
  name: 'IndexManagement',
  setup () {
    const activeName = ref(TabType.CHAT_ID)
    const commonPageRef1 = ref<IExpose>()
    const commonPageRef2 = ref<IExpose>()
    const tabChange = async (val: TabType) => {
      activeName.value = val
      await nextTick()
      commonPageRef1.value?.updateTableHeight()
      commonPageRef2.value?.updateTableHeight()
    }
    return () => (
      <ElTabs 
        class={styles.container} 
        modelValue={activeName.value} 
        onTabChange={tabChange}
      >
        {
          tabTypeOptions.map((v, index) => (
            <ElTabPane key={v.label} label={v.label} name={v.value}>{v.getComponent(index === 0 ? commonPageRef1 : commonPageRef2)}</ElTabPane>
          ))
        }
      </ElTabs>
    )
  },
})
