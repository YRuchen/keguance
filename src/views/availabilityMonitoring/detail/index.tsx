import { defineComponent, ref, nextTick, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormCollapse, FormTab } from '@formily/element-plus'
import { ElTag, ElButton, ElCard, ElMessage, ElTooltip } from 'element-plus'
import { createApi, editApi, getDetailApi, preTestApi } from '~/api/availabilityMonitoring'
import { Protocol, TaskResultStatus } from '~/api/availabilityMonitoring/constants'
import useAvailabilityMasterData from '~/store/modules/useAvailabilityMasterData'
import Space from '~/basicComponents/space'
import FormilyForm from '~/basicComponents/formilyCmps/formilyForm'
import Upload from '~/basicComponents/upload'
import CommonEditor, { MODE } from '~/businessComponents/commonEditor'
import { FormilyCommonJsonPretty } from '~/businessComponents/commonJsonPretty'
import PreviewModal from '~/views/availabilityMonitoring/taskHistory/components/previewModal'
import getTaskDetailSchema from '~/views/availabilityMonitoring/taskHistory/schema'
import Locations from './components/locations'
import ReadPrettyPwd from './components/readPrettyPwd'
import getSchema from './hooks/useFormSchema'
import getEffects from './hooks/useFormEffects'
import { generateSendData, generateFormData } from './utils'
import { ReqContentMode } from './constants'
import styles from './index.module.scss'

import type { Form } from '@formily/core'
import type { IHistoryTaskResult } from '~/api/availabilityMonitoring/interfaces'

export default defineComponent({
  name: 'Detail',
  inheritAttrs: true,
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isView = computed(() => route.path.includes('overviewPage')) // 查看态
    const isCreate = computed(() => route.path.includes('create')) // 创建态
    const testId = computed(() => route.query.testId) // 任务id
    const formRef = ref() // 表单实例
    const commonEditorRef = ref() // 公共编辑器
    const form = computed<Form>(() => formRef.value?.formRef) // form实例
    const schema = ref({}) // jsonSchema
    const effects = getEffects() // effects
    const wrapperFormCollapse = FormCollapse.createFormCollapse() // 外层手风琴
    const httpFormCollapse = FormCollapse.createFormCollapse() // http请求定义手风琴
    const grpcFormCollapse = FormCollapse.createFormCollapse() // grpc请求定义手风琴
    const sslFormCollapse = FormCollapse.createFormCollapse() // ssl请求定义手风琴
    const websocketCollapse = FormCollapse.createFormCollapse() // websocket请求定义手风琴
    const httpAdvancedFormTab = FormTab.createFormTab() // HTTP高级选项tab
    const grpcBasicFormTab = FormTab.createFormTab() // grpc基础信息tab
    const grpcAdvancedFormTab = FormTab.createFormTab() // grpc高级选项tab
    const websocketAdvancedFormTab = FormTab.createFormTab() // websocket高级选项tab
    const loading = ref(false) // 提交loading
    const { getMasterData } = useAvailabilityMasterData()
    const editorSchema = ref() // 公共编辑器jsonSchema
    const editorData = ref<Partial<IHistoryTaskResult>>({}) // 公共编辑器数据
    const openEditor = async () => {
      try {
        const formattedFormData = generateSendData(form.value?.values)
        editorData.value = await preTestApi(formattedFormData)
        commonEditorRef.value?.open({ mode: MODE.VIEW, rowData: editorData.value, rowIndex: 0 })
        editorSchema.value = getTaskDetailSchema({
          protocol: editorData.value.method as Protocol,
          showFailReason: editorData.value?.basicData?.failCode !== 2,
          failSummary: editorData.value?.failSummary,
          isPassed: editorData.value?.basicData?.resultStatus === TaskResultStatus.PASSED,
          checkType: editorData.value.basicData.checkType,
        })
      } catch (error: any) {
        console.error(`测试预览失败，失败原因：${error}`)
      }
    }
    const submit = async () => {
      try {
        loading.value = true
        await form.value?.submit()
        const formattedFormData = generateSendData(form.value?.values)
        isCreate.value 
          ? await createApi(formattedFormData)
          : await editApi({
            test: {
              ...formattedFormData.test,
              testId: testId.value as string,
            }
          })
        ElMessage({ message: '创建成功', type: 'success' })
        router.back()
      } catch (error: any) {
        console.error(`创建测试详情失败，失败原因：${error}`)
      } finally {
        loading.value = false
      }
    }
    const btnGroupTSX = () => (
      !isView.value && <div class={styles.btnGroup} alignFormItem>
        <el-button loading={loading.value} type='primary' onClick={submit}>提交</el-button>
      </div>
    )
    const init = async () => {
      try {
        await getMasterData()
        schema.value = getSchema({ 
          isView: isView.value, 
          isCreate: isCreate.value, 
          form,
          openEditor,
        })
        await nextTick()
        if (!isCreate.value) {
          const res = await getDetailApi(testId.value as string)
          form.value.setInitialValues(generateFormData(res?.test))
        }
        form.value.setState((state) => {
          state.editable = !isView.value
        })
      } catch (error: any) {
        console.error(`表单初始化失败，失败原因：${error}`)
      }
    }
    onMounted(() => {
      init()
    })
    return () => (
      <div class={styles.container}>
        <FormilyForm
          class={styles.formContainer}
          ref={formRef}
          config={schema.value}
          effectHooks={effects}
          scope={{ 
            wrapperFormCollapse, 
            httpFormCollapse, 
            grpcFormCollapse,
            sslFormCollapse,
            websocketCollapse,
            httpAdvancedFormTab,
            grpcBasicFormTab, 
            grpcAdvancedFormTab,
            websocketAdvancedFormTab,
            ReqContentMode,
          }}
          components={{ 
            ElButton, 
            ElCard, 
            ElTooltip, 
            Locations,
            ReadPrettyPwd,
            Space, 
            Upload: Upload.FormilyUpload,
          }}
        />
        {btnGroupTSX()}
        <CommonEditor
          ref={commonEditorRef}
          title='测试结果'
          size='80%'
          editFields={editorSchema.value}
          maxColumns={1}
          components={{ ElTag, PreviewModal, CommonJsonPretty: FormilyCommonJsonPretty }}
        />
      </div> 
    )
  }
})
