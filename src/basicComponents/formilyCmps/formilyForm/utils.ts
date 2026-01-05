import type { Field } from "@formily/core"

/** 获取options */
export const fetchOptions = async (field: Field) => {
  try {
    const { api, formatter, remote } = field.componentProps?.fetchConfig || {} // TODO: 缺少实时获取数据功能
    const res = await api?.()
    field.dataSource = typeof formatter === 'function' ? formatter(res) : res
  } catch (error: any) {
    console.error(`获取options失败，失败原因：${error}`)
  }
}
