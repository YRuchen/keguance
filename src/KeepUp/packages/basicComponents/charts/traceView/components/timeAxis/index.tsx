import { defineComponent, computed } from 'vue'
import { ElDivider } from 'element-plus'
import Space from '../../../../space'
import Big from 'big.js'
import styles from './index.module.scss'

import type { PropType } from 'vue'

const props = {
  /** 时间轴刻度划分 */
  timeColumns: {
    type: Number,
    default: 5,
  },
  /** 刻度点 */
  axises: {
    type: Array as PropType<string[]>,
    default: () => ([]),
  },
}

export default defineComponent({
  name: 'TimeAxis',
  props,
  setup(props) {
    /** 步长 */
    const step = computed(() => new Big(100).div(props.timeColumns).round(0))
    /** 有刻度点 */
    const hasAxises = computed(() => Boolean(props.axises?.length))
    /** 刻度点render */
    const items = computed(() => new Array(props.timeColumns + 1).fill(0).map((_, i) => (
      <Space
        class={styles.axis}
        style={{ 
          left: `${step.value.times(i)}%`,
        }}
      >
        {
          hasAxises.value
            ? <Space>
                <ElDivider
                  class={styles.divider}
                  direction='vertical' 
                />
                {props.axises[i]}
              </Space>
            : <ElDivider
                class={styles.divider}
                direction='vertical' 
              />
        }
      </Space>
    )))
    return () => (
      <div class={styles.container}>{items.value}</div>
    )
  }
})
