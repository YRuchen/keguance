import IconFont from '@/KeepUp/packages/basicComponents/iconFont'
import dayjs from 'dayjs'
import { ElTable, ElTableColumn } from 'element-plus'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ITableResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import MyPopover from '../myPopover'
import styles from './DataTable.module.scss'

interface Props {
  title: string
  tip: string
  data: ITableResponse | null
  loading?: boolean
}

export default defineComponent({
  name: 'DataTable',
  props: {
    title: {
      type: String,
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
    data: {
      type: Object as () => ITableResponse | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:filterValue'],
  setup(props: Props, { slots }) {
    const router = useRouter()
    const { path } = useRoute()

    const handleDomainClick = (row: any) => {
      // 可以在这里添加点击事件处理
      let params = {
        ...JSON.parse(localStorage.getItem('alarmParams')),
        ...row,
        keyword: row.domain,
      }
      delete params.domain
      let dataFormat = null
      if (params.time === '30d') {
        delete params.time
        dataFormat = {
          ...params,
          fromTime: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          toTime: dayjs().startOf('day').subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
        }
      } else {
        dataFormat = params
      }
      localStorage.setItem('alarmFilterParams', JSON.stringify(dataFormat))
      if (path.split('/').pop() === 'alarm') {
        window.location.reload()
      } else {
        router.push('alarm')
      }
    }

    const colors = ['#FF0000', '#FF8400', '#FFC800']

    return () => (
      <div class={styles.dataTable}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            <MyPopover content={props.tip}></MyPopover>
          </div>
          <div class={styles.headerRight}>{slots.default?.()}</div>
        </div>
        <div class={styles.tableContainer}>
          <ElTable data={props.data?.list || []} height={243}>
            <ElTableColumn
              prop='rank'
              label='排名'
              width='80'
              align='right'
              header-align='right'
              v-slots={{
                default: ({ row }) => (
                  <span style='display:flex; align-items:center; justify-content:flex-end'>
                    {row.rank <= 3 ? (
                      <>
                        <IconFont name='error' color={colors[row.rank - 1]} size={14} />
                        {row.rank}
                      </>
                    ) : (
                      row.rank
                    )}
                  </span>
                ),
              }}
            />
            <ElTableColumn prop='domain' label='域名/地址' min-width='200' show-overflow-tooltip>
              {{
                default: ({ row }: { row: any }) => (
                  <span class={styles.domainLink} onClick={() => handleDomainClick(row)}>
                    {row.domain}
                  </span>
                ),
              }}
            </ElTableColumn>
            <ElTableColumn prop='count' label='告警次数' width='120' align='center' />
          </ElTable>
        </div>
      </div>
    )
  },
})
