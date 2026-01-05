import { defineComponent, h } from 'vue'
import { connect, mapProps } from '@formily/vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export const CommonJsonPretty = defineComponent({
  name: 'CommonJsonPretty',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(VueJsonPretty, {...attrs})
  }
})

export const FormilyCommonJsonPretty = connect(
  CommonJsonPretty,
  mapProps({ value: 'data' }),
)
