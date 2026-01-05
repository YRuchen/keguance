import { Protocol } from '~/api/availabilityMonitoring/constants'
import { BasicTabs } from './defineRequest/constants'
import styles from '../index.module.scss'

import type { Field } from '@formily/core'
import type { IAssertionItem } from './interfaces'

/** 断言模式 */
export enum AssertionsModeOptions {
  DEFAULT = 'default',
  SCRIPT = 'script',
}

/** 断言模式 */
export const assertionsModeOptions = [
  { 
    label: '默认模式', 
    value: AssertionsModeOptions.DEFAULT, 
    component: 'ArrayItems', 
    componentProps: {},
  },
  { 
    label: '脚本模式', 
    value: AssertionsModeOptions.SCRIPT, 
    component: 'Input.textArea',
    componentProps: {},
  },
]

/** 断言间的逻辑关系 */
export enum AssertionsRelation {
  /** 全部 */
  All = 'and',
  /** 任一 */
  AnNY = 'or',
}

/** 断言间的逻辑关系 */
export const assertionsRelationOptions = [
  { label: '全部', value: AssertionsRelation.All },
  { label: '任一', value: AssertionsRelation.AnNY },
]

/** 全量断言类型 */
export enum AssertionType {
  /** 响应体 */
  RESPONSE_BODY = 'BODY',
  /** 响应体HASH值 */
  RESPONSE_BODY_HASH_VAL = 'BODY_HASH',
  /** 请求头 */
  REQUEST_HEADER = 'HEADER',
  /** 响应时间 */
  RESPONSE_TIME = 'RESPONSE_TIME',
  /** 状态码 */
  STATUS = 'STATUS_CODE',
  /** 网络跳数 */
  NETWORK_HOP = 'NETWORK_HOP',
  /** 连接状态 */
  CONNECTION = 'CONNECTION',
  /** 收到的消息内容 */
  MESSAGE_CONTENT = 'MESSAGE_CONTENT',
  /** grpc响应体 */
  GRPC_RESPONSE = 'GRPC_RESPONSE',
  /** grpc元数据 */
  GRPC_METADATA = 'GRPC_METADATA',
  /** 健康检查状态 */
  GRPC_HEALTHCHECK_STATUS = 'GRPC_HEALTHCHECK_STATUS',
  /** SSL证书 */
  SSL_CERT = 'SSL_CERT',
  /** SSL证书属性 （property） */
  SSL_CERT_PROPS = 'SSL_CERT_PROPS',
  /** 最高TLS协议版本 */
  TLS_VERSION_MAX = 'TLS_VERSION_MAX',
  /** 最低TLS协议版本 */
  TLS_VERSION_MIN = 'TLS_VERSION_MIN',
  /** 所有返回记录 */
  ALL_RECORDS = 'ALL_RECORDS',
  /** 只要有一个返回记录 */
  ANY_RECORD = 'ANY_RECORD',
  /** ws响应内容 */
  WEBSOCKET_RESPONSE = 'WEBSOCKET_RESPONSE',
  /** ws响应头 */
  WEBSOCKET_RESPONSE_HEADER = 'WEBSOCKET_RESPONSE_HEADER',
}

/** 
 * 断言类型到（历史详情页）响应详情节点内字段的映射
 * 历史详情页的响应内容和断言类型应该一一对应，从ws协议开始意识到这一点，所以映射从ws开始做 */
export const AssertionTypeToResMap = {
  [AssertionType.WEBSOCKET_RESPONSE]: 'websocketResponse',
  [AssertionType.WEBSOCKET_RESPONSE_HEADER]: 'websocketResponseHeader',
}

