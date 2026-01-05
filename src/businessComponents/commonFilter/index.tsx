import { defineComponent, ref, computed, onMounted } from 'vue'
import FormilyForm from '~/basicComponents/formilyCmps/formilyForm'
import { getRootSchema } from '~/constants/commonPage'
import { operateActionsSchema } from './constants'
import { setOperateBtnsStyle } from './utils'
import { useKeepFilter } from './useKeepFilter'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ISchema } from '@formily/vue'
import type { IFormilyFormExpose, IEffectHooks } from '~/basicComponents/formilyCmps/formilyForm'
import type { IOperateActions } from './interfaces'

const props = {
  /** 筛选项 */
  filterFields: {
    type: Object as PropType<ISchema>,
    default: () => ({}),
  },
  /** 栅格数量 */
  maxColumns: {
    type: Number,
    default: 3,
  },
  /** 操作 */
  operateActions: {
    type: Object as PropType<IOperateActions>,
    default: () => ({}),
  },
  /** effectHooks */
  effectHooks: {
    type: Object as PropType<IEffectHooks>,
    default: () => ({}),
  },
  /** 页面标识 */
  pageKey: {
    type: String,
    default: '',
  },
}

export type * from './interfaces'
export default defineComponent({
  name: 'CommonFilter',
  props,
  setup(props, { expose }) {
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const allFields = computed(() => ({ ...props.filterFields, ...operateActionsSchema(props.operateActions) })) // 全量筛选字段schema
    const fields = computed(() => getRootSchema({ maxColumns: props.maxColumns, properties: allFields.value })) // schema
    const collapseData = computed(() => 
      Object.entries(allFields.value).reduce(
        (initVal, [k, v]) => {
          const gridSpan = v['x-component-props']?.gridSpan || 1
          initVal.totalGridSpan += gridSpan
          initVal.allFieldKeys.push(k)
          if (initVal.totalGridSpan <= (props.maxColumns - 1) || k === 'operateBtns') {
            initVal.visibleFieldKeys.push(k)
          }
          return initVal
        },
        { visibleFieldKeys: [], allFieldKeys: [], totalGridSpan: 0 },
      )
    ) // 主数据
    const visibleFields = computed(() => visible.value ? collapseData.value.visibleFieldKeys : collapseData.value.allFieldKeys) // 展示字段
    const collapsible = computed(() => collapseData.value.totalGridSpan > props.maxColumns) // 可折叠
    const visible = ref(true) // 展开收起
    const { filterParams } = useKeepFilter({ pageKey: props.pageKey })
    // 展开收起
    const collapse = () => {
      collapseData.value.allFieldKeys.forEach(v => {
        const field = formRef.value.query(v)?.take()
        if (!field) {
          return
        }
        field.visible = visibleFields.value.includes(v)
      })
      visible.value = !visible.value
      setOperateBtnsStyle(formRef.value, visible.value)
    }
    // 初始化
    const init = () => {
      setOperateBtnsStyle(formRef.value, visible.value)
    }
    init()
    onMounted(() => {
      formRef.value.values = filterParams.value
    })
    expose({
      collapsible,
      visible,
      collapse,
      getForm: () => formRef.value,
      reset: () => {
        formRef.value.reset()
      },
      getCommonFilterHeight: () => {
        return formilyFormRef.value.getContainerRef().clientHeight
      },
    })
    return () => (
      <FormilyForm
        ref={formilyFormRef}
        class={styles.container}
        config={fields.value}
        effectHooks={props.effectHooks}
      />
    )
  }
})
