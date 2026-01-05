import { defineComponent, computed } from 'vue'
import styles from './index.module.scss'

const props = {
  /** 宽度 */
  width: {
    type: Number,
    default: 0,
  },
  /** 左偏移 */
  left: {
    type: Number,
    default: 0,
  },
  /** 耗时 */
  duration: {
    type: Number,
    default: 0,
  },
  /** 行颜色 */
  color: {
    type: String,
    default: '#fff',
  },
}

export default defineComponent({
  name: 'TimeLine',
  props,
  setup(props) {
    const wrapperStyle = computed(() => ({
      width: `${props.width}%`,
      left: `${props.left}%`,
      backgroundColor: props.color,
      minWidth: '2px',
      borderRadius: '6px',
    }))
    return () => (
      <div
        class={styles.container}
        style={wrapperStyle.value}
      >
        <div class={styles.tip}>{props.duration}ms</div>
      </div>
    )
  }
})
