import { defineComponent } from 'vue'
import { getMetricsUrl } from '@/utils/env'
import { useRoute } from 'vue-router'
import styles from './index.module.scss'

export default defineComponent({
  name: 'Events',
  setup() {
    const route = useRoute()
    const URL = getMetricsUrl(route.meta.url as string)
    return () => <div class={styles.metrics}>{URL ? <iframe src={URL} /> : <p>加载中...</p>}</div>
  },
})
