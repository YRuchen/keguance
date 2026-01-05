import { requiredText } from '~/constants/common'
import { commonMessage } from '../../commonFields'

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
    title: commonMessage({ message: '对下面填写的服务发起一次健康检查。' }),
    title1: commonMessage({ message: '不填写下框时，监控检查会使用标准的 gRPC 健康检查协议 向整个 gRPC 服务器发送一个基本的健康检查。' }),
    serviceName: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入要检查的GRPC服务名',
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
