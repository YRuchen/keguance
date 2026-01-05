import { connect, mapProps, mapReadPretty } from '@formily/vue'
import Upload from './upload'
import FormilyUpload from './formilyUpload'
import ModalUpload from './modalUpload'

export const FormilyModalUpload = connect(
  ModalUpload,
  mapProps({ value: 'fileList' }),
  mapReadPretty(Upload)
)

Upload.FormilyUpload = FormilyUpload
Upload.ModalUpload = ModalUpload
Upload.FormilyModalUpload = FormilyModalUpload
export default Upload
