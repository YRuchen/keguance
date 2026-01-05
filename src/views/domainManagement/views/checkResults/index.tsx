import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTag } from 'element-plus'
import { CommonPage, CommonModal, CommonTable, CommonDrawer, FormilyForm, Space } from '~/KeepUp'
import { getListApi, editApi, getRecordApi } from '~/api/domainManagement/checkResults'
import { hasPermission } from '~/utils/auth'
import { getFields } from './fields'
import { columns } from './constants'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'

import type { Ref } from 'vue'
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import type { ICommonObj, IExpose, ICommonModalExpose, ICommonDrawerExpose, IFormilyFormExpose } from '~/KeepUp'

export default defineComponent({
  name: 'CheckResults',
  setup() {
    const router = useRouter()
    const commonPageRef = ref<IExpose>()
    const commonModalRef = ref<ICommonModalExpose>()
    const commonDrawerRef = ref<ICommonDrawerExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed<Form>(() => formilyFormRef.value?.formRef)
    const schema: Ref<ISchema> = ref({})
    const detail = ref<ICommonObj>({})
    const fields = ref(getFields({ router, commonDrawerRef, formRef, schema, detail }))
    const formatListParams = (params: ICommonObj) => {
      return {
        ...params,
      }
    }
    const formatEditParams = (params: ICommonObj) => {
      return {
        oldDomain: params.domain,
        newDomain: params.newDomain,
      }
    }
    return () => (
      <>
        <CommonPage
          ref={commonPageRef}
          fields={fields.value}
          listApi={getListApi}
          editApi={editApi}
          disabledAdd={!hasPermission(['domain:post'])}
          formatListParams={formatListParams}
          formatEditParams={formatEditParams}
          pageKey='checkResults'
          filterColumns={3}
          rowKey='id'
          refreshable
          needPagination
        />
        <CommonModal
          ref={commonModalRef}
          size='70%'
          title='替换记录'
          v-slots={{
            default: () => <CommonTable columns={columns} listApi={getRecordApi} needPagination />,
          }}
        />
        <CommonDrawer
          ref={commonDrawerRef}
          v-slots={{
            title: () => (
              <Space>
                <ElTag type={detail.value.status}>{detail.value?.label}</ElTag>
                <div >{detail.value.title}</div>
                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '4px 8px', boxSizing: 'border-box' }}>{detail.value.createdAt}</div>
              </Space>
            ),
            default: () => (
              <FormilyForm
                ref={formilyFormRef}
                config={schema.value}
              />
            ),
          }}
        />
      </>
    )
  },
})
