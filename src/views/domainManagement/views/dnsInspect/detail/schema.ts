import { getFrequencyApi, TaskType } from '~/api/domainManagement/common'
import { getChatIdListApi, getTokenListApi } from  '~/api/configManagement/notifierManagement'
import { getProjectsApi } from '~/api/domainManagement/sslInspect'
import { formatNodes, getNodesApi } from '~/api/domainManagement/common'
import { noticeChannelOptions, NoticeChannel } from '../../../common/constants'

import type { Field } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { IFetchConfig } from '~/interfaces/commonPage'
import type { ILocationItem } from '~/api/domainManagement/dnsInspect/interfaces'
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
        fetchConfig: {
          api: getNodesApi,
          formatter: (list: Record<string, ILocationItem[]>[]) => {
            try {
              const result = list.reduce((initVal, curItem) => {
                const formattedCurItem = (Object.entries(curItem)?.[0]?.[1] || []).map((v1: ILocationItem) => ({
                  /** 节点id */
                  nodeId: v1.nodeId,
                  /** 所属地区id */
                  regionId: v1.region,
                  /** 所属地区名称 */
                  regionName: v1.region,
                  /** 所属省份 */
                  subdivision: v1.region,
                  /** 所属城市 */
                  city: v1.nodeName,
                  /** 运营商唯一标识 */
                  asn: v1.ispCode,
                  /** 运营商 */
                  ispName: v1.ispName,
                  /** 用于前端友好展示的区域名称，比如：浙江杭州电信 */
                  friendlyArea: `${v1.nodeName}`,
                }))
                initVal = [...initVal, ...formattedCurItem]
                return initVal
              }, [])
              const nodesField = formRef.value.formRef.query('nodes')?.take() as Field
              nodesField.setComponentProps({
                ...(nodesField.componentProps || {}),
                options: result || [],
              })
              return result
            } catch (error: any) {
              console.error(`【节点】数据格式转换失败，失败原因：${error}`)
            }
          }
        } as IFetchConfig,
      },
      'x-reactions': '{{ fetchOptions }}',
    },
    // project: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-decorator-props': {
    //     label: '归属项目',
    //     labelWidth: 100,
    //   },
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     placeholder: '请选择',
    //     clearable: true,
    //     fetchConfig: {
    //       api: getProjectsApi,
    //       formatter: (res) => (res?.data?.list || []).map((v: Record<string, string>) => ({
    //         label: v.name,
    //         value: v.id,
    //       })),
    //     }
    //   },
    //   'x-reactions': '{{ fetchOptions }}',
    // },
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
          params: () => TaskType.TASK_TYPE_DNS,
          formatter: (res: Record<'list', ICommonObj[]>) => (res.list || []).map(v => ({ label: v.label, value: v.id })),
        },
      },
      'x-reactions': '{{fetchOptions}}',
    },
    noticeMode: {
      type: 'string',
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
      default: false,
    },
  }
})

export default getSchema