/** 全量断言操作符 */
export enum AssertionOperators {
  /** 包含 */
  INCLUDES = 'CONTAINS',
  /** 不包含 */
  NOT_INCLUDED = 'DOES_NOT_CONTAIN',
  /** 是 */
  YES = 'IS',
  /** 不是 */
  NOT = 'IS_NOT',
  /** 正则匹配 */
  REGULAR_MATCHING = 'MATCHES_REGEX',
  /** 正则不匹配 */
  REGULAR_MISMATCH = 'DOES_NOT_MATCH_REGEX',
  /** 小于 */
  LESS_THAN = 'LESS_THAN',
  /** 大于 */
  GREATER_THAN = 'GREATER_THAN',
  /** 大于等于 */
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  /** 小于等于 */
  LESS_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  /** BODY_HASH_MD5 */
  BODY_HASH_MD5 = 'BODY_HASH_MD5',
  /** BODY_HASH_SHA1 */
  BODY_HASH_SHA1 = 'BODY_HASH_SHA1',
  /** BODY_HASH_SHA1 */
  BODY_HASH_SHA256 = 'BODY_HASH_SHA256',
  /** jsonPath */
  JSON_PATH = 'VALIDATES_JSON_PATH',
  /** 不存在 */
  IS_UNDEFINED = 'IS_UNDEFINED',
  /** 有效期大于 */
  VALIDITY_PERIOD_GT = 'VALIDITY_PERIOD_GT',
  /** 有效期小于 */
  VALIDITY_PERIOD_LT = 'VALIDITY_PERIOD_LT',
}

/** 响应体hash值的label映射表 */
export const hashMap = {
  /** BODY_HASH_MD5 */
  BODY_HASH_MD5: 'md5',
  /** BODY_HASH_SHA1 */
  BODY_HASH_SHA1: 'sha1',
  /** BODY_HASH_SHA1 */
  BODY_HASH_SHA256: 'sha256',
}

/** tcp/udp 响应时间的key的枚举 */
export enum ResponseTimeKey {
  /** 没有DNS */
  WITHOUT_DNS = 'WITHOUT_DNS',
  /** 包括DNS */
  INCLUDING_DNS = 'INCLUDING_DNS',
}

/** tcp/udp 响应时间的key options */
export const responseTimeKeyOptions = [
  { label: ResponseTimeKey.WITHOUT_DNS, value: ResponseTimeKey.WITHOUT_DNS },
  { label: ResponseTimeKey.INCLUDING_DNS, value: ResponseTimeKey.INCLUDING_DNS },
]

/** 返回记录类型 */
const enum RecordsType {
  /** 类型 A */
  DNS_TYPE_A = 'DNS_TYPE_A',
  /** 类型 AAAA */
  DNS_TYPE_AAAA = 'DNS_TYPE_AAAA',
  /** 类型 CNAME */
  DNS_TYPE_CNAME = 'DNS_TYPE_CNAME',
  /** 类型 MX */
  DNS_TYPE_MX = 'DNS_TYPE_MX',
  /** 类型 NS */
  DNS_TYPE_NS = 'DNS_TYPE_NS',
  /** 类型 TXT */
  DNS_TYPE_TXT = 'DNS_TYPE_TXT',
}

/** 返回记录类型 */
const recordsTypeOptions = [
  /** 类型 A */
  { label: '类型 A', value: RecordsType.DNS_TYPE_A },
  /** 类型 AAAA */
  { label: '类型 AAAA', value: RecordsType.DNS_TYPE_AAAA },
  /** 类型 CNAME */
  { label: '类型 CNAME', value: RecordsType.DNS_TYPE_CNAME },
  /** 类型 MX */
  { label: '类型 MX', value: RecordsType.DNS_TYPE_MX },
  /** 类型 NS */
  { label: '类型 NS', value: RecordsType.DNS_TYPE_NS },
  /** 类型 TXT */
  { label: '类型 TXT', value: RecordsType.DNS_TYPE_TXT },
]

/** 连接状态 */
export enum Connection {
  /** 成功 */
  ESTABLISHED = 'ESTABLISHED',
  /** 失败 */
  REFUSED = 'REFUSED',
  /** 超时 */
  TIMEOUT = 'TIMEOUT',
}

const commonOptions1 = [
  { label: '包含', value: AssertionOperators.INCLUDES },
  { label: '不包含', value: AssertionOperators.NOT_INCLUDED },
  { label: '是', value: AssertionOperators.YES },
  { label: '不是', value: AssertionOperators.NOT },
  { label: '正则匹配', value: AssertionOperators.REGULAR_MATCHING },
  { label: '正则不匹配', value: AssertionOperators.REGULAR_MISMATCH },
]

