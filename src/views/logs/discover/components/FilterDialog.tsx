// components/FilterDialog.tsx
import { defineComponent, PropType, reactive } from 'vue'
import { LogDocument, LogField, FilterCondition } from '@/api/logs/discover/interfaces'
import { ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElButton } from 'element-plus'
import { operatorOptions } from '../../retrieval/components/queryBuilder/constants'
import styles from '../index.module.scss'

export default defineComponent({
  name: 'FilterDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    availableFields: {
      type: Array as PropType<LogField[]>,
      required: true,
    },
    currentDocument: {
      type: Object as PropType<LogDocument>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'addFilter'],
  setup(props, { emit }) {
    const newFilter = reactive<FilterCondition>({
      field: '',
      operator: operatorOptions[0].value, // 默认使用第一个操作符（等于）
      value: '',
    })

    const handleAddFilter = () => {
      if (newFilter.field && newFilter.operator && newFilter.value) {
        // 验证过滤条件是否有效
        // const isValid = validateFilterCondition(newFilter)
        const filterWithValidation = { ...newFilter }

        emit('addFilter', filterWithValidation)
        newFilter.field = ''
        newFilter.operator = operatorOptions[0].value // 重置为第一个操作符（等于）
        newFilter.value = ''
        emit('update:modelValue', false)
      }
    }

    // 验证过滤条件是否有效
    const validateFilterCondition = (filter: FilterCondition) => {
      // 这里可以添加具体的验证逻辑
      // 例如：某些字段不允许某些操作符，某些值格式不正确等

      // 示例验证规则：
      // 1. 时间字段不能使用包含操作符
      if (filter.field.includes('timestamp') && filter.operator === 'contains') {
        return false
      }

      // 2. 数字字段不能使用通配符操作符
      if (filter.field.includes('id') && filter.operator === 'wildcard') {
        return false
      }

      // 3. 空值检查
      if (!filter.value.trim()) {
        return false
      }

      return true
    }

    const handleClose = () => {
      emit('update:modelValue', false)
    }

    return () => (
      <ElDialog
        modelValue={props.modelValue}
        onUpdate:modelValue={handleClose}
        title='编辑筛选条件'
        width='600px'
        v-slots={{
          footer: () => (
            <span class={styles.dialogFooter}>
              <ElButton onClick={handleClose}>取消</ElButton>
              <ElButton type='primary' onClick={handleAddFilter}>
                保存
              </ElButton>
            </span>
          ),
        }}
      >
        <div class={styles.filterDialog}>
          <ElForm model={newFilter} labelWidth='80px'>
            <ElFormItem label='字段'>
              <ElSelect v-model={newFilter.field} placeholder='选择字段'>
                {props.availableFields.map((field) => (
                  <ElOption key={field.name} label={field.name} value={field.name} />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem label='运算符'>
              <ElSelect v-model={newFilter.operator}>
                {operatorOptions.map((option) => (
                  <ElOption key={option.value} label={option.label} value={option.value} />
                ))}
              </ElSelect>
            </ElFormItem>
            <ElFormItem label='值'>
              <ElInput v-model={newFilter.value} />
            </ElFormItem>
          </ElForm>
        </div>
      </ElDialog>
    )
  },
})
