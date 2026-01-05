import { defineComponent, ref, computed, watch } from 'vue'
import { ElCollapse, ElCollapseItem, ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { CaretRight } from '@element-plus/icons-vue'
import Space from '~/basicComponents/space'
import { IconFont } from '~/KeepUp'
import { generateSchema } from './utils'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { ICheckBoxGroupsSchema } from './interfaces'

const props = {
  /** schema */
  schema: {
    type: Array as PropType<Partial<ICheckBoxGroupsSchema>>,
    default: () => ([]),
  },
  /** 选中值 */
  selectedValues: {
    type: Array as PropType<Array<string[]>>,
    default: () => ([]),
  },
}

export default defineComponent({
  name: 'FilterPanel',
  props,
  setup(props, { emit, expose }) {
    const collapse = ref(false)
    const basicValues = ref([]) // 选中值
    const basicSchema = computed(() => generateSchema(props.schema, props.selectedValues)) // 完整的schema
    const activeNames = ref((basicSchema.value || []).map((v, i) => i))
    const ignoreWatch = ref(false)
    watch(() => props.selectedValues, (val) => {
      basicValues.value = val
    }, { immediate: true, deep: true })
    watch(() => basicValues.value, (val) => {
      if (ignoreWatch.value) {
        ignoreWatch.value = false
        return
      }
      emit('update:selectedValues', val)
    }, { deep: true })
    // 父checkBox选中态改变
    const parentChange = (val: CheckboxValueType, key: number) => {
      basicValues.value[key] = val 
        ? basicSchema.value[key].children.map(v => v.value)
        : []
    }
    /** 清空选中值，同时不触发watch */
    const ignoreNextWatch = () => {
      ignoreWatch.value = true
    }
    expose({ ignoreNextWatch })
    return () => (
      <Space 
        class={styles.container}
        style={{ width: collapse.value ? '180px' : '300px' }}
        direction='column' 
        size={0}
      >
        <Space class={styles.title} justify='space-between'>
          <span>快速筛查</span>
          <IconFont
            class={styles.collapseIcon}
            style={{
              transform: `rotate(${collapse.value ? "180deg" : "0"})`,
              transitionDuration: "0.1s",
              transitionProperty: "all",
            }}
            name="collapse"
            onClick={() => { collapse.value = !collapse.value }}
          />
        </Space> 
        <ElCollapse 
          modelValue={activeNames.value} 
          expandIconPosition='left'
          class={styles.collapse}
        >
          {basicSchema.value.map((v, index) => {
            return (
              <ElCollapseItem
                key={index}
                name={index}
                icon={CaretRight}
                v-slots={{
                  title: () => {
                    return (
                      <ElCheckbox
                        v-model={v.isAllChecked}
                        indeterminate={v.isHalfChecked}
                        onClick={(e: Event) => { e.stopPropagation() }}
                        onChange={(val: CheckboxValueType) => parentChange(val, index)}
                      >{v.label}</ElCheckbox>
                    )
                  }
                }}
              >
                <ElCheckboxGroup class={styles.checkboxGroup} v-model={basicValues.value[index]}>
                  {v.children.map(v => (
                    <ElCheckbox 
                      key={v.label} 
                      label={v.label} 
                      value={v.value} 
                      v-slots={{
                        default: () => (
                          <div class={styles.label}>
                            <div class={styles.labelContent}>{v.label}</div>
                            <div class={styles.labelNum}>{v.num}</div>
                          </div>
                        )
                      }}
                    />
                  ))}
                </ElCheckboxGroup>
              </ElCollapseItem>
            )
          })}
        </ElCollapse>
      </Space>
    )
  }
})
