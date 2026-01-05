import { Protocol } from '~/api/availabilityMonitoring/constants'

/** 请求类型-全部 */
export const subTypeAll = 'ALL'

/** 请求类型 */
export const subTypeOptions = [
  { label: '全部', value: subTypeAll },
  { label: 'HTTP', value: Protocol.HTTP },
  { label: 'TCP', value: Protocol.TCP },
  { label: 'UDP', value: Protocol.UDP },
  { label: 'GRPC', value: Protocol.GRPC },
  { label: 'SSL', value: Protocol.SSL },
  { label: 'DNS', value: Protocol.DNS },
  { label: 'WEBSOCKET', value: Protocol.WEBSOCKET },
]

/** 告警优先级 */
export const AlertPriority = {
  1: {
    type: 'danger',
    text: 'P1(严重)',
  },
  2: {
    type: 'warning',
    text: 'P2(高)',
  },
  3: {
    type: 'info',
    text: 'P3(中)',
  },
  4: {
    type: 'success',
    text: 'P4(低)',
  },
  5: {
    type: 'primary',
    text: 'P5',
  },
}
