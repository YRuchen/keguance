import { defineComponent, Transition } from 'vue'
import logo from '~/assets/image/logo.png'
import logoCollapse from '~/assets/menu/logo.png'
import styles from './index.module.scss'

const props = {
  /** 折叠 */
  isCollapse: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'Logo',
  props,
  setup(props) {
    return () => (
      <div class={styles.sidebarLogoContainer}>
        <Transition name="sidebarLogoFadeCl">
          <router-link 
            key={props.isCollapse ? 'collapse' : 'expand'}
            class={styles.sidebarLogoLink}
            to='/'
          >
            {
              props.isCollapse
                ? <img src={logo} class={[styles.sidebarLogo, styles.collapse]} />
                : <img src={logoCollapse} class={styles.sidebarLogo} />
            }
          </router-link>
        </Transition>
      </div>
    )
  }
})
