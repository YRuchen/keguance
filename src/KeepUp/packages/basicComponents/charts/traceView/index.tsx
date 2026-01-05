import { defineComponent, ref, computed, onMounted } from 'vue'
import { Space } from '~/KeepUp'
import emitter from '../../../__builtins__/emitter'
import Line from './line'
import { useVisibleData } from './useVisibleData'
import { useCollapse } from './useCollapse'
import { COLOR_MAP, EMITTER_EVENT } from './constants'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { rightProps } from './line'
import type { ILeftRenderParams, ISpanItem, ILayoutItem } from './interfaces'

const props = {
  /** 源数据 */
  data: {
    type: Object as PropType<ISpanItem[]>,
    default: () => ({}),
  },
  /** 时间轴刻度 */
  timeColumns: {
    type: Number,
    default: 5,
  },
}

export type { ISpanItem, IVisibleDataItem } from './interfaces'
export { useVisibleData }
export default defineComponent({
  name: 'TraceView',
  props,
  emits: ['openLogPanel'],
  setup(props, { emit }) {
    /** 布局 */
    const layout = ref<Record<'left' | 'right', ILayoutItem>>({
      left: { width: '40%' },
      right: { width: '60%' },
    })
    /** 按时间排序 */
    const spans = computed(() => (props.data || []).sort((a, b) => a.startTime - b.startTime))
    /** 时间轴基准数据 */
    const rootSpan = computed(() => spans.value.find(v => !v?.parentSpanID))
    const {
      collapsedSpanIds,
      toggleSpanCollapse,
    } = useCollapse()
    const {
      visibleData,
    } = useVisibleData(spans, collapsedSpanIds)
    const headerLeftRender = ({ props }: Partial<ILeftRenderParams>) => (
      <Line.HeaderLeft width={props.width} />
    )
    const headerRightRender = (props: Partial<typeof rightProps>) => (
      <Line.HeaderRight
        timeColumns={props.timeColumns}
        rootSpan={props.rootSpan}
        width={props.width}
      />
    )
    const leftRender = ({ props, emits }: ILeftRenderParams) => (
      <Line.LineLeft
        span={props.span}
        width={props.width}
        onOpenLogPanel={emits.onOpenLogPanel}
      />
    )
    const rightRender = (props: typeof rightProps) => (
      <Line.LineRight
        span={props.span}
        timeColumns={props.timeColumns}
        rootSpan={props.rootSpan}
        width={props.width}
      />
    )
    onMounted(() => {
      emitter.on(EMITTER_EVENT['TRACE:TOGGLE_SPAN_COLLAPSE'], toggleSpanCollapse)
    })
    return () => (
      <Space class={styles.container} fill direction='column' size={0}>
        <Line
          style={{
            borderTop: '1px solid #e0e0e0',
          }}
          class={styles.headerLine}
          layout={layout.value}
          timeColumns={props.timeColumns}
          rootSpan={rootSpan.value}
          leftRender={headerLeftRender}
          rightRender={headerRightRender}
        />
        {
          (visibleData.value || []).map((v, i) => (
            <Line
              key={i}
              span={v}
              layout={layout.value}
              timeColumns={props.timeColumns}
              rootSpan={rootSpan.value}
              color={COLOR_MAP[i]}
              leftRender={leftRender}
              rightRender={rightRender}
              hoverable
              onOpenLogPanel={({ span }) => emit('openLogPanel', span)}
            />
          ))
        }
        <div class={styles.bottomBorder} />
      </Space>
    )
  }
})
