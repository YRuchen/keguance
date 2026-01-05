import { h } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDataSourceListApi, getIndexListApi } from '~/api/logs/retrieval'
import { indexOptions } from './constants'

import type { ComputedRef } from 'vue'
import type { Form, Field } from '@formily/core'
import type { ISchema } from '@formily/vue'

const commonFormatter = (res) => (res.data?.list || [])?.map(v => ({ label: v.name, value: v.id }))
export const getLeftPaneSchema = (formRef: ComputedRef<Form>): ISchema => ({
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
                placeholder: '请选择数据源',
                fetchConfig: {
                  api: getDataSourceListApi,
                  formatter: commonFormatter,
                },
              },
              'x-reactions': [
                '{{fetchOptions}}',
                async (field: Field) => {
                  if (!field.selfModified) {
                    return
                  }
                  const indexIdField = field.query('.indexId')?.take() as Field
                  const indexTypeField = field.query('.indexType')?.take() as Field
                  const hasParams = indexTypeField.value && field.value
                  const options = hasParams
                    ? commonFormatter(
                        await getIndexListApi({
                          dataSourceId: field.value,
                          indexType: indexTypeField.value,
                        })
                      )
                    : []
                  indexIdField.value = ''
                  indexIdField.dataSource = options
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
                    const res = await getDataSourceListApi()
                    dataSourceIdField.dataSource = commonFormatter(res)
                  } catch (error: any) {
                    console.error(`数据源列表刷新失败，失败原因：${error}`)
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
                    placeholder: '请选择索引类型',
                  },
                  enum: indexOptions,
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
                    placeholder: '请选择索引',
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
                    const res = await getIndexListApi({
                      dataSourceId: dataSourceIdField.value,
                      indexType: indexTypeField.value,
                    })
                    dataSourceIdField.dataSource = commonFormatter(res)
                  } catch (error: any) {
                    console.error(`数据源列表刷新失败，失败原因：${error}`)
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
        queryCondition: {
          type: 'object',
          'x-component': 'FastFilter',
        },
      },
    },
  },
})
