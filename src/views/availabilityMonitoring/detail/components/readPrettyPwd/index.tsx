import { defineComponent, ref, computed, h } from 'vue'
import { useField } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { ElText, ElButton } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import { Space } from '~/KeepUp'

import type { Field } from '@formily/core'

export default observer(
  defineComponent({
    name: 'ReadPrettyPwd',
    setup() {
      const field = useField<Field>()
      const visible = ref(false)
      const schema = computed(() => ({
        text: visible.value ? field.value?.value : '******',
        icon: visible.value ? Hide : View,
      }))
      const toggle = () => {
        visible.value = !visible.value
      }
      return () => h(Space, null, {
        default: () => [
          h(ElText, null, { default: () => schema.value.text }),
          h(ElButton, {
            icon: schema.value.icon,
            onClick: toggle,
            type: 'text',
            size: 'small',
          }),
        ],
      })
    }
  })
)
