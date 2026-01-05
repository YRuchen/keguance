import { defineComponent, computed } from 'vue'
import { ElIcon, ElText } from 'element-plus'
import { ArrowDown, WarningFilled, Document } from '@element-plus/icons-vue'
import { Space } from '~/KeepUp'
import emitter from '../../../../../__builtins__/emitter'
import { EMITTER_EVENT } from '../../constants'
import { blockRectConfig } from './constants'
import PlaceholderBlock from '../../components/placeholderBlock'
import { props } from './constants'
import styles from './index.module.scss'

export { props }
export default defineComponent({
  name: 'LineLeft',
  props,
  emits: ['openLogPanel'],
  setup(props, { emit }) {
    const commonStyle = computed(() => ({
      backgroundColor: `color-mix(in srgb, ${props.span.color} 30%, white)`,
      borderBottom: `2px solid ${props.span.color}`,
    }))
    const isError = computed(() => props.span.span?.statusCode === 2)
    const arrowDownTsx = () => (
      <ElIcon 
        size={12} 
        style={{
          cursor: 'pointer',
          transform: `rotate(${props.span.collapsed ? -90 : 0}deg)`,
        }}
      ><ArrowDown /></ElIcon>
    )
    const warningFilledTsx = () => (
      <ElIcon color='red'><WarningFilled /></ElIcon>
    )
    const documentTsx = () => (
      <ElIcon style={{ cursor: 'pointer' }}><Document /></ElIcon>
    )
    /** 折叠 */
    const collapse = () => {
      emitter.emit(EMITTER_EVENT['TRACE:TOGGLE_SPAN_COLLAPSE'], { spanId: props.span.span.spanID })
    }
    return () => (
      <Space 
        class={styles.container}
        style={{ width: props.width, overflow: 'hidden', position: 'relative' }} 
        size={0}
      >
        {
          Boolean(props.span.depth)
            && <Space size={0}>
                {new Array(props.span.depth).fill(1).map((_, i) => <PlaceholderBlock {...blockRectConfig} bordered={Boolean(i)} />)}
              </Space>
        }
        <PlaceholderBlock
          {...blockRectConfig}
          bordered={Boolean(props.span.depth)}
          onClick={collapse}
        >{props.span.hasChildren && arrowDownTsx()}</PlaceholderBlock>
        {
          isError.value 
            && <PlaceholderBlock
                {...blockRectConfig}
                style={commonStyle.value}
              >
                {warningFilledTsx()}
              </PlaceholderBlock>
        }
        <ElText
          truncated
          class={styles.text} 
          style={{
            fontSize: '14px',
            whiteSpace: 'nowrap',
            ...commonStyle.value,
          }}
        >
          {props.span.span?.serviceName} <ElText style={styles.operationName}>{props.span.span?.operationName}</ElText>
        </ElText>
        <PlaceholderBlock
          {...blockRectConfig}
          class={styles.document}
          style={commonStyle.value}
          onClick={() => { emit('openLogPanel', { span: props.span }) }}
        >
          {documentTsx()}
        </PlaceholderBlock>
      </Space>
    )
  }
})
