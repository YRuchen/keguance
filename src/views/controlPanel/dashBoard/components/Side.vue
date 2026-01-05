<template>
  <el-card class="m-dashBoard-side">
    <div>
      <el-button type="primary" class="m-dashBoard-btn" @click="addDashBoard">
        <el-icon color="#fff">
          <Plus />
        </el-icon>
        <span style="margin-left: 8px">新增仪表盘</span>
      </el-button>
    </div>
    <el-button class="m-dashBoard-btn" @click="importDashBoard">
      <el-icon color="#fff">
        <Plus />
      </el-icon>
      <span style="margin-left: 8px">导入仪表盘</span>
    </el-button>
    <h2 class="btn-text" @click="addDict">
      <el-icon color="#fff">
        <Plus />
      </el-icon><span style="margin-left: 8px">添加目录</span>
    </h2>

    <div class="filter-tree">
      <el-scrollbar class="scrollbar">
        <el-tree ref="systemFoldersRef" :data="menuData" :highlight-current="true" :props="defaultProps"
          node-key="folderId" :filter-node-method="filterNode">
          <template #default="{ node, data }">
            <span class="custom-tree-node" @click="selectAction(data)">
              <span class="custom-tree-node-label">{{ node.label }}</span>
              <span v-if="data.type == 'FOLDER_TYPE_CUSTOM'">
                <el-button type="primary" link @click.stop="editDictsort(data)">编辑</el-button>
                <el-button style="margin-left: 6px" type="danger" link @click.stop="remove(data)">删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="300">
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
  <add-dialog ref="addDialogRef"></add-dialog>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch, reactive, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElTree, FormInstance, FormRules, ElMessage } from 'element-plus'
import emitter from '~/utils/emitter'
import { useDashBoardStore } from '@/store/modules/dashBoard'
import { updateFolderApi, createBoardApi, listFolderApi, deleteFolderApi } from '@/api/controlPanel/index'
// import { useModalStore } from '@/store/modules/dialogModal'
import { useUserStore } from '@/store/modules/useAuthStore'
import AddDialog from "./addDialog.vue";
const UserStore = useUserStore()

// const modalStore = useModalStore()
// const { open } = modalStore

const router = useRouter()

const emit = defineEmits(['change'])

const systemFolders = ref<Tree[]>([])
const customFolders = ref<Tree[]>([])

const dialogFormVisible = ref(false)
const dialogFormTitle = ref('新增目录')
const curTreeData = ref({})
const dashBoardState = useDashBoardStore()
const form = reactive({
  name: '',
  folderId: 0,
})

const formRef = ref<FormInstance>()
const rules = reactive<FormRules<ruleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
  ],
})
interface Tree {
  folderId: string
  name: string
  type?: string
  boardCount?: string
  creatorId?: string
  createdTime?: string
}

const menuData = ref<InstanceType<typeof ElTree>>()
const systemFoldersRef = ref<InstanceType<typeof ElTree>>()
const customFoldersRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  label: 'name',
  value: 'folderId',
}
const addDialogRef = ref()

onBeforeMount(() => {
  getLDict()
})

const addDashBoard = (item) => {
  // open('新增仪表盘')
  addDialogRef.value.show()
}
const importDashBoard = () => {
  router.push({
    path: '/controlPanel/importDashBoard',
  })
}

// 搜索
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const addDict = () => {
  dialogFormVisible.value = true
  dialogFormTitle.value = '新增目录'
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    const isValid = await formEl.validate()
    if (!isValid) return
    const response = await updateFolderApi({
      folderId: dialogFormTitle.value === '新增目录' ? 0 : form.folderId,
      name: form.name,
      userOrg: { ...UserStore.userInfo },
    })
    if (response.code == 200 && response.message == 'success') {
      ElMessage.success('新增成功！')
      getLDict()
    } else {
      ElMessage.error(response.data)
    }
    dialogFormVisible.value = false
  } catch (error) {
    ElMessage.error('表单校验失败')
  } finally {
    form.name = ''
  }
}
const getLDict = async () => {
  try {
    menuData.value = await dashBoardState.fetchMenuData(UserStore.userInfo)
    if (menuData.value.length > 0) {
      nextTick(() => {
        systemFoldersRef.value?.setCurrentKey(menuData.value[0].folderId)
        selectAction(menuData.value[0])
      })
    }
  } catch (error) {
    ElMessage.error(error)
  }
}

const editDictsort = (data) => {
  dialogFormVisible.value = true
  dialogFormTitle.value = '编辑目录'
  Object.assign(form, data)
}

const selectAction = (data) => {
  curTreeData.value = data
  emit('change', data)
}

const remove = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      try {
        const res = await deleteFolderApi({
          folderId: row.folderId,
          userOrg: UserStore.userInfo,
        })
        if (res.message == 'fail') {
          ElMessage.error(res.data)
          return false
        }
        getLDict()
        ElMessage.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    })
    .catch(() => {
      if (error !== 'cancel') {
        ElMessage.error('删除失败: ' + (error.message || '未知错误'))
      }
    })

  console.log('data===', node, data)
}
emitter.on('DASHBOARD_OPEN', addDashBoard)
onUnmounted(() => {
  emitter.off('DASHBOARD_OPEN')
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
