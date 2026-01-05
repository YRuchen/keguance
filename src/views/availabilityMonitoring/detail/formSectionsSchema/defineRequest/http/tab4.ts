import { requiredText } from '~/constants/common'
import { uploadApi } from '~/api/availabilityMonitoring'
import { commonRemoveVisible } from '../../../utils'
import { reqContentTypeOptions, ReqContentType, ReqContentMode, reqContentModeOptions } from '../../../constants'
import { commonUpload } from '../../commonFields'

import type { Field } from '@formily/core'
import type { ISchema } from "@formily/vue"
import type { IGetSchemaParams } from '../../../interfaces'

export const getSchema = ({ isView }: IGetSchemaParams): ISchema => ({
  type: 'void',
  'x-decorator': 'Space',
  'x-decorator-props': {
    direction: 'column',
    align: 'start',
  },
  'x-component': 'FormTab.TabPane',
  'x-component-props': {
    label: '请求体内容',
  },
  properties: {
    content: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '请求体类型',
            colon: false,
            layout: 'vertical',
            labelWidth: 90,
            labelAlign: 'left',
            style: {
              width: '100%',
            },
          },
          'x-component': 'Select',
          'x-component-props': {
            style: {
              width: '100%',
            },
            'x-component-props': {
              placeholder: '请选择',
            },
          },
          'x-reactions': (field: Field) => {
            const contentField = field.query('.content')?.take() as Field
            const formDataField = field.query('.formData')?.take() as Field
            if (contentField) {
              if (field.selfModified) {
                contentField.value = ''
              }
              contentField.visible = field.value !== ReqContentType.MULTIPART_FORM_DATA
            }
            if (formDataField) {
              if (field.selfModified) {
                formDataField.value = [
                  { type: ReqContentMode.TEXT, key: '', value: '' }
                ]
              }
              formDataField.visible = field.value === ReqContentType.MULTIPART_FORM_DATA
            }
          },
          enum: reqContentTypeOptions,
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
        content: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '请求体内容',
            colon: false,
            layout: 'vertical',
            labelWidth: 90,
            labelAlign: 'left',
            style: {
              width: '100%',
            },
          },
          'x-component': 'Input.TextArea',
          'x-component-props': {
            placeholder: '请输入body内容',
          },
          // 'x-validator': (value: string) => {
          //   if (!value) {
          //     return requiredText
          //   }
          // },
        },
        formData: {
          type: 'array',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            label: '请求体内容',
            layout: 'vertical',
            labelWidth: 90,
            labelAlign: 'left',
          },
          'x-component': 'ArrayItems',
          items: {
            type: 'object',
            'x-decorator': 'div',
            'x-decorator-props': {
              style: {
                width: '100%',
                display: 'flex',
              },
            },
            properties: {
              // TODO: 请求体内容类型，看下一版是否要上
              type: {
                type: 'string',
                'x-decorator': 'div',
                'x-decorator-props': {
                  style: {
                    width: '121px!important',
                    lineHeight: 0,
                  }
                },
                default: ReqContentMode.TEXT,
                'x-component': 'Radio.Group',
                'x-component-props': {
                  buttonStyle: 'solid',
                  optionType: 'button',
                  style: {
                    width: '100%',
                  },
                },
                enum: reqContentModeOptions,
                'x-reactions': (field: Field) => {
                  if (!field.selfModified) {
                    return
                  }
                  if (field.value === ReqContentMode.FILE) {
                    const fileField = field.query('.file')?.take() as Field
                    fileField.value = []
                  }
                },
              },
              /** type */
              key: {
                type: 'string',
                'x-decorator': 'div',
                'x-decorator-props': {
                  style: {
                    width: '150px!important',
                  }
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '参数名称',
                }
              },
              /** value */
              value: {
                type: 'string',
                'x-decorator': 'div',
                'x-decorator-props': {
                  style: {
                    width: 'calc(100% - 311px)!important',
                  }
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '值',
                  uploadApi,
                },
                'x-reactions': [
                  {
                    dependencies: ['.type'],
                    fulfill: {
                      state: {
                        visible: '{{$deps[0] === ReqContentMode.TEXT}}',
                        value: `{{''}}`,
                      }
                    }
                  }
                ],
              },
              file: commonUpload({
                btnText: '上传文件',
                componentProps: {
                  uploadApi,
                },
                xReactions: [
                  {
                    dependencies: ['.type'],
                    fulfill: {
                      state: {
                        visible: '{{$deps[0] === ReqContentMode.FILE}}',
                      }
                    }
                  }
                ],
              }),
              remove: {
                type: 'void',
                'x-decorator': 'div',
                'x-decorator-props': {
                  style: {
                    width: '40px!important',
                  }
                },
                'x-component': 'ArrayItems.Remove',
                'x-reactions': commonRemoveVisible,
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
          //   const isEmpty = value.every(v => !v.type && !v.key && !v.value && !v.file)
          //   if (isEmpty) {
          //     return requiredText
          //   }
          // },
        },
      },
    },
  },
})

export default getSchema