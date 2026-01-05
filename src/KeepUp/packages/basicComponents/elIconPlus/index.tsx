import { defineComponent, h } from 'vue'
import { ElIcon } from 'element-plus'
import { StarFilled } from '@element-plus/icons-vue'

import type { PropType, VNode } from 'vue'

const props = {
  icon: {
    type: Object as PropType<VNode>,
    default: StarFilled,
  }
}

export default defineComponent({
  name: 'ElIconPlus',
  inheritAttrs: false,
  props,
  setup(props, { attrs }) {
    return () => (
      <ElIcon {...attrs}>{h(props.icon)}</ElIcon>
    )
  }
})
