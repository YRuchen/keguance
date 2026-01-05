import { defineComponent, ref, nextTick, computed } from 'vue'
import { ElDrawer, ElSpace, ElButton } from 'element-plus'
import FormilyForm from '~/basicComponents/formilyCmps/formilyForm'
import { getRootSchema } from '~/constants/commonPage'
import { MODE } from '~/businessComponents/commonEditor'

import type { PropType } from 'vue'
import type { Schema } from '@formily/vue'
import type { IFormilyFormExpose } from '~/basicComponents/formilyCmps/formilyForm'
import type { IOpenParams } from './interfaces'

const props = {
  editFields: {
    type: Object as PropType<Schema>, // TODO: ts类型需要修复为jsonSchema类型
    default: () => ({}),
  },
  title: {
    type: String,
    default: '默认标题',
  },
  size: {
    type: String,
    default: '70%',
  },
  maxColumns: {
    type: Number,
    default: 3,
  },
  /** 需要注册的组件 */
  components: {
    type: Object,
    default: () => ({}),
  },
}

export { MODE } from '../commonEditor/constants'
export * from './interfaces'
export default defineComponent({
  name: 'CommonEditor',
  inheritAttrs: false,
  props,
  setup(props, { expose, slots, attrs }) {
    const formilyFormRef = ref<IFormilyFormExpose>()
    const mode = ref(MODE.VIEW)
    const isCreate = computed(() => mode.value === MODE.CREATE)
    const isView = computed(() => mode.value === MODE.VIEW)
    const visible = ref(false)
    const loading = ref(false)
    const fields = computed(() => getRootSchema({ maxColumns: props.maxColumns, properties: props.editFields }))
    const onClose = () => {
      formilyFormRef.value?.formRef.clearFormGraph('values')
    }
    const close = () => {
      visible.value = false
    }
    const confirm = async () => {
      loading.value = true
      // TODO: 
      loading.value = false
    }
    expose({
      /** 打开抽屉 */
      open: async ({
        mode: curMode,
        rowData,
        rowIndex = 0,
      }: IOpenParams) => {
        visible.value = true
        mode.value = curMode
        await nextTick()
        // TODO: 编辑态和查看态才设置初始值，关闭的时候清掉。分好模式
        if (!isCreate.value) {
          formilyFormRef.value?.formRef.setInitialValues(rowData)
        }
      },
      getForm: () => formilyFormRef.value?.formRef
    })
    return () => {
      const footer = () => (
        !isView
          ? <ElSpace>
              <ElButton onClick={close}>取消</ElButton>
              <ElButton type="primary" loading={loading.value} onClick={confirm}>确认</ElButton>
            </ElSpace>
          : null
      )
      return (
        <>
          <ElDrawer
            v-model={visible.value}
            {...attrs}
            title={props.title}
            size={props.size}
            destroyOnClose
            onClose={onClose}
            v-slots={{
              title: slots.title?.(),
              footer,
            }}
          >
            {slots.default?.() || <FormilyForm ref={formilyFormRef} config={fields.value} components={props.components} />}
          </ElDrawer>
        </>
      )
    }
  }
})
