import { isEmpty } from 'lodash'
import { getMethodListApi } from '~/api/availabilityMonitoring'
import { ServiceDefinition } from '../formSectionsSchema/defineRequest/constants'

import type { Field } from '@formily/core'

/** 设置调用方法enum */
const commonAction = async (field: Field, extra: Record<string, any>) => {
  const methodField = field.query('.method')?.take() as Field
  const host = field.form.query('collapse.step2.request.grpc.urlConfig.host')?.get('value')
  const port = field.form.query('collapse.step2.request.grpc.urlConfig.port')?.get('value')
  const sendData = {
    host,
    port,
    ...extra,
    ...(extra?.protoFile?.[0] ? { protoFile: extra?.protoFile?.[0]?.url } : {}),
  }
  const res = await getMethodListApi(sendData)
  methodField?.setDataSource(res.list)
}

const getEffects = () => ({
  fieldEffects: {
    // 服务定义
    'collapse.step2.request.grpc.basicConfig.BEHAVIOR_CHECK.space.serviceDefinitionType': {
      onFieldValueChange: (field: Field) => {
        const methodField = field.query('.method')?.take() as Field
        methodField?.setDataSource([])
        methodField.value = ''
        if (field.value === ServiceDefinition.SERVER_REFLECTION) {
          commonAction(field, { serviceDefinitionType: field.value, protoFile: null })
        }
      },
    },
    // 上传文件
    'collapse.step2.request.grpc.basicConfig.BEHAVIOR_CHECK.space.protoFile': {
      onFieldValueChange: (field: Field) => {
        const methodField = field.query('.method')?.take() as Field
        const serviceDefinitionType = field.query('.serviceDefinitionType')?.get('value')
        if (serviceDefinitionType === ServiceDefinition.PROTO_FILE && !isEmpty(field.value?.[0])) {
          commonAction(field, { serviceDefinitionType: serviceDefinitionType, protoFile: field.value })
        } else if (serviceDefinitionType === ServiceDefinition.PROTO_FILE && isEmpty(field.value?.[0])) {
          methodField.setDataSource([])
          methodField.value = ''
        }
      },
    },
  },
})

export default getEffects
