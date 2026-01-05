import { defineComponent, nextTick, ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { ElIcon } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import ConditionItem from './conditionItem'
import OperatorSuggestions from './conditionItem/components/OperatorSuggestions'
import { operatorOptions, Operators } from './constants'
import './index.scss'

import type { PropType } from 'vue'
import type { IConditionItemExpose } from './conditionItem/interfaces'
import type { IBlock } from './interfaces'

export interface SuggestionOption {
  label: string
  value: string
}

// 将光标移动到元素末尾
const placeCursorToEnd = (el: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

export interface QueryCondition {
  field: string
  operator: string
  value: string
}

export interface ICondition {
  logic: 'LOGIC_AND' | 'LOGIC_OR'
  conditions: {
    field: string
    operator: string
    value: string
  }[]
}

export default defineComponent({
  name: 'QueryBuilder',
  props: {
    /** 搜索建议选项列表 */
    suggestions: {
      type: Array as PropType<SuggestionOption[]>,
      default: () => []
    }
  },
  emits: ['search', 'fastFilterRestore', 'update:queryCondition'],
  setup(props, { emit, expose }) {
    // blocks 仅存 id / value
    const blocks = ref<IBlock[]>([])
    // 存放子实例，key 为 block.id
    const blockRefs: Record<number, IConditionItemExpose | null> = {}
    // 外层末端的可编辑输入节点（inline span）
    const inputBox = ref<HTMLElement | null>(null)
    const tailSpacer = ref<HTMLElement | null>(null)
    
    // 操作符建议下拉框状态
    const showOperatorSuggest = ref(false)
    const operatorSuggestPosition = ref<{ top: number; left: number } | null>(null)
    const operatorSuggestSelectedIndex = ref(0)
    const operatorSuggestBlockId = ref<number | null>(null)
    
    // 搜索建议下拉框状态（外层div的）
    const showSearchSuggest = ref(false)
    const searchSuggestPosition = ref<{ top: number; left: number } | null>(null)
    const searchSuggestSelectedIndex = ref(0)
    // 保存点击前的选择状态
    const savedSelectionRange = ref<Range | null>(null)
    // 搜索框宽度（用于下拉框宽度）
    const inputBoxWidth = ref<number>(0)

    const isTailNode = (node: Node | null) =>
      node instanceof HTMLElement && node.dataset.tailSpacer !== undefined

    const countBlocksBeforeOffset = (offset: number) => {
      const container = inputBox.value
      if (!container) return 0
      const nodes = Array.from(container.childNodes).slice(0, offset)
      return nodes.reduce((sum, node) => {
        if (isTailNode(node)) return sum
        if (node instanceof HTMLElement && node.dataset.blockId) return sum + 1
        return sum
      }, 0)
    }

    const getClosestBlockEl = (node: Node | null): HTMLElement | null => {
      if (!node) return null
      if (node instanceof HTMLElement) {
        if (node.classList.contains('condition-item')) return node
        return node.closest('.condition-item') as HTMLElement | null
      }
      return node.parentElement?.closest('.condition-item') as HTMLElement | null
    }

    const getInsertIndex = () => {
      const container = inputBox.value
      // 如果 blocks 为空，直接返回 0
      if (!container || blocks.value.length === 0) return 0
      
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return blocks.value.length
      const range = sel.getRangeAt(0)
      if (!container.contains(range.startContainer)) return blocks.value.length

      if (range.startContainer === container) {
        const index = countBlocksBeforeOffset(range.startOffset)
        // 确保索引在有效范围内
        return Math.max(0, Math.min(index, blocks.value.length))
      }

      if (tailSpacer.value?.contains(range.startContainer)) {
        return blocks.value.length
      }

      const blockEl = getClosestBlockEl(range.startContainer)
      if (blockEl?.dataset.blockId) {
        const blockIndex = blocks.value.findIndex(
          (item) => String(item.id) === blockEl.dataset.blockId
        )
        if (blockIndex === -1) return blocks.value.length
        const { startOffset } = range
        const index = startOffset <= 0 ? blockIndex : blockIndex + 1
        // 确保索引在有效范围内
        return Math.max(0, Math.min(index, blocks.value.length))
      }

      let node: Node | null = range.startContainer
      while (node && node.parentNode !== container) {
        node = node.parentNode
      }
      if (!node || !node.parentNode) return blocks.value.length
      const childIndex = Array.prototype.indexOf.call(container.childNodes, node)
      if (childIndex === -1) return blocks.value.length
      const index = countBlocksBeforeOffset(childIndex)
      // 确保索引在有效范围内
      return Math.max(0, Math.min(index, blocks.value.length))
    }    
    const isSelectionInsideBlock = () => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return false
      // 如果 blocks 为空，直接返回 false
      if (blocks.value.length === 0) return false
      const range = sel.getRangeAt(0)
      const blockEl = getClosestBlockEl(range.startContainer)
      if (!blockEl) return false
      // 检查这个 block 是否还在 blocks.value 中（防止访问已销毁的组件）
      const blockId = blockEl.dataset.blockId
      if (!blockId) return false
      const blockExists = blocks.value.some(b => String(b.id) === blockId)
      return blockExists
    }

    const sanitizeTail = () => {
      if (tailSpacer.value) {
        tailSpacer.value.textContent = '\u00A0'
      }
    }

    const focusOuterEnd = () => {
      const container = inputBox.value
      if (!container) return
      
      // 确保容器可以获得焦点
      if (!container.hasAttribute('contenteditable')) {
        container.setAttribute('contenteditable', 'true')
      }
      
      // 确保 tailSpacer 存在，如果不存在则等待 nextTick
      if (!tailSpacer.value) {
        nextTick(() => {
          if (tailSpacer.value) {
            const range = document.createRange()
            const sel = window.getSelection()
            range.selectNodeContents(tailSpacer.value)
            range.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(range)
            container.focus()
            sanitizeTail()
          } else {
            // 如果还是没有，直接聚焦容器
            const range = document.createRange()
            const sel = window.getSelection()
            range.selectNodeContents(container)
            range.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(range)
            container.focus()
            sanitizeTail()
          }
        })
        return
      }
      
      const range = document.createRange()
      const sel = window.getSelection()
      
      if (tailSpacer.value) {
        range.selectNodeContents(tailSpacer.value)
      } else {
        range.selectNodeContents(container)
      }
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
      
      // 确保容器获得焦点
      container.focus()
      sanitizeTail()
    }

    const insertBlockAt = (value: string, index?: number) => {
      if (!value) return
        const id = Date.now() + Math.random()
      // 确保索引在有效范围内
      let insertIndex = index === undefined ? blocks.value.length : index
      insertIndex = Math.max(0, Math.min(insertIndex, blocks.value.length))

      blocks.value.splice(insertIndex, 0, { id, value })
      nextTick().then(() => {
        if (blockRefs[id]?.focusToEnd) {
          blockRefs[id]?.focusToEnd()
        } else {
          focusOuterEnd()
        }
        // 创建小方块后，检查是否需要显示搜索建议
        nextTick(() => {
          checkSearchSuggest()
        })
      })
    }

    const insertTextAsBlocks = (text: string, baseIndex?: number, split = true) => {
      if (!text) return
      const targetIndex = baseIndex ?? getInsertIndex()
      if (!split) {
        insertBlockAt(text, targetIndex)
        return
      }
      let cursor = targetIndex
      for (const ch of text) {
        insertBlockAt(ch, cursor)
        cursor += 1
      }
    }

    const asciiLetter = /^[a-z]$/i
    const hasNonAscii = /[^\x00-\x7F]/
    let skipNextAsciiInsert = false
    let isImeComposing = false
    let pendingCompositionText = ''

    const isSelectionInsideTail = () => {
      if (!tailSpacer.value) return false
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return false
      const range = sel.getRangeAt(0)
      return tailSpacer.value.contains(range.startContainer)
    }

    const insertViaComposition = (text: string, baseIndex?: number) => {
      const payload = text || pendingCompositionText
      pendingCompositionText = ''
      if (!payload) return
      insertTextAsBlocks(payload, baseIndex, false)
      skipNextAsciiInsert = hasNonAscii.test(payload)
      sanitizeTail()
      // 创建小方块后，检查是否需要显示搜索建议
      nextTick(() => {
        checkSearchSuggest()
      })
    }

    const onCompositionStart = () => {
      isImeComposing = true
      pendingCompositionText = ''
    }

    const onCompositionEnd = (e: CompositionEvent) => {
      const finalText = e.data || pendingCompositionText
      const target = e.target as HTMLElement | null
      isImeComposing = false
      pendingCompositionText = ''
      
      // 检查是否在小方块内部（通过事件目标）
      const isInsideBlock = target && (
        target.classList.contains('condition-item') || 
        target.closest('.condition-item')
      )
      
      // 清理可能残留的拼音字母
      nextTick().then(() => {
        const container = inputBox.value
        if (!container) return
        
        const childNodes = Array.from(container.childNodes)
        for (const node of childNodes) {
          // 跳过已有的方块节点和尾部占位节点
          if (node instanceof HTMLElement && node.dataset.blockId) continue
          if (isTailNode(node)) {
            const tailText = node.textContent || ''
            const trimmed = tailText.trim()
            // 如果尾部节点包含纯ASCII字符（可能是拼音残留），清理
            if (trimmed && trimmed !== '\u00A0' && !hasNonAscii.test(trimmed)) {
              node.textContent = '\u00A0'
            }
            continue
          }
          
          // 清理文本节点中的纯ASCII字符（拼音残留）
          if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const text = node.textContent.trim()
            if (text && !hasNonAscii.test(text)) {
              node.textContent = ''
            }
          }
        }
      })
      
      // 如果 compositionend 有最终文本，在 nextTick 中插入
      // 但通常 insertText 事件会先触发，所以这里作为兜底
      if (finalText && hasNonAscii.test(finalText)) {
        // 如果在小方块内部，不创建新方块
        if (isInsideBlock) {
          return
        }
        
        nextTick().then(() => {
          // 再次检查是否在小方块内部（通过光标位置）
          if (isSelectionInsideBlock()) {
            return
          }
          // 检查是否已经有方块被创建（通过 insertText 事件）
          // 如果没有，则创建
          const currentBlocks = blocks.value.length
          setTimeout(() => {
            if (blocks.value.length === currentBlocks) {
              insertViaComposition(finalText, getInsertIndex())
            } else {
              // 如果已经创建了方块，也检查搜索建议
              nextTick(() => {
                checkSearchSuggest()
              })
            }
          }, 0)
        })
      }
    }

    const onBeforeInput = (e: InputEvent) => {
      const container = inputBox.value
      const target = e.target as Node | null
      if (!container || !target) return
      if (target !== container && !container.contains(target)) return
      
      // 优先检查：如果事件目标本身是小方块元素或其子元素，直接返回，不阻止事件
      if (target instanceof HTMLElement) {
        const conditionItem = target.classList.contains('condition-item') 
          ? target 
          : target.closest('.condition-item')
        if (conditionItem) {
          // 检查这个 block 是否还在 blocks.value 中（防止访问已销毁的组件）
          const blockId = conditionItem.getAttribute('data-block-id')
          if (blockId && blocks.value.some(b => String(b.id) === blockId)) {
            console.log('[onBeforeInput] Target is condition-item, returning early (not preventing default)')
            // 明确不阻止默认行为，让 input 事件能正常触发
            return
          }
        }
      }
      
      // 检查是否在小方块内部：通过选择位置
      // 如果在小方块内部，直接返回，不阻止事件，让小方块自己处理
      if (isSelectionInsideBlock()) {
        console.log('[onBeforeInput] Selection is inside block, returning early (not preventing default)')
        // 明确不阻止默认行为，让 input 事件能正常触发
        return
      }

      if (isSelectionInsideTail()) {
        if (e.inputType === 'insertCompositionText') {
          // 如果正在组合中，允许默认行为，让拼音正常显示
          if (e.isComposing) {
            pendingCompositionText = e.data || pendingCompositionText
            return // 不阻止，让拼音正常显示
          }
          // 组合结束，确认中文
          e.preventDefault()
          insertViaComposition(e.data || '', blocks.value.length)
          return
        }
        if (e.inputType === 'insertText' && e.data) {
          const hasNonAsciiChars = hasNonAscii.test(e.data)
          
          // 如果正在组合中（输入拼音），允许默认行为，让拼音字母正常显示
          if (e.isComposing || isImeComposing) {
            // 如果包含中文，说明是确认中文，需要处理
            if (hasNonAsciiChars) {
              e.preventDefault()
              insertTextAsBlocks(e.data, blocks.value.length, false)
              sanitizeTail()
              return
            }
            // 纯拼音字母，允许默认行为显示
            return
          }
          
          // 组合结束后的处理
          if (hasNonAsciiChars) {
            // 确认的中文，创建方块
            e.preventDefault()
            insertTextAsBlocks(e.data, blocks.value.length, false)
            sanitizeTail()
            return
          }
          
          // 纯ASCII字符的处理（非组合状态）
          e.preventDefault()
          insertTextAsBlocks(e.data, blocks.value.length, true)
          sanitizeTail()
          return
        }
        if (e.inputType?.startsWith('delete')) {
          e.preventDefault()
          // 检查是否是全选删除
          const sel = window.getSelection()
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0)
            const container = inputBox.value
            if (container) {
              const containerRange = document.createRange()
              containerRange.selectNodeContents(container)
              const isSelectAll = range.compareBoundaryPoints(Range.START_TO_START, containerRange) <= 0 &&
                                 range.compareBoundaryPoints(Range.END_TO_END, containerRange) >= 0
              
              if (isSelectAll && blocks.value.length > 0) {
                blocks.value = []
                Object.keys(blockRefs).forEach(key => {
                  delete blockRefs[Number(key)]
                })
                nextTick(() => {
                  focusOuterEnd()
                  checkSearchSuggest()
                })
                return
              }
            }
          }
          focusOuterEnd()
          return
        }
      }

      if (e.inputType === 'insertCompositionText') {
        // 再次检查是否在小方块内部
        if (isSelectionInsideBlock() || (target instanceof HTMLElement && (target.classList.contains('condition-item') || target.closest('.condition-item')))) {
          return // 在小方块内部，不处理，让小方块自己处理
        }
        // 如果正在组合中，允许默认行为，让拼音正常显示
        if (e.isComposing) {
          pendingCompositionText = e.data || pendingCompositionText
          return // 不阻止，让拼音正常显示
        }
        // 组合结束，确认中文
        e.preventDefault()
        insertViaComposition(e.data || '', getInsertIndex())
        return
      }

      if (e.inputType === 'insertText' && e.data) {
        // 再次检查是否在小方块内部
        if (isSelectionInsideBlock()) {
          return // 在小方块内部，不处理，让小方块自己处理
        }
        // 检查事件目标是否是小方块
        if (target instanceof HTMLElement) {
          const conditionItem = target.classList.contains('condition-item') 
            ? target 
            : target.closest('.condition-item')
          if (conditionItem) {
            // 检查这个 block 是否还在 blocks.value 中（防止访问已销毁的组件）
            const blockId = conditionItem.getAttribute('data-block-id')
            if (blockId && blocks.value.some(b => String(b.id) === blockId)) {
              return // 在小方块内部，不处理，让小方块自己处理
            }
          }
        }
        
        const hasNonAsciiChars = hasNonAscii.test(e.data)
        
        // 如果正在组合中（输入拼音），允许默认行为，让拼音字母正常显示
        if (e.isComposing || isImeComposing) {
          // 如果包含中文，说明是确认中文，需要处理
          if (hasNonAsciiChars) {
            e.preventDefault()
            skipNextAsciiInsert = false
            const baseIndex = getInsertIndex()
            insertTextAsBlocks(e.data, baseIndex, false)
            sanitizeTail()
            return
          }
          // 纯拼音字母，允许默认行为显示
          return
        }
        
        // 组合结束后的处理
        if (hasNonAsciiChars) {
          // 确认的中文，创建方块
          e.preventDefault()
          skipNextAsciiInsert = false
          const baseIndex = getInsertIndex()
          insertTextAsBlocks(e.data, baseIndex, false)
          sanitizeTail()
          return
        }
        
        // 纯ASCII字符的处理（非组合状态）
        if (skipNextAsciiInsert && asciiLetter.test(e.data)) {
          e.preventDefault()
          skipNextAsciiInsert = false
          return
        }
        skipNextAsciiInsert = false
        e.preventDefault()
        const baseIndex = getInsertIndex()
        insertTextAsBlocks(e.data, baseIndex, true)
        sanitizeTail()
        return
      }

      // 处理删除操作
      if (e.inputType?.startsWith('delete')) {
        e.preventDefault()
        
        // 检查是否是全选删除（选择范围覆盖所有内容）
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0)
          const container = inputBox.value
          if (container) {
            // 检查选择范围是否覆盖了整个容器
            const containerRange = document.createRange()
            containerRange.selectNodeContents(container)
            const isSelectAll = range.compareBoundaryPoints(Range.START_TO_START, containerRange) <= 0 &&
                               range.compareBoundaryPoints(Range.END_TO_END, containerRange) >= 0
            
            // 如果全选删除，执行和清空按钮相同的逻辑
            if (isSelectAll && blocks.value.length > 0) {
              blocks.value = []
              // 清理所有 refs
              Object.keys(blockRefs).forEach(key => {
                delete blockRefs[Number(key)]
              })
              // 等待 DOM 更新后聚焦
              nextTick(() => {
                focusOuterEnd()
                checkSearchSuggest()
              })
              return
            }
          }
        }
        
        // 如果不是全选删除，按原来的逻辑处理
        if (e.inputType === 'deleteContentBackward') {
          // 如果 blocks 为空，直接聚焦到外层 div
          if (blocks.value.length === 0) {
            focusOuterEnd()
            return
          }
          const index = getInsertIndex() - 1
          const targetBlock = blocks.value[index >= 0 ? index : blocks.value.length - 1]
          if (targetBlock) {
            blockRefs[targetBlock.id]?.focusToEnd?.()
          } else {
            focusOuterEnd()
          }
          return
        }
        
        // 其他删除操作
        if (blocks.value.length === 0) {
          focusOuterEnd()
          return
        }
        focusOuterEnd()
      }
    }

    const onInput = (e: Event) => {
      const target = e.target as HTMLElement
      
      // 优先检查：如果事件目标本身是小方块元素或其子元素，直接返回，不阻止事件传播
      if (target instanceof HTMLElement) {
        if (target.classList.contains('condition-item') || target.closest('.condition-item')) {
          console.log('[onInput] Target is condition-item, returning early to allow block input event')
          // 不调用 sanitizeTail()，完全让小方块自己处理
          return
        }
      }
      
      // 检查光标是否在小方块内部
      if (isSelectionInsideBlock()) {
        console.log('[onInput] Selection is inside block, returning early to allow block input event')
        sanitizeTail()
        return
      }
      
      if (!target || target !== inputBox.value) {
        sanitizeTail()
        return
      }
      
      // 如果正在组合中（输入拼音），完全不处理，让拼音字母正常显示和累积
      if (isImeComposing) {
        // 不调用 sanitizeTail()，避免干扰拼音显示
        return
      }
      
      // 检查是否有文本被插入到 DOM 中（作为 beforeinput 的兜底）
      const childNodes = Array.from(target.childNodes)
      let hasNewText = false
      let newText = ''
      
      for (const node of childNodes) {
        // 跳过已有的方块节点
        if (node instanceof HTMLElement && node.dataset.blockId) continue
        
        // 检查尾部占位节点中的文本（除了默认的 &nbsp;）
        if (isTailNode(node)) {
          const tailText = node.textContent || ''
          const trimmed = tailText.trim()
          if (trimmed && trimmed !== '\u00A0' && hasNonAscii.test(trimmed)) {
            hasNewText = true
            newText += trimmed
            node.textContent = '\u00A0'
            continue
          }
        }
        
        // 检查文本节点
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const text = node.textContent.trim()
          if (text && hasNonAscii.test(text)) {
            hasNewText = true
            newText += text
            // 清空文本节点
          node.textContent = ''
          }
        }
      }
      
      // 如果检测到中文文本，创建方块（只在外层div中）
      if (hasNewText && newText) {
        const baseIndex = getInsertIndex()
        insertTextAsBlocks(newText, baseIndex, false)
        // insertTextAsBlocks 内部会调用 insertBlockAt，insertBlockAt 会检查搜索建议
        // 但为了确保，这里也检查一次
        nextTick(() => {
          checkSearchSuggest()
        })
      } else {
        // 检查是否需要显示搜索建议
        nextTick(() => {
          checkSearchSuggest()
        })
      }
      
      sanitizeTail()
    }

    const updateBlock = (id: number, val: string) => {
      const b = blocks.value.find(b => b.id === id)
      if (b) {
        // 即使值相同，也要更新，确保触发 watch
        const oldValue = b.value
        // 确保使用完整内容
        b.value = String(val || '')

        // 如果值相同，强制触发更新（通过临时设置为空再设置回来）
        if (oldValue === val) {
          // 使用 nextTick 确保响应式更新
          nextTick(() => {
            // 强制触发 watch，通过临时修改再改回来
            b.value = val + '\u200B' // 零宽空格
            nextTick(() => {
              b.value = val
            })
          })
        }
        
        // 当小方块内容变化时，同步 queryCondition（包括快速筛查格式的解析）
        // 使用 nextTick 确保 DOM 更新完成后再同步
        nextTick(() => {
          syncQueryCondition()
        })
      } else {
      }
    }

    // 同步 queryCondition 到外部（不触发搜索）
    const syncQueryCondition = () => {
      // 获取所有查询条件
      const queryConditions = getAllQueryConditions()
      
      // 转换为 ICondition 格式
      const condition = formatConditions(queryConditions)
      
      // emit 出去，更新 queryConditionObj（不触发搜索）
      emit('update:queryCondition', condition)
    }

    const removeBlock = async (id: number) => {
      const index = blocks.value.findIndex(b => b.id === id)
      if (index === -1) return
      
      const block = blocks.value[index]
      
      // 如果是快速筛查的方块，触发事件通知外部重新选中
      if (block.readonly && block.fastFilterKey && block.fastFilterItemNames) {
        emit('fastFilterRestore', {
          key: block.fastFilterKey,
          itemNames: block.fastFilterItemNames
        })
      }
      
      // 删除前保存是否有其他 block
      const hasOtherBlocks = blocks.value.length > 1
      
      // 原地删除，避免重新挂载导致 refs 失效
      blocks.value.splice(index, 1)
      
      // 清理 ref
      delete blockRefs[id]
      
      // 等待 DOM 更新后同步 queryCondition
      await nextTick()
      
      // 同步 queryCondition 到外部
      syncQueryCondition()
      
      // 如果还有其他 block，尝试聚焦上一个 block
      if (hasOtherBlocks) {
      const prev = blocks.value[index - 1]
      if (prev && blockRefs[prev.id]?.focusToEnd) {
        blockRefs[prev.id]?.focusToEnd()
        return
      }
      }
      
      // 否则聚焦到外层 div
      await nextTick()
      focusOuterEnd()
      // 确保输入框可以正常输入
      setTimeout(() => {
        if (inputBox.value) {
          inputBox.value.focus()
      focusOuterEnd()
        }
      }, 0)
    }
    
    // 添加快速筛查方块（单个选项或多个选项）
    const addFastFilterBlock = (key: string, itemNames: string[]) => {
      // 生成方块内容
      let blockValue = `-${key}:`
      if (itemNames.length === 1) {
        // 单个选项：-标题:选项label
        blockValue += itemNames[0]
      } else {
        // 多个选项：-标题:(选项1 OR 选项2)，OR 两边留空格
        // 确保每个选项名称前后没有多余空格，然后使用 ' OR ' 连接
        const cleanItemNames = itemNames.map(name => name.trim()).filter(name => name)
        blockValue += `(${cleanItemNames.join(' OR ')})`
      }
      
      // 检查是否已存在相同 key 的方块
      const existingBlock = blocks.value.find(
        b => b.readonly && b.fastFilterKey === key
      )
      
      if (existingBlock) {
        // 如果已存在，更新值和选项列表
        existingBlock.value = blockValue
        existingBlock.fastFilterItemNames = itemNames
        return
      }
      
      // 创建新方块
      const id = Date.now() + Math.random()
      blocks.value.push({
        id,
        value: blockValue,
        readonly: true,
        fastFilterKey: key,
        fastFilterItemNames: itemNames
      })
      
      nextTick(() => {
        focusOuterEnd()
      })
    }
    
    // 删除快速筛查方块（通过 key）
    const removeFastFilterBlock = (key: string) => {
      const index = blocks.value.findIndex(
        b => b.readonly && b.fastFilterKey === key
      )
      
      if (index !== -1) {
        const block = blocks.value[index]
        blocks.value.splice(index, 1)
        delete blockRefs[block.id]
        
        nextTick(() => {
          focusOuterEnd()
        })
      }
    }

    // 清除所有快速筛查方块
    const clearAllFastFilterBlocks = () => {
      const fastFilterBlocks = blocks.value.filter(b => b.readonly && b.fastFilterKey)
      fastFilterBlocks.forEach(block => {
        if (block.fastFilterKey) {
          const index = blocks.value.findIndex(b => b.id === block.id)
          if (index !== -1) {
            blocks.value.splice(index, 1)
            delete blockRefs[block.id]
          }
        }
      })
      
      // 同步 queryCondition 到外部（清除 conditionGroups）
      nextTick(() => {
        syncQueryCondition()
        focusOuterEnd()
      })
    }

    // 清除所有小方块（包括普通小方块和快速筛查小方块）
    const clearAllBlocks = () => {
      // 清除所有 blocks
      blocks.value.forEach(block => {
        delete blockRefs[block.id]
      })
      blocks.value = []
      
      // 同步 queryCondition 到外部（清空所有条件）
      nextTick(() => {
        syncQueryCondition()
        focusOuterEnd()
      })
    }

    // 获取所有小方块的内容（返回数组，每个元素是一个小方块的内容）
    const getAllBlocksContent = (): string[] => {
      return blocks.value.map(block => block.value || '').filter(v => v.trim())
    }

    // 获取当前的 queryCondition（用于同步到外部）
    const getCurrentQueryCondition = (): ICondition & { conditionGroups?: any[] } => {
      const queryConditions = getAllQueryConditions()
      return formatConditions(queryConditions)
    }

    // 清除与快速筛查相关的小方块（根据枚举值判断）
    // fastFilterTypes: 快速筛查类型枚举值数组，如 ['status', 'env', 'host'] 等
    const clearFastFilterRelatedBlocks = (fastFilterTypes: string[]) => {
      if (!fastFilterTypes || fastFilterTypes.length === 0) {
        return
      }

      // 创建快速筛查类型集合，用于快速查找
      const fastFilterTypeSet = new Set(fastFilterTypes.map(t => t.toLowerCase()))

      // 查找所有以 `-` 开头的小方块
      const blocksToRemove: number[] = []
      blocks.value.forEach(block => {
        const blockValue = block.value || ''
        // 检查是否以 `-` 开头
        if (blockValue.startsWith('-')) {
          // 提取 `-` 后面的第一个单词（到 `:` 之前）
          // 例如：`-status:(INFO OR WARN)` -> `status`
          // 例如：`-env:prod` -> `env`
          const afterDash = blockValue.slice(1) // 去掉开头的 `-`
          const colonIndex = afterDash.indexOf(':')
          const firstWord = colonIndex > 0 
            ? afterDash.slice(0, colonIndex).trim().toLowerCase()
            : afterDash.trim().toLowerCase()
          
          // 如果第一个单词在快速筛查类型枚举中，标记为需要删除
          if (firstWord && fastFilterTypeSet.has(firstWord)) {
            blocksToRemove.push(block.id)
          }
        }
      })

      // 删除标记的小方块
      blocksToRemove.forEach(blockId => {
        const index = blocks.value.findIndex(b => b.id === blockId)
        if (index !== -1) {
          const block = blocks.value[index]
          blocks.value.splice(index, 1)
          delete blockRefs[block.id]
        }
      })

      // 如果有删除操作，同步 queryCondition 到外部
      if (blocksToRemove.length > 0) {
        nextTick(() => {
          syncQueryCondition()
          focusOuterEnd()
        })
      }
    }
    
    // 更新快速筛查方块（当选项变化时）
    const updateFastFilterBlocks = (unselectedItems: Record<string, Array<{ name: string; value: number }>>) => {
      // 先删除所有旧的快速筛查方块
      const fastFilterBlocks = blocks.value.filter(b => b.readonly && b.fastFilterKey)
      fastFilterBlocks.forEach(block => {
        if (block.fastFilterKey) {
          const index = blocks.value.findIndex(b => b.id === block.id)
          if (index !== -1) {
            blocks.value.splice(index, 1)
            delete blockRefs[block.id]
          }
        }
      })
      
      // 为每个标题下的所有取消勾选的选项创建一个方块（合并）
      Object.keys(unselectedItems).forEach(key => {
        const items = unselectedItems[key]
        if (items.length > 0) {
          const itemNames = items.map(item => item.name)
          addFastFilterBlock(key, itemNames)
        }
      })
    }

    // 从 ICondition 加载 blocks（用于回显保存的视图）
    const loadFromCondition = (condition: ICondition & { conditionGroups?: any[] }) => {
      // 清空现有 blocks
      blocks.value = []
      Object.keys(blockRefs).forEach(key => {
        delete blockRefs[Number(key)]
      })

      // 将 operator value 转换为 label（使用已导入的 operatorOptions）
      const getOperatorLabel = (operatorValue: string): string => {
        const op = operatorOptions.find(o => o.value === operatorValue)
        return op ? op.label : operatorValue
      }

      // 1. 处理普通条件（conditions），转换为普通小方块
      if (condition.conditions && Array.isArray(condition.conditions)) {
        condition.conditions.forEach((c) => {
          // 跳过空条件
          if (!c.field && !c.operator && !c.value) {
            return
          }

          // 如果只有 value，没有 field 和 operator，直接作为 value
          if (!c.field && !c.operator && c.value) {
            const id = Date.now() + Math.random()
            blocks.value.push({
              id,
              value: c.value
            })
            return
          }

          // 构建小方块内容：field:operatorLabel:value
          let blockValue = ''
          if (c.field) {
            blockValue += c.field
          }
          if (c.operator) {
            const operatorLabel = getOperatorLabel(c.operator)
            blockValue += ':' + operatorLabel
          }
          if (c.value) {
            // 如果已经有 operator，value 直接追加；否则需要加 ':'
            if (c.operator) {
              blockValue += c.value
            } else if (c.field) {
              blockValue += ':' + c.value
            } else {
              blockValue += c.value
            }
          }

          if (blockValue) {
            const id = Date.now() + Math.random()
            blocks.value.push({
              id,
              value: blockValue
            })
          }
        })
      }

      // 2. 处理快速筛查条件（conditionGroups），转换为只读小方块
      if (condition.conditionGroups && Array.isArray(condition.conditionGroups)) {
        condition.conditionGroups.forEach((group: any) => {
          if (group.logic === 'LOGIC_OR' && Array.isArray(group.conditions)) {
            // 按 field 分组
            const fieldGroups: Record<string, string[]> = {}
            
            group.conditions.forEach((c: any) => {
              if (c.operator === 'OPERATOR_NE' && c.field && c.value) {
                const field = String(c.field).trim()
                const value = String(c.value).trim()
                if (field && value) {
                  if (!fieldGroups[field]) {
                    fieldGroups[field] = []
                  }
                  fieldGroups[field].push(value)
                }
              }
            })

            // 为每个 field 创建一个快速筛查方块
            Object.keys(fieldGroups).forEach(key => {
              const itemNames = fieldGroups[key]
              if (itemNames.length > 0) {
                addFastFilterBlock(key, itemNames)
              }
            })
          }
        })
      }

      // 等待 DOM 更新后聚焦
      nextTick(() => {
        focusOuterEnd()
      })
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return
      if (e.target.closest('.condition-item')) return
      e.preventDefault()
      focusOuterEnd()
      // 延迟检查搜索建议
      nextTick(() => {
        checkSearchSuggest()
      })
    }

    const getAllValues = () => blocks.value.map(b => b.value)

    // 清空搜索框
    const clearSearch = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      blocks.value = []
      // 清理所有 refs
      Object.keys(blockRefs).forEach(key => {
        delete blockRefs[Number(key)]
      })
      // 聚焦到外层div
      nextTick(() => {
        focusOuterEnd()
        checkSearchSuggest()
      })
    }

    // 获取外层div光标左侧第一个字符
    const getOuterLeftChar = (): string => {
      if (!inputBox.value) return ''
      
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return ''
      
      try {
        const range = selection.getRangeAt(0)
        
        // 确保光标在外层div内部，且不在小方块内部
        if (!inputBox.value.contains(range.startContainer)) return ''
        if (getClosestBlockEl(range.startContainer)) return '' // 在小方块内部，不处理
        
        const rangeClone = range.cloneRange()
        try {
          rangeClone.setStart(inputBox.value, 0)
        } catch (e) {
          const walker = document.createTreeWalker(
            inputBox.value,
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
        return ''
      }
    }

    // 更新搜索框宽度
    const updateInputBoxWidth = () => {
      if (inputBox.value) {
        const rect = inputBox.value.getBoundingClientRect()
        inputBoxWidth.value = rect.width
      }
    }

    // 获取外层div光标位置
    const getOuterCaretPosition = (): { top: number; left: number } | null => {
      if (!inputBox.value) return null
      
      // 更新搜索框宽度
      updateInputBoxWidth()
      
      try {
        const selection = window.getSelection()
        let range: Range | null = null
        
        if (selection && selection.rangeCount > 0) {
          range = selection.getRangeAt(0)
        }
        
        // 如果没有选择，但外层div有焦点，创建一个默认的range
        if (!range && (document.activeElement === inputBox.value || inputBox.value.contains(document.activeElement))) {
          range = document.createRange()
          if (tailSpacer.value) {
            range.selectNodeContents(tailSpacer.value)
            range.collapse(false)
          } else {
            range.selectNodeContents(inputBox.value)
            range.collapse(false)
          }
        }
        
        if (!range) {
          // 如果还是没有range，返回默认位置（外层div底部）
          const elementRect = inputBox.value.getBoundingClientRect()
          return { top: elementRect.height + 2, left: 0 }
        }

        const tempRange = range.cloneRange()
        tempRange.collapse(true)
        
        const rect = tempRange.getBoundingClientRect()
        const elementRect = inputBox.value.getBoundingClientRect()

        // 计算相对于外层div的位置
        const top = rect.bottom - elementRect.top + 2
        const left = rect.left - elementRect.left

        // 如果位置异常（负数或过大），使用默认位置
        if (top < 0 || left < 0 || top > 1000 || left > 1000) {
          return { top: elementRect.height + 2, left: 0 }
        }

        return { top, left }
      } catch (e) {
        // 如果出错，返回默认位置（外层div底部）
        const elementRect = inputBox.value.getBoundingClientRect()
        return { top: elementRect.height + 2, left: 0 }
      }
    }

    // 获取小方块内光标左侧第一个字符
    const getBlockLeftChar = (blockEl: HTMLElement): string => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return ''
      
      try {
        const range = selection.getRangeAt(0)
        
        if (!blockEl.contains(range.startContainer) && range.startContainer !== blockEl) {
          return ''
        }
        
        const rangeClone = range.cloneRange()
        try {
          rangeClone.setStart(blockEl, 0)
        } catch (e) {
          const walker = document.createTreeWalker(
            blockEl,
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
        return ''
      }
    }

    // 检查是否需要显示搜索建议
    const checkSearchSuggest = () => {
      // 如果操作符建议正在显示，不显示搜索建议
      if (showOperatorSuggest.value) {
        showSearchSuggest.value = false
        return
      }

      if (!inputBox.value) {
        showSearchSuggest.value = false
        return
      }

      // 检查外层div是否有焦点（包括contenteditable的情况）
      const hasFocus = document.activeElement === inputBox.value || 
                      inputBox.value.contains(document.activeElement) ||
                      (inputBox.value.isContentEditable && document.activeElement === inputBox.value)


      // 检查是否有选择
      const selection = window.getSelection()
      const hasSelection = selection && selection.rangeCount > 0

      // 如果外层div有焦点，即使没有选择或选择不在外层div内，也显示搜索建议（外层div为空时的情况）
      if (hasFocus) {
        // 检查是否在小方块内部
        let blockEl: HTMLElement | null = null
        if (hasSelection) {
          const range = selection!.getRangeAt(0)
          if (inputBox.value.contains(range.startContainer)) {
            blockEl = getClosestBlockEl(range.startContainer)
          }
        }

        if (blockEl) {
          // 检查是否是可编辑的小方块（只读方块不显示字段列表）
          const blockId = blockEl.dataset.blockId
          if (blockId) {
            const block = blocks.value.find(b => String(b.id) === blockId)
            if (block && block.readonly) {
              // 如果是只读方块，不显示搜索建议
              showSearchSuggest.value = false
              return
            }
          }
          
          // 在小方块内部，检查焦点左边是否是 `:`
          const leftChar = getBlockLeftChar(blockEl)
          if (leftChar === ':') {
            // 焦点左边是 `:`，不显示搜索建议（显示操作符建议）
            showSearchSuggest.value = false
            return
          }
          // 焦点左边不是 `:`，显示搜索建议
        } else {
          // 不在小方块内部，检查外层div的左侧字符
          if (hasSelection) {
            const range = selection!.getRangeAt(0)
            if (inputBox.value.contains(range.startContainer)) {
              const leftChar = getOuterLeftChar()
              // 如果左侧字符是 `:`，不显示搜索建议
              if (leftChar === ':') {
                showSearchSuggest.value = false
                return
              }
              // 如果左侧字符是空格或不可见字符（如 \u00A0），视为空值，显示搜索建议
              if (leftChar && leftChar.trim() === '' && leftChar !== ':') {
                // 继续显示搜索建议
              }
            }
          }
          // 如果外层div为空（没有选择或没有左侧字符），也显示搜索建议
        }

        // 显示搜索建议（只有当 suggestions 不为空时才显示）
        if (props.suggestions && props.suggestions.length > 0) {
          const position = getOuterCaretPosition()
          if (position) {
            // 保存当前选择状态
            if (hasSelection) {
              savedSelectionRange.value = selection!.getRangeAt(0).cloneRange()
            }
            searchSuggestPosition.value = position
            showSearchSuggest.value = true
            searchSuggestSelectedIndex.value = 0
          } else {
            showSearchSuggest.value = false
          }
        } else {
          // 如果没有建议选项，不显示下拉框
          showSearchSuggest.value = false
        }
      } else {
        showSearchSuggest.value = false
      }
    }

    // 监听外层div的焦点和选择变化
    const handleOuterFocus = () => {
      nextTick(() => {
        checkSearchSuggest()
      })
    }

    const handleOuterBlur = (e: FocusEvent) => {
      // 检查焦点是否移到了下拉框上
      const relatedTarget = e.relatedTarget as HTMLElement | null
      if (relatedTarget && relatedTarget.closest('.operator-suggestions')) {
        // 焦点移到了下拉框上，不隐藏
        return
      }
      // 延迟隐藏，避免在点击下拉框选项时立即隐藏
      setTimeout(() => {
        // 再次检查焦点是否在外层div或下拉框上
        const activeElement = document.activeElement
        if (activeElement && (
          activeElement === inputBox.value ||
          inputBox.value?.contains(activeElement) ||
          activeElement.closest('.operator-suggestions')
        )) {
          // 焦点还在相关元素上，不隐藏
          return
        }
        // 失焦时隐藏字段列表
        showSearchSuggest.value = false
        searchSuggestPosition.value = null
        savedSelectionRange.value = null
      }, 200)
    }

    const handleOuterSelectionChange = () => {
      // 检查焦点是否在外层div或小方块内
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        // 如果没有选择，检查是否还有焦点
        if (!inputBox.value || 
            (document.activeElement !== inputBox.value && 
             !inputBox.value.contains(document.activeElement))) {
          // 没有焦点，隐藏字段列表
          showSearchSuggest.value = false
          searchSuggestPosition.value = null
          savedSelectionRange.value = null
        }
        return
      }
      
      const range = selection.getRangeAt(0)
      if (inputBox.value && inputBox.value.contains(range.startContainer)) {
        checkSearchSuggest()
      } else {
        // 选择不在外层div内，检查是否还有焦点
        if (!inputBox.value || 
            (document.activeElement !== inputBox.value && 
             !inputBox.value.contains(document.activeElement))) {
          // 没有焦点，隐藏字段列表
          showSearchSuggest.value = false
          searchSuggestPosition.value = null
          savedSelectionRange.value = null
        }
      }
    }

    // 选择搜索建议
    const handleSelectSearchSuggest = (option: SuggestionOption) => {
      if (!inputBox.value) {
        return
      }

      // 使用保存的选择状态，如果没有则尝试获取当前选择
      let range: Range | null = null
      if (savedSelectionRange.value) {
        range = savedSelectionRange.value.cloneRange()
      } else {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          range = selection.getRangeAt(0).cloneRange()
        }
      }

      if (!range) {
        // 如果没有range，创建一个默认的range（在外层div末尾）
        range = document.createRange()
        if (tailSpacer.value) {
          range.selectNodeContents(tailSpacer.value)
          range.collapse(false)
        } else {
          range.selectNodeContents(inputBox.value)
          range.collapse(false)
        }
      }

      
      // 确保光标在外层div内部
      if (!inputBox.value.contains(range.startContainer) && range.startContainer !== inputBox.value) {
        // 如果range不在外层div内，调整到外层div末尾
        range = document.createRange()
        if (tailSpacer.value) {
          range.selectNodeContents(tailSpacer.value)
          range.collapse(false)
        } else {
          range.selectNodeContents(inputBox.value)
          range.collapse(false)
        }
      }

      // 检查是否在小方块内部
      const blockEl = getClosestBlockEl(range.startContainer)
      if (blockEl) {
        // 检查是否是可编辑的小方块（只读方块不允许插入）
        const blockId = blockEl.dataset.blockId
        if (blockId) {
          const block = blocks.value.find(b => String(b.id) === blockId)
          if (block && block.readonly) {
            // 如果是只读方块，不插入文本，直接返回
            return
          }
        }
        
        // 在小方块内部，检查焦点左边是否是 `:`
        const leftChar = getBlockLeftChar(blockEl)
        if (leftChar === ':') {
          // 焦点左边是 `:`，不应该选择搜索建议（应该选择操作符建议）
          return
        }
        // 在小方块内部，但焦点左边不是 `:`，可以插入文本
        // 直接在小方块内插入文本
        const textNode = document.createTextNode(option.label)
        range.insertNode(textNode)
        
        // 移动光标到插入文本后
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
        
        // 确保小方块获得焦点
        blockEl.focus()
        
        // 触发小方块的输入事件，更新值
        const inputEvent = new Event('input', { bubbles: true })
        blockEl.dispatchEvent(inputEvent)
      } else {
        // 不在小方块内部，在外层div中插入
        
        // 直接使用 insertTextAsBlocks 创建小方块，而不是插入文本节点
        // split: false 表示整个字段名作为一个方块，不拆分成单个字符
        const baseIndex = getInsertIndex()
        insertTextAsBlocks(option.label, baseIndex, false)
        sanitizeTail()
        
        // 移动光标到新创建的小方块末尾
        nextTick(() => {
          const newBlock = blocks.value[baseIndex]
          if (newBlock && blockRefs[newBlock.id]?.focusToEnd) {
            blockRefs[newBlock.id].focusToEnd()
          } else {
            // 如果创建失败，聚焦到外层div末尾
            focusOuterEnd()
          }
          
          // 检查搜索建议
          checkSearchSuggest()
        })
        
      }

      // 更新保存的选择状态（用于下次选择）
      const newRange = document.createRange()
      if (blockEl) {
        newRange.selectNodeContents(blockEl)
        newRange.collapse(false)
      } else {
        if (tailSpacer.value) {
          newRange.selectNodeContents(tailSpacer.value)
          newRange.collapse(false)
        } else {
          newRange.selectNodeContents(inputBox.value)
          newRange.collapse(false)
        }
      }
      savedSelectionRange.value = newRange
      
      // 不关闭下拉框，只更新位置和选择状态
      nextTick(() => {
        checkSearchSuggest()
      })
    }

    // 处理搜索建议键盘事件
    const handleSearchSuggestKeydown = (e: KeyboardEvent) => {
      if (!showSearchSuggest.value) return

      // Enter 键由 handleOperatorSuggestKeydown 统一处理，这里不处理
      if (e.key === 'Enter') {
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        searchSuggestSelectedIndex.value = Math.min(searchSuggestSelectedIndex.value + 1, props.suggestions.length - 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        searchSuggestSelectedIndex.value = Math.max(searchSuggestSelectedIndex.value - 1, 0)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        handleSelectSearchSuggest(props.suggestions[searchSuggestSelectedIndex.value])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        showSearchSuggest.value = false
        searchSuggestPosition.value = null
      }
    }

    // 处理操作符建议显示
    const handleShowOperatorSuggest = (data: { blockId: number; position: { top: number; left: number } }) => {
      // 更新搜索框宽度
      updateInputBoxWidth()
      operatorSuggestBlockId.value = data.blockId
      operatorSuggestPosition.value = data.position
      showOperatorSuggest.value = true
      operatorSuggestSelectedIndex.value = 0
    }

    // 处理操作符建议隐藏
    const handleHideOperatorSuggest = (blockId: number) => {
      if (operatorSuggestBlockId.value === blockId) {
        showOperatorSuggest.value = false
        operatorSuggestPosition.value = null
        operatorSuggestBlockId.value = null
        // 当操作符建议隐藏时，检查是否需要显示搜索建议
        nextTick(() => {
          checkSearchSuggest()
        })
      }
    }

    // 检查 `:` 后面是否已有操作符，返回操作符的结束位置
    const findExistingOperatorAfterColon = (text: string, colonIndex: number): number => {
      const afterColon = text.slice(colonIndex + 1)
      if (!afterColon.trim()) return colonIndex + 1
      
      // 按 label 长度从长到短排序，避免短操作符匹配到长操作符的前缀
      const sortedOptions = [...operatorOptions].sort((a, b) => b.label.length - a.label.length)
      
      // 检查是否以某个操作符 label 开头
      for (const op of sortedOptions) {
        if (afterColon.startsWith(op.label)) {
          return colonIndex + 1 + op.label.length
        }
      }
      
      // 如果没有匹配的操作符，检查是否有其他文本（可能是用户输入的内容）
      // 找到第一个空格的位置，或者到文本末尾
      const spaceIndex = afterColon.indexOf(' ')
      if (spaceIndex > 0) {
        return colonIndex + 1 + spaceIndex
      }
      
      // 如果没有空格，检查是否有其他非字母数字字符（可能是新的操作符或其他内容）
      // 这里我们假设如果 `:` 后面有内容但不是已知操作符，就替换整个 `:` 后面的内容
      return text.length
    }

    // 选择操作符
    const handleSelectOperator = (option: typeof operatorOptions[0]) => {
      
      if (operatorSuggestBlockId.value === null) {
        return
      }
      
      const blockId = operatorSuggestBlockId.value
      const block = blocks.value.find(b => b.id === blockId)
      if (!block) {
        return
      }

      // 直接从 DOM 获取当前值（因为 block.value 可能没有及时更新）
      // 先尝试通过 blockRefs 获取元素
      let blockElement: HTMLElement | null = null
      if (blockRefs[blockId]) {
        // 通过 ref 获取元素（需要从 ConditionItem 暴露元素引用）
        const conditionItemEl = inputBox.value?.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
        blockElement = conditionItemEl
      }
      
      // 如果没找到，尝试通过 querySelector 查找
      if (!blockElement) {
        blockElement = inputBox.value?.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
      }
      
      const currentValue = blockElement?.textContent || block.value
      
      let newValue = ''
      const currentColonIndex = currentValue.lastIndexOf(':')
      
      if (currentColonIndex === -1) {
        // 如果没有 `:`，在末尾添加 `:` 和操作符
        newValue = currentValue + ':' + option.label
      } else {
        // 如果有 `:`，替换或插入操作符
        const beforeColon = currentValue.slice(0, currentColonIndex)
        
        // 检查 `:` 后面是否已有操作符
        const existingOperatorEnd = findExistingOperatorAfterColon(currentValue, currentColonIndex)
        const afterOperator = currentValue.slice(existingOperatorEnd)
        
        
        // 构建新值：`:之前的文本` + `:` + `新操作符` + `操作符之后的文本`
        newValue = beforeColon + ':' + option.label + afterOperator
      }
      

      // 计算操作符结束的位置（用于设置光标）
      const newColonIndex = newValue.lastIndexOf(':')
      let cursorOffset = newValue.length // 默认在末尾
      if (newColonIndex !== -1) {
        // 操作符结束位置 = `:` 的位置 + 1 + 操作符长度
        cursorOffset = newColonIndex + 1 + option.label.length
      }

      // 更新 block 的值
      updateBlock(blockId, newValue)
      
      // 隐藏下拉框
      showOperatorSuggest.value = false
      operatorSuggestPosition.value = null
      operatorSuggestBlockId.value = null

      // 聚焦到对应的小方块，并将光标移动到操作符后面
      // 使用三重 nextTick 确保 DOM 更新和 watch 处理完成后再设置焦点
      nextTick(() => {
        nextTick(() => {
          nextTick(() => {
            const blockElement = inputBox.value?.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
            const blockRef = blockRefs[blockId]
            
            if (!blockElement) {
              return
            }
            
            // 确保元素获得焦点
            blockElement.focus()
            
            // 使用 focusToPosition 精确设置光标位置
            if (blockRef?.focusToPosition) {
              try {
                blockRef.focusToPosition(cursorOffset)
              } catch (e) {
                // 备用方案：手动设置光标位置
                try {
                  const walker = document.createTreeWalker(
                    blockElement,
                    NodeFilter.SHOW_TEXT,
                    null
                  )
                  let currentPos = 0
                  let targetNode: Text | null = null
                  let targetOffset = 0
                  
                  let node: Text | null = null
                  while ((node = walker.nextNode() as Text | null)) {
                    const nodeLength = node.textContent?.length || 0
                    if (currentPos + nodeLength >= cursorOffset) {
                      targetNode = node
                      targetOffset = cursorOffset - currentPos
                      break
                    }
                    currentPos += nodeLength
                  }
                  
                  if (targetNode) {
                    const range = document.createRange()
                    range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
                    range.setEnd(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
                    const selection = window.getSelection()
                    if (selection) {
                      selection.removeAllRanges()
                      selection.addRange(range)
                    }
                  } else {
                    placeCursorToEnd(blockElement)
                  }
                } catch (e2) {
                  placeCursorToEnd(blockElement)
                }
              }
            } else {
              // 如果 blockRef 还没有准备好，直接手动设置光标位置
              try {
                const walker = document.createTreeWalker(
                  blockElement,
                  NodeFilter.SHOW_TEXT,
                  null
                )
                let currentPos = 0
                let targetNode: Text | null = null
                let targetOffset = 0
                
                let node: Text | null = null
                while ((node = walker.nextNode() as Text | null)) {
                  const nodeLength = node.textContent?.length || 0
                  if (currentPos + nodeLength >= cursorOffset) {
                    targetNode = node
                    targetOffset = cursorOffset - currentPos
                    break
                  }
                  currentPos += nodeLength
                }
                
                if (targetNode) {
                  const range = document.createRange()
                  range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
                  range.setEnd(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0))
                  const selection = window.getSelection()
                  if (selection) {
                    selection.removeAllRanges()
                    selection.addRange(range)
                  }
                } else {
                  placeCursorToEnd(blockElement)
                }
              } catch (e) {
                placeCursorToEnd(blockElement)
              }
            }
          })
        })
      })
    }

    // 解析小方块的值，提取 field、operator、value
    const parseBlockValue = (blockValue: string): QueryCondition => {
      const firstColonIndex = blockValue.indexOf(':')
      
      // 如果没有 `:`，所有内容作为 value
      if (firstColonIndex === -1) {
        return {
          field: '',
          operator: '',
          value: blockValue
        }
      }
      
      // 提取第一个 `:` 前面的内容作为 field
      const field = blockValue.slice(0, firstColonIndex)
      const afterFirstColon = blockValue.slice(firstColonIndex + 1)
      
      // 查找操作符（按 label 匹配，但返回 value）
      const sortedOptions = [...operatorOptions].sort((a, b) => b.label.length - a.label.length)
      let operatorLabel = ''
      let operatorValue = ''
      let operatorEnd = 0
      
      for (const op of sortedOptions) {
        if (afterFirstColon.startsWith(op.label)) {
          operatorLabel = op.label
          operatorValue = op.value
          operatorEnd = op.label.length
          break
        }
      }
      
      // 如果没有找到操作符，但有 field 和 value，默认使用 OPERATOR_EQ
      if (!operatorValue && field && afterFirstColon) {
        operatorValue = Operators.OPERATOR_EQ
        operatorEnd = 0
      }
      
      // 提取操作符后面的内容作为 value
      // 如果操作符后面还有 `:`，说明格式是 field:operator:value，需要跳过这个 `:`
      let value = afterFirstColon.slice(operatorEnd)
      if (value.startsWith(':')) {
        value = value.slice(1)
      }
      
      const result = {
        field: String(field || ''),
        operator: String(operatorValue || ''), // 返回操作符的 value 而不是 label
        value: String(value || '')
      }
      return result
    }
    // 获取所有查询条件
    const getAllQueryConditions = (): QueryCondition[] => {
      return blocks.value.map(block => parseBlockValue(block.value))
    }

    // 将 QueryCondition[] 转换为 ICondition 格式
    const formatConditions = (queryConditions: QueryCondition[]): ICondition & { conditionGroups?: any[] } => {
      // 分离以 `-` 开头的条件（用于 conditionGroups）和普通条件
      const normalConditions: QueryCondition[] = []
      const negativeConditions: QueryCondition[] = []
      
      queryConditions.forEach((c) => {
        const isNegativeConditions = c.field && c.field.startsWith('-')
        // 检查 field 是否以 `-` 开头
        if (isNegativeConditions) {
          negativeConditions.push(c)
        } else {
          normalConditions.push(c)
        }
      })
      
      // 过滤掉空的条件（field、operator、value 都为空）
      const validNormalConditions = normalConditions.filter(
        (c) => c.field || c.operator || c.value
      )
      
      // 处理负条件，按 field 分组
      const conditionGroups: any[] = []
      const negativeGroups: Record<string, Array<{ field: string; operator: string; value: string }>> = {}
      
      negativeConditions.forEach((c) => {
        // 去掉 field 前面的 `-`
        const fieldName = c.field.startsWith('-') ? c.field.slice(1) : c.field
        const value = c.value || ''
        
        // 检查 value 是否包含括号和 OR（格式：`(value1 OR value2)`）
        const orMatch = value.match(/^\((.*)\)$/)
        if (orMatch) {
          // 解析括号内的内容，按 OR 分割
          const values = orMatch[1].split(/\s+OR\s+/i).map(v => v.trim()).filter(v => v)
          
          // 为每个值创建一个 condition
          if (!negativeGroups[fieldName]) {
            negativeGroups[fieldName] = []
          }
          values.forEach(v => {
            negativeGroups[fieldName].push({
              field: fieldName,
              operator: 'OPERATOR_NE',
              value: v
            })
          })
        } else {
          // 单个值，直接添加
          if (!negativeGroups[fieldName]) {
            negativeGroups[fieldName] = []
          }
          negativeGroups[fieldName].push({
            field: fieldName,
            operator: 'OPERATOR_NE',
            value: value
          })
        }
      })
      
      // 将每个分组的负条件转换为 conditionGroup
      Object.keys(negativeGroups).forEach((fieldName) => {
        const groupConditions = negativeGroups[fieldName]
        if (groupConditions.length > 0) {
          conditionGroups.push({
            logic: 'LOGIC_OR',
            conditions: groupConditions
          })
        }
      })
      const result = {
        logic: 'LOGIC_AND' as const,
        conditions: validNormalConditions.map((c) => {
          // 确保 field、operator、value 三个字段始终存在，不能缺少任何一个
          const condition = {
            field: String(c.field || ''),
            operator: String(c.operator || ''),
            value: c.value !== undefined && c.value !== null ? String(c.value) : '',
          }
          return condition
        }),
        conditionGroups: conditionGroups.length > 0 ? conditionGroups : undefined,
      }
      return result
    }

    // 处理 Enter 键（始终触发搜索，无论下拉列表是否打开）
    const handleEnter = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // 关闭所有下拉列表
      showOperatorSuggest.value = false
      showSearchSuggest.value = false
      operatorSuggestPosition.value = null
      searchSuggestPosition.value = null
      operatorSuggestBlockId.value = null
      
      // 获取所有查询条件
      const queryConditions = getAllQueryConditions()
      
      // 转换为 ICondition 格式
      const condition = formatConditions(queryConditions)
      
      // emit 出去
      emit('search', condition)
    }

    // 处理键盘事件（用于操作符建议导航和搜索建议导航）
    const handleOperatorSuggestKeydown = (e: KeyboardEvent) => {
      // 处理 Enter 键（始终触发搜索）
      if (e.key === 'Enter') {
        handleEnter(e)
        return
      }
      
      // 优先处理操作符建议
      if (showOperatorSuggest.value) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          operatorSuggestSelectedIndex.value = Math.min(operatorSuggestSelectedIndex.value + 1, operatorOptions.length - 1)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          operatorSuggestSelectedIndex.value = Math.max(operatorSuggestSelectedIndex.value - 1, 0)
        } else if (e.key === 'Tab') {
          e.preventDefault()
          handleSelectOperator(operatorOptions[operatorSuggestSelectedIndex.value])
        } else if (e.key === 'Escape') {
          e.preventDefault()
          showOperatorSuggest.value = false
          operatorSuggestPosition.value = null
          operatorSuggestBlockId.value = null
        }
        return
      }

      // 处理搜索建议
      handleSearchSuggestKeydown(e)
    }

    // 监听外层div的焦点事件
    watch(inputBox, (newEl, oldEl) => {
      if (oldEl) {
        oldEl.removeEventListener('focus', handleOuterFocus)
        oldEl.removeEventListener('blur', handleOuterBlur)
      }
      if (newEl) {
        newEl.addEventListener('focus', handleOuterFocus)
        newEl.addEventListener('blur', handleOuterBlur)
        document.addEventListener('selectionchange', handleOuterSelectionChange)
        // 初始化时更新宽度
        updateInputBoxWidth()
        // 监听窗口大小变化
        const resizeObserver = new ResizeObserver(() => {
          updateInputBoxWidth()
        })
        resizeObserver.observe(newEl)
      }
    }, { immediate: true })

    // 暴露方法给父组件
    expose({
      addFastFilterBlock,
      removeFastFilterBlock,
      updateFastFilterBlocks,
      loadFromCondition,
      clearAllFastFilterBlocks,
      clearFastFilterRelatedBlocks,
      getAllBlocksContent,
      getCurrentQueryCondition,
      clearAllBlocks
    })

    return () => (
      <div class="qb-wrapper" onKeydown={handleOperatorSuggestKeydown}>
        <div class="qb-container">
        <div
          ref={inputBox}
          class="qb-inner"
          contentEditable
          autocorrect="false"
          aria-busy="false"
          filter-search-input
          filter-search-input--focus
          onInput={onInput}
            onBeforeinput={onBeforeInput}
            onMousedown={onMouseDown}
            onFocus={handleOuterFocus}
            onBlur={handleOuterBlur}
            onCompositionstart={onCompositionStart}
            onCompositionend={onCompositionEnd}
        >
          {/* 渲染 blocks（插入到输入区内） */}
          {blocks.value.map((block) => (
            <ConditionItem
                id={block.id}
              ref={(el: IConditionItemExpose | null) => {
                if (el) blockRefs[block.id] = el
                else delete blockRefs[block.id]
              }}
              key={block.id}
              value={block.value}
              readonly={false}
              onUpdate:value={(val: string) => {
                // 允许所有方块更新（包括快速筛查方块）
                updateBlock(block.id, val)
              }}
              onRemove={() => removeBlock(block.id)}
                onShowOperatorSuggest={handleShowOperatorSuggest}
                onHideOperatorSuggest={handleHideOperatorSuggest}
            />
          ))}
            <span
              ref={tailSpacer}
              class="qb-caret-offset"
              data-tail-spacer=""
            contentEditable
              aria-hidden="true"
            >
              {'\u00A0'}
            </span>
        </div>
          {/* 删除图标 */}
          {blocks.value.length > 0 && (
            <div class="qb-clear-icon" onClick={clearSearch}>
              <ElIcon>
                <Delete />
              </ElIcon>
        </div>
          )}
        </div>
        {/* 操作符建议下拉框 */}
        <OperatorSuggestions
          visible={showOperatorSuggest.value}
          selectedIndex={operatorSuggestSelectedIndex.value}
          position={operatorSuggestPosition.value}
          options={operatorOptions}
          width={inputBoxWidth.value}
          onSelect={handleSelectOperator}
        />
        {/* 搜索建议下拉框（外层div的） */}
        <OperatorSuggestions
          visible={showSearchSuggest.value}
          selectedIndex={searchSuggestSelectedIndex.value}
          position={searchSuggestPosition.value}
          options={props.suggestions}
          width={inputBoxWidth.value}
          onSelect={handleSelectSearchSuggest}
        />
      </div>
    )
  }
})
