import { defineComponent } from 'vue'

const props = {
  /** 是否生效 */
  visible: {
    type: Boolean,
    default: true,
  },
}

export default defineComponent({
  name: 'DisableWrapper',
  props,
  setup(props, { slots }) {
    return () => (
      <div
        style={{ 
          cursor: props.visible 
            ? 'not-allowed !important'
            : 'pointer',
        }}
      >{slots?.default?.()}</div>
    )
  }
})
