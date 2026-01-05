import { defineComponent, ref, h, onUnmounted } from 'vue'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import {
  Form,
  FormItem,
  FormDrawer,
  FormStep,
  FormCollapse,
  FormGrid,
  FormLayout,
  Space,
  Input,
  InputNumber,
  Password,
  PreviewText,
  Radio,
  Select,
  Cascader,
  Checkbox,
  DatePicker,
  Switch,
  TimePicker,
  Transfer,
  Upload,
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  FormButtonGroup,
  Submit,
} from '@formily/element-plus'
import { ElButton, ElTree } from 'element-plus'
import SectionTitle from '../sectionTitle'
import KeepUpSpace from '../../space'
import CommonJsonPretty from '../../../businessComponents/commonJsonPretty'
import { FormTab } from '../formTab'
import { FormilyRadioGroup } from '../../radioGroup' // TODO: 是否需要将FormilyRadioGroup做为RadioGroup组件的属性
import { formEffectsMap, fieldEffectsMap } from './constants'
import { fetchOptions } from './utils'
import stylus from './index.module.scss'

import type { PropType } from 'vue'
import type { Form as IForm } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { IEffectHooks } from './interfaces'

const props = {
  /** schema配置 */
  config: {
    type: Object as PropType<ISchema>,
    default: () => ({}),
  },
  /** 初始值 */
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  /** effectHooks */
  effectHooks: {
    type: Object as PropType<IEffectHooks>,
    default: () => ({}),
  },
  /** effects 原生effects，满足高阶场景 */
  effects: {
    type: Function,
    default: undefined,
  },
  /** 需要注册的组件 */
  components: {
    type: Object,
    default: () => ({}),
  },
  /** 额外能力 */
  scope: {
    type: Object,
    default: () => ({}),
  }
}

export type * from './interfaces'
export default defineComponent({
  name: 'FormilyForm',
  inheritAttrs: true,
  props,
  setup(props, { expose, slots }) {
    const containerRef = ref()
    const commonEffects = (effect: Function | undefined) => {
      // 其他逻辑
      return effect
    }
    const wrapEffects = (form: IForm) => {
      if (props.effects && typeof props.effects === 'function') {
        props.effects(form)
        return
      }
      const { formEffects = {}, fieldEffects = {} } = props.effectHooks
      Object.entries(formEffects).forEach(([k, fn]) => {
        formEffectsMap[k]?.(commonEffects(fn))
      })
      Object.entries(fieldEffects).forEach(([k, v]) => {
        Object.entries(v).forEach(([effectKey, fn]) => {
          fieldEffectsMap[effectKey]?.(k, commonEffects(fn))
        })
      })
    }
    const formRef = createForm({
      initialValues: props.initialValues,
      effects: wrapEffects,
    })
    const { SchemaField } = createSchemaField({
      scope: props.scope,
      components: {
        Form,
        FormItem,
        FormDrawer,
        FormStep,
        FormCollapse,
        FormTab,
        FormGrid,
        FormLayout,
        Space,
        KeepUpSpace,
        Input,
        InputNumber,
        Password,
        PreviewText,
        Radio,
        RadioGroup: FormilyRadioGroup,
        Select,
        ElTree,
        Cascader,
        Checkbox,
        DatePicker,
        Switch,
        TimePicker,
        Transfer,
        Upload,
        ArrayCards,
        ArrayCollapse,
        ArrayItems,
        ArrayTable,
        ArrayTabs,
        FormButtonGroup,
        Submit,
        ElButton,
        JsonPretty: CommonJsonPretty,
        SectionTitle,
        ...props.components,
      },
    })
    onUnmounted(() => {
      formRef?.onUnmount()
    })
    expose({ formRef, getContainerRef: () => containerRef.value })
    return () => (
      <div ref={containerRef} class={stylus.container}>
        <FormProvider form={formRef}>
          <PreviewText.Placeholder value='-'>
            <SchemaField
              schema={props.config}
              scope={{
                ...props.scope,
                fetchOptions,
              }}
            />
            {slots?.btnGroup?.()}
          </PreviewText.Placeholder>
        </FormProvider>
      </div>
    )
  }
})
