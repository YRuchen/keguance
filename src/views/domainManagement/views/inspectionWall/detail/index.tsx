import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty } from 'lodash'
import { ElRadioGroup, ElEmpty, ElTag } from 'element-plus'
import { getHistoryNodeListApi, getHistoryListApi, exportApi } from '~/api/domainManagement/inspectionWall'
import { Space, CommonPage, CommonTable, CommonDrawer, FormilyForm } from '~/KeepUp'
import { wallStatusMap } from '~/api/domainManagement/common'
import { getCurTime } from '~/utils/date'
import { filterKeys } from './constants'
import { getFields, getHistoryFields } from './fields'
import { getSchema } from './schema'
import styles from './index.module.scss'

import type { Ref } from 'vue'
import type { ICommonTableExpose, ICommonDrawerExpose, IFormilyFormExpose, ICommonObj } from '~/KeepUp'

const props = {
  basicData: {
    type: Object,
    default: () => ({}),
  },
}

export default defineComponent({
  name: 'Detail',
  props,
  setup(props) {
    const route = useRoute()
    const commonTableRef = ref<ICommonTableExpose>()
    const commonDrawerRef = ref<ICommonDrawerExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const activeFactor = ref('')
    const activeRowData = ref<ICommonObj>({}) // 右侧列表中打开详情页弹窗的行
    const isInit = ref(true)
    /** 清空左侧选中态 */
    const init = () => {
      activeRowData.value = {}
      activeFactor.value = ''
      isInit.value = false
    }
    /** 左侧列表 */
    const formatListParams = (params: ICommonObj = {}) => {
      if (!isInit.value) {
        commonTableRef.value?.getList()
      }
      init()
      return {
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !filterKeys.includes(key))),
        ...(isEmpty(activeRowData.value) ? {} : { nodeName: activeRowData.value.nodeName }),
      }
    }
    /** 导出 */
    const formatExportParams = (params: ICommonObj = {}) => {
      return {
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !['startTime', 'endTime'].includes(key))),
        task: route.query?.id,
        startTimestamp: new Date(params.startTime)?.getTime(),
        endTimestamp: new Date(params.endTime)?.getTime(),
        name: `${props.basicData?.name}-${getCurTime()}-域名检测数据明细`,
      }
    }
    /** 右侧结果列表 */
    const formatListParamsForTable = (params: ICommonObj = {}) => {
      return {
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !['startTime', 'endTime'].includes(key))),
        ...(isEmpty(activeRowData.value) ? {} : { nodeName: activeRowData.value.nodeName }),
        task: route.query?.id,
        startTimestamp: new Date(params.startTime)?.getTime(),
        endTimestamp: new Date(params.endTime)?.getTime(),
      }
    }
    const commonTableContentTsx = ({ data, height }) => {
      return (
        data.value?.length
          ? <ElRadioGroup 
              style={{ height }}
              class={styles.content}
              modelValue={activeFactor.value} 
              options={
                (data.value || []).map((item: ICommonObj) => ({
                  label: `${item.region} - ${item.nodeName}`,
                  value: item.nodeName,
                  border: true,
                }))
              }
              onChange={(value: string) => {
                activeFactor.value = value
                commonTableRef.value?.getList()
              }}
            />
          : <ElEmpty style={{ height }} class={styles.content} description='暂无数据' />
      )
    }
    const commonTableRightPaneTsx = ({ height }) => {
      const listApi = computed(() => async (params: Record<string, number> = {}) => {
        try {
          const curParams = activeFactor.value
            ? {
                ...(Object.fromEntries(Object.entries(params).filter(([key]) => filterKeys.includes(key))) || {}),
                nodeName: activeFactor.value,
                task: route.query?.id,
              }
            : {
                ...params,
                task: route.query?.id,
              }
          return await getHistoryListApi(curParams)
        } catch (error: any) {
          console.error(`获取右侧列表数据失败，失败原因:${error}`)
        }
      })
      return <CommonTable
        style={{ width: 'calc(100% - 326px)' }}
        ref={commonTableRef as Ref<ICommonTableExpose>}
        columns={getHistoryFields(commonDrawerRef, formRef, activeRowData)}
        formatListParams={formatListParamsForTable}
        height={height}
        listApi={listApi.value}
        needPagination
      />
    }
    return () => (
      <Space class={styles.container} direction='row' fill style={{ height: '100%' }}>
        <CommonPage
          fields={getFields()}
          listApi={getHistoryNodeListApi}
          exportApi={exportApi}
          formatListParams={formatListParams}
          formatExportParams={formatExportParams}
          filterColumns={3} 
          pageKey='inspectionWallInspectView'
          refreshable
          v-slots={{
            commonTableContent: commonTableContentTsx,
            commonTableRightPane: commonTableRightPaneTsx,
          }}
        />
        <CommonDrawer
          ref={commonDrawerRef}
          v-slots={{
            title: () => (
              <Space>
                <ElTag type={wallStatusMap[activeRowData.value.wallStatus]?.type}>{wallStatusMap[activeRowData.value.wallStatus]?.label}</ElTag>
                <div >{activeRowData.value.nodeName}</div>
                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '4px 8px', boxSizing: 'border-box' }}>{activeRowData.value.createdAt}</div>
              </Space>
            ),
            default: () => (
              <FormilyForm
                ref={formilyFormRef}
                config={getSchema()}
              />
            ),
          }}
        />
      </Space>
    )
  }
})
