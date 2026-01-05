import { defineComponent, ref } from 'vue'
import { CommonPage } from '~/businessComponents'
import { getListApi } from '~/api/domainManagement/httpInspect'
import { getFields } from './fields'

import type { ICommonObj } from '~/interfaces/common'

export default defineComponent({
  name: 'HttpInspect',
  setup() {
    const fields = ref(getFields())
    const formatListParams = (params: ICommonObj) => {
      return {
        page: params?.pagination?.page,
        pageSize: params?.pagination?.pageSize,
        search: params?.domain,
        startDate: params?.fromTime,
        endDate: params?.toTime,
      }
    }
    return () => (
      <CommonPage
        fields={fields.value}
        listApi={getListApi}
        formatListParams={formatListParams}
        pageKey='httpInspect'
        filterColumns={6}
        rowKey='id'
        refreshable
        needPagination
      />
    )
  }
})
