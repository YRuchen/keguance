import { defineComponent, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { CommonPage } from '~/KeepUp'
import { getListApi } from '~/api/domainManagement/hijackDetection'
import { TaskType } from '~/api/domainManagement/common/constants'
import { useDomainMasterData } from '~/store/modules/useDomainMasterData'
import { hasPermission } from '~/utils/auth'
import { getFields } from './fields'

import type { ICommonObj } from '~/interfaces/common'
import type { IExpose } from '~/businessComponents/commonPage'

export default defineComponent({
  name: 'HijackDetection',
  setup() {
    const router = useRouter()
    const commonPageRef = ref<IExpose>()
    const domainMasterData = useDomainMasterData()
    const fields = ref(getFields({ router, commonPageRef, domainMasterData }))
    const formatListParams = (params: ICommonObj) => {
      return {
        ...params,
        taskType: TaskType.TASK_TYPE_HIJACK,
      }
    }
    return () => (
      <CommonPage
        ref={commonPageRef}
        fields={fields.value}
        listApi={getListApi}
        formatListParams={formatListParams}
        pageKey='hijackDetection'
        filterColumns={4}
        rowKey='id'
        refreshable
        needPagination
        v-slots={{
          setterPrefix: () =>
            h(
              ElButton,
              {
                type: 'primary',
                disabled: !hasPermission(['domain:post']),
                onClick: () => {
                  router.push({ name: 'HijackDetectionCreate' })
                },
              },
              '新增',
            ),
        }}
      />
    )
  },
})
