import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { composeExpose } from '../../__builtins__/shared'
import Upload from './upload'
import FormilyUpload from './formilyUpload'
import ModalUpload from './modalUpload'

export const FormilyModalUpload = connect(
  ModalUpload,
  mapProps({ value: 'fileList' }),
  mapReadPretty(Upload)
)
export default composeExpose(
  Upload,
  {
    FormilyUpload,
    ModalUpload,
    FormilyModalUpload,
  }
)
