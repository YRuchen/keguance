import { requiredText } from '~/constants/common'
import { uploadApi } from '~/api/availabilityMonitoring'
import { changeVisible } from '../../utils'
import { Protocol } from '../../constants' 
import { commonTimeout, commonUpload, commonUrlConfig } from '../commonFields'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../interfaces'

const getSchema = ({ isView, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'object',
  'x-component': 'Space',
  'x-component-props': {
    direction: 'column',
    fill: true,
    style: {
      width: '100%',
    }
  },
  'x-reactions': (field: Field) => {
    changeVisible(field, Protocol.SSL)
  },
  properties: {
    urlConfig: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        style: {  width: '100%' },
      },
      'x-component': 'Space',
      'x-component-props': {
        size: 12,
      },
      properties: {
        ...commonUrlConfig({
          openEditor,
          isView,
          hostPlaceholder: '如：www.example.com',
          portPlaceholder: '如：443',
          toolTip: '定义好请求格式且添加结果判断条件后，即可测试链接，（测试与选择节点无关）',
        }),
      }
    },
    collapse: {
      type: 'void',
      'x-decorator': 'div',
      'x-decorator-props': {
        class: 'inner-FormCollapse',
        style: {
          width: 'calc(100% - 32px)',
          marginLeft: '16px',
        },
      },
      'x-component': 'FormCollapse',
      'x-component-props': {
        formCollapse: '{{sslFormCollapse}}',
      },
      properties: {
        requestStep1: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            title: '高级设置',
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            },
          },
          properties: {
            allowSelfSignedCert: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-component-props': {
                label: '允许自签名证书通过检测',
                style: {
                  width: '100%',
                },
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            failOnRevokedCert: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-component-props': {
                label: '发现吊销（revoked）证书判定任务失败',
                style: {
                  width: '100%',
                },
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            failOnIncompleteChain: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-component-props': {
                label: '证书链不完整时判定任务失败',
                style: {
                  width: '100%',
                },
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            timeout: commonTimeout({
              preFixTitle: '超过',
              suffixTitle: '未拿到证书任务视为失败',
            }),
            serverName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '服务器名称（SNI）',
                layout: 'vertical',
                labelAlign: 'left',
                labelWidth: 155,
                style: { 
                  width: '100%',
                  textAlign: 'left',
                },
                tooltip: '当服务器使用同一IP 托管多个域名证书时，请填写要请求的域名。',
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            clientCert: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '客户端证书',
                colon: false,
                layout: 'vertical',
                labelAlign: 'left',
                labelWidth: 82,
                style: { width: '100%' },
              },
              properties: {
                /** 私钥 */
                privateKey: commonUpload({
                  label: '私钥',
                  btnText: '上传文件',
                  componentProps: {
                    uploadApi,
                  },
                }),
                /** 证书 */
                cert: commonUpload({
                  label: '证书',
                  btnText: '上传文件',
                  componentProps: {
                    uploadApi,
                  },
                }),
              },
            },
          },
        }
      }
    },
  }
})

export default getSchema
