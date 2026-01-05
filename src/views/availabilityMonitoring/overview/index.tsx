import { defineComponent, computed, ref, nextTick, onMounted } from 'vue'
import { ElTabs, ElTabPane, ElTooltip, ElIcon, ElText } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { Space, FormilyForm, CommonTable } from '~/KeepUp'
import { getListApi } from '~/api/availabilityMonitoring/overview'
import useAvailabilityMasterData from '~/store/modules/useAvailabilityMasterData'
import { getSchema, getTableSchema } from './schema'
import { getColumns } from './columns'
import { getEffectHooks } from './effectHooks'
import { useEcharts } from './useEcharts'
import styles from './index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'

import type { Field } from '@formily/core'
import type { IFormilyFormExpose, ICommonTableExpose, ICommonObj } from '~/KeepUp'

export default defineComponent({
  name: 'Overview',
  setup() {
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formilyForm2Ref = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const form2Ref = computed(() => formilyForm2Ref.value?.formRef)
    const commonTableRef = ref<ICommonTableExpose>()
    const loading = ref(false)
    const chartRefs = Array(9).fill(0).map(() => ref(null))
    const {
      updateEcharts,
      updateOverview2Options,
      nodeCountResponse,
      nodeCountAvailability,
      avgRespTime,
      fastResp,
      slowResp,
      avgAvail,
      bestAvail,
      worstAvail,
      chartData,
    } = useEcharts(chartRefs, formRef)
    const masterDataStore = useAvailabilityMasterData()
    const formatListParams = (params: ICommonObj) => {
      return {
        ...Object.fromEntries(
          Object.entries(params)
            .filter(([k, v]) => !['page', 'pageSize', 'total'].includes(k))
        ),
        probeRegionName: form2Ref.value?.values?.node?.[0],
        probeSubdivision: form2Ref.value?.values?.node?.[1],
        probeIspName: form2Ref.value?.values?.isp,
        ...(formRef.value?.values || {}),
        fromTime: formRef.value?.values?.fromTime ? new Date(formRef.value?.values?.fromTime)?.toISOString() : undefined,
        toTime: formRef.value?.values?.toTime ? new Date(formRef.value?.values?.toTime)?.toISOString() : undefined,
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total: params.total,
        },
      }
    }
    const refresh = async () => {
      loading.value = true
      try {
        await updateEcharts()
        /** 更新列表 */
        await commonTableRef.value?.getList()
      } catch (e) {
        console.error('刷新失败', e)
      } finally {
        loading.value = false
      }
    }
    const initTableFilter = async () => {
      await masterDataStore.getMonitoringNodes()
      await nextTick()
      const node = form2Ref.value.query('gridBox.void.node')?.take() as Field
      const isp = form2Ref.value.query('gridBox.void.isp')?.take() as Field
      node?.setDataSource(masterDataStore.masterData.monitoringNodes)
      isp?.setDataSource(masterDataStore.masterData.monitoringIsps)
    }
    onMounted(async () => {
      await refresh()
      await initTableFilter()
    })
    const columns = ref(getColumns())
    const schema = ref(getSchema(refresh, columns))
    const effectHooks = ref(getEffectHooks(refresh))
    const generateToolTipTsx = (title: string, content?: string) => (
      <ElTooltip
        disabled={!Boolean(content)}
        content={content}
        placement='top'
        popperStyle={{ width: '400px' }}
      >
        <Space>
          <span>{title}</span>
          {
            content
              ? <ElIcon style='cursor: pointer;' >
                  <QuestionFilled />
                </ElIcon>
              : null
          }
        </Space>
      </ElTooltip>
    )
    return () => (
      <Space class={styles.container} size={0} direction='column' fill>
        <FormilyForm
          style={{ width: '100%' }}
          ref={formilyFormRef}
          config={schema.value}
          effectHooks={effectHooks.value}
        />
        <div class={styles.chartPanel}>
          <div class={styles.panel}>
            <ElTabs>
              <ElTabPane
                v-slots={{
                  label: () => generateToolTipTsx('响应时间 (ms)', '展示选定HTTP任务从不同地区检测节点的平均响应时间。通过地理色彩深浅直观呈现性能优劣区域，帮助您识别用户访问的地理瓶颈，为CDN调度与区域资源部署提供决策依据。'),
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.topSummary}>
                    <div class={styles.left}>
                      <span>检测节点：</span>
                      <b>{nodeCountResponse.value} 个</b>
                    </div>
                    <div class={styles.right}>
                      <span>平均响应时间：</span>
                      <b>{avgRespTime.value} ms</b>
                    </div>
                  </div>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[0]} class={styles.chart}></div>
                    <div class={styles.rightTips}>
                      <div class={styles.title}>响应时间最快：</div>
                      <div class={styles.tip}>{fastResp.value.city}{fastResp.value.isp} （{fastResp.value.value}ms）</div>
                      <div class={styles.title}>响应时间最慢：</div>
                      <div class={styles.tip}>{slowResp.value.city}{fastResp.value.isp} （{slowResp.value.value}ms）</div>
                    </div>
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs onTabChange={updateOverview2Options}>
              <ElTabPane
                v-slots={{
                  label: () => generateToolTipTsx('响应时间最慢TOP10', '列出当前域名在所有监测节点中响应时间最快和最慢的10个节点及其具体数值。此列表直接揭示性能表现的最佳与最差，帮助您识别出性能最优的“黄金节点”和问题最突出的“短板节点’，为网络优化提供具体目标。'),
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[1]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
              <ElTabPane 
                v-slots={{
                  label: () => generateToolTipTsx('响应时间最快TOP10'),
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[2]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs>
              <ElTabPane 
                v-slots={{
                  label: () => generateToolTipTsx('运营商响应时间', '将性能问题归因于运营商，并实现省内定位。例如，数据显示“电信网络最慢，且最慢点在四川”，这极大地缩小了排查范围。')
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[3]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs >
              <ElTabPane 
                v-slots={{
                  label: () => generateToolTipTsx('地区响应时间', '展示该域名在不同省份的响应时间分布区间，其中蓝色横条长度体现了该省份网络平均响应时间，红色与绿色横条的差值体现了该省份网络的波动性。帮助您快速识别出哪些省份不仅平均响应慢，而且性能极不稳定（红色横条与绿色横条差距很大，比刻图中给的四儿是稳足性服差的省伤_应优先关注。')
                }}
              >
                <div class={styles.chartContainer}>
                  <Space direction='column' size={0} fill style={{ height: '270px' }}>
                    <Space class={styles.topSummary}>
                      {
                        (chartData.value?.overview5?.summary || []).map(v => (
                          <ElText>{v?.key}：<ElText class={styles.title}>{v?.value}</ElText></ElText>
                        ))
                      }
                    </Space>
                    <div ref={chartRefs[4]} class={styles.chart} />
                  </Space>
                </div>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs >
              <ElTabPane 
                v-slots={{
                  label: () => generateToolTipTsx('平均响应时间', '展示选定的HTTP任务在一段时间内平均响应时间的变化曲线。用于观祭性能的长期趋势、周期性波动（如每日高峰）以及与系统变更的关联性，及时发现性能劣化等异常趋势，是进行容量规划和故障回溯的关键数据支撑。')
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[5]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs>
              <ElTabPane
                v-slots={{
                  label: () => generateToolTipTsx('平均耗时分析图', '展示该域名在不同省份的响应时间分布区间，其中蓝色横条长度体现了该省份网络平均响应时间，红色与绿色横条的差值体现了该省份网络的波动性。帮助您快速识别出哪些省份不仅平均响应慢，而且性能极不稳定（紅色横系与绿色横亲差距很大，比如图中给的四川是稳定性最差的省份），这些省份的用户体验最差，应优先关注。')
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[6]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs>
              <ElTabPane
                v-slots={{
                  label: () => generateToolTipTsx('可用率 (%)', '以地图颜色不同来展示哪些区域可用率低，查看区域检测的可用性差异。节点可用性：统计时间段此任务所有节点的正常实例占比，再对比不同运宫商的可用性差异。')
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.topSummary}>
                    <div class={styles.left}>
                      <span>检测节点：</span>
                      <b>{nodeCountAvailability.value} 个</b>
                    </div>
                    <div class={styles.right}>
                      <span>节点可用率：</span>
                      <b>{avgAvail.value}%</b>
                    </div>
                  </div>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[7]} class={styles.chart} />
                    <div class={styles.rightTips}>
                      <div class={styles.title}>异常节点个数：</div>
                      <div class={styles.tip}>{bestAvail.value} </div>
                      <div class={styles.title}>正常节点个数：</div>
                      <div class={styles.tip}>{worstAvail.value} </div>
                    </div>
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
          <div class={styles.panel}>
            <ElTabs>
              <ElTabPane
                v-slots={{
                  label: () => generateToolTipTsx('可用率趋势图', '展示服务在一段时间内可用率的变化曲线。用于洞祭可用性的长期趋势、周期性波动以及定位故障发生的具体时间点和持续时间，是进行故障回溯与根因分析的关键依据。')
                }}
              >
                <Space direction='column' size={0} fill style={{ height: '270px' }}>
                  <div class={styles.chartContainer}>
                    <div ref={chartRefs[8]} class={styles.chart} />
                  </div>
                </Space>
              </ElTabPane>
            </ElTabs>
          </div>
        </div>
        <FormilyForm
          class={styles.tableFilter}
          ref={formilyForm2Ref}
          config={getTableSchema(commonTableRef)}
          effectHooks={effectHooks.value}
        />
        <CommonTable
          ref={commonTableRef}
          class={styles.tableContainer}
          columns={columns.value}
          listApi={getListApi}
          formatListParams={formatListParams}
          needPagination
        />
      </Space>
    )
  }
})
