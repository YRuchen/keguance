<template>
  <div class="m-user-table">
    <div class="footer">
      <p>
        <span class="m-user-table-title">{{ tableTitle }}</span>
        <i v-if="tableTitle == '经常查看'">近1月查看次数top10的仪表盘</i>
      </p>
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
        <el-form-item label="" prop="keyword">
          <el-input v-model="formInline.keyword" placeholder="请输入仪表盘名称" size="large" clearable @keyup.enter="onSubmit">
            <template #prepend>
              <el-button :icon="Search" @click="onSubmit" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="creatorId" style="width: 300px">
          <el-select v-model="formInline.creatorId" placeholder="请选择创建人" size="large" clearable @change="onSubmit">
            <el-option v-for="item in creators" :key="item.creatorId" :label="item.name" :value="item.creatorId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="table-inner">
        <el-table v-loading="loading" :data="tableData" style="width: 100%; height: 100%" border>
          <el-table-column prop="name" label="仪表盘名称" align="center">
            <template #default="scope">
              <el-button link size="small" @click="openIframe(scope.row)">
                {{ scope.row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" align="center" width="150" />
          <el-table-column prop="lastModifiedTime" label="最后修改时间" align="center" width="220" />
          <el-table-column prop="operator" label="操作" width="200px" align="center" fixed="right">
            <template #default="scope">
              <template v-if="scope.row.userBoard === false">
                <el-button v-if="scope.row?.favorited == true" type="primary" link size="small"
                  @click="isFavorited(scope.row, '取消')">
                  <svg-icon icon-class="collection" />
                </el-button>
                <el-button v-else type="primary" link size="small" @click="isFavorited(scope.row, '收藏')">
                  <svg-icon icon-class="collect" />
                </el-button>
              </template>
              <el-button type="primary" link size="small" @click="detailHandler(scope.row)">
                详情
              </el-button>
              <el-button v-if="scope.row.userBoard === true" type="danger" link size="small"
                :disabled="!(scope.row.userBoard && scope.row.creatorId == userOrg.userId)"
                @click="deleteBoard(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination v-model:current-page="pagination.page" :page-size="pagination.pageSize" background
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="仪表盘详情" width="600">
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="仪表盘名称：">{{ detailInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="所属目录：">
          {{
            dashBoardState.customFolders.find((item) => item.folderId == detailInfo.folderId)?.name
          }}
        </el-descriptions-item>
        <el-descriptions-item label="描述：">{{ detailInfo.description }}</el-descriptions-item>
        <el-descriptions-item label="可见范围：">
          {{
            detailInfo.visibility == 'BOARD_VISIBILITY_PRIVATE'
              ? '仅自己见'
              : detailInfo.visibility == 'BOARD_VISIBILITY_PUBLIC'
                ? '所有人可见'
                : '自定义'
          }}
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { onMounted, computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/useAuthStore'
const UserStore = useUserStore()

import {
  listBoardsApi,
  getCreatorsApi,
  searchApi,
  favoriteApi,
  unfavoriteApi,
  deleteBoardApi,
  detailBoardsApi,
  vistApi,
} from '@/api/controlPanel/index'
import { useDashBoardStore } from '@/store/modules/dashBoard'
const dashBoardState = useDashBoardStore()
const userOrg = computed(() => UserStore.userInfo)
const router = useRouter()

const tableData = ref<any>([])
const detailInfo = ref<any>({})
const tableTitle = ref<string>('')
const folderId = ref<string>('')
const total = ref<number>(0)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
interface FormData {
  name: string
  creatorId: string
}
const formInline = reactive<FormData>({
  keyword: '',
  creatorId: null,
})
type PaginationParams = {
  page: number
  pageSize: number
}
type Creators = {
  creatorId: number | null
  name: string
  role: string
}

const creators = reactive<Creators[]>([])
const pagination = reactive<PaginationParams>({
  page: 1,
  pageSize: 10,
})
const loading = ref(true)
const getCreators = async () => {
  try {
    const response = await getCreatorsApi({
      userId: userOrg.value.userId,
    })
    if (response.message !== 'success') {
      ElMessage.error(response.data)
      return false
    }
    Object.assign(creators, response.data.creators || [])
  } catch (error) {
    console.error('接口请求失败:', error)
    ElMessage.error('网络错误，获取列表失败')
  }
}
const onSubmit = async () => {
  try {
    loading.value = true
    const response = await searchApi({
      userOrg: userOrg.value,
      pagination: pagination,
      ...formInline,
    })
    if (response.message !== 'success') {
      ElMessage.error(response.data)
      return false
    }
    tableData.value = response.data?.boards || []
  } catch (error) {
    console.error('接口请求失败:', error)
    ElMessage.error('网络错误，获取列表失败')
  } finally {
    loading.value = false
  }
}

const openIframe = async (row) => {
  await dashBoardState.openIframe(row, userOrg.value, router)
}
const reset = (formEl: FormInstance | undefined) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const getList = (data) => {
  loading.value = true
  tableTitle.value = data.name
  folderId.value = data.folderId
  listBoards()
}
const listBoards = async () => {
  try {
    const response = await listBoardsApi({
      userOrg: userOrg.value,
      pagination: pagination,
      folderId: folderId.value,
    })
    if (response.code == 200 && response.message == 'success') {
      tableData.value = response.data?.boards || []

      total.value = response.data?.pagination?.totalItems || 0
    } else {
      ElMessage.error(response.data)
    }
  } catch (error) {
    console.error('接口请求失败:', error)
    ElMessage.error('网络错误，获取列表失败')
  } finally {
    loading.value = false
  }
}

const isFavorited = async (row, name) => {
  const apiReq = name === '收藏' ? favoriteApi : unfavoriteApi
  await apiReq({
    boardIds: [row.boardId],
    userOrg: userOrg.value,
    type: 'BOARD_TYPE_MY_FAVORITE',
  })
  listBoards()
}
const detailHandler = async (row) => {
  try {
    dialogVisible.value = true
    detailInfo.value = {}
    const res = await detailBoardsApi({
      boardId: row.boardId,
      userOrg: userOrg.value,
      userBoard: row.userBoard,
    })
    if (res.message == 'fail') {
      ElMessage.error(res.data)
      return false
    }
    detailInfo.value = res.data.board.basicInfo
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const deleteBoard = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      try {
        const res = await deleteBoardApi({
          boardIds: [row.boardId],
          userOrg: userOrg.value,
        })
        if (res.message == 'fail') {
          ElMessage.error(res.data)
          return false
        }
        listBoards()
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
}
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  listBoards()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  listBoards()
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
  getCreators()
})

defineExpose({
  getList,
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
