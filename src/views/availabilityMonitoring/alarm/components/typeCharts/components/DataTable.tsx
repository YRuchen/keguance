import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { ElTooltip, ElSelect, ElOption, ElTable, ElTableColumn } from 'element-plus'
import { useRouter } from 'vue-router'
import { protocolOptions, ProtocolType } from '../constants'
import type { ITableResponse } from '~/api/availabilityMonitoring/situationAwareness/interfaces'
import styles from './DataTable.module.scss'
import dayjs from 'dayjs'

interface Props {
  title: string
  tip: string
  data: ITableResponse | null
  loading?: boolean
  filterValue: ProtocolType | 'ALL'
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
    filterValue: {
      type: String as () => ProtocolType | 'ALL',
      required: true,
    },
  },
  emits: ['update:filterValue'],
  setup(props: Props, { emit }) {
    const router = useRouter()
    const allOptions = [...protocolOptions]

    const handleDomainClick = async (domain: string) => {
      let params = { ...JSON.parse(localStorage.getItem('alarmParams')), keyword: domain }
      let dataFormat = null
      if (params.time === '30d') {
        delete params.time
        dataFormat = {
          ...params,
          fromTime: dayjs().startOf('day').subtract(30, 'day').toDate(),
          toTime: dayjs().startOf('day').toDate(),
        }
      } else {
        dataFormat = { ...params }
      }
      localStorage.setItem('alarmFilterParams', JSON.stringify(dataFormat))
      window.location.reload()
    }

    onBeforeUnmount(() => {
      localStorage.removeItem('alarmParams')
    })
    return () => (
      <div class={styles.dataTable}>
        <div class={styles.chartHeader}>
          <div class={[styles.chartHeader, styles.gap]}>
            <span class={styles.chartTitle}>{props.title}</span>
            <ElTooltip content={props.tip} placement='top'>
              <span class={styles.tipIcon}>?</span>
            </ElTooltip>
          </div>
          {/* <div class={styles.headerRight}>
            <ElSelect
              modelValue={props.filterValue}
              onUpdate:modelValue={(val) => emit('update:filterValue', val)}
              class={styles.filterSelect}
            >
              {allOptions.map((option) => (
                <ElOption key={option.value} label={option.label} value={option.value} />
              ))}
            </ElSelect>
          </div> */}
        </div>
        <div class={styles.tableContainer}>
          <ElTable data={props.data?.list || []} height={243}>
            <ElTableColumn prop='rank' label='排名' width='80' align='center' />
            <ElTableColumn prop='domain' label='域名/地址' min-width='200' show-overflow-tooltip>
              {{
                default: ({ row }: { row: any }) => (
                  <span class={styles.domainLink} onClick={() => handleDomainClick(row.domain)}>
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
