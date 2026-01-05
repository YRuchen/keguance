import { h } from 'vue'
import { ElText } from 'element-plus'
import { Protocol, taskResultStatusMap, taskResultStatusStyleMap } from '~/api/availabilityMonitoring/constants'
import { BasicTabs, basicTabsMap } from '~/views/availabilityMonitoring/detail/formSectionsSchema/defineRequest/constants'
import { AssertionTypeToResMap } from '../detail/formSectionsSchema/constants'
import { AssertionType } from '../detail/constants'
import { tcpTimeLabelMap } from './constants'

import type { Field } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { IGetSchemaParams } from './interfaces'

const formatNumberToString = (field: Field, isTime: boolean = false) => {
  field.value = (!field.value && field.value !== 0) ? '' : `${field.value}${isTime ? 'ms' : ''}`
}
const commonLabelStyle = {
  fontWeight: 'bold',
  color: '#000',
  fontSize: '16px',
}
const getSchema = ({
  protocol, 
  showFailReason,
  failSummary,
  isPassed,
  checkType,
}: IGetSchemaParams): ISchema['properties'] => {
  const isBehavior = checkType === BasicTabs.BEHAVIOR_CHECK && protocol === Protocol.GRPC
  const isHealth = checkType === BasicTabs.HEALTH_CHECK && protocol === Protocol.GRPC
  return {
    taskSummaryTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '任务执行概览',
        labelWidth: 130,
        colon: false,
        style: commonLabelStyle,
      }
    },
    /** 任务执行概览 */
    basicData: {
      type: 'object',
      'x-decorator': 'FormGrid',
      'x-decorator-props': {
        maxColumns: 3,
        minColumns: 3,
      },
      properties: {
        /** 执行结果 【全部】 */
        resultStatus: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '执行结果',
          },
          'x-component': 'ElTag',
          'x-component-props': {
            type: 'danger',
          },
          'x-reactions': (field: Field) => {
            field.setContent({
              default: `${taskResultStatusMap[field.value]}${failSummary ? `（${failSummary}）` : ''}`,
            })
            field.setComponentProps({
              ...(field.componentProps || {}),
              type: taskResultStatusStyleMap[field.value]
            })
          },
        },
        /** 总耗时 【全部】 */
        duration: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '总耗时',
          },
          'x-component': 'PreviewText.Input',
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** URL 【http】 */
        url: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'URL',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.WEBSOCKET].includes(protocol),
        },
        /** 解析URL 【http】 */
        resolvedUrl: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析URL',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.HTTP,
        },
        /** host 【tcp/udp/grpc/ssl/dns】 */
        host: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: protocol === Protocol.DNS ? '域名' : '监测地址',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.TCP, Protocol.UDP, Protocol.SSL, Protocol.DNS].includes(protocol) || isBehavior || isHealth,
        },
        /** 端口号 【tcp/udp/grpc/ssl】 */
        port: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '端口号',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.TCP, Protocol.UDP, Protocol.SSL, Protocol.DNS].includes(protocol) || isBehavior || isHealth,
        },
        /** 检查类型 【grpc】 */
        checkType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '检查类型',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': isBehavior || isHealth,
          'x-reactions': (field: Field) => {
            field.value = basicTabsMap[field.value]?.label
          },
        },
        /** 服务名 【grpc】 */
        serviceName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '服务名',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': isHealth,
        },
        /** 服务定义 【grpc】 */
        serviceDefinitionType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '服务定义',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': isBehavior,
        },
        /** 调用方法 【grpc】 */
        method: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '调用方法',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': isBehavior,
        },
        /** 解析地址 【tcp/udp/grpc/ssl】 */
        resolvedAddress: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析地址',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.TCP, Protocol.UDP, Protocol.SSL].includes(protocol) || isBehavior || isHealth,
        },
        /** DNS服务器 【http/grpc/ssl/dns】【tcp/udp 该字段后端给值则展示，无值不展示】 */
        dnsServer: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'DNS服务器',
          },
          'x-component': 'PreviewText.Input',
          'x-reactions': (field: Field) => {
            if ([Protocol.HTTP, Protocol.SSL, Protocol.DNS, Protocol.WEBSOCKET].includes(protocol) || isBehavior || isHealth) {
              field.visible = true
            } else if ([Protocol.TCP, Protocol.UDP].includes(protocol) && field.value) {
              field.visible = true
            } else {
              field.visible = false
            }
          },
        },
        /** 解析时间 【dns】 */
        resolveTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析时间',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.DNS].includes(protocol),
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** 最终解析域名 */
        resolvedDomain: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '最终解析域名',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.DNS].includes(protocol),
        },
        /** 解析IP 【http/tcp/udp/grpc/ssl】 */
        resolvedIpAddress: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析IP',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.TCP, Protocol.UDP, Protocol.GRPC, Protocol.SSL, Protocol.WEBSOCKET].includes(protocol),
        },
        /** 解析端口号 【ssl】 */
        resolvedPort: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '解析端口号',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.SSL].includes(protocol),
        },
        /** HTTP版本 【http】 */
        httpVersion: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'HTTP版本',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.HTTP,
        },
      },
    },
    /** 请求失败原因 【仅超时展示】 */
    reasonTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-content': () => h(ElText, { type: 'danger' }, '请求失败原因'),
      'x-visible': showFailReason,
    },
    reason: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'PreviewText.Input',
      'x-visible': showFailReason,
    },
    durationInfoTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '耗时分析',
        colon: false,
        style: commonLabelStyle,
      },
      /** 【HTTP, TCP, UDP, GRPC, SSL】 */
      'x-visible': [Protocol.HTTP, Protocol.TCP, Protocol.UDP, Protocol.GRPC, Protocol.SSL, Protocol.WEBSOCKET].includes(protocol),
    },
    /** 耗时分析 */
    durationInfo: {
      type: 'object',
      'x-decorator': 'FormGrid',
      'x-decorator-props': {
        maxColumns: 3,
        minColumns: 3,
      },
      properties: {
        /** DNS解析耗时 【http/grpc/ssl】【tcp/udp 该字段后端给值则展示，无值不展示】 */
        dnsTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'DNS解析耗时',
            labelWidth: 150,
          },
          'x-component': 'PreviewText.Input',
          'x-reactions': (field: Field) => {
            formatNumberToString(field, true)
            if ([Protocol.HTTP, Protocol.SSL, Protocol.WEBSOCKET].includes(protocol) || isBehavior || isHealth) {
              field.visible = true
            } else if ([Protocol.TCP, Protocol.UDP].includes(protocol) && field.value) {
              field.visible = true
            } else {
              field.visible = false
            }
          },
        },
        /** 建连耗时（connection）【http/tcp/grpc】 */
        tcpTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: tcpTimeLabelMap[protocol] || '建连耗时（connection）',
            labelWidth: 190,
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.TCP, Protocol.SSL, Protocol.WEBSOCKET].includes(protocol) || isBehavior || isHealth,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** RPC耗时【grpc】 */
        rpcTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'RPC调用耗时',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': isBehavior || isHealth,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** SSL握手耗时 【http】 */
        sslTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'SSL握手耗时',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.WEBSOCKET].includes(protocol),
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** TLS握手耗时 【ssl】 */
        tlsTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'TLS握手耗时',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.SSL,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** 首字节时间（time to first byte）【http/超时】 */
        timeToFirstByte: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '首字节时间（time to first byte）',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.WEBSOCKET].includes(protocol),
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** 下载耗时 【http】 */
        downloadTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '下载耗时',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': [Protocol.HTTP, Protocol.WEBSOCKET].includes(protocol),
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** 收发UDP包耗时 【udp】 */
        udpRoundTripTime: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '收发UDP包耗时（message exchange）',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.UDP,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** WebSocket连接建立完成时间 */
        wsConnectedAt: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'WebSocket连接建立完成时间',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.WEBSOCKET,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
        /** WebSocket首次响应接收时间 */
        wsFirstResponseAt: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'WebSocket首次响应接收时间',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.WEBSOCKET,
          'x-reactions': (field: Field) => formatNumberToString(field, true),
        },
      },
    },
    /** 任务结果判断条件 全 */
    resultConfigTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '任务结果判断条件',
        labelWidth: 230,
        colon: false,
        style: commonLabelStyle,
      },
      'x-reactions': (field: Field) => {
        const resultConfig = field.query('.resultConfig')?.get('value')
        field.visible = resultConfig?.length
      },
    },
    /** 任务结果判断条件 */
    resultConfig: {
      type: 'array',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 5,
          minColumns: 5,
        },
        properties: {
          grid: {
            type: 'void',
            'x-decorator': 'FormGrid.GridColumn',
            'x-decorator-props': {
              gridSpan: 2,
            },
            properties: {
              condition: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '设置条件',
                },
                'x-component': 'PreviewText.Input',
              },
            },
          },
          type: {
            type: 'string',
            'x-display': 'hidden',
          },
          grid2: {
            type: 'void',
            'x-decorator': 'FormGrid.GridColumn',
            'x-decorator-props': {
              gridSpan: 3,
            },
            properties: {
              value: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  label: '实际值',
                },
                'x-component': 'PreviewText.Input',
                'x-reactions': (field: Field) => {
                  const type = field.query('.type')?.get('value')
                  const responseContent = field.form.query('responseContent')?.get('value')
                  if (type === AssertionType.RESPONSE_BODY) {
                    field.setComponent('PreviewModal')
                    field.setComponentProps({
                      title: '查看全部响应体',
                      content: responseContent,
                    })
                  }
                }
              },
            },
          },
        }
      }
    },
    /** 请求详情 --title-- */
    requestTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '请求详情',
        colon: false,
        style: commonLabelStyle,
      },
      'x-visible': [Protocol.SSL, Protocol.UDP, Protocol.WEBSOCKET].includes(protocol) || isBehavior || isHealth, 
    },
    /** 请求详情 */
    request: {
      type: 'object',
      properties: {
        /** 服务器名称 【ssl】 */
        serverName: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '服务器名称（SNI）',
            labelWidth: 140,
            layout: 'vertical',
            labelAlign: 'left',
          },
          'x-component': 'Input',
          'x-component-props': {
            readonly: true,
          },
          'x-visible': [Protocol.SSL].includes(protocol),
        },
        /** 请求消息体 */
        content: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: [Protocol.UDP].includes(protocol)
              ? '发送的udp数据内容'
              : '请求消息体',
            labelWidth: 140,
            layout: 'vertical',
            labelAlign: 'left',
          },
          'x-component': 'CommonJsonPretty',
          'x-visible': [Protocol.UDP].includes(protocol) || isBehavior,
        },
        /** grpc请求元数据 */
        metadata: {
          type: 'object',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'grpc请求元数据',
            layout: 'vertical',
            labelWidth: 160,
            labelAlign: 'left',
          },
          'x-component': 'CommonJsonPretty',
          'x-visible': isBehavior || isHealth,
        },
        /** websocket测试消息 */
        message: {
          type: 'object',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '测试消息',
            layout: 'vertical',
            labelWidth: 160,
            labelAlign: 'left',
          },
          'x-component': 'CommonJsonPretty',
          'x-visible': [Protocol.WEBSOCKET].includes(protocol),
        },
      },
    },
    /** 响应详情 */
    responseTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '响应详情',
        colon: false,
        style: commonLabelStyle,
      },
      /** 【HTTP, TCP, UDP, GRPC, SSL, WEBSOCKET】 */
      'x-visible': [Protocol.HTTP, Protocol.TCP, Protocol.UDP, Protocol.GRPC, Protocol.SSL, Protocol.WEBSOCKET].includes(protocol),
    },
    response: {
      type: 'object',
      'x-decorator': 'FormGrid',
      'x-decorator-props': {
        maxColumns: 3,
        minColumns: 3,
      },
      properties: {
        /** 状态码 【http】 */
        code: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '状态码',
          },
          'x-component': 'PreviewText.Input',
          'x-visible': protocol === Protocol.HTTP,
          'x-reactions': (field: Field) => formatNumberToString(field, false),
        },
        /** tcp连接状态 【tcp】 */
        tcpStatus: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: 'tcp连接状态',
          },
          'x-visible': protocol === Protocol.TCP,
          'x-component': 'PreviewText.Input',
        },
        gridColumn: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 响应时间 【http/grpc】【tcp】【udp】 */
            duration: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '响应时间',
              },
              'x-component': 'PreviewText.Input',
              'x-visible': [Protocol.HTTP, Protocol.GRPC, Protocol.TCP, Protocol.UDP, Protocol.WEBSOCKET].includes(protocol),
              'x-reactions': (field: Field) => formatNumberToString(field, true),
            },
          },
        },
        gridColumn1: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 收到内容【udp】 */
            content: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: `${isBehavior ? '响应体' : '收到内容'}（received message）`,
                labelWidth: 230,
                layout: 'vertical',
                labelAlign: 'left',
              },
              'x-visible': [Protocol.UDP].includes(protocol) || isBehavior || isHealth,
              'x-component': 'CommonJsonPretty',
            },   
          }
        },
        gridColumn2: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 响应元数据 */
            metadata: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '响应元数据',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': isBehavior,
            },
          }
        },
        /** 证书颁发对象 */
        gridColumn3: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 证书颁发对象 */
            certSubject: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '证书颁发对象',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': [Protocol.SSL].includes(protocol),
            },
          },
        },
        /** 证书颁发者信息 */
        gridColumn4: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 证书颁发者信息 */
            certIssuerInfo: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '证书颁发者信息',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': [Protocol.SSL].includes(protocol),
            },
          },
        },
        /** 证书详细信息 */
        gridColumn5: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 证书详细信息 */
            certDetailInfo: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '证书详细信息',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': [Protocol.SSL].includes(protocol),
            },
          },
        },
        /** 连接信息 */
        gridColumn6: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** 连接信息 */
            connectionInfo: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '连接信息',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': [Protocol.SSL].includes(protocol),
            },
          },
        },
        /** websocket响应内容 */
        gridColumn7: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** ws响应内容 */
            [AssertionTypeToResMap[AssertionType.WEBSOCKET_RESPONSE]]: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '响应内容',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'CommonJsonPretty',
              'x-visible': [Protocol.WEBSOCKET].includes(protocol),
            },
          },
        },
        /** websocket响应头 */
        gridColumn8: {
          type: 'void',
          'x-decorator': 'FormGrid.GridColumn',
          'x-decorator-props': {
            gridSpan: 3,
          },
          properties: {
            /** ws响应头 */
            [AssertionTypeToResMap[AssertionType.WEBSOCKET_RESPONSE_HEADER]]: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '响应头',
                layout: 'vertical',
                labelWidth: 160,
                labelAlign: 'left',
              },
              'x-component': 'PreviewText.Input',
              'x-visible': isPassed && [Protocol.WEBSOCKET].includes(protocol),
              'x-content': '响应头信息仅在请求失败的情况下被记录',
            },
          },
        },
      },
    },
    /** 请求头 */
    requestHeaderTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '请求头',
        colon: false,
        style: commonLabelStyle,
      },
      'x-visible': protocol === Protocol.HTTP,
    },
    /** 请求头 【http/超时展示，仅在任务结果失败展示】 */
    requestHeader: {
      type: 'array',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 3,
          minColumns: 3,
        },
        properties: {
          key: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              label: '设置条件',
            },
            'x-component': 'PreviewText.Input',
          },
          value: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              label: '实际值',
            },
            'x-component': 'PreviewText.Input',
          },
        }
      },
      'x-visible': !isPassed && protocol === Protocol.HTTP,
    },
    emptyRequestHeader: {
      type: 'void',
      'x-content': '请求头只在任务结果失败才展示。',
      'x-visible': isPassed && protocol === Protocol.HTTP,
    },
    /** 响应内容 【http/超时展示，仅在任务结果失败展示】 */
    responseContentTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '响应内容',
        colon: false,
        style: commonLabelStyle,
      },
      'x-visible': protocol === Protocol.HTTP,
    },
    responseContent: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'PreviewText.Input',
      'x-display': !isPassed && protocol === Protocol.HTTP ? 'visible' : 'hidden',
    },
    emptyResponseContent: {
      type: 'void',
      'x-content': '只有任务结果失败才展示body，方便调试。',
      'x-visible': isPassed && protocol === Protocol.HTTP,
    },
    /** 路由追踪 【仅tcp展示】 */
    routeTraceTitle: {
      type: 'void',
      'x-component': 'FormItem',
      'x-component-props': {
        label: '路由追踪',
        colon: false,
        style: commonLabelStyle,
      },
      'x-visible': protocol === Protocol.TCP,
    },
    /** 路由追踪 【仅tcp展示】 */
    routeTrace: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'PreviewText.Input',
      'x-visible': protocol === Protocol.TCP,
    },
  }
}

export default getSchema