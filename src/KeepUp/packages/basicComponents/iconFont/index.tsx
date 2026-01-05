import { defineComponent } from 'vue'
;(async () => {
  try {
    await import(/* @vite-ignore */ '~/assets/iconfont/iconfont.css')
  } catch {
    console.warn('[IconFont] iconfont.css not found, skip loading.')
  }
})()

const props = {
  /** 标识 */
  name: {
    type: String,
    default: '',
  },
  /** font-size */
  size: {
    type: String,
    default: '24px',
  },
  color: {
    type: String,
    default: '',
  },
}

export default defineComponent({
  name: 'Iconfont',
  props,
  setup(props) {
    return () => (
      <i class={['iconfont', `icon-${props.name}`]} style={{ fontSize: props.size, color: props.color }} />
    )
  }
})
