import { computed, defineComponent } from 'vue'
import Big from 'big.js'
import { Space } from '~/KeepUp'
import TimeLine from '../../components/timeLine'
import TimeAxis from '../../components/timeAxis'
import { props } from './constants'
import styles from './index.module.scss'

export { props }
export default defineComponent({
  name: 'LineRight',
  props,
  setup(props) {
    /** 宽度向上保留一位小数，left向上保留一位小数，宽度最小为2px */
    /** 当前span耗时 */
    const duration = computed<Big>(() => new Big(props.span.span.duration))
    /** 当前span开始时间 */
    const startTime = computed<Big>(() => new Big(props.span.span.startTime))
    /** 总耗时 */
    const rootDuration = computed<Big>(() => new Big(props.rootSpan?.duration))
    /** 总开始时间 */
    const rootStartTime = computed<Big>(() => new Big(props.rootSpan?.startTime))
    /** 当前开始时间 - 总开始时间，得到【当前开始时间】距离【总开始时间】之间的距离 */
    const curStartTime = computed(() => startTime.value.minus(rootStartTime.value))
    /** 宽度（百分比） */
    const width = computed(() => duration.value.div(rootDuration.value).times(100).round(2))
    /** 左边距（百分比） */
    const left = computed(() => curStartTime.value.div(rootDuration.value).times(100).round(2))
    return () => (
      <Space class={styles.container} fill>
        <TimeAxis timeColumns={props.timeColumns} />
        <TimeLine
          width={width.value}
          left={left.value}
          duration={duration.value.round(2)}
          color={props.span.color}
        />
      </Space>
    )
  }
})
