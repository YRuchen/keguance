import { requiredText } from '~/constants/common'
import { commonRemoveVisible } from '../../../utils'
import { httpVersionOptions } from '../../../constants'
import { commonTimeout, commonToolTipContainer } from '../../commonFields'
import styles from '../../../index.module.scss'

import type { Field } from "@formily/core"
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

/** 根据followRedirects切换visible */
const changeVisible = (field: Field) => {
  const followRedirects = field.query('.followRedirects')?.get('value')
  field.visible = Boolean(followRedirects)
  if (!followRedirects) {
    field.value = false
  }
}

const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '请求设置',
  },
  properties: {
    /** HTTP版本 */
    httpVersion: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'HTTP版本',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: '80',
        style: {
          width: '100%',
        },
      },
      'x-component': 'Select',
      'x-component-props': {
        style: {
          width: '100%',
        }
      },
      enum: httpVersionOptions,
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
    /** 跟随重定向 */
    tooltipContainer1: commonToolTipContainer({
      schema: {
        followRedirects: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '跟随重定向（follow redirects）',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      tooltip: '勾选后，当服务返回 3xx重定向响应时，自动跟随跳转的地址发起请求。如请求 http://example.com 被 301重定向到 https://example.com。勾选“Follow redirects” 一 自动跳转至 HTTPS 页面，返回最终响应。不勾选 一只返回301 响应，监测断言需要手动判断。',
    }),
    /** 在重定向过程中保留 cookie */
    tooltipContainer2: commonToolTipContainer({
      schema: {
        keepCookie: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '跨域重定向保留 Cookie',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      xReactions: changeVisible,
      tooltip: '勾选后会将源地址返回的 Cookie 自动带入跳转后的新地址请求中。',
    }),
    /** 在跨域重定向中保留授权标头 */
    tooltipContainer3: commonToolTipContainer({
      schema: {
        keepAuth: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '跨域重定向时保留认证头信息',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      xReactions: changeVisible,
      tooltip: '将认证头（如 token）在跳转到其他域名时继续携带。谨慎使用，可能存在安全风险。',
    }),
    /** 忽略服务器证书错误 */
    tooltipContainer4: commonToolTipContainer({
      schema: {
        ignoreSSL: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-component-props': {
            label: '忽略HTTP证书错误',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
      },
      tooltip: '如自签名、过期、CN不匹配。若未勾选，则检测会因证书而失败。',
    }),
    timeoutBox: commonTimeout(),
    /** 请求头 */
    requestHeaders: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '请求头',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: '60',
        style: {
          width: '100%',
        },
      },
      'x-component': 'ArrayItems',
      default: [{ key: '', value: '' }],
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {
              size: 0,
            },
            properties: {
              /** key */
              key: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '参数名称',
                  class: styles.leftRadius,
                  style: {
                    width: '180px',
                  }
                },
              },
              /** value */
              value: {
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '值',
                  class: styles.rightRadius,
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
                'x-reactions': commonRemoveVisible,
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayItems.Addition',
          'x-component-props': {
            title: '添加条件',
            type: 'primary',
            link: true,
            style: {
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '10px',
              padding: 0,
              fontSize: '14px',
              color: '#409EFF',
              background: 'none',
              border: 'none',
            },
          },
        },
      },
      // 'x-validator': (value: Record<string, string>[] = []) => {
      //   const isEmpty = value.every(v => !v.key && !v.value)
      //   if (isEmpty) {
      //     return requiredText
      //   }
      // },
    },
    /** cookie */
    cookie: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: 'cookies',
        colon: false,
        layout: 'vertical',
        labelAlign: 'left',
        labelWidth: '70',
        style: {
          width: '100%',
        },
      },
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '设置请求时携带的cookie字段',
      },
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    }
  },
})

export default getSchema