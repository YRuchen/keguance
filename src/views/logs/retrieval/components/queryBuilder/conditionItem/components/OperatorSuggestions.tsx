import { defineComponent, type PropType } from 'vue'
import './OperatorSuggestions.scss'

export interface OperatorOption {
  label: string
  value: string
}

export default defineComponent({
  name: 'OperatorSuggestions',
  props: {
    visible: { type: Boolean, required: true },
    selectedIndex: { type: Number, required: true },
    position: { type: Object as PropType<{ top: number; left: number } | null>, default: null },
    options: { type: Array as PropType<OperatorOption[]>, required: true },
    width: { type: Number, default: 0 },
    onSelect: { type: Function as PropType<(option: OperatorOption) => void>, required: true }
  },
  setup(props) {
    return () => {
      if (!props.visible || !props.position) return null

      return (
        <div
          class="operator-suggestions"
          data-operator-suggestions=""
          style={{
            top: `${props.position.top}px`,
            left: `${props.position.left}px`,
            width: props.width > 0 ? `${props.width}px` : 'auto'
          }}
          onMousedown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('[OperatorSuggestions] container mousedown')
          }}
        >
          <ul class="operator-suggestions__list">
            {props.options.map((option, index) => (
              <li
                key={option.value}
                class={{
                  'operator-suggestions__item': true,
                  'operator-suggestions__item--selected': index === props.selectedIndex
                }}
                onMousedown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('[OperatorSuggestions] mousedown option:', option)
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('[OperatorSuggestions] clicked option:', option)
                  console.log('[OperatorSuggestions] calling onSelect')
                  props.onSelect?.(option)
                  console.log('[OperatorSuggestions] onSelect called')
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }
})

