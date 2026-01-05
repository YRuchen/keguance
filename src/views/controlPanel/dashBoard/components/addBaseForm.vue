<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px"
    :class="showTemplateSelector ? '' : 'form-content'">
    <slot v-if="showTemplateSelector" name="selectionOption">
      <el-form-item label="" prop="selectedOption">
        <el-radio-group v-model="selectedOption" size="large">
          <el-radio-button value="已有模板">已有模板</el-radio-button>
          <el-radio-button value="新建空白">新建空白</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-row v-if="selectedOption == '已有模板'">
        <el-col :span="10">
          <el-form-item label="">
            <el-select v-model="tenplateFolderId" placeholder="请选择" @change="getBoardList">
              <el-option v-for="item in typeDashBoards" :key="item.folderId" :label="item.name"
                :value="item.folderId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="" label-width="0px">
            <el-select v-model="ruleForm.templateId" placeholder="请选择" @change="getTemplateInfo">
              <el-option v-for="item in tableData" :key="item.boardId" :label="item.name" :value="item.boardId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </slot>
    <el-form-item label="仪表盘名称：" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入字典项名称" size="large" />
    </el-form-item>
    <el-form-item label="所属目录：" prop="folderId">
      <el-select v-model="ruleForm.folderId" size="large" placeholder="请选择">
        <el-option v-for="item in customFolders" :key="item.folderId" :label="item.name" :value="item.folderId" />
      </el-select>
    </el-form-item>
    <el-form-item label="描述：" prop="description">
      <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入字典项描述" />
    </el-form-item>
    <el-form-item label="可见范围：" prop="visibility">
      <el-radio-group v-model="ruleForm.visibility">
        <el-radio value="BOARD_VISIBILITY_PRIVATE">仅自己可见</el-radio>
        <el-radio value="BOARD_VISIBILITY_PUBLIC">所有人可见</el-radio>
        <el-radio value="BOARD_VISIBILITY_UNSPECIFIED">自定义</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row v-if="ruleForm.visibility == 'BOARD_VISIBILITY_UNSPECIFIED'">
      <el-col :span="14">
        <el-form-item label="拥有全部权限：" label-width="210px" prop="allPermission">
          <el-select v-model="ruleForm.allPermission">
            <el-option label="全部成员" value=" " />
            <el-option v-for="item in personArr" :key="item.folderId" :label="item.name" :value="item.folderId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="只读权限：" label-width="210px" prop="readPermission">
          <el-select v-model="ruleForm.readPermission">
            <el-option label="全部成员" value=" " />
            <el-option v-for="item in personArr" :key="item.folderId" :label="item.name" :value="item.folderId" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <slot>
      <el-row v-if="showTemplateSelector == false" name="upload">
        <el-col :span="24">
          <el-form-item label="" prop="importType">
            <el-radio-group v-model="ruleForm.importType" size="large">
              <el-radio-button value="1">通过JSON文件导入</el-radio-button>
              <el-radio-button value="2">从granfana.com模板导入</el-radio-button>
              <el-radio-button value="3">JSON模型导入</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="ruleForm.importType == 1" label="">
            <el-upload v-if="!fileList.length" v-model:file-list="fileList" class="upload-demo" drag
              :on-change="handleFileChange" :auto-upload="false" :limit="1">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
              <div class="el-upload__tip">支持文件格式：.json .txt</div>
            </el-upload>
            <div v-if="fileList.length" class="file-list-container">
              <div class="file-item">
                <el-icon>
                  <document />
                </el-icon>
                <span class="file-name">{{ fileList[0].name }}</span>
                <el-button link size="small" circle @click="handleRemoveFile">
                  <el-icon>
                    <Close />
                  </el-icon>
                </el-button>
              </div>
            </div>
            <el-alert v-if="error" :title="error" type="error" show-icon closable @close="error = ''" />
            <div v-if="loading" class="loading-container">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              正在解析文件...
            </div>
          </el-form-item>
          <el-form-item v-if="ruleForm.importType == 2" label="">
            <div>
              <div class="flex_x_between">
                <span>在grafana.com（(https://grafana.com/dashboards)）获取通用模板</span>
                <el-button type="primary" link size="small" @click="openDialog()"> 示例 </el-button>
              </div>
              <div>
                <el-input v-model="ruleForm.grafanaTemplateId" placeholder="请输入"
                  style="width: 500px; max-width: 100%" />
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="ruleForm.importType == 3" label="">
            <el-input v-model="ruleForm.jsonContent" style="width: 500px" :rows="8" type="textarea"
              placeholder="Please input" />
          </el-form-item>
        </el-col>
      </el-row>
    </slot>
    <div style="text-align: center">
      <el-button @click="handleClose()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </div>
  </el-form>
  <el-dialog v-model="dialogVisible" title="grafana.com模板导入示例" width="800">
    <div style="height: 450px; max-width: 700px">
      <el-steps :space="200" align-center direction="vertical">
        <el-step title="访问“https://grafana.com/dashboards“" />
        <el-step title="找到需要的模板，复制模板ID或者完整的URL，粘贴在我们平台（图片红框中所示）">
          <template #description>
            <img src="@/assets/image/dashBoard/example.jpg" alt="" style="height: 80%; max-width: 100%" />
          </template>
        </el-step>
      </el-steps>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { UploadFilled, Loading } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref, computed, toRaw, onMounted } from 'vue'