/** 全量断言类型schema */
export const assertionTypeOptionsMap2: Record<string, IAssertionItem<AssertionType>> = {
  [AssertionType.RESPONSE_BODY]: { 
    label: '响应体', 
    value: AssertionType.RESPONSE_BODY,
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.RESPONSE_BODY_HASH_VAL]: { 
    label: '响应体哈希值', 
    value: AssertionType.RESPONSE_BODY_HASH_VAL, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: hashMap[AssertionOperators.BODY_HASH_MD5], value: AssertionOperators.BODY_HASH_MD5 },
      { label: hashMap[AssertionOperators.BODY_HASH_SHA1], value: AssertionOperators.BODY_HASH_SHA1 },
      { label: hashMap[AssertionOperators.BODY_HASH_SHA256], value: AssertionOperators.BODY_HASH_SHA256 },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.REQUEST_HEADER]: { 
    label: '请求头', 
    value: AssertionType.REQUEST_HEADER, 
    'x-property-component': 'Input',
    'x-property-component-props': {
      placeholder: '请输入',
    },
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.RESPONSE_TIME]: { 
    label: '响应时间', 
    value: AssertionType.RESPONSE_TIME, 
    'x-property-component': 'Select',
    'x-property-component-props': {
      placeholder: '请选择',
    },
    'x-property-enum': responseTimeKeyOptions,
    'x-property-visible': (field: Field) => (field.form.query('collapse.step1.protocol')?.get('value') !== Protocol.HTTP),
    'x-property-reactions': (field: Field) => (field.form.query('collapse.step1.protocol')?.get('value') !== Protocol.HTTP),
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '小于', value: AssertionOperators.LESS_THAN },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-content': 'ms', // TODO: 是否合适
    'x-value-visible': true,
  },
  [AssertionType.STATUS]: {
    label: '状态码', 
    value: AssertionType.STATUS, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '是', value: AssertionOperators.YES },
      { label: '不是', value: AssertionOperators.NOT },
      { label: '正则匹配', value: AssertionOperators.REGULAR_MATCHING },
      { label: '正则不匹配', value: AssertionOperators.REGULAR_MISMATCH },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.NETWORK_HOP]: {
    label: '网络跳数', 
    value: AssertionType.NETWORK_HOP, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '是', value: AssertionOperators.YES },
      { label: '小于', value: AssertionOperators.LESS_THAN },
      { label: '大于', value: AssertionOperators.GREATER_THAN },
      { label: '大于等于', value: AssertionOperators.GREATER_THAN_OR_EQUAL },
      { label: '小于等于', value: AssertionOperators.LESS_THAN_OR_EQUAL },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.CONNECTION]: {
    label: '连接状态', 
    value: AssertionType.CONNECTION, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Select',
    'x-value-component-props': {
      placeholder: '请选择',
    },
    'x-value-enum': [
      { label: '成功', value: Connection.ESTABLISHED },
      { label: '失败', value: Connection.REFUSED },
      { label: '超时', value: Connection.TIMEOUT },
    ],
    'x-value-visible': true,
  },
  [AssertionType.MESSAGE_CONTENT]: {
    label: '收到的消息内容',
    value: AssertionType.MESSAGE_CONTENT,
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.GRPC_RESPONSE]: {
    label: 'GRPC响应体',
    value: AssertionType.GRPC_RESPONSE, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      ...commonOptions1,
      { label: 'jsonpath', value: AssertionOperators.JSON_PATH },
    ],
    'x-operator-visible': true,
    'x-operator-reactions': (field: Field) => {
      const isJsonPath = field.value === AssertionOperators.JSON_PATH
      const valueField = field.query('.value')?.take()
      const factor1Field = field.query('.jsonpathFactor')?.take()
      const operator1Field = field.query('.jsonpathOperator')?.take()
      const value1Field = field.query('.jsonpathValue')?.take()
      const display = isJsonPath ? 'visible' : 'none'
      if (!factor1Field || !operator1Field || !value1Field || !valueField) {
        return
      }
      factor1Field.setDisplay(display)
      operator1Field.setDisplay(display)
      value1Field.setDisplay(display)
      valueField.setComponent(isJsonPath ? 'Input' : 'Input.TextArea')
      valueField.setComponentProps({
        ...(valueField.componentProps || {}),
        class: isJsonPath ? styles.rightRadius : styles.leftTopStraight,
        style: {
          ...(valueField.componentProps.style || {}),
          height: isJsonPath ? '32px' : 'auto',
        },
        placeholder: isJsonPath ? '请输入jsonpath' : '响应体内容',
      })
      field.setComponentProps({
        ...(field.componentProps || {}),
        class: isJsonPath ? styles.straightAngle : [styles.straightAngle, styles.removeRightBorder]
      })
    },
    'x-value-visible': true,
  },
  [AssertionType.GRPC_METADATA]: {
    label: 'GRPC元数据',
    value: AssertionType.GRPC_METADATA, 
    'x-property-component': 'Input',
    'x-property-component-props': {
      placeholder: '请输入property（键）',
    },
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入value',
    },
    'x-value-visible': true,
  },
  [AssertionType.GRPC_HEALTHCHECK_STATUS]: {
    label: '健康检查状态',
    value: AssertionType.GRPC_HEALTHCHECK_STATUS, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '是', value: AssertionOperators.YES },
      { label: '不是', value: AssertionOperators.NOT },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入value',
    },
    'x-value-visible': true,
  },
  [AssertionType.SSL_CERT]: {
    label: 'SSL证书',
    value: AssertionType.SSL_CERT, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '有效期大于', value: AssertionOperators.VALIDITY_PERIOD_GT },
      { label: '有效期小于', value: AssertionOperators.VALIDITY_PERIOD_LT },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.SSL_CERT_PROPS]: {
    label: 'SSL证书属性 （property）',
    value: AssertionType.SSL_CERT_PROPS, 
    'x-property-component': 'Input',
    'x-property-component-props': {
      placeholder: '请输入property',
    },
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入value',
    },
    'x-value-visible': true,
  },
  [AssertionType.TLS_VERSION_MAX]: {
    label: '最高TLS协议版本',
    value: AssertionType.TLS_VERSION_MAX, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '是', value: AssertionOperators.YES },
      { label: '小于', value: AssertionOperators.LESS_THAN },
      { label: '小于等于', value: AssertionOperators.LESS_THAN_OR_EQUAL },
      { label: '大于', value: AssertionOperators.GREATER_THAN },
      { label: '大于等于', value: AssertionOperators.GREATER_THAN_OR_EQUAL },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.TLS_VERSION_MIN]: {
    label: '最低TLS协议版本',
    value: AssertionType.TLS_VERSION_MIN, 
    'x-property-component': null,
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '大于', value: AssertionOperators.GREATER_THAN },
      { label: '大于等于', value: AssertionOperators.GREATER_THAN_OR_EQUAL },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.ALL_RECORDS]: {
    label: '所有返回记录',
    value: AssertionType.ALL_RECORDS, 
    'x-property-component': 'Select',
    'x-property-enum': recordsTypeOptions,
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '包含', value: AssertionOperators.INCLUDES },
      { label: '是', value: AssertionOperators.YES },
      { label: '正则匹配', value: AssertionOperators.REGULAR_MATCHING },
      { label: '正则不匹配', value: AssertionOperators.REGULAR_MISMATCH },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.ANY_RECORD]: {
    label: '只要有一个返回记录',
    value: AssertionType.ANY_RECORD, 
    'x-property-component': 'Select',
    'x-property-enum': recordsTypeOptions,
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      { label: '包含', value: AssertionOperators.INCLUDES },
      { label: '是', value: AssertionOperators.YES },
      { label: '正则匹配', value: AssertionOperators.REGULAR_MATCHING },
      { label: '正则不匹配', value: AssertionOperators.REGULAR_MISMATCH },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入',
    },
    'x-value-visible': true,
  },
  [AssertionType.WEBSOCKET_RESPONSE]: {
    label: '响应内容',
    value: AssertionType.WEBSOCKET_RESPONSE, 
    'x-property-component': 'Select',
    'x-property-visible': false,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': commonOptions1,
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入value',
    },
    'x-value-visible': true,
  },
  [AssertionType.WEBSOCKET_RESPONSE_HEADER]: {
    label: '响应头',
    value: AssertionType.WEBSOCKET_RESPONSE_HEADER, 
    'x-property-component': 'Input',
    'x-property-component-props': {
      placeholder: '请输入key',
    },
    'x-property-visible': true,
    'x-operator-component': 'Select',
    'x-operator-component-props': {
      placeholder: '请选择',
    },
    'x-operator-enum': [
      ...commonOptions1,
      { label: '不存在', value: AssertionOperators.IS_UNDEFINED },
      { label: '小于', value: AssertionOperators.LESS_THAN },
      { label: '小于等于', value: AssertionOperators.LESS_THAN_OR_EQUAL },
    ],
    'x-operator-visible': true,
    'x-value-component': 'Input',
    'x-value-component-props': {
      placeholder: '请输入value',
    },
    'x-value-visible': true,
  },
}

