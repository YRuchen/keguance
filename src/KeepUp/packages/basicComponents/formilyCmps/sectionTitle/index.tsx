import { defineComponent } from 'vue'
import styles from './index.module.scss'

import type { PropType } from 'vue'

const props = {
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 类型 */
  type: {
    type: String as PropType<'primary' | 'danger'>,
    default: 'primary',
  },
}

export default defineComponent({
  name: 'SectionTitle',
  props,
  setup(props) {
    return () => (
      <div
        class={[
          styles.wrapper,
          {
            [styles.primary]: props.type === 'primary',
            [styles.danger]: props.type === 'danger',
          },
        ]}
      >{props.title}</div>
    )
  },
})
