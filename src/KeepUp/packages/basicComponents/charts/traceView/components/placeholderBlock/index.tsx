import { defineComponent } from 'vue'
import styles from './index.module.scss'

const props = {
  width: {
    type: Number,
    default: 16,
  },
  size: {
    type: Number,
    default: 16,
  },
  bordered: {
    type: Boolean,
    default: false,
  }
}

export default defineComponent({
  name: 'PlaceholderBlock',
  props,
  setup(props, { slots }) {
    return () => (
      <div
        class={[styles.container, { [styles.border]: props.bordered }]}
        style={{
          width: `${props.width}px`,
          height: `${props.size}px`,
        }}
      >
        {slots?.default?.()}
      </div>
    )
  }
})
