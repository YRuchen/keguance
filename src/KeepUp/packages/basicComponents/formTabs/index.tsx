import { defineComponent, h, ref, computed } from 'vue'
import { ElTabs } from 'element-plus'

import type { PropType } from 'vue'
import type { ISchema } from '@formily/json-schema'
import type { ICommonObj } from '~/interfaces/common'

const props = {
  /** 
   * formTabs的结构模型
   * @description 注意：ElTabPane的name就是当前ISchema['properties']的key
   */
  schema: {
    type: Object as PropType<ISchema['properties']>,
    default: () => ({}),
  },
  /** ElTabPane的组件的data，可以为任意类型 */
  tabPaneData: {
    type: [Object, Array],
    default: undefined,
  },
}

export default defineComponent({
  name: 'FormTabs',
  props,
  setup(props) {
    const formattedSchema = computed(() => Object.entries(props.schema))
    const activeName = ref(formattedSchema.value?.[0]?.[0])
    // TODO: 这个抽象成一个转换方法，用来转换普通vue组件
    console.log('props.schema', props.schema)
    return () => (
      <ElTabs style={{ width: '100%' }} modelValue={activeName.value}>
        {
          Object.entries(props.schema).map(([_, v]) => (
            h(
              v['x-decorator'],
              v['x-decorator-props'],
              h(
                v['x-component'],
                v['x-component-props'],
                (props.tabPaneData || []).map((v1: ICommonObj, index1: string) => (
                  h(
                    v.items?.['x-component'],
                    {
                      ...(v.items?.['x-component-props'] || {}),
                      name: index1,
                    },
                    {
                      ...Object.fromEntries(
                        Object.entries(v.items?.['x-content'])
                          .map(([k2, v2]) => (
                            [k2, h(v2, v1)]
                          ))
                      ),
                      default: () => h(
                        v.items?.items?.['x-component'],
                        {
                          ...v.items?.items?.['x-component-props'],
                          data: v1,
                        },
                      ),
                    },
                  )
                ))
              ),
            )
          ))
        }
      </ElTabs>
    )
  }
})
