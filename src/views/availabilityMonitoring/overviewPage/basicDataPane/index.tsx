import { defineComponent } from 'vue'
import { Protocol, ResultStatus } from '~/api/availabilityMonitoring/constants'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'

const props = {
  basicData: {
    type: Object,
    default: () => ({}),
  },
}

export default defineComponent({
  name: 'BasicDataPane',
  props,
  setup(props) {
    return () => (
      <Space class={styles.container} justify='start' fill size={16} style={{ padding: '16px', boxSizing: 'border-box' }}>
        <div class={[styles.circle, props.basicData?.testResults === ResultStatus.PASSED ? styles.success : styles.fail]}></div>
        <Space direction='column' align='start' size={0}>
          <div style={{ fontWeight: 'bold' }}>任务名称：{props.basicData?.taskName}</div>
          <Space size={16}>
            <div style={{ fontWeight: 'bold' }}>请求类型: {props.basicData?.requestType}</div>
            {props.basicData?.requestType !== Protocol.HTTP && <div style={{ fontWeight: 'bold' }}>host: {props.basicData?.host}</div>}
            {props.basicData?.requestType !== Protocol.HTTP && <div style={{ fontWeight: 'bold' }}>port: {props.basicData?.port}</div>}
            {props.basicData?.requestType === Protocol.HTTP && <div style={{ fontWeight: 'bold' }}>URL: {props.basicData?.url}</div>}
            <div style={{ fontWeight: 'bold' }}>监测频率: {props.basicData?.monitoringFrequency}</div>
          </Space>
        </Space>
      </Space>
    )
  }
})
