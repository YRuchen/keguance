/** locations节点种类 */
export enum Type {
  /** 运营商 全选 */
  IS_ISP = 'IS_ISP',
  /** 组 全选 */
  IS_GROUP = 'IS_GROUP',
  /** 全选 */
  IS_ALL = 'IS_ALL',
  /** 叶子结点 */
  IS_LEAF = 'IS_LEAF',
}

/**
 * 值是根据nodeId
 * 归类是根据TypeKey
 */
/** 值的键名 */
export const valueKey = 'friendlyArea'

/** 存储节点值的key */
export enum TypeKey {
  /** 运营商 全选 */
  IS_ISP = 'asn',
  /** 组 全选 */
  IS_GROUP = 'regionId',
  /** 全选 */
  IS_ALL = 'regionId',
  /** 叶子结点 */
  IS_LEAF = 'regionId',
}
