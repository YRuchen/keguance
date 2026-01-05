/** 操作符 */
export enum Operators {
  /** 等于 */
  OPERATOR_EQ= 'OPERATOR_EQ',
  /** 不等于 */
  OPERATOR_NE= 'OPERATOR_NE',
  /** 大于 */
  OPERATOR_GT= 'OPERATOR_GT',
  /** 大于等于 */
  OPERATOR_GTE= 'OPERATOR_GTE',
  /** 小于 */
  OPERATOR_LT= 'OPERATOR_LT',
  /** 小于等于 */
  OPERATOR_LTE= 'OPERATOR_LTE',
  /** 包含，关键字字段匹配 */
  OPERATOR_MATCH= 'OPERATOR_MATCH',
  /** 不包含 */
  OPERATOR_NOT_MATCH= 'OPERATOR_NOT_MATCH',
  /** 通配符匹配 */
  OPERATOR_WILDCARD= 'OPERATOR_WILDCARD',
  /** 反向通配 */
  OPERATOR_NOT_WILDCARD= 'OPERATOR_NOT_WILDCARD',
  /** 正则匹配 */
  OPERATOR_REGEXP= 'OPERATOR_REGEXP',
  /** 反向正则 */
  OPERATOR_NOT_REGEXP= 'OPERATOR_NOT_REGEXP',
  /** 字段存在 */
  OPERATOR_FIELD_EXIST= 'OPERATOR_FIELD_EXIST',
  /** 字段不存在 */
  OPERATOR_FIELD_NOT_EXIST= 'OPERATOR_FIELD_NOT_EXIST',
  /** 关键字全文档匹 */
  OPERATOR_QUERY_STRING= 'OPERATOR_QUERY_STRING',
}

/** 操作符 */
export const operatorOptions = [
  { label: '=', value: Operators.OPERATOR_EQ },
  { label: '/=', value: Operators.OPERATOR_NE },
  { label: '>', value: Operators.OPERATOR_GT },
  { label: '>=', value: Operators.OPERATOR_GTE },
  { label: '<', value: Operators.OPERATOR_LT },
  { label: '<=', value: Operators.OPERATOR_LTE },
  { label: '包含，关键字字段匹配', value: Operators.OPERATOR_MATCH },
  { label: '不包含', value: Operators.OPERATOR_NOT_MATCH },
  { label: '通配符匹配', value: Operators.OPERATOR_WILDCARD },
  { label: '反向通配', value: Operators.OPERATOR_NOT_WILDCARD },
  { label: '正则匹配', value: Operators.OPERATOR_REGEXP },
  { label: '反向正则', value: Operators.OPERATOR_NOT_REGEXP },
  { label: '字段存在', value: Operators.OPERATOR_FIELD_EXIST },
  { label: '字段不存在', value: Operators.OPERATOR_FIELD_NOT_EXIST },
  { label: '关键字全文档匹配', value: Operators.OPERATOR_QUERY_STRING },
]
