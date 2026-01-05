import { defineComponent } from 'vue'
import { ElButton, ElPopover, ElIcon } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'myPopover',
  props: {
    content: {
      type: String,
      default: 'tips',
    },
  },
  setup(props) {
    return () => (
      <ElPopover
        content={props.content}
        effect='dark'
        width={400}
        placement='right'
        v-slots={{
          reference: () => (
            <ElButton link>
              <ElIcon color='#A8ABB2' size='16px'>
                <QuestionFilled />
              </ElIcon>
            </ElButton>
          ),
        }}
      ></ElPopover>
    )
  },
})
