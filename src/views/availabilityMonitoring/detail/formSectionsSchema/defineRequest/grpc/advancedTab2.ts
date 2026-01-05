import { uploadApi } from '~/api/availabilityMonitoring'
import { commonUpload } from '../../commonFields'

import type { ISchema } from "@formily/vue"

export const getSchema = ({}): ISchema => ({
  type: 'void',
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '身份认证',
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
})

export default getSchema
