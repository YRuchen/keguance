import { defineComponent } from 'vue'
import styles from './index.module.scss'

const props = {
  /** 宽度比例 */
  width: {
    type: String,
    default: '0%',
  },
}

export default defineComponent({
  name: 'HeaderLeft',
  props,
  setup(props) {
    return () => (
      <div
        class={styles.container} 
        style={{ width: props.width }}
      >Service & Operation</div>
    )
  }
})
