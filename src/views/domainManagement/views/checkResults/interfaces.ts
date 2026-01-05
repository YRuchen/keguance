import { DetailType } from './constants'

import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { ISchema } from '@formily/json-schema'
import type { Form } from '@formily/core'
import type { ICommonObj, ICommonDrawerExpose } from '~/KeepUp'

/** commonInfoPreview入参 */
export interface ICommonInfoPreviewParams {
  /** 单元格展示内容 */
  text: string
  /** 任务id */
  id: string
  /** 详情类型 */
  type: DetailType
  /** 侧边栏 */
  commonDrawerRef: Ref<ICommonDrawerExpose>
  /** 表单实例 */
  formRef: Ref<Form>
  /** schema */
  schema: Ref<ISchema>
  /** 详情 */
  detail: Ref<ICommonObj>
  /** 路由控制器 */
  router: Router
}

/** getFields入参 */
export interface IGetFieldsParams {
  /** 路由实例 */
  router: Router
  /** 侧边栏实例 */
  commonDrawerRef: Ref<ICommonDrawerExpose>
  /** 表单实例 */
  formRef: Ref<Form>
  /** 表单结构schema */
  schema: Ref<ISchema>
  /** 详情 */
  detail: Ref<ICommonObj>
}
