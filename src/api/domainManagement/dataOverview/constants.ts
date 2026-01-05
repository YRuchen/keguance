
export type DetectionStatus = 'normal' | 'error'
export interface DetectionCard {
  key: string
  title: string
  status: DetectionStatus
  errorCount?: number
  iconName?: string
}

export interface AlarmItem {
  id: string
  type: string
  typeLabel: string
  time: string
  taskName: string
  region: string
}

export interface ServiceStat {
  name: string
  open: number
  disabled: number
}

export interface DetectionStat {
  name: string
  total: number
  failed: number
}