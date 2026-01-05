import { h } from 'vue'
import { requiredText } from '~/constants/common'
import { uploadApi } from '~/api/availabilityMonitoring'
import { commonMessage, commonUpload } from '../../commonFields'
import { serviceDefinitionOptions, ServiceDefinition } from '../constants'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

export const getSchema = ({ label }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  properties: {
    title: commonMessage({ message: '只支持对目标 gRPC 服务发起 单次请求-单次响应（Unary Call） 的调用' }),
    space: {
      type: 'void',
      'x-component': 'Space',
      'x-component-props': {
        align: 'end',
      },
      properties: {
        serviceDefinitionType: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '服务定义',
            colon: false,
            layout: 'vertical',
            labelAlign: 'left',
            labelWidth: 86,
            tooltip: () => h(
              'div',
              { style: { color: '#fff', fontSize: '12px' } },
              [
                h('div', {}, '指定 gRPC 服务接口定义的方式。'),
                h('div', {}, 'Proto File： 手动上传.proto 文件（gRPC 的接口定义文件）。'),
                h('div', {}, 'Server Reflection： 目标 gRPC 服务开启了 Server Reflection（一种内'),
                h('div', {}, '建的 gRPC服务自省机制），平台可以直接去服务端获取接口定义（有哪些 Service、有哪些方法）。'),
              ],
            ),
            style: {
              paddingRight: '0',
            },
            labelStyle: {
              alignItems: 'center',
            },
          },
          'x-component': 'Select',
          'x-component-props': {
            style: {
              width: '150px',
            },
          },
          enum: serviceDefinitionOptions,
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
        protoFile: commonUpload({
          btnText: '上传文件',
          componentProps: {
            limit: 1,
            uploadApi,
          },
          xReactions: (field: Field) => {
            const serviceDefinitionType = field.query('.serviceDefinitionType')?.get('value')
            field.visible = serviceDefinitionType === ServiceDefinition.PROTO_FILE
          },
        }),
      },
    },
    method: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '调用方法',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: 68,
        style: {
          paddingRight: '0',
        },
      },
      'x-component': 'Select',
      'x-component-props': {
        style: {
          width: '150px',
        },
      },
      enum: [],
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
    message: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '请求消息体',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: 82,
        style: {
          paddingRight: '0',
        },
      },
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '{GRPC的请求参数}',
      },
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
  },
})

export default getSchema
