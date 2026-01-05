import { nextTick } from 'vue'
import { getTaskListByDomainApi, getDomainListApi } from '~/api/availabilityMonitoring/overview'
import { TimeType } from './constants'

import { Field } from "@formily/core"

export const getEffectHooks = (refresh: () => Promise<void>) => {
  /** 统一请求器 */
  const commonAction = async (field: Field) => {
    if (!field.selfModified) {
      return
    }
    refresh()
  }
  /** 将时间重置为【最近一次】，确保清空时间选择框 */
  const commonAction2 = async (field: Field) => {
    const timeField = field.query('.time')?.take() as Field
    const timeRangeField = field.query('.[fromTime,toTime]')?.take() as Field
    if (!timeField || !timeRangeField) {
      return
    }
    const isLaTest = timeField.value === TimeType.LATEST
    if (isLaTest) {
      timeRangeField.value = []
      await commonAction(field)
    } else {
      timeField.value = TimeType.LATEST
    }
  }
  const subTypeAction = async (field: Field) => {
    try {
      await nextTick()
      const domainField = field.query('.domain')?.take() as Field
      const res = await getDomainListApi(field.value)
      domainField.dataSource = res.list
      if (!domainField.value) {
        const timeField = field.query('.verticalSpace.filterGroup2.time')?.take() as Field
        timeField.value = TimeType.LATEST
      } else {
        domainField.value = ''
      }
    } catch (error: any) {
      console.error(`获取域名列表失败，失败原因：${error}`)
    }
  }
  return {
    fieldEffects: {
      'verticalSpace.filterGroup.subType': {
        onFieldInit: subTypeAction,
        onFieldValueChange: subTypeAction,
      },
      'verticalSpace.filterGroup.domain': {
        onFieldValueChange: async (field: Field) => {
          const testIdField = field.query('.testId')?.take() as Field
          const res = field.value 
            ? await getTaskListByDomainApi(field.value)
            : { list: [] }
          testIdField.dataSource = res.list || []
          const isEmpty = !testIdField.value
          if (isEmpty) {
            const timeField = field.query('.time')?.take() as Field
            const isLaTest = timeField.value === TimeType.LATEST
            if (!isLaTest) {
              timeField.value = TimeType.LATEST
            } else {
              refresh()
            }
            return
          }
          testIdField.value = undefined
        },
      },
      'verticalSpace.filterGroup.testId': {
        onFieldValueChange: commonAction2,
      },
      'verticalSpace.filterGroup2.time': {
        onFieldValueChange: async (field: Field) => {
          if (!field.value) {
            return
          }
          const timeRangeField = field.query('.[fromTime,toTime]')?.take() as Field
          if (timeRangeField?.value?.length) {
            timeRangeField.value = []
          }
          await commonAction(field)
        },
      },
      'verticalSpace.filterGroup2.[fromTime,toTime]': {
        onFieldValueChange: async (field: Field) => {
          if (!field.value?.length) {
            return
          }
          const timeField = field.query('.time')?.take() as Field
          if (timeField.value) {
            timeField.value = ''
          }
          await commonAction(field)
        },
      },
      'verticalSpace.filterGroup2.refreshRate': {
        onFieldValueChange: commonAction,
      },
    }
  }
}
