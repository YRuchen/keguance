import { ElDialog } from 'element-plus'
import { computed, defineComponent, PropType } from 'vue'
import styles from './index.module.scss'

const props = {
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number] as PropType<number | string | 'small' | 'default' | 'large'>,
    default: 'default',
  },
}

const SIZE_MAP: Record<'small' | 'default' | 'large', number> = {
  small: 480,
  default: 600,
  large: 900,
}

export default defineComponent({
  name: 'BaseDialog',
  props,
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit, attrs, slots }) {
    const dialogVisible = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })

    const dialogWidth = computed(() => {
      const w = props.width

      if (w === 'small' || w === 'default' || w === 'large') {
        return `${SIZE_MAP[w]}px`
      }

      return w
    })

    return () => (
      <ElDialog
        {...attrs}
        width={dialogWidth.value}
        modelValue={dialogVisible.value}
        onUpdate:modelValue={(val) => (dialogVisible.value = val)}
        class={styles.container}
      >
        {slots.default?.()}
      </ElDialog>
    )
  },
})
