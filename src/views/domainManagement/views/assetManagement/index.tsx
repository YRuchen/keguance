import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import Upload from '~/basicComponents/upload'
import Space from '~/basicComponents/space'
import CommonPage from '~/businessComponents/commonPage'
import {
  getListApi,
  createApi,
  editApi,
  downloadApi,
  batchImportApi,
  exportApi,
} from '~/api/domainManagement/assetManagement'
import { getFields } from './fields'
import { hasPermission } from '~/utils/auth'

import type { UploadFiles } from 'element-plus'
import type { ICommonObj } from '~/interfaces/common'
import type { IExpose } from '~/businessComponents/commonPage'

export default defineComponent({
  name: 'AvailabilityMonitoring',
  setup() {
    const router = useRouter()
    const commonPageRef = ref<IExpose>()
    const uploadRef = ref()
    const fields = ref(getFields({ router, commonPageRef }))
    const fileList = ref<UploadFiles>([])
    const formatListParams = (params: ICommonObj) => {
      return params
    }
    const batchImport = async () => {
      try {
        if (!fileList.value?.length) {
          ElMessage({
            message: '请选则导入内容',
            type: 'warning',
          })
        }
        await batchImportApi({ file: fileList.value?.[0] })
        ElMessage({
          message: '批量上传成功',
          type: 'success',
        })
      } catch (error: any) {
        console.error(`批量上传失败，失败原因：${error}`)
      }
    }
    const exportData = async () => {
      try {
        await exportApi()
        ElMessage({
          message: '导出成功',
          type: 'success',
        })
      } catch (error: any) {
        console.error(`导出失败，失败原因：${error}`)
      }
    }
    return () => (
      <CommonPage
        ref={commonPageRef}
        fields={fields.value}
        listApi={getListApi}
        createApi={createApi}
        editApi={editApi}
        downloadApi={downloadApi}
        formatListParams={formatListParams}
        pageKey='assetManagement'
        filterColumns={5}
        editorLayout={{
          columns: 1,
          labelStyle: {
            margin: 0,
          },
        }}
        rowKey='id'
        needPagination
        v-slots={{
          setterPrefix: () => (
            <Upload.ModalUpload
              ref={uploadRef}
              fileList={fileList.value}
              onUpdate:fileList={(val: UploadFiles) => {
                fileList.value = val
              }}
              limit={1}
              title='批量导入'
              tip='将EXCEL文件拖至此处或'
              drag
              uploadApi={batchImportApi}
              v-slots={{
                reference: () => (
                  <ElButton disabled={!hasPermission(['domain:import'])}>批量导入</ElButton>
                ),
              }}
            />
          ),
          download: (download: () => Promise<void>) => (
            <ElButton onClick={download}>模版下载</ElButton>
          ),
          setterSuffix: () => (
            <ElButton
              type='primary'
              icon={Download}
              onClick={exportData}
              disabled={!hasPermission(['domain:download'])}
            >
              导出
            </ElButton>
          ),
        }}
      />
    )
  },
})
