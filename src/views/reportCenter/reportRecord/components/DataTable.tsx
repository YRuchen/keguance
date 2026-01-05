import { ElTable, ElTableColumn } from 'element-plus'
import { PropType, defineComponent, h, ref } from 'vue'
import type { ITableResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import { ColumnItem } from '~/basicComponents/ListTable/interface'
import styles from './DataTable.module.scss'

interface Props {
  title: string
  tip?: string
  data: Object
  columns: ColumnItem[] | null
  loading?: boolean
  maxHeight?: number
}

export default defineComponent({
  name: 'DataTable',
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
    columns: {
      type: Array as PropType<ColumnItem[]>,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    maxHeight: {
      type: Number,
      default: 256,
    },
  },
  setup(props: Props, { slots }) {
    return () => (
      <div class={styles.dataTable}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
          </div>
        </div>
        <div class={styles.tableContainer}>
          <ElTable
            v-loading={props.loading}
            data={props.data}
            style='width: 100%'
            maxHeight={props.maxHeight}
            stripe
          >
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
        </div>
      </div>
    )
  },
})
