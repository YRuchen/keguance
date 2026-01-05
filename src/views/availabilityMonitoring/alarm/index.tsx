import { defineComponent, ref, computed, nextTick, watch, onMounted } from 'vue'
import { ElTooltip, ElIcon } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { Space, CommonPage, CommonDrawer, FormilyForm } from '~/KeepUp'
import { getListApi } from '~/api/availabilityMonitoring/alarm'
import { getHistoryTaskDetail } from '~/api/availabilityMonitoring'
import {
  TaskResultStatus,
  taskResultStatusMap,
  taskResultStatusStyleMap,
} from '~/api/availabilityMonitoring/constants'
import useAvailabilityMasterData from '~/store/modules/useAvailabilityMasterData'
import { subTypeAll } from './constants'
import { getFields } from './fields'
import { getSchema } from './schema'
import { useChart } from './useChart'
import { useTypeCharts } from './components/typeCharts/useTypeCharts'
import { PanelId, chartTips } from '../situationAwareness/constants'
import ChartWrap from '../situationAwareness/chartWrap'
import DataTable from '../situationAwareness/components/DataTable'
import BarChart from '../situationAwareness/components/BarChart'
import StackedBarChart from '../situationAwareness/components/StackedBarChart'
import styles from './index.module.scss'
import typeChartsStyles from '../situationAwareness/index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'

import type { Field, Form } from '@formily/core'
import type { ICommonObj, IExpose, ICommonDrawerExpose, IFormilyFormExpose } from '~/KeepUp'
import type { IHistoryTaskResult } from '~/api/availabilityMonitoring/interfaces'

