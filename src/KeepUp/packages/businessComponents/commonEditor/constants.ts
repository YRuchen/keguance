/** 模式 */
export enum MODE {
  /** 查看 */
  VIEW = 'VIEW',
  /** 创建 */
  CREATE = 'CREATE',
  /** 编辑 */
  EDIT = 'EDIT',
}

/** 布局默认值 */
export const defaultLayout = {
  columns: 1,
  labelStyle: {
    width: '80px',
    margin: '0',
  }
}
