import { defineComponent } from 'vue'
import Space from '../../../space'
import LineLeft, { props as leftProps } from './lineLeft'
import LineRight, { props as rightProps } from './lineRight'
import HeaderLeft from './headerLeft'
import HeaderRight from './headerRight'
import { composeExpose } from '../../../../__builtins__/shared'
import styles from './index.module.scss'

import type { PropType, VNode } from 'vue'
import type { ICommonObj } from '../../../../interfaces/common'
import type { IVisibleDataItem, ILayoutItem, ISpanItem } from '../interfaces'

const props = {
  /** span数据 */
  span: {
    type: Object as PropType<IVisibleDataItem>,
    default: () => ({}),
  },
  /** 布局配置 */
  layout: {
    type: Object as PropType<Record<'left' | 'right', ILayoutItem>>,
    default: () => ({}),
  },
  /** 时间轴刻度划分 */
  timeColumns: {
    type: Number,
    default: 5,
  },
  /** 基准span */
  rootSpan: {
    type: Object as PropType<ISpanItem>,
    default: () => ({}),
  },
  /** 行颜色 */
  color: {
    type: String,
    default: '#fff',
  },
  /** 左侧 */
  leftRender: {
    type: Function as PropType<(p: ICommonObj) => VNode>,
    default: () => null,
  },
  /** 右侧 */
  rightRender: {
    type: Function as PropType<(p: ICommonObj) => VNode>,
    default: () => null,
  },
  /** 可悬浮 */
  hoverable: {
    type: Boolean,
    default: false,
  },
}

const Line = defineComponent({
  name: 'Line',
  props,
  emits: ['openLogPanel'],
  setup(props, { emit }) {
    return () => (
      <Space class={[styles.container, { [styles.hoverable]: props.hoverable }]} fill size={0}>
        {
          props.leftRender({
            props: {
              span: props.span,
              width: props.layout.left?.width,
              color: props.color,
            },
            emits: {
              onOpenLogPanel: ({ span }) => { emit('openLogPanel', { span }) },
            },
          })
        }
        {
          props.rightRender({
            span: props.span,
            timeColumns: props.timeColumns,
            rootSpan: props.rootSpan,
            width: props.layout.right?.width,
            color: props.color,
          })
        }
      </Space>
    )
  }
})
export type { leftProps }
export type { rightProps }
export default composeExpose(
  Line,
  {
    HeaderLeft,
    HeaderRight,
    LineLeft,
    LineRight,
  }
)
