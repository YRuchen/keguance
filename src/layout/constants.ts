import { HeaderMode } from '~/routers/constants'
import { DeviceType } from '~/constants/common'
import Hamburger from './components/header/hamburger'
import MainTitle from './components/header/mainTitle'
import PcLayout from './pc'
import MobileLayout from './mobile'

/** 路由跳转依赖的key */
export enum RouterKey {
  /** path */
  PATH = 'PATH',
  /** name */
  NAME = 'NAME',
}

/** 路由key */
export const routeKeyMap = {
  [RouterKey.NAME]: 'name',
  [RouterKey.PATH]: 'path',
}

export { HeaderMode }
/** 顶部展示形式到组件的映射 */
export const headerModeToCmpMap = {
  [HeaderMode.BREADCRUMB]: Hamburger,
  [HeaderMode.SUBMENU]: MainTitle,
}

/** 设备到布局模型的映射 */
export const deviceToLayoutMap = {
  [DeviceType.PC]: PcLayout,
  [DeviceType.MOBILE]: MobileLayout,
}
