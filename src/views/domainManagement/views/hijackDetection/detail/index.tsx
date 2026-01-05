import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElMessage } from 'element-plus'
import { Space, CommonLocations, FormilyForm } from '~/KeepUp'
import { getNodesApi, NoticeChannel } from '~/api/domainManagement/common'
import {
  getDetailApi,
  createApi,
  editApi,
} from '~/api/domainManagement/hijackDetection'
import { hasPermission } from '~/utils/auth'
import getSchema from './schema'
import styles from './index.module.scss'

import type { Field } from '@formily/core'
import type { IFormilyFormExpose, ILocationItem } from '~/KeepUp'

export default defineComponent({
  name: 'Detail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref<IFormilyFormExpose>()
    const schema = ref({})
    const isCreate = computed(() => route.path.includes('hijackDetectionCreate'))
    const isView = computed(() => route.name === 'HijackDetectionView')
    const isEdit = computed(() => route.name === 'HijackDetectionEdit')
    const confirm = async () => {
      try {
        const formData = await formRef.value?.formRef?.submit()
        const curWhiteList = (formData as any).whiteList?.trim()
        const data = {
          ...(formData as Record<string, any>),
          whiteList: curWhiteList ? curWhiteList.split(' ').filter(Boolean) : undefined,
        }
        isCreate.value ? await createApi(data) : await editApi(data)
        router.back()
        ElMessage({
          message: `${isCreate ? '新增' : '编辑'}成功`,
          type: 'success',
        })
      } catch (error: any) {
        console.error(`提交失败，失败原因：${error}`)
      }
    }
    const format = (list: Record<string, ILocationItem[]>[]) => {
      try {
        const result = list.reduce((initVal, curItem) => {
          const formattedCurItem = (Object.entries(curItem)?.[0]?.[1] || []).map(
            (v1: ILocationItem & any) => ({
              /** 节点id */
              nodeId: v1.nodeId,
              /** 所属地区id */
              regionId: v1.region,
              /** 所属地区名称 */
              regionName: v1.region,
              /** 所属省份 */
              subdivision: v1.region,
              /** 所属城市 */
              city: v1.nodeName,
              /** 运营商唯一标识 */
              asn: v1.ispCode,
              /** 运营商 */
              ispName: v1.ispName,
              /** 区域名称，比如：浙江杭州电信 */
              friendlyArea: `${v1.nodeName}`,
            }),
          )
          initVal = [...initVal, ...formattedCurItem]
          return initVal
        }, [])
        const nodesField = formRef.value.formRef.query('nodes')?.take() as Field
        nodesField.setComponentProps({
          ...(nodesField.componentProps || {}),
          options: result || [],
        })
        nodesField.value = result.map((v) => v.nodeId)
      } catch (error: any) {
        console.error(`【节点】数据格式转换失败，失败原因：${error}`)
      }
    }
    const init = async () => {
      schema.value = getSchema({ formRef, isEdit })
      const res = await getNodesApi()
      format(res)
      if (!isCreate.value) {
        const res = await getDetailApi({ id: route.query.id })
        setTimeout(() => {
          const formValues = { ...res, noticeMode: [NoticeChannel.TELEGRAM] }
          if (Array.isArray(formValues.whiteList)) {
            formValues.whiteList = formValues.whiteList.join(' ')
          }
          formRef.value?.formRef?.setValues(formValues)
        }, 500)
      } else {
        setTimeout(async () => {
          formRef.value?.formRef?.setValues({ taskStatus: false })
        }, 500)
      }
      if (isView.value) {
        formRef.value.formRef.readPretty = true
      }
    }
    onMounted(() => {
      init()
    })
    return () => (
      <Space direction='column' fill>
        <FormilyForm
          ref={formRef}
          class={styles.container}
          config={schema.value}
          components={{ CommonLocations }}
        />
        {
          isView.value
            ? null
            : <Space class={styles.btnGroup} fill justify='end'>
                <ElButton
                  onClick={() => {
                    router.back()
                  }}
                >
                  取消
                </ElButton>
                <ElButton type='primary' onClick={confirm} disabled={!hasPermission(['domain:post'])}>
                  保存
                </ElButton>
              </Space>
        }
      </Space>
    )
  },
})