import { dictionaryData } from '@/mock/system'
import { useDashBoardStore } from '@/store/modules/dashBoard'
import { listBoardsApi, createBoardApi, detailBoardsApi } from '@/api/controlPanel/index'
import { useUserStore } from '@/store/modules/useAuthStore'

const UserStore = useUserStore()
const dashBoardState = useDashBoardStore()
const props = defineProps({
  showTemplateSelector: {
    type: Boolean,
    default: false,
  },
})

interface AddForm {
  templateId: string | null
  name: string
  description: string
  folderId: string | null
  visibility: string
  allPermission: string
  readPermission: string
  importType: string
  jsonContent: string
  grafanaTemplateId: string
}
const rules = reactive<FormRules<ruleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 99, message: '长度在 2 到 99 个字符', trigger: 'blur' },
  ],
  folderId: [{ required: true, message: '请输入所属目录', trigger: 'blur' }],
  visibility: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
  allPermission: [{ required: true, message: '请选择拥有全部权限', trigger: 'change' }],
  readPermission: [{ required: true, message: '请选择拥有只读权限', trigger: 'change' }],
})
// 定义初始表单状态
const selectedOption = ref('已有模板')
const dialogVisible = ref(false)
const tenplateFolderId = ref('')
const initialFormState = {
  templateId: null,
  name: '',
  description: '',
  folderId: null,
  visibility: 'BOARD_VISIBILITY_PRIVATE',
  allPermission: ' ',
  readPermission: ' ',
  importType: '1',
  jsonContent: '',
  grafanaTemplateId: '',
}

const ruleForm = reactive({ ...initialFormState }) as AddForm
const ruleFormRef = ref<FormInstance>()
const showUploadBox = ref(true)
const tableData = ref<any>([])
const loading = ref(false)
const error = ref('')
const fileList = ref<UploadFile[]>([])
const emit = defineEmits(['submit', 'close'])

const personArr = ref<any>([])
const typeDashBoards = computed(() => dashBoardState.menuData)
const customFolders = computed(() => dashBoardState.customFolders)

const getBoardList = async () => {
  const res = await listBoardsApi({
    userOrg: UserStore.userInfo,
    pagination: {
      page: 1,
      pageSize: 100,
    },
    folderId: tenplateFolderId.value,
  })
  if (res.code == 200 && res.message == 'fail') {
    ElMessage.error(res.data || '获取模板信息失败')
    return false
  }
  tableData.value = res.data.boards
  ruleForm.templateId = ''
}
const getTemplateInfo = async (templateId) => {
  const userBoard = tableData.value.find((item) => item.boardId == templateId).userBoard
  const res = await detailBoardsApi({
    boardId: templateId,
    userOrg: UserStore.userInfo,
    userBoard: userBoard,
  })
  Object.assign(ruleForm, {
    ...res.data.board.basicInfo,
    folderId: res.data.board.basicInfo.visibility == 'BOARD_VISIBILITY_PRIVATE' ? res.data.board.basicInfo.folderId : '',
  })
}
const openDialog = () => {
  dialogVisible.value = true
}
const handleClose = () => {
  close()
  emit('close', ruleForm)
}
function close() {
  ruleFormRef.value.resetFields()
  Object.assign(ruleForm, initialFormState)
}
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
  loading.value = true
  error.value = ''
  ruleForm.jsonContent = ''
  fileList.value = uploadFiles

  if (!uploadFile.raw) {
    handleError('无效的文件对象')
    return
  }

  const reader = new FileReader()

  reader.onload = (event) => {
    try {
      if (!event.target?.result) {
        throw new Error('文件读取结果为空')
      }

      const result = event.target.result as string
      ruleForm.jsonContent = JSON.stringify(JSON.parse(result))
      ElMessage.success('JSON文件解析成功')
    } catch (err) {
      handleError('JSON文件解析失败: ' + (err as Error).message)
    } finally {
      loading.value = false
    }
  }

  reader.onerror = () => {
    handleError('读取文件失败')
  }

  reader.readAsText(uploadFile.raw)
}
const handleRemoveFile = () => {
  fileList.value = [] // 清空文件列表后会重新显示上传框
}

// 错误处理
const handleError = (msg: string) => {
  error.value = msg
  ElMessage.error(msg)
  loading.value = false
  fileList.value = []
}

const handleSubmit = async () => {
  try {
    await ruleFormRef.value?.validate()
    await emit('submit', { ...ruleForm, importType: ruleForm.importType == '2' ? 'IMPORT_TYPE_GRAFANA_ID' : 'IMPORT_TYPE_JSON_CONTENT' })
  } catch (fields) {
    console.error('验证失败:', fields)
  }
}
onMounted(() => {
  // getBoardList()
})
</script>
<style lang="scss" scoped>
.upload-demo {
  width: 70%;
}

.form-content {
  margin: 40px;
  width: 56%;
}
</style>
