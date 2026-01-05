import { defineComponent, ref, computed, onMounted } from 'vue'
import { isEmpty } from 'lodash'
import { ElButton } from 'element-plus'
import { FormilyForm, Space } from '~/KeepUp'
import { getRootSchema } from '../../constants/common'
import { setOperateBtnsStyle } from './utils'
import { useKeepFilter } from './useKeepFilter'
import { props } from './props'
import { useFieldsParser } from './useFieldsParser'
import { useCollapse } from './useCollapse'
import styles from './index.module.scss'

import type { IFormilyFormExpose } from '../../basicComponents/formilyCmps/formilyForm'

export type * from './interfaces'
export default defineComponent({
  name: 'CommonFilter',
  props,
  setup(props, { expose }) {
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const { collapseData } = useFieldsParser(props) // 派生展开收起所需所有数据
    const fields = computed(() => getRootSchema({ 
      maxColumns: props.maxColumns, 
      properties: collapseData.value.allFields,
    })) // schema
    const { visible, collapse } = useCollapse({ formRef, collapseData }) // 展开收起
    const { filterParams, keepFilter, init: keepFilterInit } = useKeepFilter({ pageKey: props.pageKey, formRef }) // 筛选项数据缓存
    const init = () => {
      setOperateBtnsStyle(formRef.value, visible.value)
    } // 初始化
    init()
    onMounted(() => {
      keepFilterInit()
      if (!isEmpty(filterParams.value)) {
        formRef.value.values = filterParams.value
      }
    })
    expose({
      collapseData,
      visible,
      collapse,
      keepFilter,
      getForm: () => formRef.value,
      reset: () => {
        formRef.value.reset()
      },
      getCommonFilterHeight: () => {
        return formilyFormRef.value.getContainerRef().clientHeight
      },
    })
    return () => (
      <Space class={styles.container} align='flex-start' justify='start'  size={12} fill>
        <FormilyForm
          ref={formilyFormRef}
          config={fields.value}
          effectHooks={props.effectHooks}
        />
        <Space size={12}>
          <ElButton class={styles.btn} type='primary' onClick={props.operateActions.query}>查询</ElButton>
          <ElButton class={styles.btn} onClick={props.operateActions.reset}>重置</ElButton>
        </Space>
      </Space>
    )
  }
})
