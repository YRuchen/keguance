import { defineComponent, computed, Transition } from 'vue'
import { RouterView } from 'vue-router'
import { useRect } from '~/store/modules/useRect'
import styles from './index.module.scss'

export default defineComponent({
  name: 'Main',
  setup() {
    const rectStore = useRect()
    const mainHeight = computed(() => `${rectStore.appHeight - rectStore.headerHeight}px`)
    return () => (
      <div class={['app-main', styles.appMain]} style={{ height: `calc(100% - ${rectStore.headerHeight || 0}px)!important` }}>
        <Transition
          name="fade-slide" 
          mode="out-in" 
          appear
        >
          <RouterView></RouterView>
        </Transition>
      </div>
    )
  }
})
