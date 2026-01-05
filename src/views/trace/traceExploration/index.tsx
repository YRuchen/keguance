import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CommonPage, CommonTable } from '~/KeepUp'
import { getListApi, getSpansListApi } from '~/api/trace/traceExploration'
import { searchTargetToFieldsMap, tracesExpandedColumns } from './constants'

import type { ICommonObj } from '~/interfaces/common'

export default defineComponent({
  name: 'TraceExploration',
  setup() {
    const router = useRouter()
    const curTarget = ref('TRACES')
    const isTraces = computed(() => curTarget.value === 'TRACES')
    const changeSearchTarget = (target: 'TRACES' | 'SPANS') => {
      curTarget.value = target
      fields.value = searchTargetToFieldsMap[target]?.(router, changeSearchTarget)
    }
    const fields = ref(searchTargetToFieldsMap.TRACES?.(router, changeSearchTarget))
    const formatListParams = (params: ICommonObj = {}) => {
      const traceId = params.traceID ? `trace:id="${params.traceID}"` : ''
      const spanId = params.spanID ? `span:id="${params.spanID}"` : ''
      const query = isTraces.value ? traceId : spanId
      return {
        q: `{${query}}`,
        start: params?.fromTime ? new Date(params.fromTime).getTime() / 1000 : '',
        end: params?.toTime ? new Date(params.toTime).getTime() / 1000 : '',
        limit: 20,
        spss: 3,
      }
    }
    const listApi = computed(() => (isTraces.value ? getListApi : getSpansListApi))
    const expandedRowTsx = computed(() =>
      isTraces.value
        ? (props) => (
            <CommonTable
              style={{ padding: '0 0 0 50px' }}
              columns={tracesExpandedColumns}
              listApi={async () => ({ list: props.row.spanSet.spans })}
            />
          )
        : undefined,
    )
    return () => (
      <CommonPage
        fields={fields.value}
        listApi={listApi.value}
        formatListParams={formatListParams}
        filterColumns={6}
        // pageKey='TraceExploration' // TODO: commonSetter的选项没有跟随变化，需要跟随变化
        rowKey='traceID'
        expandedRowRender={expandedRowTsx.value}
      />
    )
  },
})