/** 
 * 请求协议到断言类型的配置映射(每个请求类型下拥有的断言类型)
 * 新：不再根据请求类型设置断言类型
 */
export const protocolToAssertionMap = {
  [Protocol.HTTP]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_BODY],
    assertionTypeOptionsMap2[AssertionType.RESPONSE_BODY_HASH_VAL], 
    assertionTypeOptionsMap2[AssertionType.REQUEST_HEADER], 
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME], 
    assertionTypeOptionsMap2[AssertionType.STATUS],
  ],
  [Protocol.TCP]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.NETWORK_HOP],
    assertionTypeOptionsMap2[AssertionType.CONNECTION],
  ],
  [Protocol.UDP]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.MESSAGE_CONTENT],
  ],
  [BasicTabs.BEHAVIOR_CHECK]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.GRPC_RESPONSE],
    assertionTypeOptionsMap2[AssertionType.GRPC_METADATA],
  ],
  [BasicTabs.HEALTH_CHECK]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.GRPC_METADATA],
    assertionTypeOptionsMap2[AssertionType.GRPC_HEALTHCHECK_STATUS],
  ],
  [Protocol.SSL]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.SSL_CERT],
    assertionTypeOptionsMap2[AssertionType.SSL_CERT_PROPS],
    assertionTypeOptionsMap2[AssertionType.TLS_VERSION_MAX],
    assertionTypeOptionsMap2[AssertionType.TLS_VERSION_MIN],
  ],
  [Protocol.DNS]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.ALL_RECORDS],
    assertionTypeOptionsMap2[AssertionType.ANY_RECORD],
  ],
  [Protocol.WEBSOCKET]: [
    assertionTypeOptionsMap2[AssertionType.RESPONSE_TIME],
    assertionTypeOptionsMap2[AssertionType.WEBSOCKET_RESPONSE],
    assertionTypeOptionsMap2[AssertionType.WEBSOCKET_RESPONSE_HEADER],
  ],
}

