import type { Form } from '@formily/core'
import type { Ref, ComputedRef } from 'vue'
import type { Router } from 'vue-router'
import type { IExpose, ICommonModalExpose } from '~/KeepUp'

/** 索引类型入参 */
export interface IGetIndexTypeOptionsParams {
  /** 路由对象 */
  router: Router
  /** commonPageRef1 */
  commonPageRef1: Ref<IExpose>
  /** commonPageRef2 */
  commonPageRef2: Ref<IExpose>
  /** commonPageRef1 -> selectedKeys */
  selectedKeys: ComputedRef<string[]>
  /** commonModalRef */
  commonModalRef: Ref<ICommonModalExpose>
  /** 表单实例 */
  formRef: Ref<Form>
  /** 查看态 */
  isView: Ref<boolean>
}
