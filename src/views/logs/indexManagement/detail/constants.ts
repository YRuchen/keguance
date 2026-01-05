import { h } from 'vue'
import { isEmpty } from 'lodash'
import { CommonJsonPretty } from '~/KeepUp'

import type { Column } from 'element-plus'

/** 详情页-顶部列表 */
export const getColumns = (): Partial<Column>[] => ([
  {
    prop: 'timestamp',
    label: '时间',
    width: 180,
  },
  {
    prop: 'logJson',
    label: '内容',
    minWidth: 180,
    render: ({ rowData }) => h(
      'div',
      {
        style: {
          maxHeight: '150px',
          overflowY: 'auto',
        },
      },
      h(
        CommonJsonPretty, 
        { 
          data: isEmpty(rowData.logJson) ? '暂无信息' : rowData.logJson,
          deep: 0,
        },
      ),
    ),
  }
])

/** 数据存储策略 */
export enum RetentionDays {
  '3天' = 3,
  '7天' = 7,
  '15天' = 15,
  '30天' = 30,
  '45天' = 45,
  '60天' = 60,
  '180天' = 180,
}

/** 数据存储策略 */
export const retentionDaysOptions = [
  { label: '3天', value: RetentionDays['3天'] },
  { label: '7天', value: RetentionDays['7天'] },
  { label: '15天', value: RetentionDays['15天'] },
  { label: '30天', value: RetentionDays['30天'] },
  { label: '45天', value: RetentionDays['45天'] },
  { label: '60天', value: RetentionDays['60天'] },
  { label: '180天', value: RetentionDays['180天'] },
]

/** 全量断言操作符 */
export enum AssertionOperators {
  /** 等于 */
  OPERATOR_EQ = 'OPERATOR_EQ',
  /** 不等于 */
  OPERATOR_NE = 'OPERATOR_NE',
  /** 大于 */
  OPERATOR_GT = 'OPERATOR_GT',
  /** 大于等于 */
  OPERATOR_GTE = 'OPERATOR_GTE',
  /** 小于 */
  OPERATOR_LT = 'OPERATOR_LT',
  /** 小于等于 */
  OPERATOR_LTE = 'OPERATOR_LTE',
  /** 包含，关键字字段匹配 */
  OPERATOR_MATCH = 'OPERATOR_MATCH',
  /** 不包含 */
  OPERATOR_NOT_MATCH = 'OPERATOR_NOT_MATCH',
  /** 通配符匹配 */
  OPERATOR_WILDCARD = 'OPERATOR_WILDCARD',
  /** 反向通配 */
  OPERATOR_NOT_WILDCARD = 'OPERATOR_NOT_WILDCARD',
  /** 正则匹配 */
  OPERATOR_REGEXP = 'OPERATOR_REGEXP',
  /** 反向正则 */
  OPERATOR_NOT_REGEXP = 'OPERATOR_NOT_REGEXP',
  /** 字段存在 */
  OPERATOR_FIELD_EXIST = 'OPERATOR_FIELD_EXIST',
  /** 字段不存在 */
  OPERATOR_FIELD_NOT_EXIST = 'OPERATOR_FIELD_NOT_EXIST',
  /** 关键字全文档匹 */
  OPERATOR_QUERY_STRING = 'OPERATOR_QUERY_STRING',
}

/** 全量断言操作符 */
export const assertionOperatorOptions = [
  { label: '等于', value: AssertionOperators.OPERATOR_EQ },
  { label: '不等于', value: AssertionOperators.OPERATOR_NE },
  { label: '大于', value: AssertionOperators.OPERATOR_GT },
  { label: '大于等于', value: AssertionOperators.OPERATOR_GTE },
  { label: '小于', value: AssertionOperators.OPERATOR_LT },
  { label: '小于等于', value: AssertionOperators.OPERATOR_LTE },
  { label: '包含，关键字字段匹配', value: AssertionOperators.OPERATOR_MATCH },
  { label: '不包含', value: AssertionOperators.OPERATOR_NOT_MATCH },
  { label: '通配符匹配', value: AssertionOperators.OPERATOR_WILDCARD },
  { label: '反向通配', value: AssertionOperators.OPERATOR_NOT_WILDCARD },
  { label: '正则匹配', value: AssertionOperators.OPERATOR_REGEXP },
  { label: '反向正则', value: AssertionOperators.OPERATOR_NOT_REGEXP },
  { label: '字段存在', value: AssertionOperators.OPERATOR_FIELD_EXIST },
  { label: '字段不存在', value: AssertionOperators.OPERATOR_FIELD_NOT_EXIST },
  { label: '关键字全文档匹配', value: AssertionOperators.OPERATOR_QUERY_STRING },
]

/** 断言间的逻辑关系 */
export enum AssertionsRelation {
  /** 全部 */
  All = 'LOGIC_AND',
  /** 任一 */
  AnNY = 'LOGIC_OR',
}

/** 断言间的逻辑关系 */
export const assertionsRelationOptions = [
  { label: '全部', value: AssertionsRelation.All },
  { label: '任一', value: AssertionsRelation.AnNY },
]
