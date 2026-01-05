import { getCollapseTitle } from '../commonFields'
import getHttpSchema from './http'
import getTcpSchema from './tcp'
import getUdpSchema from './udp'
import getGrpcSchema from './grpc'
import getSslSchema from './ssl'
import getDNSSchema from './dns'
import getWebSocketSchema from './websocket'

import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../interfaces'

const getSchema = ({ isView, form, openEditor }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-component': 'FormCollapse.Item',
  'x-component-props': {
    title: getCollapseTitle({ index: 2, title: '定义请求格式' }),
  },
  properties: {
    /** 请求定义 */
    request: {
      type: 'object',
      properties: {
        http: getHttpSchema({ isView, openEditor }),
        tcp: getTcpSchema({ isView, openEditor }),
        udp: getUdpSchema({ isView, openEditor }),
        grpc: getGrpcSchema({ isView, form, openEditor }),
        ssl: getSslSchema({ isView, form, openEditor }),
        dns: getDNSSchema({ isView, form, openEditor }),
        websocket: getWebSocketSchema({ isView, openEditor }),
      },
    },
  },
})

export default getSchema
