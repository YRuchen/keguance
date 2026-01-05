import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { isEmpty } from 'lodash'
import { ElEmpty, ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import styles from './index.module.scss'

const props = {
  /** 图表配置 */
  updateOptions: {
    type: Function,
    default: undefined,
  },
  /** 高度 */
  height: {
    type: Number,
    default: 150,
  },
}

export default defineComponent({
  name: 'KeepUpChart',
  props,
  setup(props, { slots }) {
    /** chartRef */
    const chartRef = ref()
    /** chartInstance */
    const chartInstance = ref(null)
    /** chat配置 */
    const options = ref({})
    /** 空配置项 */
    const isEmptyOptions = computed(() => isEmpty(options.value))
    /** 初始化 */
    const init = () => {
      if (chartInstance.value) {
        destroy()
      }
      initChart()
    }
    /** 初始化图表 */
    const initChart = async () => {
      try {
        const curOptions = await props.updateOptions()
        options.value = curOptions
        await nextTick()
        if (!chartRef.value) {
          ElMessage.warning('缺少图表dom')
          return
        }
        chartInstance.value = echarts.init(chartRef.value)
        console.log('options', curOptions)
        chartInstance.value.setOption(curOptions)
      } catch (error: any) {
        console.error(`初始化图表失败，失败原因：${error}`)
      }
    }
    /** 销毁图表 */
    const destroy = () => {
      if (isEmpty(chartInstance.value)) {
        return
      }
      chartInstance.value.dispose()
    }
    onMounted(async () => {
      setTimeout(() => {
        init()
      }, 500)
    })
    onBeforeUnmount(() => {
      destroy()
    })
    return () => (
      isEmptyOptions.value
        ? <ElEmpty description='No Data' />
        : <div style={{ height: `${props.height}px` }} class={styles.wrapper} ref={chartRef} />
    )
  }
})
