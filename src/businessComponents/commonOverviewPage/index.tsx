import { defineComponent, ref, h } from 'vue'
import { useRoute } from 'vue-router'
import { ElTabs } from 'element-plus'
import Space from '~/basicComponents/space'
import BasicDataPane from './basicDataPane'
import styles from './index.module.scss'
import './index.scss'

import type { PropType } from 'vue'
import type { ISchema } from '@formily/vue'
import type { IBasicData } from './interfaces'

const props = {
  /** tabs的结构模型 */
  schema: {
    type: Array as PropType<(ISchema['properties'] & { name: string, title: string })[]>,
    default: () => ([]),
  },
  /** 可激活的tabs */
  tabsActiveNames: {
    type: Array as PropType<string[]>,
    default: () => ([]),
  },
  /** 当前激活的tab */
  defaultActiveName: {
    type: String,
    default: '',
  },
  /** 基础数据 */
  basicData: {
    type: Object as PropType<Partial<IBasicData>>,
    default: () => ({}),
  },
}

export default defineComponent({
  name: 'OverviewPage',
  props,
  setup(props, { expose }) {
    const route = useRoute()
    const componentRefs = ref<Record<string, any>>({})
    const activeName = ref(route.query?.activeKey || props.defaultActiveName)
    expose({
      getComponentRefs: () => componentRefs.value,
    })
    return () => (
      <Space class={styles.container} direction='column'>
        <BasicDataPane basicData={props.basicData} />
        <ElTabs
          class={['tabs', styles.tabsContainer]}
          modelValue={activeName.value}
          onUpdate:modelValue={(val: string) => { activeName.value = val }}
        >
          {props.schema.map(v => (
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
                  {
                    ref: (ref) => {
                      componentRefs.value[v.name] = ref
                    },
                    basicData: props.basicData,
                    ...(v['x-component-props'] || {}),
                  },
                ),
              ],
            )
          ))}
        </ElTabs>
      </Space>
    )
  }
})
