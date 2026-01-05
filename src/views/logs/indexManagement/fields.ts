import { h, nextTick } from 'vue'
import { isEmpty } from 'lodash'
import { ElLink, ElMessageBox, ElMessage } from 'element-plus'
import { 
  getDataSourceListApi,
  deleteIndexTemplateApi,
  getIndexTemplateCreatorListApi,
  getRawIndexCreatorListApi,
  deleteRawIndexApi,
} from '~/api/logs/indexManagement'
import { CommonJsonPretty } from '~/KeepUp'

import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { Form } from '@formily/core'
import type { IField, ICommonModalExpose, IExpose } from '~/KeepUp'

const commonFormatter = (res) => (res?.data?.list || []).map(v => ({ label: v.name, value: v.id }))
/** 索引模版 */
export const getIndexTemplateFields = (router: Router, commonPageRef1: Ref<IExpose>): IField[] => ([
  {
    prop: 'keyword',
    label: '索引模板名称',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入索引模板名称',
        clearable: true,
      },
    },
  },
  {
    prop: 'dataSourceId',
    label: '数据源',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择数据源',
        clearable: true,
      },
    },
    // TOOD: 补充
    fetchConfig: {
      api: getDataSourceListApi,
      formatter: commonFormatter,
    },
  },
  {
    prop: 'creatorId',
    label: '创建人',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择创建人',
        clearable: true,
      },
    },
    fetchConfig: {
      api: getIndexTemplateCreatorListApi,
      formatter: commonFormatter,
    },
  },
  {
    prop: 'templateName',
    label: '索引模板名称',
    isColumn: true,
    columnConfig: { minWidth: 160 },
  },
  {
    prop: 'indexPrefix',
    label: '原始索引前缀',
    isColumn: true,
    columnConfig: { minWidth: 140 },
  },
  {
    prop: 'dataSourceName',
    label: '数据源',
    isColumn: true,
    columnConfig: { width: 160 },
  },
  {
    prop: 'filterCondition',
    label: '过滤条件',
    isColumn: true,
    columnConfig: { 
      minWidth: 300,
      render: ({ rowData }) => h(
        'div',
        {
          style: {
            maxHeight: '150px',
            overflowY: 'auto',
          },
        },
        h(
          CommonJsonPretty,
          {
            data: isEmpty(rowData.filterCondition) ? '暂无结果' : rowData.filterCondition,
            deep: 0,
          },
        ),
      ),
    },
  },
  {
    prop: 'retentionDays',
    label: '存储策略（天）',
    isColumn: true,
    columnConfig: { width: 140 },
  },
  {
    prop: 'visibilityScope',
    label: '权限配置',
    isColumn: true,
    columnConfig: { width: 140 },
  },
  {
    prop: 'creator',
    label: '创建人',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'updateTime',
    label: '最近更新时间',
    isColumn: true,
    columnConfig: { width: 180 },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 220,
      fixed: 'right',
      render({ rowData }) {
        return h(
          'div',
          { style: { display: 'flex', gap: '8px' } },
          [
            h(
              ElLink,
              { 
                type: 'primary', 
                onClick: () => {
                  router.push({ name: 'IndexManagementEdit', query: { id: rowData.templateId, type: 'edit' } })
                },
              },
              '编辑',
            ),
            h(
              ElLink,
              { 
                type: 'danger', 
                onClick: async () => {
                  try {
                    await ElMessageBox.confirm(
                      '删除后无法恢复，确认删除吗?',
                      '删除提示',
                      {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                      },
                    )
                    await deleteIndexTemplateApi({ templateIds: [rowData.templateId] })
                    ElMessage.success('删除成功')
                    await commonPageRef1.value?.query?.()
                  } catch (error: any) {
                    console.error(`删除失败，失败原因：${error}`)
                  }
                },
              },
              '删除',
            ),
            h(
              ElLink,
              { 
                type: 'primary', 
                onClick: () => {
                  // 跳转到日志检索页，携带参数
                  const query: Record<string, any> = {
                    dataSourceId: rowData.dataSourceId,
                    indexId: rowData.templateId,
                    indexType: 'SEARCH_INDEX_TYPE_TEMPLATE',
                  }
                  router.push({ 
                    name: 'discover',
                    query
                  })
                },
              },
              '查看日志',
            ),
          ],
        )
      },
    },
  },
])

/** 原始索引 */
export const getRawIndexFields = (
  commonModalRef: Ref<ICommonModalExpose>, 
  formRef: Ref<Form>, 
  isView: Ref<boolean>,
  commonPageRef2: Ref<IExpose>,
  router: Router,
): IField[] => ([
  {
    prop: 'keyword',
    label: '索引名称',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入索引名称',
        clearable: true,
      },
    },
  },
  {
    prop: 'dataSourceId',
    label: '数据源名称',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择数据源',
        clearable: true,
      },
    },
    fetchConfig: {
      api: getDataSourceListApi,
      formatter: commonFormatter,
    },
  },
  {
    prop: 'creatorId',
    label: '创建人',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择创建人',
        clearable: true,
      },
    },
    fetchConfig: {
      api: getRawIndexCreatorListApi,
      formatter: commonFormatter,
    },
  },
  {
    prop: 'indexName',
    label: '索引名称',
    isColumn: true,
    columnConfig: { minWidth: 160 },
  },
  {
    prop: 'dataSourceName',
    label: '数据源名称',
    isColumn: true,
    columnConfig: { width: 160 },
  },
  {
    prop: 'numberOfShards',
    label: '索引分片数',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'numberOfReplicas',
    label: '副本数量',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'creator',
    label: '创建人',
    isColumn: true,
    columnConfig: { width: 120 },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    isColumn: true,
    columnConfig: { width: 180 },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 220,
      fixed: 'right',
      render({ rowData }) {
        return h(
          'div',
          { style: { display: 'flex', gap: '8px' } },
          [
            h(
              ElLink,
              {
                type: 'danger',
                onClick: async () => {
                  try {
                    await ElMessageBox.confirm(
                      '删除后无法恢复，确认删除该索引吗?',
                      '删除提示',
                      {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                      },
                    )
                    await deleteRawIndexApi({ indexIds: [rowData.indexId] })
                    ElMessage.success('删除成功')
                    await commonPageRef2.value?.query?.()
                  } catch (error: any) {
                    console.error(`删除失败，原因：${error}`)
                  }
                },
              },
              '删除',
            ),
            h(
              ElLink,
              {
                type: 'primary',
                onClick: async () => {
                  commonModalRef.value?.open()
                  isView.value = true
                  await nextTick()
                  formRef.value.values = rowData
                  formRef.value.readPretty = true
                },
              },
              '详情',
            ),
            h(
              ElLink,
              {
                type: 'primary',
                onClick: () => {
                  // 跳转到日志检索页，携带参数
                  const query: Record<string, any> = {
                    dataSourceId: rowData.dataSourceId,
                    indexId: rowData.indexId,
                    indexType: 'SEARCH_INDEX_TYPE_ORIGINAL',
                  }
                  router.push({ 
                    name: 'discover',
                    query
                  })
                },
              },
              '查看日志',
            ),
          ],
        )
      },
    },
  },
])
