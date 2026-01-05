import { defineComponent, PropType, ref } from 'vue'
import { ElCheckbox, ElIcon } from 'element-plus'
import styles from '../index.module.scss'
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue'

export type StatusKey = 'Error' | 'Warn' | 'Info' | 'Fatal' | 'Debug'

export default defineComponent({
  name: 'StatusFilter',
  props: {
    title: { type: String, default: 'Status' },
    /** 选中状态集合 */
    modelValue: { type: Array as PropType<StatusKey[]>, required: true },
    /** 计数 */
    counts: {
      type: Object as PropType<Record<StatusKey, number>>,
      required: true,
    },
    /** 是否已全部选中（用于标题小对勾图标控制，可扩展） */
    allSelected: { type: Boolean, default: false },
    collapsible: { type: Boolean, default: true },
    defaultCollapsed: { type: Boolean, default: false },
    /** 是否正在日志流模式 */
    isStreaming: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const collapsed = ref<boolean>(props.defaultCollapsed)
    const hoveredStatus = ref<StatusKey | null>(null)

    const toggle = (key: StatusKey, checked: boolean) => {
      // 如果正在日志流模式，禁止切换
      if (props.isStreaming) {
        return
      }
      const next = new Set(props.modelValue)
      if (checked) next.add(key)
      else next.delete(key)
      const arr = Array.from(next) as StatusKey[]
      emit('update:modelValue', arr)
      emit('change', arr)
    }

    // 处理Only点击：只选中当前状态
    const handleOnlyClick = (key: StatusKey) => {
      // 如果正在日志流模式，禁止操作
      if (props.isStreaming) {
        return
      }
      emit('update:modelValue', [key])
      emit('change', [key])
    }

    // 处理All点击：全选所有状态
    const handleAllClick = () => {
      // 如果正在日志流模式，禁止操作
      if (props.isStreaming) {
        return
      }
      const allStatuses: StatusKey[] = ['Error', 'Warn', 'Info', 'Fatal', 'Debug']
      emit('update:modelValue', allStatuses)
      emit('change', allStatuses)
    }

    // 判断是否应该显示Only
    const shouldShowOnly = (key: StatusKey) => {
      // 多选时，所有状态都显示Only
      // 单选时，只有未选中的状态显示Only
      return (
        props.modelValue.length > 1 ||
        (props.modelValue.length === 1 && !props.modelValue.includes(key))
      )
    }

    // 判断是否应该显示All
    const shouldShowAll = (key: StatusKey) => {
      return props.modelValue.length === 1 && props.modelValue.includes(key)
    }

    return () => (
      <div class={styles.panelSection}>
        <div
          class={styles.panelHeader}
          onClick={() => {
            if (props.collapsible) collapsed.value = !collapsed.value
          }}
        >
          <ElIcon>{collapsed.value ? <ArrowRight /> : <ArrowDown />}</ElIcon>
          <h4>{props.title}</h4>
        </div>
        {!collapsed.value ? (
          <div class={styles.statusList}>
            {(['Fatal', 'Error', 'Warn', 'Debug', 'Info'] as StatusKey[]).map((k) => (
              <div
                class={styles.statusRow}
                key={k}
                onMouseenter={() => (hoveredStatus.value = k)}
                onMouseleave={() => (hoveredStatus.value = null)}
                onClick={(e) => {
                  // 如果正在日志流模式，禁止点击
                  if (props.isStreaming) {
                    return
                  }
                  // 如果点击的是复选框，不处理整行点击
                  if ((e.target as HTMLElement).closest('.el-checkbox')) {
                    return
                  }

                  // 根据当前状态决定点击行为
                  if (shouldShowOnly(k)) {
                    handleOnlyClick(k)
                  } else if (shouldShowAll(k)) {
                    handleAllClick()
                  }
                }}
              >
                <ElCheckbox
                  modelValue={props.modelValue.includes(k)}
                  disabled={props.isStreaming}
                  onChange={(val: boolean) => toggle(k, val)}
                />
                <span class={[styles.statusDot, styles[`dot${k}`]]}></span>
                <span class={styles.statusLabel}>{k}</span>
                <span class={styles.statusCount}>{props.counts[k] ?? 0}</span>

                {/* Only/All 按钮 */}
                {hoveredStatus.value === k && (
                  <span class={styles.statusAction}>
                    {shouldShowOnly(k) ? (
                      <span class={styles.onlyButton}>Only</span>
                    ) : shouldShowAll(k) ? (
                      <span class={styles.allButton}>All</span>
                    ) : null}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  },
})