/** jsonpath的因子 */
export enum JsonPathFactor {
  /** 响应体的第一个元素 */
  FIRST_ELEMENT_MATCHES = 'FIRST_ELEMENT_MATCHES',
  /** 响应体的序列化结果 */
  SERIALIZATION_MATCHES = 'SERIALIZATION_MATCHES',
  /** 响应体的所有元素 */
  EVERY_ELEMENT_MATCHES = 'EVERY_ELEMENT_MATCHES',
  /** 响应体只要有一个元素 */
  AT_LEAST_ONE_ELEMENT_MATCHES = 'AT_LEAST_ONE_ELEMENT_MATCHES',
}

/** jsonpath的因子options */
export const jsonpathFactorOptions = [
  { label: '响应体的第一个元素', value: JsonPathFactor.FIRST_ELEMENT_MATCHES },
  { label: '响应体的序列化结果', value: JsonPathFactor.SERIALIZATION_MATCHES },
  { label: '响应体的所有元素', value: JsonPathFactor.EVERY_ELEMENT_MATCHES },
  { label: '响应体只要有一个元素', value: JsonPathFactor.AT_LEAST_ONE_ELEMENT_MATCHES },
]

/** jsonpath的因子options */
export const jsonpathOperatorOptions = [
  { label: '包含', value: AssertionOperators.INCLUDES },
  { label: '不包含', value: AssertionOperators.NOT_INCLUDED },
  { label: '是', value: AssertionOperators.YES },
  { label: '不是', value: AssertionOperators.NOT },
  { label: '正则匹配', value: AssertionOperators.REGULAR_MATCHING },
  { label: '正则不匹配', value: AssertionOperators.REGULAR_MISMATCH },
  { label: '小于', value: AssertionOperators.LESS_THAN },
  { label: '大于', value: AssertionOperators.GREATER_THAN },
  { label: '不存在', value: AssertionOperators.IS_UNDEFINED },
]

/** 通知渠道 */
export enum NoticeChannel {
  /** TELEGRAM */
  TELEGRAM = 'TELEGRAM'
}

/** 通知渠道 */
export const noticeChannelOptions = [
  { label: 'telegram', value: NoticeChannel.TELEGRAM }
]
