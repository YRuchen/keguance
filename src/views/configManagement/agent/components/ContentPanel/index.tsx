import { defineComponent, ref, watch } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
const props = {
  data: {
    type: Object,
    default: () => {},
  },
  step: {
    type: Number,
    default: 1,
  },
}

export default defineComponent({
  name: 'InfoPanel',
  props,
  setup(props, { slots }) {
    return () => {
      return (
        <Space class={styles.container} direction='column' fill size={0} align='left'>
          <Space direction='row' fill align='center' size={0}>
            <span class={[styles.num]}>{props.step}</span>
            <span class={styles.text}>{props.data.name}</span>
            <el-divider border-style='dashed' class={styles.divider} />
          </Space>
          {slots.default ? slots.default() : null}
        </Space>
      )
    }
  },
})
