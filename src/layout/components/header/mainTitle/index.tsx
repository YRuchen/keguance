import { defineComponent, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useRect } from '~/store/modules/useRect'
import styles from './index.module.scss'

export default defineComponent({
  name: 'MainTitle',
  setup() {
    const route = useRoute()
    const rectStore = useRect()
    const containerRef = ref()
    watch(() => route.name, async () => {
      await nextTick()
      rectStore.headerHeight = containerRef.value?.clientHeight || 0
    }, { immediate: true, deep: true })
    return () => (
      <div class={styles.container} ref={containerRef}>
        {route.meta?.title}
      </div>
    )
  }
})
