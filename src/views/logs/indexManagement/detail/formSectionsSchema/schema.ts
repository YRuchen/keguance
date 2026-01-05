import { h } from 'vue'
import { cloneDeep } from 'lodash'
import { ElEmpty } from 'element-plus'
import { getDataSourceListApi, getRawIndexPrefixListApi, getLogSamplingList } from '~/api/logs/indexManagement'
import { CommonTable } from '~/KeepUp'
import { default as getAssertionSchema } from './assertions'
import { getColumns, RetentionDays, retentionDaysOptions } from '../constants'

import type { Ref } from 'vue'
import type { ISchema } from '@formily/json-schema'
import type { Field } from '@formily/core'

const assertionSchema = cloneDeep(getAssertionSchema({
  isView: false,
  titleSuffix: '条件',
}))
const commonLabelWidth = 115
const commonFormatter = (res) => (res?.data?.list || [])
  .map(v => ({ label: v.name, value: v.id }))
export const getSchema = (isEdit: Ref<boolean>): ISchema => ({
  type: 'object',
  properties: {
    readOnlyList: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {
          minHeight: '400px', // 设置最小高度，防止数据刷新时高度变化导致滚动位置跳转
        },
      },
      'x-component': CommonTable,
      'x-component-props': {
        columns: getColumns(),
      },
      'x-content': {
        empty: () => h(ElEmpty),
      },
    },
    dataSourceId: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '数据源',
        labelWidth: commonLabelWidth,
      },
      'x-component': 'Select',
      'x-component-props': {
        disabled: isEdit.value,
        filterable: true,
        clearable: true,
        placeholder: '请选择数据源',
        fetchConfig: {
          api: getDataSourceListApi,
          formatter: commonFormatter,
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
    templateName: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '索引模版名称',
        labelWidth: commonLabelWidth,
      },
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请填写索引模版名称',
      },
      'x-validator': (value: string) => {
        const regx = /^[a-z][a-z0-9-]*$/
        const fail = !regx.test(value)
        return fail ? '索引名称必须以字母开头，并且只能包含小写字母、数字或“-字符' : ''
      },
    },
    indexPrefix: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '原始索引前缀',
        labelWidth: commonLabelWidth,
      },
      'x-component': 'Select',
      'x-component-props': {
        filterable: true,
        clearable: true,
        placeholder: '请选择原始索引前缀',
      },
      'x-reactions': async (field: Field) => {
        try {
          const dataSourceField = field.query('dataSourceId')?.take() as Field
          if (!dataSourceField?.value) {
            return
          }
          const res = await getRawIndexPrefixListApi(dataSourceField?.value)
          field.dataSource = (res?.data?.list || []).map(v => ({ label: v, value: v }))
        } catch (error) {
          console.error('indexPrefix 获取数据源ID失败，失败原因:', error)
        }
      },
    },
    filterCondition: assertionSchema,
    retentionDays: {
      type: 'number',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '数据存储策略',
        labelWidth: commonLabelWidth,
      },
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择数据存储策略',
      },
      enum: retentionDaysOptions,
      default: RetentionDays['3天'],
    },
  },
})
