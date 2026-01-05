import { ref, nextTick, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { operatorOptions } from '../../constants'

export interface UseOperatorSuggestOptions {
  /** 输入元素引用 */
  el: Ref<HTMLElement | null>
  /** 当前值 */
  value: Ref<string>
  /** 值更新回调 */
  onUpdate: (newValue: string) => void
  /** 显示建议回调 */
  onShowSuggest?: (position: { top: number; left: number }) => void
  /** 隐藏建议回调 */
  onHideSuggest?: () => void
}

/**
 * 检测光标左侧是否为 `:` 并管理操作符下拉列表
 */
export function useOperatorSuggest({ el, value, onUpdate, onShowSuggest, onHideSuggest }: UseOperatorSuggestOptions) {

  /** 获取光标左侧第一个字符 - 简化版本 */
  const getLeftChar = (): string => {
    if (!el.value) return ''
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return ''
    
    try {
      const range = selection.getRangeAt(0)
      
      // 确保 range 在元素内部
      if (!el.value.contains(range.startContainer) && range.startContainer !== el.value) {
        return ''
      }
      
      // 创建一个从元素开始到光标位置的 range，获取文本
      const rangeClone = range.cloneRange()
      
      // 尝试从元素开始设置
      try {
        rangeClone.setStart(el.value, 0)
      } catch (e) {
        // 如果失败，尝试找到第一个文本节点
        const walker = document.createTreeWalker(
          el.value,
          NodeFilter.SHOW_TEXT,
          null
        )
        const firstTextNode = walker.nextNode()
        if (firstTextNode) {
          rangeClone.setStart(firstTextNode, 0)
        } else {
          return ''
        }
      }
      
      rangeClone.setEnd(range.startContainer, range.startOffset)
      const textBefore = rangeClone.toString()
      
      // 返回最后一个字符
      return textBefore.length > 0 ? textBefore[textBefore.length - 1] : ''
    } catch (e) {
      // 如果所有方法都失败，尝试使用 textContent
      const textContent = el.value.textContent || ''
      if (textContent.length === 0) return ''
      
      // 简单方法：假设光标在文本末尾（大多数情况）
      return textContent[textContent.length - 1]
    }
  }

  /** 获取光标位置（相对于小方块元素） */
  const getCaretPosition = (): { top: number; left: number } | null => {
    if (!el.value) return null
    
    try {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return null

      const range = selection.getRangeAt(0)
      
      // 创建一个临时 range 来获取光标位置
      const tempRange = range.cloneRange()
      tempRange.collapse(true) // 折叠到开始位置
      
      const rect = tempRange.getBoundingClientRect()
      const elementRect = el.value.getBoundingClientRect()

      return {
        top: rect.bottom - elementRect.top + 2, // 光标下方 2px
        left: rect.left - elementRect.left
      }
    } catch (e) {
      return { top: 20, left: 0 } // 默认位置
    }
  }

  /** 在 `:` 后插入文本 */
  const insertAfterColon = (text: string) => {
    if (!el.value) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const textBeforeCursor = getTextBeforeCursor(el.value, range)
    const colonIndex = textBeforeCursor.lastIndexOf(':')
    
    if (colonIndex === -1) return

    const beforeColon = textBeforeCursor.slice(0, colonIndex)
    const afterCursor = getTextAfterCursor(el.value, range)
    const newText = beforeColon + ':' + text + afterCursor

    el.value.textContent = newText

    nextTick(() => {
      const newPosition = beforeColon.length + 1 + text.length
      const textNode = getTextNodeAtPosition(el.value!, newPosition)
      if (textNode) {
        const newRange = document.createRange()
        const offset = newPosition - getTextOffsetBeforeNode(el.value!, textNode)
        newRange.setStart(textNode, offset)
        newRange.setEnd(textNode, offset)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
      onUpdate(newText)
    })
  }

  /** 获取光标前的文本 */
  const getTextBeforeCursor = (container: HTMLElement, range: Range): string => {
    const rangeClone = range.cloneRange()
    rangeClone.setStart(container, 0)
    rangeClone.setEnd(range.startContainer, range.startOffset)
    return rangeClone.toString()
  }

  /** 获取光标后的文本 */
  const getTextAfterCursor = (container: HTMLElement, range: Range): string => {
    const rangeClone = range.cloneRange()
    rangeClone.setStart(range.endContainer, range.endOffset)
    rangeClone.setEnd(container, container.childNodes.length)
    return rangeClone.toString()
  }

  /** 获取指定位置的文本节点 */
  const getTextNodeAtPosition = (container: HTMLElement, position: number): Text | null => {
    let currentPos = 0
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node: Text | null = null
    while ((node = walker.nextNode() as Text | null)) {
      const nodeLength = node.textContent?.length || 0
      if (currentPos + nodeLength >= position) {
        return node
      }
      currentPos += nodeLength
    }
    return null
  }

  /** 获取节点前的文本偏移量 */
  const getTextOffsetBeforeNode = (container: HTMLElement, targetNode: Node): number => {
    let offset = 0
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node: Text | null = null
    while ((node = walker.nextNode() as Text | null)) {
      if (node === targetNode) break
      offset += node.textContent?.length || 0
    }
    return offset
  }

  /** 检查是否需要显示下拉列表 */
  const checkShouldShow = () => {
    console.log('[checkShouldShow] called')
    
    if (!el.value) {
      console.log('[checkShouldShow] el.value is null')
      onHideSuggest?.()
      return
    }

    // 确保元素有焦点
    const isFocused = document.activeElement === el.value
    console.log('[checkShouldShow] isFocused:', isFocused, 'activeElement:', document.activeElement, 'el.value:', el.value)
    
    if (!isFocused) {
      console.log('[checkShouldShow] not focused')
      onHideSuggest?.()
      return
    }

    const leftChar = getLeftChar()
    console.log('[checkShouldShow] leftChar:', leftChar, '=== ":"?', leftChar === ':')
    
    if (leftChar === ':') {
      console.log(1) // 检测到 `:` 字符
      const position = getCaretPosition()
      if (position) {
        // 获取小方块相对于外层div的位置
        const blockRect = el.value.getBoundingClientRect()
        const outerDiv = el.value.closest('.qb-inner')
        if (outerDiv) {
          const outerRect = (outerDiv as HTMLElement).getBoundingClientRect()
          // 计算相对于外层div的位置：外层div底部（下拉框显示在外层div下方）
          const relativePosition = {
            top: outerRect.height + 4, // 外层div高度 + 4px 间距
            left: 0 // 左对齐
          }
          onShowSuggest?.(relativePosition)
        } else {
          onShowSuggest?.(position)
        }
      }
    } else {
      onHideSuggest?.()
    }
  }

  /** 处理键盘事件 - 由父组件处理 */
  const handleKeydown = (e: KeyboardEvent) => {
    // 键盘事件由父组件处理
  }

  /** 实时检查焦点左侧字符 */
  const checkLeftChar = () => {
    if (!el.value || document.activeElement !== el.value) {
      return
    }
    
    const leftChar = getLeftChar()
    if (leftChar === ':') {
      console.log(1)
    }
  }

  /** 处理输入事件 */
  const handleInput = () => {
    // 延迟检查，确保 DOM 已更新
    setTimeout(() => {
      checkLeftChar()
    }, 0)
  }

  /** 处理按键事件 */
  const handleKeyup = () => {
    // 延迟检查，确保 DOM 已更新
    setTimeout(() => {
      checkLeftChar()
    }, 0)
  }

  /** 处理光标移动事件 */
  const handleSelectionChange = () => {
    if (el.value && document.activeElement === el.value) {
      checkLeftChar()
    }
  }

  /** 处理聚焦事件 */
  const handleFocus = () => {
    setTimeout(() => {
      checkLeftChar()
    }, 0)
  }

  /** 处理点击外部关闭下拉 */
  const handleClickOutside = (e: MouseEvent) => {
    if (!el.value) return
    const target = e.target as HTMLElement
    if (target.closest('.operator-suggestions')) {
      return
    }
    if (!el.value.contains(target)) {
      onHideSuggest?.()
    }
  }

  /** 绑定事件 */
  const bindEvents = () => {
    if (!el.value) return
    
    // 监听所有可能触发字符变化的事件
    el.value.addEventListener('input', handleInput)
    el.value.addEventListener('keyup', handleKeyup)
    el.value.addEventListener('keydown', handleKeydown)
    el.value.addEventListener('focus', handleFocus)
    el.value.addEventListener('click', () => {
      setTimeout(() => checkLeftChar(), 0)
    })
    
    // 监听全局选择变化（光标移动）
    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('click', handleClickOutside)
  }

  /** 解绑事件 */
  const unbindEvents = () => {
    if (!el.value) return
    
    el.value.removeEventListener('input', handleInput)
    el.value.removeEventListener('keyup', handleKeyup)
    el.value.removeEventListener('keydown', handleKeydown)
    el.value.removeEventListener('focus', handleFocus)
    document.removeEventListener('selectionchange', handleSelectionChange)
    document.removeEventListener('click', handleClickOutside)
  }

  // 监听 el 的变化
  watch(el, (newEl, oldEl) => {
    if (oldEl) {
      unbindEvents()
    }
    if (newEl) {
      nextTick(() => {
        bindEvents()
      })
    }
  }, { immediate: true })

  onMounted(() => {
    nextTick(() => {
      if (el.value) {
        bindEvents()
      }
    })
  })

  onUnmounted(() => {
    unbindEvents()
  })

  return {
    checkShouldShow,
    getOperatorSuggestState: () => ({
      insertAfterColon
    })
  }
}
