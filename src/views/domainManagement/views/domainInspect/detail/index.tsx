import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElTag } from 'element-plus'
import { Space, CommonPage, CommonDrawer, FormilyForm } from '~/KeepUp'
import { getHistoryListApi, exportApi } from '~/api/domainManagement/domainInspect'
import { domainStatusMap } from '~/api/domainManagement/common'
import { getCurTime } from '~/utils/date'
import { getFields } from './fields'
import { getSchema } from './schema'

import type { ICommonDrawerExpose, IFormilyFormExpose, ICommonObj } from '~/KeepUp'

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
    const commonDrawerRef = ref<ICommonDrawerExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const activeRowData = ref<ICommonObj>({}) // 右侧列表中打开详情页弹窗的行
    const formatListParams = (params: ICommonObj) => {
      return { 
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !['startTime', 'endTime'].includes(key))),
        task: route?.query?.id, 
        startTimestamp: new Date(params.startTime)?.getTime(),
        endTimestamp: new Date(params.endTime)?.getTime(),
      }
    }
    const formatExportParams = (params: ICommonObj) => {
      return { 
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !['startTime', 'endTime'].includes(key))),
        task: route?.query?.id, 
        startTimestamp: new Date(params.startTime)?.getTime(),
        endTimestamp: new Date(params.endTime)?.getTime(),
        name: `${props.basicData?.name}-${getCurTime()}-域名检测数据明细`,
      }
    }
    return () => (
      <Space direction='row' style={{ height: '100%' }} fill>
        <CommonPage
          fields={getFields(commonDrawerRef, formRef, activeRowData)}
          listApi={getHistoryListApi}
          exportApi={exportApi}
          formatListParams={formatListParams}
          formatExportParams={formatExportParams}
          pageKey='domainInspectDetail'
          needPagination
        />
        <CommonDrawer
          ref={commonDrawerRef}
          v-slots={{
            title: () => (
              <Space>
                <ElTag type={domainStatusMap[activeRowData.value.domainExpiryStatus]?.type}>{domainStatusMap[activeRowData.value.domainExpiryStatus]?.label}</ElTag>
                <div >{activeRowData.value.domain}</div>
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
