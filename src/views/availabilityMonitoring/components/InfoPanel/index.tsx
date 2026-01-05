import { defineComponent } from 'vue'
import { ElImage } from 'element-plus'
import { TaskType, resultStatusMap, ResultStatus } from '~/api/availabilityMonitoring/constants'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ITaskInfo } from '~/api/availabilityMonitoring/interfaces'

const props = {
  /** 卡片数据 */
  data: {
    type: Object as PropType<ITaskInfo>,
    default: () => ({}),
  },
  /** 拨测结果 */
  resultStatus: {
    type: String as PropType<ResultStatus>,
    default: ResultStatus.PASSED,
  }
}

export default defineComponent({
  name: 'InfoPanel',
  props,
  setup(props, { emit }) {
    return () => (
      <el-card 
        class={[styles.container, props.data.type === TaskType.SUCCESS ? styles.success : styles.fail]}
        shadow="hover" 
        onClick={() => { emit('update:resultStatus', resultStatusMap[props.data.type]) }}
      >
        <Space align='center' justify='center' size={66}>
          <ElImage 
            class={[
              styles.circle,
              props.data.type === TaskType.SUCCESS 
                ? styles.success
                : styles.fail
            ]}
            src={props.data.icon}
          />
          <Space class={styles.content} direction='column' size={16} align='center'>
            <Space direction='row' size={16} justify='space-between' fill>
              <span class={styles.label}>{props.data.total.label}</span>
              <span class={styles.total}>{props.data.total.value}</span>
            </Space>
            <div class={styles.taskGroup}>
              {props.data.taskList.map(v => (
                <Space class={styles.taskInfo} size={0} justify='space-between'>
                  <div class={styles.title}>{v.label}：</div>
                  <span class={styles.text}>{v.value}</span>
                </Space>
              ))}
            </div>
          </Space>
        </Space>
      </el-card>
    )
  }
})