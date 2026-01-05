// components/SearchSuggestions.tsx
import { defineComponent, PropType, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { LogField } from '@/api/logs/discover/interfaces'
import styles from '../index.module.scss'

// 运算符定义
const SEARCH_OPERATORS = [
  {
    operator: '=',
    syntax: 'attribute:value',
    description: '等于',
    backendId: 'equals',
  },
  {
    operator: '≠',
    syntax: '-attribute:value',
    description: '不等于',
    backendId: 'not_equals',
  },
  {
    operator: 'match',
    syntax: 'attribute:~value',
    description: '包含',
    backendId: 'match',
  },
  {
    operator: 'not_match',
    syntax: '-attribute:~value',
    description: '不包含',
    backendId: 'not_match',
  },
  {
    operator: 'wildcard',
    syntax: 'attribute:*value*',
    description: '通配',
    backendId: 'wildcard',
  },
  {
    operator: 'not_wildcard',
    syntax: '-attribute:*value*',
    description: '反向通配',
    backendId: 'not_wildcard',
  },
  {
    operator: 'regexp',
    syntax: 'attribute:/.*value.*/',
    description: '正则匹配',
    backendId: 'regexp',
  },
  {
    operator: 'not_regexp',
    syntax: '-attribute:/.*value.*/',
    description: '反向正则匹配',
    backendId: 'not_regexp',
  },
  {
    operator: 'exist',
    syntax: 'attribute:*',
    description: '存在',
    backendId: 'exist',
  },
  {
    operator: 'not_exist',
    syntax: '-attribute:*',
    description: '不存在',
    backendId: 'not_exist',
  },
]

export default defineComponent({
  name: 'SearchSuggestions',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    availableFields: {
      type: Array as PropType<LogField[]>,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
    cursorPosition: {
      type: Number,
      required: true,
    },
    onSelect: {
      type: Function as PropType<(suggestion: any) => void>,
      required: true,
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const selectedIndex = ref(0)
    const suggestionsRef = ref<HTMLDivElement>()

    // 判断是否应该显示运算符建议
    const shouldShowOperators = computed(() => {
      if (!props.searchQuery || props.cursorPosition === 0) return false

      // 检查光标前是否有空格
      const beforeCursor = props.searchQuery.substring(0, props.cursorPosition)

      // 统计空格数量
      const spaceCount = (beforeCursor.match(/ /g) || []).length

      // 如果有两个或更多空格，不显示任何建议
      if (spaceCount >= 2) return null

      // 如果有一个空格，检查空格后是否有内容
      if (spaceCount === 1) {
        const parts = beforeCursor.split(' ')
        const lastPart = parts[parts.length - 1]

        // 如果空格后没有内容（即空格是最后一个字符），显示运算符建议
        if (beforeCursor.endsWith(' ')) {
          return true
        }

        // 如果空格后有内容，不显示任何建议
        return null
      }

      return false
    })

    // 获取建议列表
    const suggestions = computed(() => {
      // 如果 shouldShowOperators 为 null，表示不显示任何建议
      if (shouldShowOperators.value === null) {
        return []
      }

      if (shouldShowOperators.value) {
        return SEARCH_OPERATORS.map((op) => ({
          type: 'operator' as const,
          value: op.operator,
          label: op.operator,
          description: op.description,
          syntax: op.syntax,
          backendId: op.backendId,
        }))
      } else {
        // 显示所有字段
        return props.availableFields.map((field) => ({
          type: 'field' as const,
          value: field.name,
          label: field.name,
          description: field.type,
          syntax: `${field.name}:value`,
        }))
      }
    })

    // 处理键盘事件
    const handleKeydown = (e: KeyboardEvent) => {
      if (!props.visible) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
          break
        case 'Enter':
          e.preventDefault()
          if (suggestions.value[selectedIndex.value]) {
            props.onSelect(suggestions.value[selectedIndex.value])
          }
          break
        case 'Escape':
          e.preventDefault()
          props.onClose()
          break
      }
    }

    // 处理建议项点击
    const handleSuggestionClick = (suggestion: any, e: MouseEvent) => {
      e.preventDefault() // 阻止默认行为
      e.stopPropagation() // 阻止事件冒泡
      props.onSelect(suggestion)
    }

    // 计算动态预览内容
    const previewQuery = computed(() => {
      const beforeCursor = props.searchQuery.substring(0, props.cursorPosition)
      const parts = beforeCursor.split(' ')

      if (shouldShowOperators.value === null) {
        // 两个空格后，显示完整的查询
        return props.searchQuery
      } else if (shouldShowOperators.value) {
        // 显示运算符建议时，显示字段名
        const field = parts[0] || 'field'
        return `${field}:value`
      } else {
        // 显示字段建议时
        return 'field:value'
      }
    })

    // 重置选中索引
    const resetSelectedIndex = () => {
      selectedIndex.value = 0
    }

    // 监听建议列表变化，重置选中索引
    watch(() => suggestions.value, resetSelectedIndex)

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return () => {
      if (!props.visible || suggestions.value.length === 0) {
        return null
      }

      return (
        <div class={styles.searchSuggestions} ref={suggestionsRef}>
          {/* 预览区域 */}
          {/* <div class={styles.suggestionPreview}>
            <div class={styles.previewIcon}>📄</div>
            <div class={styles.previewContent}>
              <div class={styles.previewLabel}>预览</div>
              <div class={styles.previewQuery}>{previewQuery.value}</div>
            </div>
          </div> */}

          {/* 建议列表 */}
          <div class={styles.suggestionList}>
            {suggestions.value.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.value}`}
                class={[
                  styles.suggestionItem,
                  index === selectedIndex.value ? styles.suggestionItemActive : '',
                ]}
                onMousedown={(e) => handleSuggestionClick(suggestion, e)}
              >
                <div class={styles.suggestionContent}>
                  <div class={styles.suggestionOperator}>{suggestion.label}</div>
                  <div class={styles.suggestionSyntax}>{suggestion.syntax}</div>
                  <div class={styles.suggestionDescription}>{suggestion.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  },
})
