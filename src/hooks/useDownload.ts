import { ref } from 'vue'
import type { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

export function useDownload() {
  const loading = ref(false)

  const download = async (response: AxiosResponse, fallbackName?: string) => {
    try {
      loading.value = true

      // 如果后端返回的是 JSON 错误，需要提示
      if (response.data instanceof Blob && response.data.type.includes('application/json')) {
        const text = await response.data.text()
        try {
          const errorJson = JSON.parse(text)
          ElMessage.error(errorJson.message || '导出失败')
        } catch {
          ElMessage.error('导出失败')
        }
        return
      }

      // 文件名处理
      let filename = fallbackName || 'download'

      const contentDisposition = response.headers?.['content-disposition']
      if (contentDisposition) {
        const result = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (result?.[1]) {
          filename = decodeURIComponent(result[1].replace(/['"]/g, ''))
        }
      }

      // 创建 Blob
      const blob = new Blob([response as any])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
    } catch (err) {
      console.error(err)
      ElMessage.error('文件下载失败')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    download,
  }
}
