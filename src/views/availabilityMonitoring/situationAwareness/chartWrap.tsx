import { defineComponent, PropType, VNode, Comment, Text, Fragment } from 'vue'
import styles from './index.module.scss'
import { number } from 'echarts'

export default defineComponent({
  name: 'ChartWrap',
  props: {
    chartNum: {
      type: Number as PropType<1 | 2 | 3>,
      default: 2,
      validator: (value: number) => [1, 2, 3].includes(value),
    },
    // 每个卡片的背景色（可选），不传则使用默认白色
    cardBgColors: {
      type: Array as PropType<(string | undefined)[]>,
      default: () => [],
    },
    minHeight: {
      type: Number,
      default: 307,
    },
  },
  setup(props, { slots }) {
    return () => {
      const chartRowClasses = [
        styles.chartRow,
        props.chartNum === 3 && styles.chartRowThree,
        props.chartNum === 1 && styles.chartRowFull,
      ].filter(Boolean)

      const defaultSlots = slots.default?.()
      if (!defaultSlots) return null

      const children = (Array.isArray(defaultSlots) ? defaultSlots : [defaultSlots]).filter(
        (vnode) => {
          // 1️⃣ 过滤注释
          if (vnode.type === Comment) return false

          // 2️⃣ 过滤空文本
          if (vnode.type === Text && String(vnode.children).trim() === '') return false

          // 3️⃣ 过滤空 Fragment
          if (
            vnode.type === Fragment &&
            (!vnode.children || (Array.isArray(vnode.children) && vnode.children.length === 0))
          ) {
            return false
          }

          return true
        },
      )

      if (!children.length) return null

      const wrappedChildren = children.map((child: VNode, index: number) => {
        const childClass = (child.props as any)?.class
        const cardClass = childClass ? [styles.chartCard, childClass] : styles.chartCard
        const bg = props.cardBgColors[index]

        return (
          <div
            class={cardClass}
            key={child.key || index}
            style={{
              background: bg || undefined,
              minHeight: `${props.minHeight}px`,
            }}
          >
            {child}
          </div>
        )
      })

      return (
        <div class={styles.section}>
          <div class={chartRowClasses}>{wrappedChildren}</div>
        </div>
      )
    }
  },
})
