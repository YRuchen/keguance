import { nextTick, h } from 'vue'
import { debounce, isEmpty } from 'lodash'
import { ElEmpty } from 'element-plus'
import { getLogSamplingList } from '~/api/logs/indexManagement'

import type { Field } from "@formily/core"

/**
 * 保存和恢复滚动位置的辅助函数
 * 通过保持表格容器高度和滚动位置来防止滚动跳转
 * @param _field - Formily 字段
 * @param callback - 数据更新回调
 * @param isEmpty - 数据是否为空，如果为空则恢复自然高度
 */
const preserveScrollPosition = async (
  _field: Field, 
  callback: () => void | Promise<void>,
  isEmpty: boolean = false
) => {
  // 查找滚动容器（页面主容器）
  const scrollContainer = document.querySelector('.container') as HTMLElement
  
  // 保存当前滚动位置
  const savedScrollTop = scrollContainer?.scrollTop ?? 
                         window.scrollY ?? 
                         document.documentElement.scrollTop ?? 
                         0

  // 查找表格的 FormItem 容器（通过字段路径定位）
  await nextTick()
  const formItemContainers = document.querySelectorAll('.formily-element-plus-form-item')
  let tableFormItem: HTMLElement | null = null
  
  // 查找包含表格的 FormItem（通过查找包含 .el-table 的 FormItem）
  for (const formItem of Array.from(formItemContainers)) {
    if (formItem.querySelector('.el-table')) {
      tableFormItem = formItem as HTMLElement
      break
    }
  }
  
  // 保存表格容器的当前高度
  let savedHeight: number | null = null
  if (tableFormItem) {
    const currentHeight = tableFormItem.offsetHeight
    if (currentHeight > 0 && !isEmpty) {
      // 只有在数据不为空时才保存高度并设置最小高度
      savedHeight = currentHeight
      // 设置最小高度，保持高度不变
      tableFormItem.style.minHeight = `${currentHeight}px`
    }
  }

  // 执行回调（数据更新）
  await callback()

  // 恢复状态
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 恢复滚动位置
      if (scrollContainer && scrollContainer.isConnected) {
        scrollContainer.scrollTop = savedScrollTop
      }
      
      // 处理表格容器高度
      if (tableFormItem && tableFormItem.isConnected) {
        if (isEmpty) {
          // 如果数据为空，移除动态设置的最小高度，恢复自然高度
          // 但保留 schema 中设置的 minHeight: 400px（通过移除内联样式来恢复）
          tableFormItem.style.minHeight = ''
        } else if (savedHeight !== null) {
          // 如果新内容的高度小于保存的高度，保持最小高度
          const newHeight = tableFormItem.offsetHeight
          if (newHeight < savedHeight) {
            tableFormItem.style.minHeight = `${savedHeight}px`
          }
        }
      }
    })
  })
}

const itemsXReaction = debounce(async ({ dataSourceId, indexPrefix, filterConditions, form }) => {
  const res = await getLogSamplingList({ dataSourceId, indexPrefix, filterConditions })
  const readonlyListField = form.query('readOnlyList')?.take() as Field
  
  // 检查数据是否为空
  const isDataEmpty = !res?.list || res.list.length === 0
  
  await preserveScrollPosition(readonlyListField, async () => {
    readonlyListField.setComponentProps({
      ...(readonlyListField.componentProps || {}),
      listApi: () => res,
    })
    readonlyListField.content = {
      empty: '未找到匹配的日志'
    }
    await nextTick()
    readonlyListField?.data?.reset?.()
  }, isDataEmpty)
}, 300)
const commonAction1 = async (field: Field) => {
  try {
    const readOnlyListField = field.form.query('readOnlyList')?.take() as Field
    const dataSourceIdField = field.form.query('dataSourceId')?.take() as Field
    const indexPrefixField = field.form.query('indexPrefix')?.take() as Field
    const conditionsField = field?.form?.query('filterCondition.conditions')?.get('value') as Field
    const logicField = field?.form?.query('filterCondition.logic')?.get('value') as Field
    const hasValue = dataSourceIdField?.value && indexPrefixField?.value
    if (!hasValue) {
      // 没有值时，数据为空，恢复自然高度
      await preserveScrollPosition(readOnlyListField, async () => {
        readOnlyListField.setComponentProps({
          ...(readOnlyListField.componentProps || {}),
          listApi: () => ([]),
        })
        readOnlyListField.content = {
          empty: () => h(ElEmpty),
        }
        await nextTick()
        setTimeout(() => {
          readOnlyListField.data.reset()
        }, 300)
      }, true) // 数据为空
    } else {
      itemsXReaction({
        dataSourceId: dataSourceIdField?.value,
        indexPrefix: indexPrefixField?.value, 
        filterConditions: { conditions: conditionsField, logic: logicField },
        form: field?.form,
      })
    }
  } catch (error: any) {
    console.error(`获取日志采样数据失败，失败原因：${error}`)
  }
}
const commonAction2 = (field: Field) => {
  const conditionsField = field?.form?.query('filterCondition.conditions')?.get('value') as Field
  const logicField = field?.form?.query('filterCondition.logic')?.get('value') as Field
  const dataSourceId = field?.form?.query('.dataSourceId')?.get('value')
  const indexPrefix = field?.form?.query('.indexPrefix')?.get('value')
  const hasValue = dataSourceId && indexPrefix && !isEmpty(field.value)
  if (hasValue) {
    itemsXReaction({
      dataSourceId, 
      indexPrefix, 
      filterConditions: { conditions: conditionsField, logic: logicField },
      form: field?.form,
    })
  }
}
export const getEffects = () => ({
  fieldEffects: {
    /** 数据源 */
    'dataSourceId': {
      onFieldValueChange: commonAction1,
    },
    /** 原始索引前缀 */
    'indexPrefix': {
      onFieldValueChange: commonAction1,
    },
    /** 过滤条件 全部/任一 */
    'filterCondition.logic': {
      onFieldValueChange: commonAction2,
    },
    /** 过滤条件 因子 */
    'filterCondition.conditions.*.field': {
      onFieldValueChange: commonAction2,
    },
    /** 过滤条件 操作符 */
    'filterCondition.conditions.*.operator': {
      onFieldValueChange: commonAction2,
    },
    /** 过滤条件 值 */
    'filterCondition.conditions.*.value': {
      onFieldValueChange: commonAction2,
    },
  },
})
