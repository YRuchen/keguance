import { defineComponent } from 'vue'
import Space from '~/basicComponents/space'
import { ResultStatus } from '../constants'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { IOptionItem } from '~/KeepUp'
import type { IBasicData } from '../interfaces'

const props = {
  basicData: {
    type: Object as PropType<Partial<IBasicData>>,
    default: () => ({}),
  },
}

export default defineComponent({
  name: 'BasicDataPane',
  props,
  setup(props) {
    return () => (
      <Space class={styles.container} justify='start' fill size={16} style={{ padding: '16px', boxSizing: 'border-box' }}>
        <div class={[styles.circle, props.basicData.status ? styles.success : styles.fail]}></div>
        <Space direction='column' align='start' size={0}>
          <div style={{ fontWeight: 'bold' }}>任务名称：{props.basicData.name}</div>
          <Space size={16}>
            {
              Object.entries(props.basicData).map(([k, v]) => (
                ['name', 'status'].includes(k)
                  ? null
                  : <div style={{ fontWeight: 'bold' }}>
                      {(v as IOptionItem).label}: {(v as IOptionItem).value}
                    </div>
              ))
            }
          </Space>
        </Space>
      </Space>
    )
  }
})