export default defineComponent({
  name: 'Alarm',
  setup() {
    const commonPageRef = ref<IExpose>()
    const commonDrawerRef = ref<ICommonDrawerExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed<Form>(() => formilyFormRef.value?.formRef)
    const chartRef = ref<HTMLDivElement>()
    const chartRef1 = ref<HTMLDivElement>()
    const chartRef2 = ref<HTMLDivElement>()
    const filterParams = ref({})
    const fields = ref([])
    const schema = ref({})
    const masterDataStore = useAvailabilityMasterData()
    const editorData = ref<Partial<IHistoryTaskResult>>({})
    const subType = ref('')
    const { updateChartsOptions } = useChart({ filterParams, chartRef, chartRef1, chartRef2 })
    const {
      alert4Data,
      alert5Data,
      alert6Data,
      loading: typeChartsLoading,
      refreshAllCharts: refreshTypeCharts,
    } = useTypeCharts()
    const formatListParams = async (params: ICommonObj) => {
      const result = {
        probeSubdivision: params?.node?.[1],
        probeRegionName: params?.node?.[0],
        ...Object.fromEntries(
          Object.entries(params).filter(
            ([k, v]) => !['node', 'page', 'pageSize', 'total'].includes(k),
          ),
        ),
        fromTime: params.fromTime ? new Date(params.fromTime).toISOString() : undefined,
        toTime: params.toTime ? new Date(params.toTime).toISOString() : undefined,
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total: params.total,
        },
      }
      subType.value = params.subType
      filterParams.value = result
      await nextTick()

      setTimeout(async () => {
        await updateChartsOptions()
        // 如果显示的是 TypeCharts，刷新三个图表
        if (subType.value !== subTypeAll && subType.value) {
          await refreshTypeCharts()
        }
      }, 300)
      return result
    }
    const openEditor = async ({ rowData }) => {
      try {
        editorData.value = await getHistoryTaskDetail({
          testId: rowData.testId,
          resultId: rowData.resultId,
        })
        commonDrawerRef.value?.open()
        schema.value = getSchema({
          protocol: rowData.subType,
          showFailReason: editorData.value?.basicData?.failCode !== 2,
          failSummary: editorData.value?.failSummary,
          isPassed: editorData.value?.basicData?.resultStatus === TaskResultStatus.PASSED,
          checkType: editorData.value.basicData.checkType,
        })
        await nextTick()
        formRef.value.values = editorData.value
      } catch (error) {
        console.error(`获取历史任务详情失败，失败原因：${error}`)
      }
    }
    const init = async () => {
      try {
        fields.value = getFields(openEditor)
        await masterDataStore.getMonitoringNodes()
        await nextTick()
        const formRef = commonPageRef.value.getFilterForm()
        const node = formRef.query('space.grid.monitoringNodeName.void.node')?.take() as Field
        const probeIspName = formRef
          .query('space.grid.monitoringNodeName.void.probeIspName')
          ?.take() as Field
        node.setDataSource(masterDataStore.masterData.monitoringNodes)
        probeIspName.setDataSource(masterDataStore.masterData.monitoringIsps)
      } catch (error: any) {
        console.error(`初始化历史任务列表失败，失败原因：${error}`)
      }
    }
    init()
    // 监听 subType 变化，当切换到非 ALL 时刷新图表
    watch(
      subType,
      async (newSubType) => {
        if (newSubType !== subTypeAll && newSubType) {
          await nextTick()
          setTimeout(async () => {
            await refreshTypeCharts()
          }, 300)
        }
      },
      { immediate: false },
    )
    const generateToolTipTsx = (content: string) => (
      <ElTooltip content={content} placement='top'>
        <ElIcon style='cursor: pointer; color: #909399;'>
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    )
    const extraPaneTsx = computed(() => {
      return subType.value === subTypeAll || !subType.value ? (
        <Space class={styles.extraPanel} direction='column' fill>
          <Space fill>
            <div class={styles.chartContainer}>
              <Space class={styles.title}>
                告警占比图
                {generateToolTipTsx(
                  '快速定位主要矛盾。通过图形化的占比，让您瞬间理解"哪一类问题最突出"，从而优先分配处理资源',
                )}
              </Space>
              <div ref={chartRef1} class={styles.lineContainer} />
            </div>
            <div class={styles.chartContainer}>
              <Space class={styles.title}>
                不同协议告警统计
                {generateToolTipTsx(
                  '统计并对比不同协议类型触发的告誓数量。用于定量分析各协议服务的稳定性，精准识别最脆弱的协议类型',
                )}
              </Space>
              <div ref={chartRef2} class={styles.lineContainer} />
            </div>
          </Space>
        </Space>
      ) : (
        <div class={typeChartsStyles.container}>
          {/* 第一块：两个图表 */}
          <ChartWrap chartNum={2}>
            <DataTable
              title='异常域名/地址 TOP10'
              tip={chartTips[PanelId.ALERT_4]}
              data={alert4Data.value}
              loading={typeChartsLoading.alert4}
            />
            <StackedBarChart
              title='不同运营商异常统计'
              tip={chartTips[PanelId.ALERT_5]}
              data={alert5Data.value}
              loading={typeChartsLoading.alert5}
              showxAxis={false}
            />
          </ChartWrap>
          {/* 第二块：一个柱状图 */}
          <ChartWrap chartNum={1}>
            <BarChart
              title='不同区域告警统计'
              tip={chartTips[PanelId.ALERT_6]}
              data={alert6Data.value}
              loading={typeChartsLoading.alert6}
            />
          </ChartWrap>
        </div>
      )
    })
    onMounted(() => {
      const el = document.querySelector('.app-main')
      el && (el.scrollTop = 0)
    })
    return () => (
      <div class={styles.container}>
        <CommonPage
          ref={commonPageRef}
          fields={fields.value}
          listApi={getListApi}
          formatListParams={formatListParams}
          pageKey='alarm'
          filterColumns={3}
          rowKey='testId'
          refreshable
          needPagination
          v-slots={{
            extraPane: () => (
              <div>
                <div class={styles.chartContainer}>
                  <Space class={styles.title}>
                    告警趋势图
                    {generateToolTipTsx(
                      '从时间维度洞祭告警的动态变化，是发现周期性故障、评估故障影响时长和验证修复效果的关键',
                    )}
                  </Space>
                  <div ref={chartRef} class={styles.lineContainer} />
                </div>
                {extraPaneTsx.value}
              </div>
            ),
          }}
          onRowClick={({ rowData }) => {
            openEditor?.({ rowData })
          }}
        />
        <CommonDrawer
          ref={commonDrawerRef}
          v-slots={{
            title: () => (
              <Space align='end'>
                <el-tag type={taskResultStatusStyleMap[editorData.value?.basicData?.resultStatus]}>
                  {taskResultStatusMap[editorData.value?.basicData?.resultStatus]}
                </el-tag>
                <el-text style={{ fontWeight: 'bold' }}>
                  {editorData.value?.basicData?.monitoringNodeName}
                </el-text>
                <el-text size='small'>{editorData.value?.basicData?.execTime}</el-text>
              </Space>
            ),
            default: () => <FormilyForm ref={formilyFormRef} config={schema.value} />,
          }}
        />
      </div>
    )
  },
})
