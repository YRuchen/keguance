import { h } from 'vue'
import { requiredText } from '~/constants/common'
import { uploadApi } from '~/api/availabilityMonitoring'
import { authOptions, Auth, oAuth2ModeOptions, authMethodOptions, OAuth2Mode } from '../../../constants'
import { commonUpload } from '../../commonFields'
import styles from '../../../index.module.scss'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

/** 根据身份验证类型控制显隐 */
const changeVisibleByAuth = (field: Field, authType: Auth) => {
  const type = field.query('.type')?.get('value')
  field.visible = type === authType
}

/** 根据授权类型控制显隐 */
const changeVisibleByMode = (field: Field, curMode: OAuth2Mode) => {
  const mode = field.query('.mode')?.get('value')
  field.visible = mode === curMode
}

export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
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
    /** 身份验证配置 */
    auth: {
      type: 'object',
      'x-component': 'Space',
      'x-component-props': {
        direction: 'column',
        fill: true,
        style: { width: '100%' },
      },
      properties: {
        /** 类型 */
        type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '身份认证类型',
            colon: false,
            layout: 'vertical',
            labelAlign: 'left',
            labelWidth: 97,
            style: { width: '100%' },
          },
          'x-component': 'Radio.Group',
          'x-component-props': {
            buttonStyle: 'solid',
            optionType: 'button',
            size: 'small',
            style: {
              width: '100%',
            },
          },
          'default': Auth.BASIC,
          enum: authOptions,
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
        /** HTTP基本身份验证 */
        basic: {
          type: 'object',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            style: { width: '100%' },
          },
          'x-component': 'Space',
          'x-component-props': {
            size: 0,
          },
          'x-reactions': (field: Field) => {
            changeVisibleByAuth(field, Auth.BASIC)
          },
          properties: {
            /** 用户名 */
            userName: {
              type: 'string',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '用户名',
                class: styles.leftRadius,
                style: {
                  width: '180px',
                },
              },
            },
            /** 密码 */
            pwd: {
              type: 'string',
              'x-component': isView ? 'ReadPrettyPwd' : 'Password',
              'x-component-props': {
                placeholder: '密码',
                class: styles.rightRadius,
              },
            }
          },
          // 'x-validator': (value: Record<string, string>) => {
          //   if (!value?.userName && !value?.pwd) {
          //     return requiredText
          //   }
          // },
        },
        /** AWS 签名 */
        aws: {
          type: 'object',
          'x-component': 'Space',
          'x-component-props': {
            direction: 'column',
            fill: true,
            style: { width: '100%' },
          },
          'x-reactions': (field: Field) => {
            changeVisibleByAuth(field, Auth.AWS)
          },
          properties: {
            /** AWS 的访问密钥 ID（AccessKeyId） */
            keyId: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'AWS 的访问密钥 ID（AccessKeyId）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 255,
                style: { width: '100%' },
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
            /** AWS 的访问密钥 Secret（Secret Access Key） */
            secret: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'AWS 的访问密钥 Secret（Secret Access Key）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 325,
                style: { width: '100%' },
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
            /** 其他配置（选填） */
            title: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: { width: '100%' },
              },
              'x-content': () => h(
                'div', 
                { 
                  style: 
                  { 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  },
                }, 
                '其他配置（选填）',
              ),
            },
            /** 目标 AWS 区域 */
            region: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '目标 AWS 区域',
                colon: false,
                labelAlign: 'left',
                labelWidth: 110,
                style: { width: '100%' },
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
            /** AWS 服务名称 */
            service: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'AWS 服务名称',
                colon: false,
                labelAlign: 'left',
                labelWidth: 105,
                style: { width: '100%' },
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
            /** Session Token */
            token: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'Session Token',
                colon: false,
                labelAlign: 'left',
                labelWidth: 110,
                style: { width: '100%' },
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
          },
        },
        oauth2: {
          type: 'object',
          'x-reactions': (field: Field) => {
            changeVisibleByAuth(field, Auth.OAUTH2)
          },
          properties: {
            mode: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '授权类型',
                colon: false,
                layout: 'vertical',
                labelAlign: 'left',
                labelWidth: 65,
                style: { width: '100%' },
              },
              'x-component': 'Radio.Group',
              'x-component-props': {
                style: {
                  width: '100%',
                },
              },
              enum: oAuth2ModeOptions,
              default: OAuth2Mode.CLIENT,
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** token 的URL（Access Token URL） */
            tokenUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'token 的URL（Access Token URL）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
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
            /** 用户名（Username） */
            userName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '用户名（Username）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.PWD)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 密码（Password） */
            pwd: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '密码（Password）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.PWD)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 客户端ID（Client ID） */
            clientId: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '客户端ID（Client ID）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.CLIENT)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 客户端密匙（Client Secret） */
            clientSecret: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '客户端密匙（Client Secret）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.CLIENT)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 认证方式（Token API Authentication） */
            authMethod: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '认证方式（Token API Authentication）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Select',
              'x-component-props': {
                placeholder: '请选择',
              },
              enum: authMethodOptions,
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 其他配置（选填） */
            title: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                style: { width: '100%' },
              },
              'x-content': () => '其他配置（选填）',
            },
            /** 【可选】客户端ID（Client ID） */
            optionalClientId: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '客户端ID（Client ID）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.PWD)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** 【可选】客户端密匙（Client Secret） */
            optionalClientSecret: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '客户端密匙（Client Secret）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
              },
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入',
              },
              'x-reactions': (field: Field) => {
                changeVisibleByMode(field, OAuth2Mode.PWD)
              },
              // 'x-validator': (value: string) => {
              //   if (!value) {
              //     return requiredText
              //   }
              // },
            },
            /** JWT令牌受众校验（Audience） */
            audience: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'JWT令牌受众校验（Audience）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
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
            /** OAuth资源指示符（Resource） */
            resource: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: 'OAuth资源指示符（Resource）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
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
            /** 权限范围控制（Scope） */
            scope: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                label: '权限范围控制（Scope）',
                colon: false,
                labelAlign: 'left',
                labelWidth: 280,
                style: { width: '100%' },
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
          },
        },
      },
    },
  },
})

export default getSchema