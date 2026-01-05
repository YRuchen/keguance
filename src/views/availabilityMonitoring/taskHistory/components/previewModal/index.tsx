import { defineComponent, ref } from 'vue'
import { ElButton, ElDialog, ElText } from 'element-plus'
import { CommonJsonPretty } from '~/businessComponents/commonJsonPretty'

const props = {
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 内容 */
  content: {
    type: String,
    default: '',
  },
  /** json形式展示 */
  isJson: {
    type: Boolean,
    default: false,
  }
}

export default defineComponent({
  name: 'PreviewModal',
  props,
  setup(props) {
    const visible = ref(false)
    return () => (
      <>
        <ElText truncated>{props.content}</ElText>
        <ElButton onClick={() => { visible.value = true }}>{props.title}</ElButton>
        <ElDialog modelValue={visible.value} title={props.title} onClose={() => { visible.value = false }}>
          {
            props.isJson 
              ? <CommonJsonPretty  data={props.content} editable={false} showIcon={true} />
              : <ElText>{props.content}</ElText> 
          }
        </ElDialog>
      </>
    )
  }
})
