// components/FieldPanel.tsx
import { defineComponent, PropType, ref, watch } from 'vue'
import { LogField } from '@/api/logs/discover/interfaces'
import styles from '../index.module.scss'
import { ElIcon } from 'element-plus'
import { ArrowDown, ArrowRight, CirclePlusFilled, Close } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'FieldPanel',
  props: {
    title: {
      type: String,
      required: true,
    },
    fields: {
      type: Array as PropType<LogField[]>,
      required: true,
    },
    showSelected: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: true,
    },
    defaultCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fieldToggle'],
  setup(props, { emit }) {
    const collapsed = ref<boolean>(props.defaultCollapsed)

    watch(
      () => props.defaultCollapsed,
      (v) => (collapsed.value = v),
    )

    const handleFieldClick = (field: LogField) => {
      emit('fieldToggle', field)
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
          <div class={styles.fieldList}>
            {props.fields.map((field) => (
              <div
                key={field.name}
                class={[styles.fieldItem, field.isSystemField ? styles.systemField : '']}
              >
                {field.name}
                {/* 系统字段不显示操作图标 */}
                {field.name !== '_source' && (
                  <span class={styles.actionIcon} onClick={() => handleFieldClick(field)}>
                    <ElIcon color={field.selected ? 'red' : '#1763ff'} size={18}>
                      {field.selected ? <Close /> : <CirclePlusFilled />}
                    </ElIcon>
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
