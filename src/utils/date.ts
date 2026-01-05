/** 转换日期格式 */
export const formatDate = (dateStr: string, format: 'HH:mm:ss.SSS') => {
  const date = new Date(dateStr)
  /** HH:mm:ss.SSS */
  const format1 = () => {
    const str1 = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `
    const str2 = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.`
    const str3 = `${String(date.getMilliseconds()).padStart(3, '0')}`
    return `${str1}${str2}${str3}`
  }
  /** format与转换函数的映射表 */
  const dateFormatMap = {
    'HH:mm:ss.SSS': format1,
  }
  return dateFormatMap[format]?.()
}

/** 获取当前时间 */
export const getCurTime = () => {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
