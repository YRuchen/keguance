import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CommonPage } from '~/KeepUp'
import { getListApi, createApi, editApi } from '~/api/domainManagement/inspectionICP'
import { TaskType } from '~/api/domainManagement/common/constants'
import { useDomainMasterData } from '~/store/modules/useDomainMasterData'
import { hasPermission } from '~/utils/auth'
import { getFields } from './fields'

import type { ICommonObj, IExpose } from '~/KeepUp'

export default defineComponent({
  name: 'InspectionICP',
  setup() {
    const router = useRouter()
    const commonPageRef = ref<IExpose>()
    const domainMasterData = useDomainMasterData()
    const fields = ref(getFields({ router, commonPageRef, domainMasterData }))
    const formatListParams = (params: ICommonObj) => {
      return {
        ...params,
        taskType: TaskType.TASK_TYPE_ICP,
      }
    }
    return () => (
      <CommonPage
        ref={commonPageRef}
        fields={fields.value}
        listApi={getListApi}
        createApi={createApi}
        disabledAdd={!hasPermission(['domain:post'])}
        editApi={editApi}
        formatListParams={formatListParams}
        pageKey='inspectionICP'
        filterColumns={3}
        editorLayout={{
          columns: 1,
          labelStyle: {
            margin: 0,
          },
        }}
        rowKey='id'
        needPagination
      />
    )
  },
})
