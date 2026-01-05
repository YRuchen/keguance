import { defineComponent, ref } from 'vue'
import { ElDrawer, ElEmpty } from 'element-plus'
import styles from './index.module.scss'

import type { ICommonDrawerExpose } from './interfaces'

const props = {
  title: {
    type: String,
    default: '默认标题',
  },
  size: {
    type: String,
    default: '70%',
  },
}

export * from './interfaces'
export default defineComponent({
  name: 'CommonEditor',
  inheritAttrs: false,
  props,
  setup(props, { expose, slots, attrs }) {
    const visible = ref(false)
    /** 打开抽屉 */
    const open = () => {
      visible.value = true
    }
    /** 关闭抽屉 */
    const close = () => {
      visible.value = false
    }
    expose<ICommonDrawerExpose>({
      open,
      close,
    })
    return () => (
      <ElDrawer
        class={styles.container}
        v-model={visible.value}
        {...attrs}
        title={props.title}
        size={props.size}
        destroyOnClose
        v-slots={{
          title: slots.title?.(),
          footer: slots.footer?.(),
        }}
      >
        {slots.default?.() || <ElEmpty description='No Data' />}
      </ElDrawer>
    )
  }
})
