import { defineComponent, computed } from 'vue'

import type { PropType } from 'vue'

const props = {
  /** 方向 */
  direction: {
    type: String as PropType<'row' | 'column' | 'row-reverse' | 'column-reverse'>,
    default: 'row',
  },
  /** 交叉轴对齐方式 */
  align: {
    type: String as PropType<'start' | 'center' | 'end' | 'stretch'>,
    default: 'center',
  },
  /** 主轴对齐方式 */
  justify: {
    type: String as PropType<'start' | 'center' | 'end' | 'space-around' | 'space-between'>,
    default: 'start',
  },
  /** 当前space宽度是否占满父容器 */
  fill: {
    type: Boolean,
    default: false,
  },
  /** 间距 */
  size: {
    type: Number,
    default: 8,
  },
}

export default defineComponent({
  name: 'Space',
  inheritAttrs: false,
  props,
  setup(props, { slots, attrs }) {
    const style = computed(() => ({
      ...(props.fill ? { width: '100%' } : null),
      display: 'flex',
      flexDirection: props.direction,
      alignItems: props.align,
      justifyContent: props.justify,
      gap: `${props.size}px`,
      ...((attrs.style as Record<string, any>) || {}),
    }))
    return () => (<div {...attrs} style={style.value}>{slots?.default?.()}</div>)
  }
})
