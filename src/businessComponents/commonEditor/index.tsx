import { defineComponent, ref, nextTick, computed } from 'vue'
import { ElMessage, ElSpace, ElButton } from 'element-plus'
import FormilyForm from '~/basicComponents/formilyCmps/formilyForm'
import { getRootSchema } from '~/constants/commonPage'
import CommonModal from '../commonModal'
import { MODE, defaultLayout } from './constants'
import useModeMap from './useModeMap'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ISchema } from '@formily/vue'
import type { IFormilyFormExpose, IEffectHooks } from '~/basicComponents/formilyCmps/formilyForm'
import type { ICommonObj } from '~/interfaces/common'
import type { ICommonModalExpose } from '../commonModal'
import type { IOpenParams, IEditorLayout, ICommonEditorExpose } from './interfaces'

const props = {
  /** 创建Api */
  createApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<void>>, // TODO：建一个全局通用的async ts，这里的void是否正确
    default: undefined,
  },
  /** 编辑Api */
  editApi: {
    type: Function as PropType<(p: ICommonObj) => Promise<void>>,
    default: undefined,
  },
  /** 格式化列表接口入参 */
  formatEditParams: {
    type: Function as PropType<(p: any) => any>,
    default: undefined,
  },
  /** 编辑器字段 */
  editFields: {
    type: Object as PropType<ISchema>,
    default: () => ({}),
  },
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 宽度 */
  size: {
    type: String,
    default: '42%',
  },
  /** layout */
  layout: {
    type: Object as PropType<IEditorLayout>,
    default: () => ({
      columns: 0,
      labelStyle: {
        width: '100px',
        margin: '0',
      }
    }),
  },
  /** effectHooks */
  effectHooks: {
    type: Object as PropType<IEffectHooks>,
    default: () => ({}),
  },
  /** 需要注册的组件 */
  components: {
    type: Object,
    default: () => ({}),
  },
}

export * from './constants'
export * from './interfaces'
export default defineComponent({
  name: 'CommonEditor',
  props,
  setup(props, { emit, expose, slots }) {
    const commonModalRef = ref<ICommonModalExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const mode = ref(MODE.VIEW)
    const isCreate = computed(() => mode.value === MODE.CREATE)
    const isView = computed(() => mode.value === MODE.VIEW)
    const modeMap = useModeMap({ createApi: props.createApi, editApi: props.editApi })
    const innerLayout = computed(() => ({ ...defaultLayout, ...props.layout }))
    const loading = ref(false)
    const fields = computed(() => getRootSchema({ maxColumns: innerLayout.value.columns, properties: props.editFields }))
    const onClose = () => {
      formilyFormRef.value.formRef.values = {}
      formilyFormRef.value.formRef.clearErrors?.()
    }
    const open = async ({ mode: curMode, rowData }: IOpenParams) => {
      commonModalRef.value?.open?.()
      mode.value = curMode
      await nextTick()
      if (!isCreate.value) {
        formilyFormRef.value.formRef.values = rowData
      }
      formilyFormRef.value.formRef.readPretty = isView.value
    }
    const close = () => {
      commonModalRef.value?.close?.()
    }
    const confirm = async () => {
      try {
        loading.value = true
        const result = await formilyFormRef.value.formRef.submit()
        await modeMap[mode.value]?.api?.(
          typeof props?.formatEditParams === 'function' 
            ? props.formatEditParams(result) 
            : result
        )
        ElMessage({
          message: `${modeMap[mode.value].text}成功`,
          type: 'success',
        })
        close()
        emit('confirmSuccess')
      } catch (error: any) {
        console.error(`${modeMap[mode.value].text}失败，失败原因：${JSON.stringify(error)}`)
      } finally {
        loading.value = false
      }
    }
    expose<ICommonEditorExpose>({
      open,
      getForm: () => formilyFormRef.value?.formRef
    })
    return () => {
      const footer = () => (
        !isView.value
          ? <ElSpace style={{ width: '100%', justifyContent: 'center' }}>
              <ElButton onClick={close}>取消</ElButton>
              <ElButton type='primary' loading={loading.value} onClick={confirm}>确认</ElButton>
            </ElSpace>
          : null
      )
      return (
        <CommonModal
          ref={commonModalRef}
          title={props.title || modeMap[mode.value]?.text}
          width={props.size}
          onClose={onClose}
          class={styles.container}
          style={{
            '--common-editor-label-width': innerLayout.value.labelStyle.width,
            '--common-editor-label-margin': innerLayout.value.labelStyle.margin,
          }}
          v-slots={{
            ...slots,
            default: () => (
              <FormilyForm 
                ref={formilyFormRef} 
                config={fields.value}
                components={props.components} 
                effectHooks={props.effectHooks}
              />),
            footer,
          }}
        />
      )
    }
  }
})
