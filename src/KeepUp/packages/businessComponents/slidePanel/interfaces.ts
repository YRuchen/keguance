import type { Ref } from 'vue'

/** slidePanel expose */
export interface ISlidePanelExpose {
  visible: Ref<boolean>
  /** 打开 */
  open: () => void
  /** 关闭 */
  close: () => void
}
