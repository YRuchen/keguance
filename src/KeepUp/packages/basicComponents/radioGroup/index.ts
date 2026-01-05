import { defineComponent, computed, h } from 'vue'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewText } from '@formily/element-plus'
import { ElRadioGroup } from 'element-plus'
import { composeExpose } from '../../__builtins__/shared'
import { optionRenderTypeMap } from './constants'

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
  },
  /** 选项dom类型 */
  optionRenderType: {
    type: String as PropType<'RADIO' | 'BUTTON'>,
    default: 'RADIO',
  },
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
            || h(optionRenderTypeMap[props.optionRenderType], { value: v.value }, v.label)
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

/** radioGroup */
export default composeExpose(
  RadioGroup,
  {
    FormilyRadioGroup,
  }
)
