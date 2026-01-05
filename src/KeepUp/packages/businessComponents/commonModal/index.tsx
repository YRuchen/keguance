import { defineComponent, ref } from 'vue'
import { ElDialog } from 'element-plus'
import styles from './index.module.scss'

import type { ICommonModalExpose } from './interfaces'

const props = {
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 宽度 */
  size: {
    type: String,
    default: '42%',
  },
}

export * from './interfaces'
export default defineComponent({
  name: 'CommonEditor',
  props,
  emits: ['close'],
  setup(props, { emit, expose, slots }) {
    const visible = ref(false)
    const onClose = () => {
      emit('close')
    }
    const open = () => {
        visible.value = true
      }
    const close = () => {
      visible.value = false
    }
    expose<ICommonModalExpose>({ open, close })
    return () => (
      <ElDialog
        modelValue={visible.value}
        onUpdate:modelValue={(modelValue: boolean) => { visible.value = modelValue }}
        title={props.title || '默认标题'}
        width={props.size}
        class={styles.container}
        bodyClass={styles.content}
        destroyOnClose
        onClose={onClose}
        v-slots={slots}
      />
    )
  }
})
