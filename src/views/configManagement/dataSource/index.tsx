import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { CommonPage } from '~/businessComponents'
import { getDataSourceList, getDataSourceDetail } from '~/api/configManagement/dataSource'

import { getFields } from './fields'
import DataSourceTypeDialog from './components/SelectType/index'
import DataSourceDetailDrawer from './components/Detail'
import emitter from '~/utils/emitter'

import type { ICommonObj } from '~/interfaces/common'
import type { IExpose } from '~/businessComponents/commonPage'
import type { DataSourceDetail } from '~/api/configManagement/dataSource/interfaces'

export default defineComponent({
  name: 'DataSource',
  setup() {
    const router = useRouter()
    const commonPageRef = ref<IExpose>()
    const fields = ref(getFields({ router, commonPageRef }))
    const loading = ref(false)

    // 弹框和抽屉状态
    const showTypeDialog = ref(false)
    const showDetailDrawer = ref(false)
    const selectedDataSource = ref<DataSourceDetail | null>(null)

    const formatListParams = (params: ICommonObj) => {
      return {
        ...params,
      }
    }

    const handleCreate = () => {
      showTypeDialog.value = true
    }

    const handleTypeSelect = (typeId: string) => {
      router.push({
        path: 'dataSourceForm',
        query: { type: typeId },
      })
    }

    const handleShowDetail = async (dataSource) => {
      try {
        showDetailDrawer.value = true
        loading.value = true
        const res = await getDataSourceDetail(dataSource.id)
        selectedDataSource.value = res.data.datasource
      } finally {
        loading.value = false
      }
    }
    // 监听事件总线
    onMounted(() => {
      emitter.on('showDataSourceDetail', handleShowDetail)
    })

    onUnmounted(() => {
      emitter.off('showDataSourceDetail', handleShowDetail)
    })

    return () => (
      <>
        <CommonPage
          ref={commonPageRef}
          fields={fields.value}
          listApi={getDataSourceList}
          formatListParams={formatListParams}
          pageKey='dataSource'
          filterColumns={5}
          rowKey='id'
          needPagination
          v-slots={{
            setterPrefix: () => (
              <>
                <ElButton type='primary' icon={Plus} onClick={handleCreate}>
                  新增
                </ElButton>
              </>
            ),
          }}
        />

        {/* 数据源类型选择弹框 */}
        <DataSourceTypeDialog
          modelValue={showTypeDialog}
          onUpdate:modelValue={(val: boolean) => {
            showTypeDialog.value = val
          }}
          onSelect={handleTypeSelect}
        />
        <div v-loading={loading.value}>
          {/* 数据源详情抽屉 */}
          <DataSourceDetailDrawer
            modelValue={showDetailDrawer}
            onUpdate:modelValue={(val: boolean) => {
              showDetailDrawer.value = val
            }}
            loading={loading.value}
            dataSource={selectedDataSource.value}
          />
        </div>
      </>
    )
  },
})
