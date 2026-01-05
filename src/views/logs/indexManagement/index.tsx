import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElTabs, ElTabPane, ElButton, ElText, ElMessage } from 'element-plus'
import { FormStep } from '@formily/element-plus'
import { createRawIndexApi } from '~/api/logs/indexManagement'
import { CommonModal, FormilyForm, Space } from '~/KeepUp'
import { IndexType, getIndexTypeOptions } from './constants'
import { getSchema } from './schema'
import styles from './index.module.scss'
// 显式导入 CommonPage 及其依赖组件的样式，确保在生产构建时样式被正确包含
// 当组件通过动态引用（如 constants.ts 中的方式）使用时，Vite 可能无法正确追踪样式依赖
// 这是因为组件对象被存储在 schema 中，然后在运行时动态渲染，Vite 的静态分析可能无法追踪到这些样式
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'

import type { IIndexTemplateListItem } from '~/api/logs/indexManagement/interfaces'
import type { IExpose, ICommonModalExpose, IFormilyFormExpose } from '~/KeepUp'

export default defineComponent({
  name: 'IndexManagement',
  setup () {
    const router = useRouter()
    const test = ref()
    const commonPageRef1 = ref<IExpose>()
    const commonPageRef2 = ref<IExpose>()
    const commonModalRef = ref<ICommonModalExpose>()
    const formilyFormRef = ref<IFormilyFormExpose>()
    const formRef = computed(() => formilyFormRef.value?.formRef)
    const isView = ref(false)
    const loading = ref(false)
    const formStep = FormStep.createFormStep(4)
    const selected = ref<IIndexTemplateListItem[]>([]) // 选中数据
    const selectedKeys = computed(() => (selected.value || []).map(v => v.templateId))
    const activeName = ref(IndexType.INDEX_TEMPLATE)
    watch(() => activeName.value, async () => {
      await nextTick()
      commonPageRef2.value?.updateTableHeight()
    }, { deep: true })
    const tabPaneContentTsx = getIndexTypeOptions({
      router,
      commonPageRef1,
      commonPageRef2,
      selectedKeys,
      commonModalRef,
      formRef,
      isView,
    }).map((v, index) => {
      const cmp = v['x-component']
      const slots = v['x-content']
      return <ElTabPane
        class={styles.tabsItem}
        label={v.label}
        name={v.name}
      >
        <cmp
          {...(v['x-component-props'] || {})}
          ref={index === 0 ? commonPageRef1 : commonPageRef2}
          selected={selected.value}
          onUpdate:selected={(val) => {
            selected.value = val
          }}
          v-slots={slots}
        />
      </ElTabPane>
    })
    const confirm = async () => {
      try {
        loading.value = true
        await formRef.value?.submit()
        await createRawIndexApi(formRef.value.values)
        ElMessage.success('创建原始索引成功')
        commonModalRef.value?.close()
      } catch (error: any) {
        console.error(`提交失败，失败原因：${error}`)
      } finally {
        loading.value = false
      }
    }
    return () => (
      <>
        <ElTabs 
          ref={test}
          modelValue={activeName.value}
          onTabChange={(val: IndexType) => { activeName.value = val }}
          class={styles.container}
        >
          {tabPaneContentTsx}
        </ElTabs>
        <CommonModal
          ref={commonModalRef}
          title='新增原始索引'
          v-slots={{
            default: () => (
              <FormilyForm
                ref={formilyFormRef}
                config={getSchema()}
                scope={{ formStep }}
                components={{ ElText }}
              />
            ),
            ...(
              !isView.value
                ? {
                    footer: () => (
                      <Space justify='center'>
                        <ElButton onClick={() => { commonModalRef.value?.close() }}>取消</ElButton>
                        <ElButton loading={loading.value} type='primary' onClick={confirm}>提交</ElButton>
                      </Space>
                    )
                  }
                : {}
            ),
          }}
        />
      </>
    )
  },
})
