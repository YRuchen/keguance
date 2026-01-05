import { useUserStore } from '@/store/modules/useAuthStore'

export function useSSEChat(params, options): AbortController {
  const baseURL = import.meta.env.VITE_APP_GATEWAY_OBSERVE || ''
  const userStore = useUserStore()
  const token: string = userStore.userInfo?.token || ''
  const abortController = new AbortController()

  // 检查必要的配置
  if (!baseURL) {
    const error = new Error('baseURL 未配置，请检查环境变量 VITE_APP_GATEWAY_OBSERVE')
    console.error(error)
    if (options.onError) {
      options.onError(error)
    }
    return abortController
  }

  if (!token) {
    const error = new Error('Token 未获取，请先登录')
    console.error(error)
    if (options.onError) {
      options.onError(error)
    }
    return abortController
  }

  fetch(`${baseURL}/api/v1/aichat/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
    signal: abortController.signal,
    cache: 'no-cache',
  })
    .then(async (res) => {
      // 检查 HTTP 状态
      if (!res.ok) {
        // 尝试读取错误信息
        let errorMessage = `HTTP error! status: ${res.status}`
        try {
          const errorText = await res.text()
          console.error('错误响应内容:', errorText)
          errorMessage = errorText || errorMessage
        } catch (e) {
          console.error('读取错误响应失败:', e)
        }
        throw new Error(errorMessage)
      }

      // 检查响应类型
      const contentType = res.headers.get('Content-Type') || ''
      if (!contentType.includes('text/event-stream') && !contentType.includes('text/plain')) {
        console.warn('响应 Content-Type 不是流式类型:', contentType)
      }

      if (!res.body) {
        throw new Error('接口未返回可读流')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = '' // 缓冲区，用于存储不完整的行
      let done = false
      while (!done) {
        const { value, done: readDone } = await reader.read()
        done = readDone

        if (!value) {
          console.warn('读取到空值，继续等待...')
          continue
        }

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留最后不完整的行

        if (lines.length > 0) {
          processSSELines(lines, options)
        }
      }

      // 流结束后处理剩余 buffer
      if (buffer.trim()) {
        processSSELines(buffer.split('\n'), options)
      }

      // 调用完成回调
      options.onComplete?.()
    })
    .catch((error) => {
      // eslint-disable-next-line
      if (error.name === 'AbortError') {
      } else {
        console.error('SSE 请求失败:', error)
        if (options.onError) {
          options.onError(error)
        }
      }
    })

  return abortController
}

/**
 * 处理 SSE 格式的行数据
 * @param lines 行数组
 * @param options 回调选项
 */
function processSSELines(lines: string[], options: any) {
  let completed = false
  const callComplete = () => {
    if (!completed) {
      completed = true
      options.onComplete?.()
    }
  }

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    if (trimmedLine.startsWith(': probe')) {
      continue
    }
    if (trimmedLine.startsWith('id:')) {
      continue
    }

    // 处理 event: 行
    if (trimmedLine.startsWith('event:')) {
      const eventType = trimmedLine.replace(/^event:\s*/, '').trim()
      if (eventType === 'complete') {
        callComplete()
      }
      continue
    }

    // 处理 data: 行
    if (trimmedLine.startsWith('data:')) {
      const dataStr = trimmedLine.replace(/^data:\s*/, '').trim()
      if (!dataStr) continue

      try {
        const json = JSON.parse(dataStr)
        // 处理完成标记
        if (json.type === 'complete') {
          callComplete()
          continue
        }

        if (json.messageId !== undefined && json.message !== undefined) {
          if (options.onMessage) {
            options.onMessage({
              messageId: json.messageId,
              message: json.message,
            })
          }
        }
      } catch (e) {
        // JSON 解析失败，可能是数据不完整，记录警告但不中断流程
        console.warn('解析 SSE 数据失败:', dataStr, e)
      }
    }
  }
}
