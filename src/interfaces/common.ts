import { HeaderMode } from '@/routers/constants'

import type { VNode, DefineComponent } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

/** 对象 */
export interface ICommonObj {
  [k: string]: any
}

/** upload组件的文件格式 */
export interface IUploadFile {
  /** 文件名 */
  name: string
  /** url */
  url: string
}

/** 获取列表出参 */
export interface ICommonGetListRes<L> {
  /** list */
  list: L
  /** 分页信息 */
  pagination?: {
    /** 页码 */
    page: number
    /** 每页展示条数 */
    pageSize: number
    /** 总条目 */
    total: number
  }
}

/** 获取列表 */
export type IListApi = (p?: ICommonObj) => Promise<ICommonGetListRes<any[]>>

/** Option Item */
export interface IOptionItem {
  /** 键名 */
  label: string
  /** 值 */
  value: string | number
}

/** action入参 */
interface IActionParams {
  router: Router
}
/** action */
type IAction = (p?: IActionParams) => Promise<void> | void

/** 路由元配置 */
export type IRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    /** 层级 */
    level?: number
    /** 强制作为菜单组展示 */
    alwaysShow?: boolean
    /** 权限点列表 */
    permissionCodes?: string[]
    /** 左侧菜单隐藏 */
    hidden?: boolean
    /** 在左侧菜单置灰 */
    disabledInMenu?: boolean
    /** 顶部菜单隐藏 */
    headerHidden?: boolean
    /** 缓存 */
    keepAlive?: boolean
    /** 标题 */
    title?: string
    /** 图标 */
    icon?: DefineComponent | VNode | string
    /** 是标签 */
    affix?: boolean
    /** 是面包屑 */
    breadcrumb?: boolean
    /** 顶部菜单展示形式 */
    headerMode?: HeaderMode
    /** 面包屑（自定义面包屑的数据） */
    breadcrumbConfig?: Record<'label' | 'name', string>[]
    /** 动作 */
    action?: IAction
  }
  /** 子节点 */
  children?: IRouteRecordRaw[]
}

/** 线路通用获取图表数据的接口入参 */
export interface ILineModuleGetChartParams {
  /** 搜索关键字 */
  keyword?: string
  /** 执行时间 */
  time?: 'LATEST' | 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | '30D'
  /** 执行任务的开始时间（ISO RFC-3339 格式） */
  fromTime?: string
  /** 执行任务的结束时间（ISO RFC-3339 格式） */
  toTime?: string
  /** 执行节点所属地区 */
  probeRegionName?: string
  /** 执行节点所属省份 */
  probeSubdivision?: string
  /** 执行节点运营商 */
  probeLspName?: string
  /** 任务类型 */
  subType?: 'SUB_TYPE_UNKNOWN' | 'HTTP' | 'TCP' | 'UDP' | 'ALL' | 'GRPC' | 'SSL' | 'DNS' | 'WEBSOCKET'
  /** 任务ID */
  testId?: string
  /** 域名/地址 */
  domain?: string
  /** 面板宽度（单位px） */
  panelWidth?: number
}

/** 饼图item */
interface IPieChartData {
  /** 值 */
  value: 2
  /** 百分比 */
  percent: 20
  /** 标题 */
  name: string
}
/** 线路通用获取图表数据的接口出参-饼图 */
export interface ILineModuleGetPieChartRes {
  total: 10
  /** 数据 */
  data: IPieChartData[]
}

/** 线路通用获取图表数据的接口出参-柱状图 */
export interface ILineModuleGetBarChartRes {
  /** 标题 */
  category: string[]
  /** 数据 */
  series: {
    data: number[]
    name: string
  }[]
  /** 总结标题 */
  summary: {
    key: string
    value: string
  }[]
}

/** 线路通用获取图表数据的接口出参-折线图 */
export interface ILineModuleGetLineChartRes {
  /** 数据 */
  series: {
    data: {
      time: string
      value: number
    }[]
    name: string
  }[]
}
