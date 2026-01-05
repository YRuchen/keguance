import { defineComponent, ref, computed, onMounted, Transition } from 'vue'
import {
  ElButton,
  ElIcon,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElDatePicker,
  ElOption,
} from 'element-plus'
import { RefreshRight, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { getReportTypes, getReportModules } from '@/api/reportCenter'
import styles from './index.module.scss'
import { IconFont } from '~/KeepUp'

import type { PropType } from 'vue'

const STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '生产', value: 'production' },
  { label: '预生产', value: 'preproduction' },
  { label: '测试', value: 'test' },
  { label: '开发', value: 'dev' },
]

const props = {
  /** 按钮配置 */
  buttonConfig: {
    type: Object as PropType<{
      text: string
      onClick: () => void
    }>,
    default: undefined,
  },
  /** 是否显示刷新icon */
  showRefresh: {
    type: Boolean,
    default: false,
  },
  /** 展开/收起的字段名（该字段之后的所有字段都会被展开/收起控制） */
  expandField: {
    type: String,
    default: 'module', // 默认是所属模块
  },
  /** 额外的筛选项配置 */
  extraFields: {
    type: Array as PropType<
      Array<{
        field: string
        label: string
        type: 'select' | 'date' | 'daterange'
        options?: Array<{ label: string; value: any }>
      }>
    >,
    default: () => [],
  },
  /** 表单值 */
  modelValue: {
    type: Object,
    default: () => ({}),
  },
}

