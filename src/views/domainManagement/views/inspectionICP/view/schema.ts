import { getFrequencyApi, TaskType } from '~/api/domainManagement/common'
import { getChatIdListApi, getTokenListApi } from  '~/api/configManagement/notifierManagement'
import { noticeChannelOptions } from '../../../common/constants'

import type { ISchema } from '@formily/vue'
import type { ICommonObj, ICommonGetListRes } from '~/KeepUp'

export const getSchema = (): ISchema => ({
  type: 'void',
  properties: {
    inspectName: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务名称',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
    domain: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '监控对象',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入baidu.com的域名格式',
      },
    },
    taskStatus: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务状态',
      },
      'x-component': 'Switch',
      'x-component-props': {
        placeholder: '请选择',
        activeText: '启用',
        inactiveText: '禁用',
      },
    },
    frequencyId: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '监测频率',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        fetchConfig: {
          api: getFrequencyApi,
          params: () => TaskType.TASK_TYPE_ICP,
          formatter: (res: Record<'list', ICommonObj[]>) => {
            return (res?.list || []).map(v => ({ label: v.label, value: v.id }))
          },
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
    noticeMode: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '通知渠道',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        multiple: true,
        clearable: true,
      },
      enum: noticeChannelOptions,
    },
    chatId: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'Chat ID',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择 Chat ID',
        fetchConfig: {
          api: getChatIdListApi,
          formatter: (res: ICommonGetListRes<ICommonObj[]>) => {
            return (res.list || []).map(v => ({
              label: v.name,
              value: v.id,
            }))
          },
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
    chatToken: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'Token',
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择 Token',
        fetchConfig: {
          api: getTokenListApi,
          formatter: (res: ICommonGetListRes<ICommonObj[]>) => {
            return (res.list || []).map(v => ({
              label: v.name,
              value: v.id,
            }))
          },
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
  },
})
