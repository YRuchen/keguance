import { defineComponent } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
const props = {
  iframeUrl: {
    type: String,
    default: '',
  },
}
export default defineComponent({
  name: 'commonIframePage',
  props,
  setup(props) {
    return () => {
      return (
        <Space class={styles.container} direction='column' fill size={0}>
          {console.log(props.iframeUrl)}
          <iframe src={props.iframeUrl} frameborder='0' class={styles.fullIframe}></iframe>
        </Space>
      )
    }
  },
})
