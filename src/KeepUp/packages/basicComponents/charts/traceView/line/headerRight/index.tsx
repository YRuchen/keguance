import { defineComponent, computed } from 'vue'
import Big from 'big.js'
import TimeAxis from '../../components/timeAxis'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ISpanItem } from '../../interfaces'

export const props = {
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
  /** 宽度比例 */
  width: {
    type: String,
    default: '0%',
  },
}

export default defineComponent({
  name: 'HeaderRight',
  props,
  setup(props) {
    /** 刻度区间（分为几个区间） */
    const axisesIntervalCount = computed(() => props.timeColumns - 1)
    /** 刻度总数（共有几个刻度点） */
    const totalAxises = computed(() => props.timeColumns + 1)
    /** 时间步长 */
    const timeStep = computed(() => new Big(props.rootSpan?.duration || 0).div(axisesIntervalCount.value).round(2))
    /** 时间轴刻度点 */
    const axises = computed(() => new Array(totalAxises.value).fill(0).map((_, i) => `${timeStep.value.times(i)}ms`)) 
    return () => (
      <TimeAxis
        class={styles.container}
        style={{ width: props.width }}
        timeColumns={props.timeColumns}
        axises={axises.value}
      />
    )
  }
})
