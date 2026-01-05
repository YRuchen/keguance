import { defineComponent, ref, watch } from 'vue'
import { ElButton } from 'element-plus'
import { Menu, CloseBold } from '@element-plus/icons-vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'HoverSwitch',
  emit: ['visible', 'hide'],
  setup(_, { slots, emit, expose }) {
    const visible = ref(false)
    const openable = ref(true)
    const open = () => {
      if (openable.value) {
        openable.value = false
        visible.value = true
      }
    }
    const close = () => {
      visible.value = false
    }
    const outClose = () => {
      visible.value = false
      allowOpen()
    }
    const allowOpen = () => {
      if (!visible.value) {
        openable.value = true
      }
    }
    watch(() => visible.value, () => {
      emit(visible.value ? 'visible' : 'hide')
    }, { deep: true })
    expose({ open, close: outClose })
    return () => (
      !visible.value 
        ? (
          slots.openBtn?.({ mouseEnter: open, mouseLeave: allowOpen })
            ?? <ElButton
                class={styles.noBorder}
                icon={Menu}
                circle
                onMouseenter={open}
                onMouseleave={allowOpen}
              />
        )
        : (
          slots.closeBtn?.({ mouseEnter: close })
            ?? <ElButton
                class={styles.noBorder}
                icon={CloseBold}
                circle
                onClick={close}
              />
        )
    )
  }
})
