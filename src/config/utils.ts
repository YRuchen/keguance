
// 公共过滤空参数方法
export const filterEmptyParams = (obj: any) => {
  const isFormData = obj instanceof FormData
  if (!obj || isFormData) return obj
  const result = JSON.parse(JSON.stringify(obj))
  Object.keys(result).forEach((key) => {
    if (result[key] === '' || result[key] == null) {
      delete result[key]
    }
    if (typeof result[key] === 'object') {
      result[key] = filterEmptyParams(result[key])
    }
  })
  return result
}

/** 导出为csv格式 */
export const exportByCsv = (res: any, name?: string) => {
  const blob = new Blob([res])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name ? `${name}.csv` : '数据导出.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}
