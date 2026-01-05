import { getFrequencyApi, TaskType } from '~/api/domainManagement/common'
import { getChatIdListApi, getTokenListApi } from  '~/api/configManagement/notifierManagement'
import { noticeChannelOptions, NoticeChannel } from '../../../common/constants'

import type { ISchema } from '@formily/vue'
import type { ICommonObj, ICommonGetListRes } from '~/KeepUp'

const getSchema = ({ formRef, isEdit }): ISchema => ({
  type: 'object',
  properties: {
    inspectName: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务名称',
        labelWidth: 100,
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入任务名称',
        clearable: true,
      },
    },
    domain: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '监控对象',
        labelWidth: 100,
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入baidu.com的域名格式',
        clearable: true,
        disabled: isEdit.value,
      },
    },
    whiteList: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '白名单',
        labelWidth: 100,
      },
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '可填写多个白名单域名，用‘空格’隔开',
        clearable: true,
      },
    },
    nodes: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '监控节点',
        labelWidth: 100,
      },
      'x-component': 'CommonLocations',
      'x-component-props': {
        placeholder: '请选择',
        clearable: true,
      },
      'x-reactions': '{{ fetchOptions }}',
    },
    frequencyId: {
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '监测频率',
        labelWidth: 100,
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        fetchConfig: {
          api: getFrequencyApi,
          params: () => TaskType.TASK_TYPE_HIJACK,
          formatter: (res: Record<'list', ICommonObj[]>) => {
            return (res.list || []).map(v => ({ label: v.label, value: v.id }))
          },
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
    noticeMode: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '通知渠道',
        labelWidth: 100,
      },
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择',
        disabled: true,
        multiple: true,
        clearable: true,
      },
      default: [NoticeChannel.TELEGRAM],
      enum: noticeChannelOptions,
    },
    chatId: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'Chat ID',
        labelWidth: 100,
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
        labelWidth: 100,
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
    taskStatus: {
      type: 'boolean',
      required: true,
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '任务状态',
        labelWidth: 100,
      },
      'x-component': 'Switch',
      'x-component-props': {
        activeText: '启用',
        inactiveText: '禁用',
      },
      default: true,
    },
  }
})

export default getSchema
