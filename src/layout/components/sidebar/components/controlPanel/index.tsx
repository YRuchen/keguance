import { defineComponent } from 'vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import emitter from '~/utils/emitter'
import Space from '~/basicComponents/space'
import { IconFont } from '~/KeepUp'
import chatIcon from '~/icons/svg/chat_icon.svg'
import CollapseIcon from '../../../header/collapseIcon'
import styles from './index.module.scss'

const props = {
  /** 折叠 */
  isCollapse: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'ControlPanel',
  props,
  setup(props) {
    // 打开AI助手
    const openAI = () => {
      emitter.emit('openChat')
    };
    return () => (
      <Space
        class={styles.container}
        direction={props.isCollapse ? 'column-reverse' : 'row'}
        justify='space-between'
        fill
      >
        <CollapseIcon />
        {
          qiankunWindow.__POWERED_BY_QIANKUN__ 
            ? null 
            : <img
              src={chatIcon}
              class={`${props.isCollapse ? styles.chatIconFold : styles.chatIcon} `}
              onClick={openAI}
            />
        }
        {
          qiankunWindow.__POWERED_BY_QIANKUN__
            ? null
            : <IconFont
              name='message'
              class={styles.icon}
              style={{ marginRight: props.isCollapse ? '0' : '15px' }}
            />
        }
      </Space>
    )
  },
})