export default defineComponent({
  name: 'ReportFilter',
  props,
  emits: ['update:modelValue', 'query', 'reset'],
  setup(props, { emit, expose }) {
    const formRef = ref()
    const reportTypes = ref<Array<{ id: number; label: string }>>([])
    const reportModules = ref<Array<{ id: number; label: string }>>([])
    const expanded = ref(true)
    const formData = ref({
      reportName: '',
      reportType: '',
      module: '',
      ...props.extraFields.reduce((acc, field) => {
        acc[field.field] = ''
        return acc
      }, {} as Record<string, any>),
    })

    // 获取报告类型
    const fetchReportTypes = async () => {
      try {
        const res = await getReportTypes()
        if (res.code === 200 && res.data?.list) {
          reportTypes.value = res.data.list
        }
      } catch (error) {
        console.error('获取报告类型失败:', error)
      }
    }

    // 获取所属模块
    const fetchReportModules = async () => {
      try {
        const res = await getReportModules()
        if (res.code === 200 && res.data?.list) {
          reportModules.value = res.data.list
        }
      } catch (error) {
        console.error('获取所属模块失败:', error)
      }
    }

    onMounted(() => {
      fetchReportTypes()
      fetchReportModules()
    })

    const handleQuery = () => {
      emit('query', formData.value)
    }

    const handleReset = () => {
      formRef.value?.resetFields()
      Object.keys(formData.value).forEach((key) => {
        formData.value[key] = ''
      })
      emit('reset')
    }

    const toggleExpand = () => {
      expanded.value = !expanded.value
    }

    const getFormValues = () => {
      return formData.value
    }

    const reset = () => {
      handleReset()
    }

    expose({
      getFormValues,
      reset,
    })

    // 计算第一行和第二行的字段
    const firstRowFields = computed(() => {
      const allFields = [
        'reportName',
        'reportType',
        'module',
        ...props.extraFields.map((f) => f.field),
      ]
      const expandFieldIndex = allFields.indexOf(props.expandField)
      // 第一行：基础字段 + expandField之前的extraFields
      return allFields.filter((_, index) => index <= expandFieldIndex)
    })

    const secondRowFields = computed(() => {
      const allFields = [
        'reportName',
        'reportType',
        'module',
        ...props.extraFields.map((f) => f.field),
      ]
      const expandFieldIndex = allFields.indexOf(props.expandField)
      // 第二行：expandField之后的extraFields
      return props.extraFields.filter((field) => {
        const currentFieldIndex = allFields.indexOf(field.field)
        return currentFieldIndex > expandFieldIndex
      })
    })

    // 判断字段是否在第一行
    const isFirstRowField = (fieldName: string) => {
      return firstRowFields.value.includes(fieldName)
    }

    // 渲染字段组件
    const renderField = (field: {
      field: string
      label: string
      type: 'select' | 'date' | 'daterange'
      options?: Array<{ label: string; value: any }>
    }) => {
      if (field.type === 'select') {
        return (
          <ElFormItem key={field.field} label={field.label}>
            <ElSelect
              v-model={formData.value[field.field]}
              placeholder={`请选择${field.label}`}
              clearable
              style='width: 200px'
            >
              {(field.options || []).map((opt) => (
                <ElOption key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </ElSelect>
          </ElFormItem>
        )
      } else if (field.type === 'date' || field.type === 'daterange') {
        return (
          <ElFormItem key={field.field} label={field.label}>
            <ElDatePicker
              v-model={formData.value[field.field]}
              type={field.type === 'daterange' ? 'daterange' : 'date'}
              placeholder={field.type === 'daterange' ? '选择日期范围' : '选择日期'}
              clearable
              style='width: 200px'
              value-format='YYYY-MM-DD'
            />
          </ElFormItem>
        )
      }
      return null
    }

    return () => (
      <div class={styles.container}>
        <div class={styles.leftSection}>
          {props.buttonConfig && (
            <ElButton
              type='primary'
              onClick={props.buttonConfig.onClick}
              class={styles.actionButton}
            >
              {props.buttonConfig.text}
            </ElButton>
          )}
          <div class={styles.filterSection}>
            <ElForm ref={formRef} model={formData.value} inline class={styles.filterForm}>
              {/* 第一行：始终显示 */}
              <div class={styles.firstRow}>
                {/* 基础字段 */}
                <ElFormItem label='报告名称'>
                  <ElInput
                    v-model={formData.value.reportName}
                    placeholder='请输入报告名称'
                    clearable
                    style='width: 200px'
                  />
                </ElFormItem>
                <ElFormItem label='报告类型'>
                  <ElSelect
                    v-model={formData.value.reportType}
                    placeholder='请选择报告类型'
                    clearable
                    style='width: 200px'
                  >
                    {reportTypes.value.map((item) => (
                      <ElOption key={item.id} label={item.label} value={item.id} />
                    ))}
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label='所属模块'>
                  <ElSelect
                    v-model={formData.value.module}
                    placeholder='请选择所属模块'
                    clearable
                    style='width: 200px'
                  >
                    {reportModules.value.map((item) => (
                      <ElOption key={item.id} label={item.label} value={item.id} />
                    ))}
                  </ElSelect>
                </ElFormItem>
                {/* 第一行的额外字段（expandField之前的） */}
                {props.extraFields.map((field) => {
                  if (isFirstRowField(field.field)) {
                    return renderField(field)
                  }
                  return null
                })}
                {/* 按钮永远在第一行最后 */}
                <ElFormItem class={styles.buttonGroup}>
                  <ElButton type='primary' onClick={handleQuery}>
                    查询
                  </ElButton>
                  <ElButton onClick={handleReset}>重置</ElButton>
                  <ElButton onClick={toggleExpand} link type='primary'>
                    <IconFont
                      name='double_arrow_down'
                      style={{ transform: `rotate(${expanded.value ? '180deg' : '0deg'})` }}
                      size={10}
                    />
                    {expanded.value ? '收起' : '展开'}
                  </ElButton>
                </ElFormItem>
                {/* <ElFormItem>
                  <ElButton onClick={handleReset}>重置</ElButton>
                </ElFormItem> */}
                {/* <ElFormItem>
                  <ElButton onClick={toggleExpand} link type='primary'>
                    <IconFont
                      name='double_arrow_down'
                      style={{ transform: `rotate(${expanded.value ? '180deg' : '0deg'})` }}
                      size={10}
                    />
                    {expanded.value ? '收起' : '展开'}
                  </ElButton>
                </ElFormItem> */}
              </div>
              {/* 第二行：受展开/收起控制 */}
              <Transition name='collapse'>
                {expanded.value && secondRowFields.value.length > 0 && (
                  <div class={styles.secondRow}>
                    {secondRowFields.value.map((field) => renderField(field))}
                  </div>
                )}
              </Transition>
            </ElForm>
          </div>
        </div>
        {props.showRefresh && (
          <div class={styles.rightSection}>
            <ElButton>
              <ElIcon class={styles.refreshIcon} onClick={handleQuery}>
                <RefreshRight />
              </ElIcon>
            </ElButton>
          </div>
        )}
      </div>
    )
  },
})
