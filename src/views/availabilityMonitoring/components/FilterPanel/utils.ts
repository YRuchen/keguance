import type { ICheckBoxGroupsSchema } from './interfaces'

/** 生成完整schema模型 */
export const generateSchema = (schema: ICheckBoxGroupsSchema, selectedValues: Array<string[]>): ICheckBoxGroupsSchema => {
  return schema.map((v, index) => {
    const isAllChecked = selectedValues?.[index]?.length === v.children?.length
    return ({
      options: [],
      ...v,
      isAllChecked,
      isHalfChecked: !isAllChecked && Boolean(selectedValues?.[index]?.length),
    }) 
  })
}
