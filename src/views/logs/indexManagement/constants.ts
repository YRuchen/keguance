
import { h } from 'vue'
import { 
  ElButton, 
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElDropdown,
  ElIcon,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { 
  getIndexTemplateListApi,
  getRawIndexListApi,
  deleteIndexTemplateApi,
} from '~/api/logs/indexManagement'
import { CommonPage, Space } from '~/KeepUp'
import { getIndexTemplateFields, getRawIndexFields } from './fields'

import type { Ref } from 'vue'
import type { ISchema } from '@formily/json-schema'
import type { IExpose } from '~/KeepUp'
import type { IGetIndexTypeOptionsParams } from './interfaces'

/** 索引类型 */
export enum IndexType {
  /** 索引模版 */
  INDEX_TEMPLATE = 'INDEX_TEMPLATE',
  /** 原生索引 */
  RAW_INDEX = 'RAW_INDEX',
}

/** 批量操作 */
export const batchActions = (commonPageRef: Ref<IExpose>) => ([
  {
    label: '批量删除',
    onClick: async (selectedKeys: string[]) => {
      try {
        if (!selectedKeys.length) {
          ElMessage.warning('请至少选择一条数据')
          return
        }
        await ElMessageBox.confirm(
          '删除后无法恢复，确认删除吗?',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        await deleteIndexTemplateApi({ templateIds: selectedKeys })
        ElMessage.success('删除成功')
        commonPageRef.value?.query?.()
      } catch (error: any) {
        console.log(`删除失败，失败原因：${error}`)
      }
    },
  },
])

/** 索引类型 */
export const getIndexTypeOptions = ({
  router, commonPageRef1, commonPageRef2, selectedKeys, commonModalRef, formRef, isView,
}: IGetIndexTypeOptionsParams): (ISchema & { label: string })[] => ([
  { 
    label: '索引模版',
    name: IndexType.INDEX_TEMPLATE,
    'x-component': CommonPage,
    'x-component-props': {
      fields: getIndexTemplateFields(router, commonPageRef1),
      listApi: getIndexTemplateListApi,
      selectable: true,
      needPagination: true,
      filterColumns: 4,
      refreshable: true,
      rowKey: 'templateId',
      pageKey: 'indexTemplatePage',
    },
    'x-content': {
      setterPrefix: () => h(
        Space,
        {},
        [
          h(
            ElButton, 
            {
              type: 'primary',
              onClick: () => { router.push({ name: 'IndexManagementCreate', query: { type: 'create' } }) },
            }, 
            '新增',
          ),
          h(
            ElDropdown, 
            {}, 
            {
              default: () => h(
                ElButton,
                { type: 'primary' },
                {
                  default: () => ([
                    '批量操作',
                    h(
                      ElIcon,
                      { class: 'el-icon--right' },
                      {
                        default: () => h(ArrowDown),
                      }),
                  ]),
                },
              ),
              dropdown: () => h(
                ElDropdownMenu,
                {},
                {
                  default: () => batchActions(commonPageRef1)?.map(v => (
                    h(
                      ElDropdownItem,
                      {
                        onClick: () => {
                          v.onClick?.(selectedKeys.value)
                        }
                      },
                      v.label,
                    )
                  ))
                }
              ),
            },
          ),
        ]
      ),
      commonTableEmpty: () => h(ElEmpty, { description: '暂无数据，请创建索引' }),
    },
  },
  { 
    label: '原生索引',
    name: IndexType.RAW_INDEX,
    'x-component': CommonPage,
    'x-component-props': {
      fields: getRawIndexFields(commonModalRef, formRef, isView, commonPageRef2, router),
      listApi: getRawIndexListApi,
      needPagination: true,
      filterColumns: 4,
      pageKey: 'rawIndexPage',
    },
    'x-content': {
      setterPrefix: () => h(
        Space,
        {},
        [
          h(
            ElButton, 
            {
              type: 'primary',
              onClick: () => {
                commonModalRef.value?.open()
                isView.value = false
              },
            },
            '新增原始索引',
          ),
        ]
      ),
      commonTableEmpty: () => h(ElEmpty, { description: '暂无数据，请创建索引' }),
    },
  },
])
