import { defineComponent, ref, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash'
import { ElCheckbox, ElCheckboxGroup, ElDivider, ElText } from 'element-plus'
import Draggle from 'vuedraggable'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { IPagePreferenceItem } from '../../../commonPage/interfaces'

const props = {
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 全量字段 */
  fields: {
    type: Array as PropType<IPagePreferenceItem[]>,
    default: () => [],
  },
}

// TODO：checkBoxGroup的场景很多，考虑抽成通用组件。
export default defineComponent({
  name: 'DraggableList',
  inheritAttrs: true,
  props,
  setup(props, { emit }) {
    const isAllChecked = ref<CheckboxValueType>(false)
    const isHalfChecked = ref(false)
    const innerFields = ref<IPagePreferenceItem[]>([])
    const selectedKeys = ref<string[]>([])
    watch(
      () => props.fields,
      () => {
        selectedKeys.value = props.fields.filter((v) => v.selected).map((v) => v.key)
        if (!isEqual(innerFields.value, props.fields)) {
          innerFields.value = cloneDeep(props.fields)
        }
      },
      { immediate: true, deep: true },
    )
    watch(
      () => selectedKeys.value,
      () => {
        innerFields.value.forEach((v) => (v.selected = selectedKeys.value.includes(v.key)))
        isAllChecked.value = selectedKeys.value.length === props.fields.length
        isHalfChecked.value =
          selectedKeys.value.length >= 1 && selectedKeys.value.length < props.fields.length
      },
      { immediate: true, deep: true },
    )
    watch(
      () => innerFields.value,
      () => {
        emit('update:fields', innerFields.value)
      },
      { immediate: true, deep: true },
    )
    // 父checkBox选中态改变
    const parentChange = (val: CheckboxValueType) => {
      isAllChecked.value = val
      isHalfChecked.value = !val
      selectedKeys.value = val ? props.fields.map((v) => v.key) : []
    }
    return () => (
      <Space direction='column' size={0}>
        <ElText>{props.title}</ElText>
        <Space class={styles.container} direction='column'>
          <ElCheckbox
            class={styles.allCheckbox}
            modelValue={isAllChecked.value}
            onUpdate:modelValue={(modelValue: boolean) => (isAllChecked.value = modelValue)}
            indeterminate={isHalfChecked.value}
            onClick={(e: Event) => {
              e.stopPropagation()
            }}
            onChange={(val: CheckboxValueType) => parentChange(val)}
          >
            全选
          </ElCheckbox>
          <ElDivider class={styles.divider}></ElDivider>
          <ElCheckboxGroup v-model={selectedKeys.value} class={styles.childBox}>
            <Draggle
              class={styles.draggle}
              modelValue={innerFields.value}
              itemKey='value'
              onUpdate:modelValue={(modelValue: IPagePreferenceItem[]) =>
                (innerFields.value = modelValue)
              }
              v-slots={{
                item: ({ element }) => (
                  <ElCheckbox
                    class={styles.child}
                    key={element.label}
                    label={element.label}
                    value={element.key}
                    v-slots={{
                      default: () => <ElText truncated>{element.label}</ElText>,
                    }}
                  />
                ),
              }}
            />
          </ElCheckboxGroup>
        </Space>
      </Space>
    )
  },
})
