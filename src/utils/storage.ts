/** 存储 */
export function setStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error: any) {
    console.error(`设置localStorage失败，失败原因：${error}`)
  }
}

/** 获取 */
export function getStorage(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (error: any) {
    console.error(`获取localStorage失败，失败原因: ${error}`)
  }
}

/** 删除 */
export function removeStorage(key: string) {
  localStorage.removeItem(key)
}

/** 清空 */
export function clearStorage() {
  localStorage.clear()
}
