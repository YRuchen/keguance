import { defineComponent } from 'vue'
import { PanelId, chartTips } from './constants'
import { useTypeCharts } from './useTypeCharts'
import DataTable from './components/DataTable'
import HorizontalStackedBarChart from './components/HorizontalStackedBarChart'
import BarChart from './components/BarChart'
import styles from './index.module.scss'

export default defineComponent({
  name: 'TypeCharts',
  setup(_, { expose }) {
    const {
      top10Filter,
      alert4Data,
      alert5Data,
      alert6Data,
      loading,
      refreshAllCharts,
    } = useTypeCharts()

    // 暴露刷新方法
    expose({
      refreshAllCharts,
    })

    return () => (
      <div class={styles.container}>
        {/* 第一块：两个图表 */}
        <div class={styles.section}>
          <div class={styles.chartRow}>
            <div class={styles.chartCard}>
              <DataTable
                title='异常域名/地址 TOP10'
                tip={chartTips[PanelId.ALERT_4]}
                data={alert4Data.value}
                loading={loading.alert4}
                v-model:filterValue={top10Filter.value}
              />
            </div>
            <div class={styles.chartCard}>
              <HorizontalStackedBarChart
                title='不同运营商异常统计'
                tip={chartTips[PanelId.ALERT_5]}
                data={alert5Data.value}
                loading={loading.alert5}
              />
            </div>
          </div>
        </div>
        {/* 第二块：一个柱状图 */}
        <div class={styles.section}>
          <div class={[styles.chartRow, styles.chartRowFull]}>
            <div class={styles.chartCard}>
              <BarChart
                title='不同区域告警统计'
                tip={chartTips[PanelId.ALERT_6]}
                data={alert6Data.value}
                loading={loading.alert6}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
})
