import { defineComponent, ref, watch } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'
import styles from './index.module.scss'
const props = {
  list: {
    type: Array,
    default: () => [
      { step: 1, text: '选安装采集日志Agent的平台', sucess: false },
      { step: 2, text: '安装Agent ', sucess: false },
    ],
  },
  active: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    default: 'icon', // icon 对勾 text 数字
  },
}

export default defineComponent({
  name: 'InfoPanel',
  props,
  setup(props) {
    const stepList = ref(props.list)
    watch(
      () => props.active,
      () => {
        stepList.value = stepList.value.map((v) => ({
          ...v,
          success: v.step < props.active,
        }))
      },
    )
    return () => {
      return (
        <div class={styles['form-step-box']}>
          {stepList.value.map((item, index) => (
            <div class={styles['step-item']} key={item.step}>
              {/* {props.status === 'icon' && item.success && (
                <CircleCheck class={styles['success-icon-num']} />
              )} */}
              <span
                class={[
                  styles.num,
                  item.step === props.active && styles['active-num'],
                  item.success && styles['success-num'],
                ]}
              >
                {item.step}
              </span>
              <span
                class={[
                  styles.text,
                  item.step === props.active && styles['active-text'],
                  item.success && styles['success-text'],
                ]}
              >
                {item.text}
              </span>
              {index + 1 !== stepList.value.length && (
                <span
                  class={[styles.line, item.step < props.active && styles['active-line']]}
                ></span>
              )}
            </div>
          ))}
        </div>
      )
    }
  },
})
