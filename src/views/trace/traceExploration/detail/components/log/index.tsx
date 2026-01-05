import { defineComponent, ref } from 'vue'
import { ElText, ElDivider, ElTabPane, ElCollapse, ElCollapseItem } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { Space, ElIconPlus, CommonJsonPretty, FormTabs } from '~/KeepUp'
import { formatDate } from '~/utils/date'
import { basicDataFieldSort, basicDataFieldMap } from '../../constants'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ISchema } from '@formily/json-schema'
import type { ICommonObj } from '~/interfaces/common'
import type { ILogData } from './interfaces'

const props = {
  /** 数据 */
  data: {
    type: Object as PropType<ILogData>,
    default: () => ([]),
  },
}

export default defineComponent({
  name: 'Log',
  emits: ['closed'],
  props,
  setup(props, { emit, expose }) {
    const visible = ref(false)
    const schema1: ISchema['properties'] = {
      log: {
        type: 'array',
        'x-decorator': ElTabPane,
        'x-decorator-props': {
          label: '日志',
          name: 'log',
        },
        'x-component': ElCollapse,
        'x-component-props': {
          expandIconPosition: 'left',
        },
        items: {
          type: 'object',
          'x-component': ElCollapseItem,
          'x-content': {
            title: (row: ICommonObj) => (
              <Space
                style={{ width: 'calc(100% - 21px)' }}
                size={24}
              >
                <ElText
                  style={{ whiteSpace: 'nowrap' }}
                >{formatDate(row?.['@timestamp'], 'HH:mm:ss.SSS')}</ElText><ElText truncated>{row?.body}</ElText>
              </Space>
            ),
          },
          items: {
            type: 'object',
            'x-component': CommonJsonPretty,
            'x-component-props': {
              style: {
                padding: '0 0 0 21px',
                boxSizing: 'border-box',
              },
              showIcon: false,
              showLine: true,
              deep: 10,
            },
          },
        },
      },
    }
    const open = () => {
      visible.value = true
    }
    const close = () => {
      visible.value = false
      emit('closed')
    }
    expose({
      open,
      close,
    })
    return () => (
      <Space
        class={styles.container}
        direction='column'
        align='start'
        style={{
          width: `${visible.value ? '40%' : 0}`
        }}
      >
        <Space class={styles.header} fill justify='space-between'>
          <ElText>span详情</ElText>
          <ElIconPlus
            class={styles.close}
            icon={Close}
            onClick={close}
          />
        </Space>
        <ElDivider class={styles.divider} />
        <Space class={styles.content} fill direction='column' align='start'>
          <Space direction='column' align='start'>
            {
              Object.entries((props.data.basicData || {}))
                .sort(([a], [b]) => basicDataFieldSort.indexOf(a) - basicDataFieldSort.indexOf(b))
                .map(([k, v]) => (
                  <Space>
                    <ElText>{basicDataFieldMap[k]}:</ElText>
                    <ElText truncated>{v}</ElText>
                  </Space>
                ))
            }
            <Space>
              <ElText>span名称:</ElText>
              <ElText truncated>-</ElText>
            </Space>
            <Space>
              <ElText>服务所属ip:</ElText>
              <ElText truncated>-</ElText>
            </Space>
            <Space>
              <ElText>请求返回码:</ElText>
              <ElText truncated>-</ElText>
            </Space>
          </Space>
          <FormTabs
            schema={schema1}
            tabPaneData={props.data.log}
          />
        </Space>
      </Space>
    )
  }
})
