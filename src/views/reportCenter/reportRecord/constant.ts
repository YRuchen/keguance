export const StatusLabelMap = {
  1: '生产',
  2: '预生产',
  3: '测试',
  4: '开发',
} as const

export type Status = keyof typeof StatusLabelMap
