import { defineComponent, ref, computed } from 'vue'
import { Space, FormilyForm } from '~/KeepUp'
import FilterPanel from '~/views/availabilityMonitoring/components/FilterPanel'
import FastFilter from './components/fastFilter'
import { getLeftPaneSchema } from './leftSchema'
import QueryBuilder from './components/queryBuilder'
import styles from './index.module.scss'

import type { IFormilyFormExpose } from '~/KeepUp'
import type { IExpose as IFilterExpose } from '~/views/availabilityMonitoring/components/FilterPanel/interfaces'

export default defineComponent({
  name: 'Retrieval',
  setup() {
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const filterPanelRef = ref<IFilterExpose>()
    const selectedValues = ref<Array<string[]>>([]) // 左侧筛选区的选中项
    /** 获取焦点左侧第一个字符 */
    function getLeftCharSimple() {
      const sel = window.getSelection()
      const hasRange = sel && sel.rangeCount
      if (!hasRange) return ''

      const range = sel.getRangeAt(0) // 第一个选区
      const node = range.startContainer // 选区container
      const offset = range.startOffset // 焦点左侧第一个字符在startContainer内的偏移量

      // 情况 1：在文本节点中
      if (node.nodeType === Node.TEXT_NODE) {
        if (offset > 0) {
          return node.textContent[offset - 1]
        }
      }

      // 情况 2：光标在元素节点（如 span）的 childNodes 索引中
      if (node.nodeType === Node.ELEMENT_NODE) {
        const idx = offset - 1
        if (idx >= 0) {
          let prev = node.childNodes[idx]
          while (prev && prev.lastChild) {
            prev = prev.lastChild
          }
          if (prev && prev.nodeType === Node.TEXT_NODE) {
            return prev.textContent.slice(-1)
          }
        }
      }

      // 情况 3：向左跨节点查找
      let cur = node
      while (cur) {
        let prev = cur.previousSibling
        while (prev) {
          // 找到最深的文本节点
          while (prev.lastChild) {
            prev = prev.lastChild
          }
          if (prev.nodeType === Node.TEXT_NODE) {
            return prev.textContent.slice(-1)
          }
          prev = prev.previousSibling
        }
        cur = cur.parentNode
      }

      return ''
    }
    const g = () => {
      console.log(getLeftCharSimple())
    }
    function onInput(e) {
      const sel = window.getSelection()
      if (!sel || !sel.rangeCount) return
      const range = sel.getRangeAt(0)
      
      // 获取刚输入的字符
      const char = range.startContainer.textContent[range.startOffset - 1]
      if (!char) return

      // 创建内层div
      const span = document.createElement('div')
      span.className = 'inner-block'
      span.textContent = char

      // 插入到光标位置
      range.deleteContents() // 删除刚输入的字符
      range.insertNode(span)

      // 移动光标到 span 后面
      range.setStartAfter(span)
      range.setEndAfter(span)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    return () => (
      <Space class={styles.container} fill>
        <Space class={styles.left} align='start'>
          <FormilyForm
            ref={formilyFormRef}
            config={getLeftPaneSchema(formRef)}
            components={{ FastFilter }}
          />
        </Space>
        <Space class={styles.right}>
          <QueryBuilder />
          {/* <FormilyForm
            ref={formilyFormRef}
            config={getLeftPaneSchema(formRef)}
            components={{ FastFilter }}
          /> */}
        </Space>
      </Space>
    )
  }
})
