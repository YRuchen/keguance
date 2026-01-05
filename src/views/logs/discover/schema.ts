import { h } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDatasourceUseList } from '~/api/configManagement/dataSource'
import { getIndexList } from '~/api/logs/discover'
import { indexOptions } from '../retrieval/constants'

import type { ComputedRef } from 'vue'
import type { Form, Field } from '@formily/core'
import type { ISchema } from '@formily/vue'

const commonFormatter = (res) => (res.data?.list || [])?.map(v => ({ label: v.name || v.indexName, value: v.id || v.indexName }))

export const getDataSourceIndexSchema = (formRef: ComputedRef<Form>, onIndexChange: (indexName: string) => void): ISchema => ({
  type: 'object',
  properties: {
    void: {
      type: 'void',
      'x-component': 'KeepUpSpace',
      'x-component-props': {
        fill: true,
        direction: 'column',
      },
      properties: {
        selectGroup1: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': {
            fill: true,
          },
          properties: {
            dataSourceId: {
              type: 'string',
              required: true,
              'x-component': 'Select',
              'x-component-props': {
                style: {
                  width: '100%',
                },
                clearable: true,
                filterable: true,
                placeholder: '请选择数据源',
                fetchConfig: {
                  api: getDatasourceUseList,
                  formatter: commonFormatter,
                },
              },
              'x-reactions': [
                '{{fetchOptions}}',
                async (field: Field) => {
                  // 数据源列表加载后，自动选中第一条
                  if (field.dataSource && field.dataSource.length > 0 && !field.value) {
                    field.value = field.dataSource[0].value
                  }
                  
                  if (!field.selfModified) {
                    return
                  }
                  const indexIdField = field.query('.indexId')?.take() as Field
                  const indexTypeField = field.query('.indexType')?.take() as Field
                  const hasParams = indexTypeField.value && field.value
                  const options = hasParams
                    ? commonFormatter(
                        await getIndexList({
                          dataSourceId: field.value,
                          indexType: indexTypeField.value,
                        } as any)
                      )
                    : []
                  indexIdField.value = ''
                  indexIdField.dataSource = options
                  // 索引列表加载后，自动选中第一条
                  if (options && options.length > 0) {
                    indexIdField.value = options[0].value
                  }
                },
              ],
            },
            refreshBtn: {
              type: 'void',
              'x-component': 'ElButton',
              'x-component-props': {
                onClick: async () => {
                  const dataSourceIdField = formRef.value.query('void.selectGroup1.dataSourceId')?.take() as Field
                  const refreshBtnField = formRef.value.query('void.selectGroup1.refreshBtn')?.take() as Field
                  try {
                    dataSourceIdField.disabled = true
                    refreshBtnField.setComponentProps({ loading: true })
                    const res = await getDatasourceUseList()
                    const options = commonFormatter(res)
                    dataSourceIdField.dataSource = options
                    // 刷新后自动选中第一条
                    if (options && options.length > 0) {
                      dataSourceIdField.value = options[0].value
                    }
                  } catch (error: any) {
                    console.error(`数据源列表刷新失败，失败原因：${error}`)
                    ElMessage.error('刷新数据源列表失败')
                  } finally {
                    dataSourceIdField.disabled = false
                    refreshBtnField.setComponentProps({ loading: false })
                  }
                },
              },
              'x-content': {
                icon: () => h(Refresh),
              },
            },
          },
        },
        selectGroup2: {
          type: 'void',
          'x-component': 'KeepUpSpace',
          'x-component-props': {
            fill: true,
          },
          properties: {
            indexGroup: {
              type: 'void',
              'x-component': 'KeepUpSpace',
              'x-component-props': {
                fill: true,
              },
              properties: {
                indexType: {
                  type: 'string',
                  required: true,
                  'x-component': 'Select',
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    clearable: true,
                    filterable: true,
                    placeholder: '请选择索引类型',
                  },
                  enum: indexOptions,
                  default: indexOptions.find(opt => opt.label === '原始索引')?.value,
                  'x-reactions': async (field: Field) => {
                    const dataSourceIdField = field.query('../../selectGroup1.dataSourceId')?.take() as Field
                    const indexIdField = field.query('.indexId')?.take() as Field
                    if (!dataSourceIdField || !indexIdField) {
                      return
                    }
                    const hasParams = dataSourceIdField?.value && field.value
                    if (hasParams) {
                      const options = commonFormatter(
                        await getIndexList({
                          dataSourceId: dataSourceIdField.value,
                          indexType: field.value,
                        } as any)
                      )
                      indexIdField.dataSource = options
                      indexIdField.value = ''
                      // 索引列表加载后，自动选中第一条
                      if (options && options.length > 0) {
                        indexIdField.value = options[0].value
                      }
                    } else {
                      indexIdField.dataSource = []
                      indexIdField.value = ''
                    }
                  },
                },
                indexId: {
                  type: 'string',
                  required: true,
                  'x-component': 'Select',
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    clearable: true,
                    filterable: true,
                    placeholder: '请选择索引',
                  },
                  'x-reactions': async (field: Field) => {
                    // 索引列表加载后，自动选中第一条
                    if (field.dataSource && field.dataSource.length > 0 && !field.value) {
                      field.value = field.dataSource[0].value
                    }
                  },
                },
              },
            },
            refreshBtn: {
              type: 'void',
              'x-component': 'ElButton',
              'x-component-props': {
                onClick: async () => {
                  const dataSourceIdField = formRef.value.query('void.selectGroup1.dataSourceId')?.take() as Field
                  const indexTypeField = formRef.value.query('void.selectGroup2.indexGroup.indexType')?.take() as Field
                  const hasParams = dataSourceIdField?.value && indexTypeField?.value
                  if (!hasParams) {
                    ElMessage.warning('请先选择数据源和索引')
                    return
                  }
                  const refreshBtnField = formRef.value.query('void.selectGroup2.refreshBtn')?.take() as Field
                  const indexIdField = formRef.value.query('void.selectGroup2.indexGroup.indexId')?.take() as Field
                  try {
                    indexIdField.disabled = true
                    refreshBtnField.setComponentProps({ loading: true })
                    const res = await getIndexList({
                      dataSourceId: dataSourceIdField.value,
                      indexType: indexTypeField.value,
                    } as any)
                    const options = commonFormatter(res)
                    indexIdField.dataSource = options
                    // 刷新后自动选中第一条
                    if (options && options.length > 0) {
                      indexIdField.value = options[0].value
                    }
                  } catch (error: any) {
                    console.error(`索引列表刷新失败，失败原因：${error}`)
                    ElMessage.error('刷新索引列表失败')
                  } finally {
                    indexIdField.disabled = false
                    refreshBtnField.setComponentProps({ loading: false })
                  }
                },
              },
              'x-content': {
                icon: () => h(Refresh),
              },
            },
          },
        },
      },
    },
  },
})
