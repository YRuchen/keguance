import { h } from 'vue'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { deleteChatIdAPi, deleteTokenAPi } from '~/api/configManagement/notifierManagement'
import { Space } from '~/KeepUp'

import type { Ref } from 'vue'
import type { IField, IExpose } from '~/KeepUp'

const commonDelete = async (
  deleteApi: (id: string) => Promise<any>,
  id: string,
  commonPageRef: Ref<IExpose>,
) => {
  try {
    await ElMessageBox.confirm(
      '删除后无法恢复，确认删除吗?',
      '确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await deleteApi(id)
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    commonPageRef.value?.query()
  } catch (error: any) {
    console.error(`删除失败，失败原因：${error}`)
  }
}
export const getChatIdFields = (commonPageRef: Ref<IExpose>): IField[] => ([
  {
    prop: 'name',
    label: 'telegram群名称',
    isColumn: true,
    columnConfig: {
      minWidth: 180,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'chatId',
    label: 'Chat ID',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'creator',
    label: '创建人',
    isColumn: true,
    columnConfig: {
      width: 120,
    },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
      width: 60,
      fixed: 'right',
      render({ rowData }) {
        return h(Space, {
          size: 0,
          justify: 'start',
        }, [
          h(ElButton, {
            type: 'primary',
            link: true,
            onClick: async (e: Event) => {  
              e.stopPropagation()
              commonDelete(
                deleteChatIdAPi,
                rowData.id,
                commonPageRef,
              )
            }
          }, '删除')
        ])
      },
    },
  },
])

export const getTokenFields = (commonPageRef: Ref<IExpose>): IField[] => ([
  {
    prop: 'name',
    label: '机器人名称',
    isColumn: true,
    columnConfig: {
      minWidth: 180,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'token',
    label: 'Token',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
    isEdit: true,
    editConfig: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'creator',
    label: '创建人',
    isColumn: true,
    columnConfig: {
      width: 120,
    },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    isColumn: true,
    columnConfig: {
      width: 180,
    },
  },
  {
    prop: 'operation',
    label: '操作',
    isColumn: true,
    columnConfig: {
    width: 60,
    fixed: 'right',
    render: ({ rowData }) => h(
      Space,
      { size: 0, justify: 'start' },
        [
          h(
            ElButton,
            {
              type: 'primary',
              link: true,
              onClick: async (e: Event) => {
                e.stopPropagation()
                commonDelete(
                  deleteTokenAPi,
                  rowData.id,
                  commonPageRef,
                )
              },
            },
            '删除'
          )
        ]
      ),
    },
  },
])
