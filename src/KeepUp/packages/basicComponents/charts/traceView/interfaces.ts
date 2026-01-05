import type { Ref } from 'vue'
import type { ICommonObj } from '../../../interfaces/common'
import type { leftProps } from './line'

/** 左侧render入参 */
export interface ILeftRenderParams {
  /** props */
  props: typeof leftProps
  /** emits */
  emits: Record<string, (p: ICommonObj) => void>
}

/** useCollapse出参 */
export interface IUseCollapseExpose {
  /** 所有收起的span的id */
  collapsedSpanIds: Ref<Set<string>>
  /** 切换span展开收起 */
  toggleSpanCollapse: (p: Record<'spanId', string>) => void
}

/** 通用tag类型 */
interface ITagItem {
  /** 键名 */
	key: string
	/** 值 */
	value: string
}

/** span详情 */
export interface ISpanItem {
  /** id */
  spanID: string
  /** traceId */
  traceID: string
  /** 父级id */
  parentSpanID: string
  /** span操作名 */
  operationName: string
  /** span的服务名称 */
  serviceName: string
  /** span的类型，例如Client、Server、Producer、Consumer等，表示在分布式系统中的作用 */
  kind: string
  /** 状态码，表示span的执行状态, 0: unset, 1: ok, 2: error */
  statusCode: 0 | 1 | 2
  /** 状态信息 */
  statusMessage: string
  /** 产生span的 instrumentation library 的名称，例如OpenTelemetry中的库名 */
  instrumentationLibraryName: string
  /** instrumentation library 的版本。 */
  instrumentationLibraryVersion: string
  /** 携带跨度的跟踪系统特定信息，例如W3C Trace Context中的traceState。 */
  traceState: string
  /** 服务级别的标签，通常包括服务实例的信息，如版本、环境等。 */
  serviceTags: ITagItem[]
  /** 开始时间 */
  startTime: number
  /** 持续时间 */
  duration: number
  /** 日志 */
  logs: null
  /** 指向其他span的引用，例如在异步调用中，一个span可能被多个子span引用。这里为null，表示没有引用 */
  references: null
  /** span的标签，用于记录额外的元数据，例如HTTP状态码、数据库查询语句等 */
  tags: ITagItem[]
}

/** 用于渲染的源数据 */
export interface IVisibleDataItem {
  /** span数据 */
  span: ISpanItem
  /** 层级 */
  depth: number
  /** 有子级 */
  hasChildren: boolean
  /** 颜色 */
  color: string
  /** 折叠 */
  collapsed: boolean
}

/** useVisibleData出参 */
export interface IUseVisibleDataExpose {
  /** 用于渲染的源数据 */
  visibleData: Ref<IVisibleDataItem[]>
}

/** 布局 */
export interface ILayoutItem {
  /** 宽度 */
  width: string
}
