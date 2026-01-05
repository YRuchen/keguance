import { defineComponent, ref } from 'vue'
import { ElIcon } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import CommonModal from '~/businessComponents/commonModal'
import Upload from './upload'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { UploadFile } from 'element-plus'
import type { ICommonModalExpose } from '~/businessComponents/commonModal'

const props = {
  /** 上传文件列表 */
  fileList: {
    type: Array as PropType<UploadFile[]>,
    default: () => ([]),
  },
  title: {
    type: String,
    default: '默认标题',
  },
  tip: {
    type: String,
    default: '',
  },
}

export default defineComponent({
  name: 'Upload',
  inheritAttrs: false,
  props,
  setup(props, { slots, emit, attrs }) {
    const commonModal = ref<ICommonModalExpose>()
    const open = () => {
      commonModal.value?.open?.()
    }
    return () => (
      <>
        <CommonModal
          class={styles.container}
          ref={commonModal}
          title={props.title}
          v-slots={{
            default: () => (
              <Upload
                fileList={props.fileList}
                onUpdate:fileList={(val: any[]) => { emit('update:fileList', val) }}
                {...attrs}
                v-slots={{
                  ...slots,
                  default: () => (
                    <>
                      <ElIcon class='el-icon--upload'><UploadFilled /></ElIcon>
                      <div class='el-upload__text'>
                        {props.tip} <em>点击上传</em>
                      </div>
                    </>
                  )
                }}
              />
            ),
            footer: slots.footer?.(),
          }}
        />
        <div onClick={open}>{slots.reference?.() || '打开弹窗'}</div>
      </>
    )
  }
})
