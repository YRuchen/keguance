import type { ISchema } from '@formily/vue'
import type { IField } from '~/interfaces/commonPage'

/** 将table的field转为formily的jsonSchema */
export const formatTableToFormily = (field: IField, key: 'filterConfig' | 'editConfig'): ISchema => {
  return {
    [field.prop]: {
      ...field[key],
      title: field.label,
    },
  }
}
