import { defineComponent, nextTick, onMounted, onUnmounted, ref, watch, h } from 'vue'
import type { PropType } from 'vue'
import type { IConditionItemExpose } from './interfaces'
import { useOperatorSuggest } from './hooks/useOperatorSuggest'
import { operatorOptions } from '../constants'
import { ElButton, ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const placeCursorToEnd = (el: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

export default defineComponent({
  name: 'ConditionItem',
  props: {
    id: { type: Number, required: true },
    value: { type: String as PropType<string>, required: true },
    readonly: { type: Boolean, default: false }
  },
  emits: ['update:value', 'remove', 'showOperatorSuggest', 'hideOperatorSuggest'],
  setup(props, { emit, expose }) {
    const el = ref<HTMLElement | null>(null)
    const valueRef = ref(props.value)

    const getContent = () => el.value?.textContent ?? ''
    
    // 格式化内容，将 `:` 后面的操作符设置为橘色
    const formatContent = (text: string): string => {
      if (!text) return ''
      const colonIndex = text.lastIndexOf(':')
      if (colonIndex === -1) return text
      
      const beforeColon = text.slice(0, colonIndex + 1)
      const afterColon = text.slice(colonIndex + 1)
      
      if (!afterColon.trim()) return text
      
      // 转义 HTML 特殊字符的辅助函数
      const escapeHtml = (str: string) => {
        const div = document.createElement('div')
        div.textContent = str
        return div.innerHTML
      }
      
      // 使用常量中的操作符选项
      // 按长度从长到短排序，优先匹配长操作符
      const sortedOptions = [...operatorOptions].sort((a, b) => b.label.length - a.label.length)
      
      let operatorFound = ''
      let operatorEnd = 0
      
      // 检查是否以某个已知操作符开头
      for (const op of sortedOptions) {
        if (afterColon.startsWith(op.label)) {
          operatorFound = op.label
          operatorEnd = op.label.length
          break
        }
      }
      
      if (operatorFound) {
        // 找到已知操作符，只将操作符本身用 span 包裹
        const operatorText = afterColon.slice(0, operatorEnd)
        const afterOperator = afterColon.slice(operatorEnd)
        // 只有操作符是橘色，后面的内容保持原色
        return `${escapeHtml(beforeColon)}<span class="condition-item__operator">${escapeHtml(operatorText)}</span>${escapeHtml(afterOperator)}`
      }
      
      // 如果没有找到已知操作符，不进行格式化（保持原样）
      // 这样用户输入的内容不会变成橘色
      return escapeHtml(text)
    }
    
    const setContent = (val: string) => {
      if (!el.value) return
      
      // 保存当前光标位置（基于文本偏移量，更可靠）
      const selection = window.getSelection()
      let savedOffset = -1
      let isFocused = false
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (el.value.contains(range.startContainer) || range.startContainer === el.value) {
          isFocused = true
          // 计算光标在文本中的位置
          try {
            const rangeClone = range.cloneRange()
            rangeClone.setStart(el.value, 0)
            rangeClone.setEnd(range.startContainer, range.startOffset)
            savedOffset = rangeClone.toString().length
          } catch (e) {
            // 如果计算失败，尝试使用 range.startOffset
            if (range.startContainer.nodeType === Node.TEXT_NODE) {
              savedOffset = range.startOffset
            }
          }
        }
      }
      
      // 如果内容没有变化，只检查是否需要格式化
      if (el.value.textContent === val) {
        const formatted = formatContent(val)
        if (el.value.innerHTML !== formatted) {
          // 保存当前光标位置（在格式化之前）
          const currentSelection = window.getSelection()
          let currentOffset = -1
          if (currentSelection && currentSelection.rangeCount > 0) {
            const currentRange = currentSelection.getRangeAt(0)
            if (el.value.contains(currentRange.startContainer) || currentRange.startContainer === el.value) {
              try {
                const rangeClone = currentRange.cloneRange()
                rangeClone.setStart(el.value, 0)
                rangeClone.setEnd(currentRange.startContainer, currentRange.startOffset)
                currentOffset = rangeClone.toString().length
              } catch (e) {
                if (currentRange.startContainer.nodeType === Node.TEXT_NODE) {
                  currentOffset = currentRange.startOffset
                }
              }
            }
          }
          
          el.value.innerHTML = formatted
          
          // 恢复光标位置
          const offsetToRestore = isFocused && savedOffset >= 0 ? savedOffset : currentOffset
          if (offsetToRestore >= 0) {
            nextTick(() => {
              try {
                restoreCursorPosition(offsetToRestore)
                // 确保光标不在操作符span内部
                ensureCursorOutsideOperatorSpan()
                el.value!.focus()
              } catch (e) {
                placeCursorToEnd(el.value!)
                el.value!.focus()
              }
            })
          } else {
            // 如果没有保存的位置，将光标移到末尾
            nextTick(() => {
              placeCursorToEnd(el.value!)
              el.value!.focus()
            })
          }
        } else {
          // 即使 HTML 也相同，也要确保焦点在小方块内
          // 这可能是因为值相同但需要重新设置焦点
          if (!isFocused) {
            nextTick(() => {
              el.value!.focus()
              if (savedOffset >= 0) {
                try {
                  restoreCursorPosition(savedOffset)
                  ensureCursorOutsideOperatorSpan()
                } catch (e) {
                  placeCursorToEnd(el.value!)
                }
              } else {
                placeCursorToEnd(el.value!)
              }
            })
          } else {
            // 即使有焦点，也要确保光标不在操作符span内部
            nextTick(() => {
              ensureCursorOutsideOperatorSpan()
            })
          }
        }
        return
      }
      
      // 格式化内容
      const formatted = formatContent(val)
      
      // 更新内容
      el.value.innerHTML = formatted
      
      // 恢复光标位置
      if (isFocused && savedOffset >= 0) {
        nextTick(() => {
          try {
            restoreCursorPosition(savedOffset)
            // 确保光标不在操作符span内部
            ensureCursorOutsideOperatorSpan()
            el.value!.focus()
          } catch (e) {
            placeCursorToEnd(el.value!)
            el.value!.focus()
          }
        })
      } else {
        // 如果没有保存的位置，将光标移到末尾
        nextTick(() => {
          placeCursorToEnd(el.value!)
          el.value!.focus()
        })
      }
    }
    
    // 确保光标不在操作符span内部，如果在内部则移动到span外部（但在小方块内部）
    const ensureCursorOutsideOperatorSpan = () => {
      if (!el.value) return
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer
      
      // 检查光标是否在操作符span内部
      let node: Node | null = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer as Node
      
      while (node && node !== el.value) {
        if (node instanceof HTMLElement && node.classList.contains('condition-item__operator')) {
          // 光标在操作符span内部，使用 moveCursorAfterOperatorSpan 移动到span外部
          moveCursorAfterOperatorSpan(node)
          return
        }
        node = node.parentNode
      }
    }
    
    // 恢复光标位置到指定文本偏移量
    const restoreCursorPosition = (offset: number) => {
      if (!el.value) return
      
      const walker = document.createTreeWalker(
        el.value,
        NodeFilter.SHOW_TEXT,
        null
      )
      let currentPos = 0
      let targetNode: Text | null = null
      let targetOffset = 0
      
      let node: Text | null = null
      while ((node = walker.nextNode() as Text | null)) {
        const nodeLength = node.textContent?.length || 0
        if (currentPos + nodeLength >= offset) {
          targetNode = node
          targetOffset = offset - currentPos
          break
        }
        currentPos += nodeLength
      }
      
      if (targetNode) {
        // 检查目标节点是否在操作符span内部
        const operatorSpan = targetNode.parentElement?.closest('.condition-item__operator')
        if (operatorSpan && targetNode.parentElement === operatorSpan) {
          // 如果光标在操作符span内部，移动到span外部（span后面，但在小方块内部）
          moveCursorAfterOperatorSpan(operatorSpan as HTMLElement)
        } else {
          // 正常设置光标位置
          const newRange = document.createRange()
          newRange.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
          newRange.setEnd(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
          // 确保光标在 condition-item 内部
          ensureCursorInsideConditionItem()
        }
      } else {
        placeCursorToEnd(el.value)
      }
    }
    
    // 将光标移动到操作符 span 后面（在 condition-item 内部，不在外层 div 的 tailSpacer 中）
    const moveCursorAfterOperatorSpan = (operatorSpan: HTMLElement) => {
      if (!el.value) return
      
      // 确保 operatorSpan 在 el.value 内部
      if (!el.value.contains(operatorSpan)) {
        placeCursorToEnd(el.value)
        return
      }
      
      // 查找span后面的下一个节点（在 condition-item 内部）
      let nextNode: Node | null = operatorSpan.nextSibling
      
      // 跳过任何不在 condition-item 内部的节点
      while (nextNode) {
        // 如果下一个节点超出了 condition-item，停止查找
        if (!el.value.contains(nextNode)) {
          break
        }
        
        // 如果下一个节点是文本节点，将光标设置到文本节点开始
        if (nextNode.nodeType === Node.TEXT_NODE) {
          const newRange = document.createRange()
          newRange.setStart(nextNode, 0)
          newRange.setEnd(nextNode, 0)
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
          // 确保元素获得焦点
          el.value.focus()
          return
        }
        
        // 如果下一个节点是元素节点，查找其内部的第一个文本节点
        if (nextNode.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(
            nextNode,
            NodeFilter.SHOW_TEXT,
            null
          )
          const firstTextNode = walker.nextNode()
          if (firstTextNode && el.value.contains(firstTextNode)) {
            const newRange = document.createRange()
            newRange.setStart(firstTextNode, 0)
            newRange.setEnd(firstTextNode, 0)
            const selection = window.getSelection()
            if (selection) {
              selection.removeAllRanges()
              selection.addRange(newRange)
            }
            // 确保元素获得焦点
            el.value.focus()
            return
          }
        }
        
        nextNode = nextNode.nextSibling
      }
      
      // 如果没有找到后续文本节点，在span后面创建一个空的文本节点（在 condition-item 内部）
      // 使用零宽空格，这样不会被格式化逻辑清除
      const textNode = document.createTextNode('\u200B') // 零宽空格
      if (operatorSpan.parentNode && el.value.contains(operatorSpan.parentNode)) {
        operatorSpan.parentNode.insertBefore(textNode, operatorSpan.nextSibling)
        const newRange = document.createRange()
        newRange.setStart(textNode, 0)
        newRange.setEnd(textNode, 0)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(newRange)
        }
        // 确保元素获得焦点
        el.value.focus()
      } else {
        // 如果无法插入，将光标移到 condition-item 末尾
        placeCursorToEnd(el.value)
        el.value.focus()
      }
    }

    const handleUpdate = (newValue: string) => {
      valueRef.value = newValue
      emit('update:value', newValue)
    }

    // 使用操作符建议 hook
    const {
      checkShouldShow,
      getOperatorSuggestState
    } = useOperatorSuggest({
      el,
      value: valueRef,
      onUpdate: handleUpdate,
      onShowSuggest: (position) => {
        emit('showOperatorSuggest', { blockId: props.id, position })
      },
      onHideSuggest: () => {
        emit('hideOperatorSuggest', props.id)
      }
    })

    onMounted(() => {
      // 如果是只读模式，设置内容并格式化 OR 为橘色
      if (props.readonly) {
        if (el.value) {
          // 格式化内容，将 OR 设置为橘色
          const formatted = formatFastFilterContent(props.value)
          el.value.innerHTML = formatted
        }
      } else {
        setContent(props.value)
      }
    })
    
    // 格式化快速筛查内容，将 OR 设置为橘色
    const formatFastFilterContent = (text: string): string => {
      if (!text) return ''
      // 转义 HTML 特殊字符
      const escapeHtml = (str: string) => {
        const div = document.createElement('div')
        div.textContent = str
        return div.innerHTML
      }
      
      // 先确保 OR 两边有空格（处理可能没有空格的情况）
      // 将 "OR" 替换为 " OR "（前后各一个空格）
      let normalizedText = text.replace(/\bOR\b/gi, ' OR ')
      // 清理多余的空格（多个连续空格变为一个）
      normalizedText = normalizedText.replace(/\s+/g, ' ')
      
      // 将 " OR " 替换为橘色的 span
      const parts = normalizedText.split(/(\s+OR\s+)/i)
      let result = ''
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].match(/^\s+OR\s+$/i)) {
          result += `<span class="condition-item__operator">${escapeHtml(parts[i])}</span>`
        } else {
          result += escapeHtml(parts[i])
        }
      }
      return result
    }

    watch(
      () => props.value,
      (val) => {
        // 如果是只读模式，设置内容并格式化 OR 为橘色
        if (props.readonly) {
          if (el.value) {
            const formatted = formatFastFilterContent(val)
            el.value.innerHTML = formatted
          }
          valueRef.value = val
        } else {
          // 即使值相同，也要调用 setContent，因为可能需要重新格式化（比如操作符被删除后又选择同样的操作符）
          setContent(val)
          valueRef.value = val
        }
      }
    )

    // 获取光标左侧第一个字符
    const getLeftChar = (): string => {
      if (!el.value) return ''
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return ''
      
      try {
        const range = selection.getRangeAt(0)
        
        if (!el.value.contains(range.startContainer) && range.startContainer !== el.value) {
          return ''
        }
        
        const rangeClone = range.cloneRange()
        try {
          rangeClone.setStart(el.value, 0)
        } catch (e) {
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
        
        return textBefore.length > 0 ? textBefore[textBefore.length - 1] : ''
      } catch (e) {
        const textContent = el.value.textContent || ''
        if (textContent.length === 0) return ''
        return textContent[textContent.length - 1]
      }
    }

    // 获取光标位置（相对于外层div）
    const getCaretPositionForSuggest = (): { top: number; left: number } | null => {
      if (!el.value) return null
      
      try {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return null

        const range = selection.getRangeAt(0)
        const tempRange = range.cloneRange()
        tempRange.collapse(true)
        
        const rect = tempRange.getBoundingClientRect()
        const elementRect = el.value.getBoundingClientRect()

        const blockRect = el.value.getBoundingClientRect()
        const outerDiv = el.value.closest('.qb-inner')
        if (outerDiv) {
          const outerRect = (outerDiv as HTMLElement).getBoundingClientRect()
          return {
            top: outerRect.height + 4,
            left: 0
          }
        }
        
        return {
          top: rect.bottom - elementRect.top + 2,
          left: rect.left - elementRect.left
        }
      } catch (e) {
        return { top: 20, left: 0 }
      }
    }

    // 检查光标是否在小方块内部
    const isCursorInsideBlock = (): boolean => {
      if (!el.value) return false
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return false
      
      const range = selection.getRangeAt(0)
      // 检查 range 的 startContainer 是否在小方块内部
      return el.value.contains(range.startContainer) || range.startContainer === el.value
    }

    // 检查左侧字符是否为 `:`
    const checkLeftChar = () => {
      if (!el.value) {
        return
      }
      
      // 检查光标是否在小方块内部
      if (!isCursorInsideBlock()) {
        return
      }
      
      const leftChar = getLeftChar()
      if (leftChar === ':') {
        // 显示下拉框
        const position = getCaretPositionForSuggest()
        if (position) {
          emit('showOperatorSuggest', { blockId: props.id, position })
        }
      } else {
        // 隐藏下拉框
        emit('hideOperatorSuggest', props.id)
      }
    }

    // 事件处理函数
    // 原生 input 事件处理，确保所有输入方式（键盘、粘贴、拖拽等）都能触发更新
    // 这是主要的输入处理函数，因为 Vue 的 @input 在 contentEditable 上可能不工作
    const handleNativeInput = (e?: Event) => {
      // 如果是只读方块，不允许输入
      if (props.readonly) {
        // 阻止输入，恢复原值
        if (el.value) {
          el.value.textContent = props.value
        }
        return
      }
      
      // 如果正在从 observer 更新，跳过，防止循环
      if (isUpdatingFromObserver) {
        console.log('[handleNativeInput] Skipping because isUpdatingFromObserver is true')
        return
      }
      
      // 检查事件目标是否在当前元素内部
      if (e && e.target) {
        const target = e.target as Node
        // 如果事件目标不在当前元素内部，不处理
        if (!el.value || (!el.value.contains(target) && target !== el.value)) {
          console.log('[handleNativeInput] Event target is not inside condition-item, ignoring')
          return
        }
      }
      
      console.log('s------------>🚀🚀我在输入 (handleNativeInput)', e?.type, 'target:', e?.target, 'el.value:', el.value, 'textContent:', el.value?.textContent)
      // 立即获取并 emit，确保所有输入方式都能实时触发 updateBlock
      const txt = el.value?.textContent || ''
      console.log('[handleNativeInput] Current textContent:', txt)
      
      // 更新 lastTextContent，避免 MutationObserver 重复触发
      lastTextContent = txt
      
      // 立即更新，确保无论什么输入方式都能触发 updateBlock
      valueRef.value = txt
      emit('update:value', txt)
      console.log('[handleNativeInput] Emitted update:value with:', txt)
      
      if (txt === '') {
        emit('remove')
      }
      
      // 检查左侧字符
      setTimeout(() => {
        checkLeftChar()
        // 触发外层div检查搜索建议（通过selectionchange事件）
        const event = new Event('selectionchange', { bubbles: true })
        document.dispatchEvent(event)
      }, 0)
    }

    const handleKeyup = () => {
      setTimeout(() => {
        checkLeftChar()
        // 触发外层div检查搜索建议（通过selectionchange事件）
        const event = new Event('selectionchange', { bubbles: true })
        document.dispatchEvent(event)
      }, 0)
    }

    const handleFocus = () => {
      setTimeout(() => {
        checkLeftChar()
        // 触发外层div检查搜索建议（通过selectionchange事件）
        const event = new Event('selectionchange', { bubbles: true })
        document.dispatchEvent(event)
      }, 0)
    }

    const handleSelectionChange = () => {
      if (el.value && isCursorInsideBlock()) {
        checkLeftChar()
      }
    }

    const handleClick = () => {
      setTimeout(() => {
        checkLeftChar()
      }, 0)
    }

    // 处理删除键
    const handleKeydown = (e: KeyboardEvent) => {
      // 如果是只读方块，按删除键直接删除
      if (props.readonly && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault()
        e.stopPropagation()
        emit('remove')
        return
      }
      
      // 当内容为空且按删除键时，直接触发删除
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const txt = el.value?.textContent || ''
        if (txt === '' || txt.trim() === '') {
          e.preventDefault()
          e.stopPropagation()
          emit('remove')
          return
        }
      }
    }
    
    // 处理删除按钮点击
    const handleDeleteClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      emit('remove')
    }

    // 使用 MutationObserver 作为备用方案，监听内容变化
    let mutationObserver: MutationObserver | null = null
    let lastTextContent = ''
    let isUpdatingFromObserver = false // 防止循环更新的标志
    let observerTimeout: ReturnType<typeof setTimeout> | null = null
    
    const createMutationObserver = () => {
      if (!el.value) return
      
      mutationObserver = new MutationObserver(() => {
        // 如果正在从 observer 更新，跳过，防止循环
        if (isUpdatingFromObserver) {
          return
        }
        
        const currentText = el.value?.textContent || ''
        // 只有当内容真正改变时才触发
        if (currentText !== lastTextContent) {
          console.log('[MutationObserver] Content changed from', lastTextContent, 'to', currentText)
          
          // 清除之前的定时器
          if (observerTimeout) {
            clearTimeout(observerTimeout)
          }
          
          // 使用防抖，避免频繁触发
          observerTimeout = setTimeout(() => {
            // 设置标志，防止循环
            isUpdatingFromObserver = true
            lastTextContent = currentText
            
            try {
              // 只更新 valueRef 和 emit，不调用可能修改 DOM 的操作
              valueRef.value = currentText
              emit('update:value', currentText)
              console.log('[MutationObserver] Emitted update:value with:', currentText)
              
              if (currentText === '') {
                emit('remove')
              }
            } finally {
              // 重置标志
              isUpdatingFromObserver = false
            }
          }, 10) // 10ms 防抖
        }
      })
      
      mutationObserver.observe(el.value, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true
      })
      
      lastTextContent = el.value.textContent || ''
      console.log('[MutationObserver] Created and observing, initial textContent:', lastTextContent)
    }
    
    const destroyMutationObserver = () => {
      if (observerTimeout) {
        clearTimeout(observerTimeout)
        observerTimeout = null
      }
      if (mutationObserver) {
        mutationObserver.disconnect()
        mutationObserver = null
        console.log('[MutationObserver] Destroyed')
      }
      isUpdatingFromObserver = false
    }

    // 绑定事件
    const bindEvents = () => {
      if (!el.value) {
        console.log('[bindEvents] el.value is null, cannot bind events')
        return
      }
      
      // 如果是只读模式，只绑定删除相关事件
      if (props.readonly) {
        el.value.addEventListener('keydown', handleKeydown)
        el.value.addEventListener('click', handleClick)
        console.log('[bindEvents] Readonly mode: only bound keydown and click events')
        return
      }
      
      console.log('s------------>🚀🚀我在绑定事件 (bindEvents)', el.value)
      console.log('[bindEvents] Binding events to element:', el.value)
      
      // 尝试多种方式绑定 input 事件，确保能捕获到
      // 方式1: 在冒泡阶段绑定（正常方式）
      el.value.addEventListener('input', handleNativeInput, { capture: false, passive: false })
      // 方式2: 在捕获阶段也绑定（作为备用）
      el.value.addEventListener('input', handleNativeInput, { capture: true, passive: false })
      
      // 同时监听 beforeinput 事件作为备用
      el.value.addEventListener('beforeinput', (e: Event) => {
        console.log('[beforeinput] Event on condition-item:', e.type, 'target:', e.target)
      }, { capture: false, passive: false })
      
      // 创建 MutationObserver 作为备用方案
      createMutationObserver()
      
      el.value.addEventListener('keyup', handleKeyup)
      el.value.addEventListener('keydown', handleKeydown)
      el.value.addEventListener('focus', handleFocus)
      el.value.addEventListener('click', handleClick)
      document.addEventListener('selectionchange', handleSelectionChange)
      console.log('[bindEvents] Events bound successfully (both capture and bubble phases + MutationObserver)')
    }

    // 解绑事件
    const unbindEvents = () => {
      if (!el.value) return
      
      // 如果是只读模式，只解绑删除相关事件
      if (props.readonly) {
        el.value.removeEventListener('keydown', handleKeydown)
        el.value.removeEventListener('click', handleClick)
        return
      }
      
      // 销毁 MutationObserver
      destroyMutationObserver()
      
      // 注意：removeEventListener 需要与 addEventListener 使用相同的选项
      // 移除冒泡阶段的监听器
      el.value.removeEventListener('input', handleNativeInput, { capture: false } as any)
      // 移除捕获阶段的监听器
      el.value.removeEventListener('input', handleNativeInput, { capture: true } as any)
      
      el.value.removeEventListener('keyup', handleKeyup)
      el.value.removeEventListener('keydown', handleKeydown)
      el.value.removeEventListener('focus', handleFocus)
      el.value.removeEventListener('click', handleClick)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }

    // 监听 el 的变化并绑定事件
    watch(el, (newEl) => {
      if (newEl) {
        nextTick(() => {
          bindEvents()
        })
      } else {
        unbindEvents()
      }
    }, { immediate: true })

    onMounted(() => {
      console.log('[onMounted] Component mounted, el.value:', el.value)
      nextTick(() => {
        console.log('[onMounted] After nextTick, el.value:', el.value)
        if (el.value) {
          bindEvents()
        } else {
          console.warn('[onMounted] el.value is still null after nextTick')
        }
      })
    })

    onUnmounted(() => {
      unbindEvents()
    })

    // 注意：onInput 函数已移除，因为 Vue 的 @input 在 contentEditable 上不工作
    // 现在使用原生的 addEventListener('input', handleNativeInput) 来处理输入事件

    const focus = async (initVal?: string) => {
      await nextTick()
      if (!el.value) return
      if (initVal !== undefined) {
        setContent(initVal)
        valueRef.value = initVal
        emit('update:value', initVal)
      }
      el.value.focus()
      placeCursorToEnd(el.value)
    }

    const focusToEnd = () => {
      if (!el.value) return
      el.value.focus()
      placeCursorToEnd(el.value)
    }

    // 聚焦到指定文本位置（专门用于选择操作符后定位光标）
    const focusToPosition = (offset: number) => {
      if (!el.value) return
      el.value.focus()
      
      nextTick(() => {
        try {
          // 先尝试直接定位到操作符后面
          const operatorSpan = el.value.querySelector('.condition-item__operator') as HTMLElement
          if (operatorSpan) {
            // 直接使用 moveCursorAfterOperatorSpan 将光标移动到操作符后面
            moveCursorAfterOperatorSpan(operatorSpan)
            // 确保光标在 condition-item 内部
            ensureCursorInsideConditionItem()
          } else {
            // 如果没有操作符，使用 restoreCursorPosition
            restoreCursorPosition(offset)
            // 确保光标在 condition-item 内部
            ensureCursorInsideConditionItem()
          }
        } catch (e) {
          // 如果恢复失败，将光标移到末尾
          placeCursorToEnd(el.value!)
        }
      })
    }
    
    // 确保光标在 condition-item 内部（不在外层 div 的 tailSpacer 中）
    const ensureCursorInsideConditionItem = () => {
      if (!el.value) return
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      const startContainer = range.startContainer
      
      // 检查光标是否在 condition-item 内部
      let isInside = false
      let node: Node | null = startContainer
      
      // 检查是否在 tailSpacer（qb-caret-offset）中
      let isInTailSpacer = false
      while (node) {
        if (node === el.value) {
          isInside = true
          break
        }
        // 检查是否在 tailSpacer 中
        if (node instanceof HTMLElement && (node.classList.contains('qb-caret-offset') || node.dataset.tailSpacer !== undefined)) {
          isInTailSpacer = true
          break
        }
        node = node.parentNode
      }
      
      // 如果光标不在 condition-item 内部，或者在外层 div 的 tailSpacer 中，将其移到 condition-item 内部
      if (!isInside || isInTailSpacer) {
        // 查找操作符 span，将光标设置到 span 后面
        const operatorSpan = el.value.querySelector('.condition-item__operator') as HTMLElement
        if (operatorSpan) {
          // 使用 moveCursorAfterOperatorSpan 将光标移动到操作符后面
          moveCursorAfterOperatorSpan(operatorSpan)
        } else {
          // 如果没有操作符 span，将光标移到 condition-item 末尾
          placeCursorToEnd(el.value)
        }
      }
    }

    expose({
      focus,
      focusToEnd,
      focusToPosition
    } as IConditionItemExpose)

    return () => (
      <span
        class={['condition-item', { 'condition-item--readonly': props.readonly }]}
        data-block-id={props.id}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      >
        <span
          ref={el}
          class={['condition-item__content', { 'condition-item--readonly': props.readonly }]}
          contenteditable={!props.readonly}
          spellcheck={false}
          style={props.readonly ? { cursor: 'default' } : undefined}
        />
        {h(ElButton, {
          class: 'condition-item__delete-btn',
          type: 'text',
          size: 'small',
          icon: Close,
          onClick: handleDeleteClick,
          onMousedown: (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
          },
          title: '删除'
        })}
      </span>
    )
  }
})
