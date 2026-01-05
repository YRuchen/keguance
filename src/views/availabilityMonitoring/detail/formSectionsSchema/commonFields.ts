import { h } from 'vue'
import { isEmpty } from 'lodash'
import { ElIcon, ElButton } from 'element-plus'
import { QuestionFilled, Upload } from '@element-plus/icons-vue'
import { requiredText } from '~/constants/common'
import styles from '../index.module.scss'

import type { ISchema } from '@formily/vue'
import type { ICommonToolTipParams, ICommonToolTipContainer, ICommonUploadParams } from '../interfaces'

/** 文本 */
export const commonMessage = ({ message }) => ({
  type: 'void',
  'x-decorator': 'FormItem',
  'x-decorator-props': {
    style: {
      textAlign: 'left',
    },
  },
  'x-content': () => message,
})

/** 超时时间 */
export const commonTimeout = ({
  preFixTitle,
  suffixTitle,
}: Record<string, string> = {}) => ({
  type: 'void',
  'x-component': 'Space',
  'x-component-props': {
    style: { width: '100%' },
  },
  properties: {
    /** 超时时间 */
    timeout: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: preFixTitle || '请求超时时间',
        style: {
          paddingRight: '0',
        }
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
        style: { width: '85px' },
      },
      'x-content': { append: 's' },
      default: 60,
      // 'x-validator': (value: string) => {
      //   if (!value) {
      //     return requiredText
      //   }
      // },
    },
    text: {
      type: 'void',
      'x-content': () => h(
        'div',
        {
          class: styles.commonLabel,
        },
        (suffixTitle || '超过这个时间视为失败'),
      ),
    },
  },
})

/** 生成通用tooltip */
export const commonToolTip = ({ defaultSlot, content, visible }: ICommonToolTipParams) => ({
  toolTip: {
    type: 'void',
    'x-decorator': 'FormGrid.GridColumn',
    'x-decorator-props': {
      gridSpan: 1,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    },
    'x-component': 'ElTooltip',
    'x-component-props': {
      placement: 'top',
    },
    'x-content': {
      default: defaultSlot?.() 
        || (() => h(ElIcon, { size: 16, }, {  default: () => h(QuestionFilled) })),
      content: () => h('div', {
        size: 'small',
        style: {
          minWidth: '200px!important',
          maxWidth: '400px!important',
          padding: '4px 8px',
          color: '#fff',
          fontSize: '12px',
          backgroundColor: '#303133',
          fontWeight: 400,
        },
      }, content || '默认提示'),
    },
    'x-visible': visible,
  },
})

/** 生成末尾包含tooltip的container */
export const commonToolTipContainer = ({
  schema,
  xReactions,
  size,
  icon,
  tooltip,
}: ICommonToolTipContainer): ISchema => {
  return ({
    type: 'void',
    'x-component': 'Space',
    'x-component-props': {
      size: size || 0,
      style: { width: '100%' },
    },
    'x-reactions': xReactions,
    properties: {
      ...schema,
      ...commonToolTip({ defaultSlot: icon, content: tooltip }),
    },
  })
}

/** 上传证书文件 */
export const commonUpload = ({
  label,
  action,
  btnText,
  componentProps,
  xReactions,
}: ICommonUploadParams) => ({
  type: 'string',
  ...(
    label
      ? {
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          label,
          colon: false,
          labelWidth: '50',
          style: {
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          },
        },
      }
      : {}
  ),
  'x-component': 'Upload',
  'x-component-props': {
    style: {
      margin: 0,
      display: 'flex'
    },
    action,
    ...(componentProps || {}),
  },
  'x-content': {
    default: () => h(ElButton, { icon: Upload }, btnText),
  },
  ...(xReactions ? { 'x-reactions': xReactions } : {}),
  // 'x-validator': (value: any) => {
  //   if (isEmpty(value)) {
  //     return requiredText
  //   }
  // },
})

/** 获取Collapse的自定义标题 */
export const getCollapseTitle = ({
  index,
  title,
}: Record<'title' | 'index', string | number>) => (
  h(
    'div', 
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      }
    }, 
    [
      h(
        'div', 
        {
          style: {
            width: '14px',
            height: '14px',
            lineHeight: '14px',
            textAlign: 'center',
            borderRadius: '50%',
            backgroundColor: '#1763FF',
            flexShrink: '0',
            marginRight: '4px',
            color: '#fff',
            fontFamily: 'PingFang SC',
            fontSize: '10px',
            fontStyle: 'normal',
            fontWeight: 300,
          }
        },
        index,
      ),
      h(
        'div', 
        {
          style: {
            whiteSpace: 'nowrap',
            color: '#41464F',
            leadingTrim: 'both',
            textEdge: 'cap',
            fontFamily: 'PingFang SC',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '22px',
          },
        }, 
        title,
      ),
      h(
        'div', 
        {
          style: {
            width: 'calc(100% - 16px)',
            height: 'auto',
            border: '1px dashed #DDE2E9',
            margin: '0 8px 0 8px',
          },
        }
      ),
    ],
  )
)

export const commonUrlConfig = ({
  openEditor,
  isView,
  hostPlaceholder,
  portPlaceholder,
  toolTip,
}) => ({
  host: {
    type: 'string',
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      label: 'HOST',
      style: {
        padding: 0,
        width: '424px',
      }
    },
    'x-component': 'Input',
    'x-component-props': {
      placeholder: hostPlaceholder,
    },
    'x-validator': (value: string) => {
      if (!value) {
        return '请输入HOST'
      }
    },
  },
  port: {
    type: 'string',
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      label: 'PORT',
      style: {
        padding: 0,
        flex: 1,
      },
    },
    'x-component': 'Input',
    'x-component-props': {
      placeholder: portPlaceholder,
    },
    'x-validator': (value: string) => {
      if (!value) {
        return '请输入PORT'
      }
    },
  },
  btn: {
    type: 'void',
    'x-component': 'ElButton',
    'x-component-props': {
      type: 'primary',
      style: {
        width: 'fit-content',
      },
      onClick: () => {
        openEditor()
      },
    },
    'x-content': {
      default: '测试预览',
    },
    'x-visible': !isView,
  },
  ...commonToolTip({ content: toolTip, visible: !isView }),
})