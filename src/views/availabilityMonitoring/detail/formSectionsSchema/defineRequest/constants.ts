import getBasicTab1Schema from './grpc/basicTab1'
import getBasicTab2Schema from './grpc/basicTab2'

/** grpc 基础信息tabs */
export enum BasicTabs {
  /** 行为检查 */
  BEHAVIOR_CHECK = 'BEHAVIOR_CHECK',
  /** 健康检查 */
  HEALTH_CHECK = 'HEALTH_CHECK',
}

/** 基础信息tabs */
export const basicTabsMap = {
  [BasicTabs.BEHAVIOR_CHECK]: {
    label: '行为检查',
    getSchema: getBasicTab1Schema,
  },
  [BasicTabs.HEALTH_CHECK]: {
    label: '健康检查',
    getSchema: getBasicTab2Schema,
  },
}

/** 服务定义 */
export enum ServiceDefinition {
  /** 原型文件 */
  PROTO_FILE = 'PROTO_FILE',
  /** 服务器反射 */
  SERVER_REFLECTION = 'SERVER_REFLECTION',
}

/** 服务定义 */
export const serviceDefinitionOptions = [
  /** 原型文件 */
  { label: '原型文件', value: ServiceDefinition.PROTO_FILE },
  /** 服务器反射 */
  { label: '服务器反射', value: ServiceDefinition.SERVER_REFLECTION },
]
