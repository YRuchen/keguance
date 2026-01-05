import { defineComponent, computed, h } from 'vue'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewText } from '@formily/element-plus'
import { ElRadio, ElRadioGroup } from 'element-plus'

import type { PropType } from 'vue'
import type { IOptionsItem } from './interfaces'

const props = {
  /** 值 */
  modelValue: {
    type: [String, Boolean],
    default: '',
  },
  /** 下拉框options */
  options: {
    type: Array as PropType<IOptionsItem[]>,
    default: () => ([]),
  }
}

/** vue radioGroup */
export const RadioGroup = defineComponent({
  name: 'RadioGroup',
  inheritAttrs: false,
  props,
  setup(props, { attrs, emit, slots }) {
    const selected = computed({
      set(val) {
        emit('update:modelValue', val)
      },
      get() {
        return props.modelValue
      }
    })
    return () => (
      h(
        ElRadioGroup,
        { modelValue: selected.value, ...attrs },
        props.options.map(v => (
          slots.option?.({ option: v })
            || h(ElRadio, { value: v.value }, v.label)
        )),
      )
    )
  }
})

/** formily radioGroup */
export const FormilyRadioGroup = connect(
  RadioGroup,
  mapProps({ value: 'modelValue', dataSource: 'options' }),
  mapReadPretty(PreviewText.Input),
)
