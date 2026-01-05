
import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { IExpose } from '~/businessComponents/commonPage'

/** getFields入参 */
export interface IGetFieldsParams {
  router: Router
  commonPageRef: Ref<IExpose>
  domainMasterData: any
}
