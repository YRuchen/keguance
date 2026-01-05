import { defineComponent } from 'vue'
import { useField } from '@formily/vue'

export default defineComponent({
  name: 'FastFilter',
  setup() {
    const fieldRef = useField()
    
    return () => (1)
  },
})
