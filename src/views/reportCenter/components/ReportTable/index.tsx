import { defineComponent, ref, onMounted, computed, h, type VNodeChild } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElMessage,
  type TableColumnCtx,
} from 'element-plus'
import {
  getReportRecordList,
  previewReport,
  exportReport,
  regenerateReport,
  getReportTypes,
  getReportModules,
  subscribeReport,
} from '@/api/reportCenter'

import type { PropType } from 'vue'
import { FilterValues, ColumnItem, ListApi } from './interface'
import styles from './index.module.scss'

const props = {
  /**查询条件 */
  filterValues: {
    type: Object as PropType<FilterValues>,
    default: () => {},
  },
  /**列配置 */
  columns: {
    type: Array as PropType<ColumnItem[]>,
    required: true,
  },
  /**接口 */
  listApi: {
    type: Function as PropType<ListApi>,
    required: true,
  },
  /**显示页脚 */
  showPagination: {
    type: Boolean,
    default: true,
  },
}
export default defineComponent({
  name: 'ReportTable',
  props,
  setup(props, { emit, expose }) {
    const loading = ref(false)
    const tableData = ref([])

    const pagination = ref({
      page: 1,
      pageSize: 10,
      total: 0,
    })

    const getStatusLabel = (status?: number) => {
      const map: Record<number, string> = {
        1: '生产',
        2: '预生产',
        3: '测试',
        4: '开发',
      }
      return map[status || 0] || status || '-'
    }
    // 获取列表数据
    const fetchList = async () => {
      loading.value = true
      const { filterValues, listApi } = props

      try {
        const params: any = {
          page: pagination.value.page,
          pageSize: pagination.value.pageSize,
          ...filterValues,
        }
        const res = await listApi(params)
        if (res.code === 200) {
          tableData.value = res.data?.list || []
          pagination.value.total = res.data?.pagination?.total || 0
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        // ElMessage.error('获取列表失败')
      } finally {
        loading.value = false
      }
    }
    expose({
      fetchList,
    })
    return () => (
      <div class={styles.tablePage}>
        <ElTable v-loading={loading.value} data={tableData.value} style='width: 100%' stripe>
          {props.columns.map((col) =>
            h(
              ElTableColumn,
              {
                label: col?.label,
                prop: col?.prop,
                ...col.columnAttr,
              },
              col.render
                ? {
                    default: (scope) => col.render(scope),
                  }
                : undefined,
            ),
          )}
        </ElTable>
        {props.showPagination && (
          <ElPagination
            current-page={pagination.value.page}
            page-size={pagination.value.pageSize}
            total={pagination.value.total}
            page-sizes={[10, 20, 50, 100]}
            layout='total, sizes, prev, pager, next, jumper'
            style='margin-top: 16px; justify-content: flex-end'
            onSizeChange={(size) => {
              pagination.value.pageSize = size
              fetchList()
            }}
            onCurrentChange={(page) => {
              pagination.value.page = page
              fetchList()
            }}
          />
        )}
      </div>
    )
  },
})
