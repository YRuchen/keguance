import { defineComponent, ref, watch } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
import { useUserStore } from '@/store/modules/useAuthStore'
import type { FormInstance, FormRules } from 'element-plus'

import {
  getKeyApi,
  generateKeyApi,
  editKeyApi,
  deleteKeyApi,
} from '~/api/configManagement/angent/index'

import { ElMessage, ElMessageBox } from 'element-plus'

const props = {
  drawer: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'rtl',
  },
}

export default defineComponent({
  name: 'AddKeyPanel',
  props,
  setup(props, { emit }) {
    const userStore = useUserStore()
    const isOpen = ref(props.drawer)
    const tableData = ref([])
    const name = ref('')
    const addDialog = ref(false)
    const selectedId = ref('')
    const addDialogRef = ref<FormInstance>()
    const loading = ref(false)
    const pagination = ref({
      page: 1,
      pageSize: 10,
      total: 0,
    })

    const form = ref({
      keyId: undefined as number | undefined,
      name: '',
      radio1: 1,
    })
    const rules: FormRules = {
      name: [
        { required: true, message: '请输入API名称', trigger: 'blur' },
        { min: 3, max: 100, message: '长度在3到100个字符', trigger: 'blur' },
      ],
    }
    const handleDelete = async (row: any) => {
      ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      })
        .then(async () => {
          try {
            const response = await deleteKeyApi({ keyId: row.keyId, id: userStore.userInfo.userId })
            if (response.message == 'fail') {
              ElMessage.error(response.data)
              return false
            }
            ElMessage.success('删除成功')
            handlGetTableList()
          } catch (error) {
            console.log(error)
          }
        })
        .catch((error) => {
          if (error !== 'cancel') {
            ElMessage.error('删除失败: ' + (error.message || '未知错误'))
          }
        })
    }
    const handleClose = () => {
      addDialog.value = false
    }
    const handleSaveData = () => {
      localStorage.setItem('APIKey', selectedId.value)
      selectedId.value = ''
      emit('update:confirmClick')
    }
    const handlGetTableList = async () => {
      loading.value = true
      const response = await getKeyApi<MyResponse>(
        {
          type: 1,
          id:
            userStore.userInfo.tenantId ||
            JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.tenantId,
        },
        { ...pagination.value, name: name.value },
      )
      const { code, message, data } = response
      if (code == 200 && message == 'success') {
        loading.value = false
        tableData.value = data.keys
        pagination.value = data.pagination
      } else {
        ElMessage.error(data)
      }
    }
    const handleAddApi = () => {
      addDialog.value = true
    }
    const handleEditApi = (row: any) => {
      addDialog.value = true
      form.value = { ...form.value, ...row }
    }
    const onSubmit = () => {
      addDialogRef.value?.validate(async (valid) => {
        if (valid) {
          const apiPost = form.value.keyId ? editKeyApi : generateKeyApi
          const response = await apiPost<MyResponse>({
            ...form.value,
            type: 1,
            id: userStore.userInfo.userId,
          })
          const { code, message, data } = response
          if (code == 200 && message == 'success') {
            addDialog.value = false
            ElMessage.success('新增成功！')
            handlGetTableList()
          } else {
            ElMessage.error(response.data)
          }
        }
      })
    }
    watch(
      () => props.drawer,
      (val) => {
        isOpen.value = val
        if (val) {
          handlGetTableList()
          selectedId.value = localStorage.getItem('APIKey') ? localStorage.getItem('APIKey') : ''
        }
      },
    )
    return () => {
      return (
        <>
          <el-drawer
            class={styles.container}
            modelValue={isOpen.value}
            onUpdate:modelValue={(val: boolean) => (isOpen.value = val)}
            size='60%'
            onClose={() => ((name.value = ''), emit('update:cancelClick'))}
            direction={props.direction}
            v-slots={{
              header: () => <h4>选择API key</h4>,
              default: () => (
                <div>
                  <p>从下方列表中选择API key，您选择的key将被添加到本页相关代码片段中。</p>
                  <Space direction='HORIZONTAL' fill size={0} align='left' justify='space-between'>
                    <Space direction='HORIZONTAL' fill size={15} align='left'>
                      <el-input
                        v-model={name.value}
                        style='width: 240px'
                        placeholder='请输入API名称'
                      />
                      <el-button type='primary' onClick={handlGetTableList}>
                        查询
                      </el-button>
                    </Space>
                    <el-button type='primary' onClick={handleAddApi}>
                      创建API
                    </el-button>
                  </Space>
                  <el-table
                    data={tableData.value}
                    class={styles.tableContainer}
                    border
                    v-loading={loading.value}
                  >
                    <el-table-column
                      width={55}
                      v-slots={{
                        default: (scope: any) => (
                          <el-radio v-model={selectedId.value} value={scope.row.keyId} />
                        ),
                      }}
                    />
                    <el-table-column
                      label='API名称'
                      property='name'
                      v-slots={{
                        default: (scope: any) => <span>{scope.row.name}</span>,
                      }}
                    />
                    <el-table-column property='keyId' label='Key id' />
                    <el-table-column property='key' label='Key' />
                    <el-table-column property='label' label='权限类型' />
                    <el-table-column property='createTime' label='创建时间' />
                    <el-table-column
                      label='操作'
                      width={100}
                      v-slots={{
                        default: (scope: any) => (
                          <div>
                            <el-button size='small' link onclick={() => handleEditApi(scope.row)}>
                              编辑
                            </el-button>
                            <el-button
                              size='small'
                              link
                              type='danger'
                              onClick={() => handleDelete(scope.row)}
                            >
                              删除
                            </el-button>
                          </div>
                        ),
                      }}
                    />
                  </el-table>
                  <div class='pagination'>
                    <el-pagination
                      modelValue={pagination.value.page}
                      page-size={pagination.value.pageSize}
                      background
                      layout='total, sizes, prev, pager, next, jumper'
                      total={pagination.value.total}
                      onUpdate:current-page={(val: number) => (
                        (pagination.value.page = val), handlGetTableList()
                      )}
                      onUpdate:page-size={(val: number) => (
                        (pagination.value.pageSize = val), handlGetTableList()
                      )}
                    />
                  </div>
                </div>
              ),
              footer: () => (
                <div style='flex: auto'>
                  <el-button onClick={() => emit('update:cancelClick')}>取消</el-button>
                  <el-button type='primary' onClick={handleSaveData}>
                    使用Api Key
                  </el-button>
                </div>
              ),
            }}
          ></el-drawer>
          <el-dialog
            v-model={addDialog.value}
            title='创建Api Key'
            width='30%'
            close-on-click-modal={false}
            destroy-on-close
            onClose={handleClose}
          >
            <el-form ref={addDialogRef} model={form.value} label-width='auto' rules={rules}>
              <el-form-item label='API名称' prop='name'>
                <el-input v-model={form.value.name} />
              </el-form-item>
              <el-form-item label='可见范围'>
                <el-radio-group v-model={form.value.radio1}>
                  <el-radio value={1} size='large'>
                    仅自己可见
                  </el-radio>
                  <el-radio value={2} size='large'>
                    所有人可见
                  </el-radio>
                  <el-radio value={3} size='large'>
                    自定义
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type='primary' onClick={onSubmit}>
                  创建
                </el-button>
                <el-button onClick={handleClose}>取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </>
      )
    }
  },
})
