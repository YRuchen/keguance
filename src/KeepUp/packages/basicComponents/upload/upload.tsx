import { defineComponent, computed } from 'vue'
import { ElUpload, ElLink } from 'element-plus'

import type { PropType } from 'vue'
import type { UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus'
import type { ICommonObj } from '~/interfaces/common'

const props = {
  /** 上传文件列表 */
  fileList: {
    type: Array as PropType<UploadFile[]>,
    default: () => ([]),
  },
  /** 上传api */
  uploadApi: {
    type: Function as PropType<(p: any) => Promise<any>>,
    default: undefined,
  },
  /** 最大上传数量 */
  limit: {
    type: Number,
    default: 1,
  },
  /** 样式 */
  style: {
    type: Object,
    default: () => ({}),
  },
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'Upload',
  inheritAttrs: false,
  props,
  emits: ['update:fileList', 'remove'],
  setup(props, { slots, emit, attrs }) {
    const isView = computed(() => props.disabled || props.readonly)
    const fileList = computed<UploadFile[]>({
      set(val) {
        emit('update:fileList', val)
        ;(attrs?.onChange as (p: ICommonObj) => void)?.(val)
      },
      get() {
        return props.fileList
      },
    })
    const customUpload = async (options: UploadRequestOptions) => {
      try {
        const { file } = options
        const res: UploadFile = await props.uploadApi?.({ file }) || file
        fileList.value = props.limit === 1
          ? [res]
          : [...(fileList.value || []), res]
      } catch (error: any) {
        console.error(`上传文件失败，失败原因：${error}`)
      }
    }
    const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      fileList.value = uploadFiles
      emit('remove', uploadFile, uploadFiles)
    }
    return () => (
      isView.value
        ? (fileList.value || []).map(v => <ElLink type="primary" href={v.url} target='_blank'>{v.name}</ElLink>)
        : <ElUpload
          style={props.style}
          fileList={fileList.value}
          httpRequest={customUpload}
          onRemove={onRemove}
          v-slots={slots}
        />
    )
  }
})
