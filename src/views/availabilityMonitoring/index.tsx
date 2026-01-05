import { defineComponent, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { CommonPage, Space } from "~/KeepUp"
import { getListApi, getListExtraApi } from '~/api/availabilityMonitoring'
import { TaskType, taskTypeMap, taskMethodMap, ResultStatus } from '~/api/availabilityMonitoring/constants'
import { getFields } from './fields'
import { batchActions, PanelType } from './constants'
import InfoPanel from './components/InfoPanel'
import FilterPanel from './components/FilterPanel'
import successIcon from '~/assets/availabilityMonitoring/success.png'
import failIcon from '~/assets/availabilityMonitoring/fail.png'
import { hasPermission } from '~/utils/auth'
import styles from './index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'

import type { ICommonObj, IExpose } from '~/KeepUp'
import type { IExtra, IListItem } from '~/api/availabilityMonitoring/interfaces'
import type { IExpose as IFilterExpose } from './components/FilterPanel/interfaces'

export default defineComponent({
  name: 'AvailabilityMonitoring',
  setup() {
    const router = useRouter()
    const timer = ref(-1)
    const filterPanelRef = ref<IFilterExpose>()
    const commonPageRef = ref<IExpose>()
    const fields = ref(getFields({ router, commonPageRef }))
    const selectedValues = ref<Array<string[]>>([]) // 左侧筛选区的选中项
    const selected = ref<IListItem[]>([]) // 选中数据
    const selectedKeys = computed(() => selected.value.map(v => v.id)) // 选中数据的key
    const resultStatus = ref<ResultStatus | ''>('') // 卡片拨测结果
    const extra = ref<Partial<IExtra>>({}) // 顶部卡片和左侧快速筛查
    const ready = ref(false) // 数据加载完成
    const commonAction = (panelType: PanelType, val: ResultStatus | '' | Array<string[]>) =>{
      const isTaskGroup = panelType === PanelType.TASK_GROUP
      resultStatus.value = isTaskGroup ? (val as ResultStatus | '') : ''
      selectedValues.value = isTaskGroup ? [] : (val as Array<string[]>)
      if (isTaskGroup) {
        filterPanelRef.value.ignoreNextWatch()
      }
      commonPageRef.value?.query()
    }
    const formatListParams = async (params: ICommonObj) => {
      await updateExtra() // 会在初始化时调用两次
      const result = Object.fromEntries(
        (extra.value?.filterFast || [])
          .map(v => ([v.key, `${v.children.filter(v1 => selectedValues.value.flat().includes(v1.value)).map(v1 => v1.value).join(',')}`]))
          .filter(v => v?.[1]?.length)
      )
      return {
        ...params,
        ...(resultStatus.value ? { resultStatus: resultStatus.value, time: '1HOUR' } : result),
      }
    }
    const updateExtra = async () => {
      const extraData = await getListExtraApi()
      extra.value = {
        ...extraData,
        taskGroup: extraData.taskGroup.map((v) => ({
          ...v,
          icon: v.type === TaskType.SUCCESS ? successIcon : failIcon,
          total: { ...v.total, label: taskTypeMap[v.type] },
          taskList: Object.entries(v)
            .filter(([k]) => !['type', 'total'].includes(k))
            .map(([k, v]) => ({ ...v, label: taskMethodMap[k] })),
        }))
      }
    }
    const onClearInterval = () => {
      clearInterval(timer.value)
      timer.value = -1
    }
    /** 1小时刷新一次列表 */
    const onInterval = () => {
      onClearInterval()
      timer.value = setInterval(() => {
        commonPageRef.value?.query()
      }, 3600000) as unknown as number
    }
    const init = async () => {
      try {
        onInterval()
        await updateExtra()
        selectedValues.value = (extra.value.filterFast || []).map(v => v.children.map(v1 => v1.value))
        ready.value = true
      } catch (error: any) {
        console.error(`获取额外信息失败，失败原因：${error}`)
      }
    }
    init()
    onUnmounted(() => {
      onClearInterval()
    })
    const setterPrefix = () => (
      <>
        <el-button disabled={!hasPermission(['line:post'])} onClick={() => { router.push({ path: 'create' }) }}>新建任务</el-button>
        <el-dropdown>
          {{
            default: () => (
              <el-button type="primary">
                批量操作
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
            ),
            dropdown: () => (
              <el-dropdown-menu>
                {batchActions(commonPageRef)?.map(v => (
                  <el-dropdown-item onClick={() => { v.onClick?.(selectedKeys.value, selected.value) }}>{v.label}</el-dropdown-item>
                ))}
              </el-dropdown-menu>
            )
          }}
        </el-dropdown>
      </>
    )
    return () => (
      <Space class={styles.main} fill size={0}>
        {
          ready.value 
          && (
            <>
              <FilterPanel
                ref={filterPanelRef}
                schema={extra.value.filterFast} 
                selectedValues={selectedValues.value} 
                onUpdate:selectedValues={(val: Array<string[]>) => {
                  commonAction(PanelType.FILTER_FAST, val)
                }}
              />
              <div class={styles.commonPage}>
                <Space class={styles.infoPanelGroup} size={16}>
                  {(extra.value?.taskGroup || []).map(v => (
                    <InfoPanel
                      key={v.type}
                      data={v}
                      resultStatus={resultStatus.value}
                      onUpdate:resultStatus={(val: ResultStatus) => {
                        commonAction(PanelType.TASK_GROUP, val)
                      }}
                    />
                  ))}
                </Space>
                <div style={{ height: 'calc(100% - 242px)' }}>
                  <CommonPage
                    ref={commonPageRef}
                    fields={fields.value}
                    listApi={getListApi}
                    formatListParams={formatListParams}
                    selected={selected.value}
                    filterColumns={6}
                    rowKey='id'
                    pageKey='availabilityMonitoring'
                    selectable
                    needPagination
                    singleActionBar
                    onUpdate:selected={(val: any) => { selected.value = val }}
                    onRowClick={({ rowData }) => {
                      router.push({
                        path: 'overviewPage', 
                        query: {
                          testId: rowData.id,
                          requestType: rowData.requestType,
                          resultStatus: rowData.resultStatus,
                        }
                      })
                    }}
                    v-slots={{ setterPrefix }}
                  />
                </div>
              </div>
            </>
          )
        }
      </Space>
    )
  }
})
