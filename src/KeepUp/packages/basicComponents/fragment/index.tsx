import { defineComponent } from "vue"

export default defineComponent({
  name: 'Fragment',
  setup(_, { slots }) {
    return () => slots?.default?.()
  }
})
