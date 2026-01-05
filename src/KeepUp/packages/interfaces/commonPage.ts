import type { DefineComponent, VNode } from "vue"
import type { ISchema } from "@formily/vue"
import type { ICommonObj } from './common'

/** 行数据 */
interface IRowData {
  /** rowData */
  rowData: ICommonObj
  /** rowIndex */
  rowIndex: number
}

/** 列配置 */
interface IColumnConfig {
  /** 列宽度 */
  width?: number
  /** 最小列宽 */
  minWidth?: number
  /** 允许拖拽改变列宽 */
  resizable?: boolean
  /** 最小可拖拽列宽 */
  resizeMinWidth?: number
  /** 固定列 */
  fixed?: 'left' | 'right'
  /** 自定义单元格 */
  render?: ({rowData, rowIndex}: IRowData) => VNode
}

/** 筛选项/编辑项配置 */
interface IFilterOrEditConfig extends Partial<ISchema> {
  /** 组件 */
  component?: DefineComponent
  /** 组件props */
  componentProps?: ICommonObj
}

/** 请求配置 */
export interface IFetchConfig {
  /** api */
  api: (p: any) => Promise<any>
  /** 入参 */
  params?: any
  /** 远程搜索 */
  remote?: boolean
  /** 请求出参过滤器 */
  formatter?: (p: any) => any
}

/** field基础配置 */
export interface IFieldBase {
  /** 字段标识 */
  prop: string
  /** 字段label */
  label: string
  /** 是列 */
  isColumn?: boolean
  /** 列配置 */
  columnConfig?: IColumnConfig
  /** 是筛选项 */
  isFilter?: boolean
  /** 筛选项配置 */
  filterConfig?: IFilterOrEditConfig
  /** 是编辑项 */
  isEdit?: boolean
  /** 编辑项配置（用于侧边栏的新增/查看/编辑状态） */
  editConfig?: IFilterOrEditConfig
  /** 请求配置 */
  fetchConfig?: IFetchConfig
}

/** field完整配置 */
export type IField = IFieldBase
  & (
    | { columnConfig?: undefined }
    | {
      /** 列 */
      isColumn: boolean
      /** 列配置 */
      columnConfig: IColumnConfig
    }
  )
  & (
    | { editConfig?: undefined }
    | { 
      /** 编辑项 */
      isEdit: boolean
      /** 编辑项配置（用于侧边栏的新增/查看/编辑状态） */
      editConfig: IFilterOrEditConfig
    }
  )
  & (
    | { filterConfig?: undefined }
    | {
      /** 筛选项 */
      isFilter: boolean 
      /** 筛选项配置 */
      filterConfig: IFilterOrEditConfig
    }
  )
