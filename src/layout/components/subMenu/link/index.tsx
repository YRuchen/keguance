import { defineComponent, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { isExternal as checkExternal } from '~/utils/validate.js'
import styles from './index.module.scss'

const props = {
  /** routerName */
  to: {
    type: String,
    required: true,
  }
}

export default defineComponent({
  name: 'Link',
  props,
  setup(props, { slots }) {
    const isExternal= computed(() => checkExternal(props.to))
    const type = computed(() => isExternal.value ? 'a' : RouterLink)
    const linkAttrs = (to: string) => (
      isExternal.value
        ? {
          href: to,
          target: '_blank',
          rel: 'noopener',
        }
        : {
          to: { name: to },
        }
    )
    return () => (
      <type.value
        class={styles.container}
        {...linkAttrs(props.to)}
        v-slots={slots}
      />
    )
  }
})
