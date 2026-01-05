import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElCheckbox,
  ElDivider,
  ElIcon,
  ElMessage,
} from 'element-plus'
import { InfoFilled, Plus, Delete, Back } from '@element-plus/icons-vue'
import {
  getDataSourceDetail,
  createDataSource,
  updateDataSource,
  testDataSourceConnection,
} from '@/api/configManagement/dataSource'
import type {
  CreateDataSourceParams,
  UpdateDataSourceParams,
  HttpHeader,
} from '@/api/configManagement/dataSource/interfaces'
import {
  DataSourceType,
  DataType,
  AuthType,
  Version,
  PrometheusType,
  OpenSearchVersion,
} from '@/api/configManagement/dataSource/interfaces'
import styles from './index.module.scss'

// 统一表单数据接口
interface UnifiedFormData {
  // 基本信息
  name: string
  url: string
  type: DataSourceType
  dataType: DataType
  description: string

  // 认证信息
  authType: AuthType
  username: string
  password: string
  skipTlsVerify: boolean
  httpHeader: HttpHeader[]

  // 高级设置
  timeout: number

  // ElasticSearch 特定字段
  elasticSearchVersion: Version
  maxShard: number
  timeFieldName: string

  // Prometheus 特定字段
  prometheusType: PrometheusType

  // OpenSearch 特定字段
  openSearchVersion: OpenSearchVersion
}

export default defineComponent({
  name: 'DataSourceForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEdit = computed(() => !!route.query.id)
    const dataSourceType = computed(() => (route.query.type as string) || 'elasticsearch')
    const loading = ref(false)

    // 表单引用
    const formRef = ref()

    // 表单数据
    const formData = reactive<UnifiedFormData>({
      // 基本信息
      name: '',
      url: '',
      type: DataSourceType.ELASTIC_SEARCH,
      dataType: DataType.LOG,
      description: '',

      // 认证信息
      authType: AuthType.NONE,
      username: '',
      password: '',
      skipTlsVerify: false,
      httpHeader: [{ key: '', value: '' }],

      // 高级设置
      timeout: 10000,

      // ElasticSearch 特定字段
      elasticSearchVersion: Version.ES8_SERIES,
      maxShard: 5,
      timeFieldName: '@timestamp',

      // Prometheus 特定字段
      prometheusType: PrometheusType.PROMETHEUS,

      // OpenSearch 特定字段
      openSearchVersion: OpenSearchVersion.OS1_SERIES,
    })

    // 根据数据源类型设置默认值
    const setDefaultValues = () => {
      switch (dataSourceType.value) {
        case 'prometheus':
          formData.type = DataSourceType.PROMETHEUS
          formData.dataType = DataType.METRICS
          formData.url = 'http://localhost:9090/'
          formData.timeout = 15000
          break
        case 'opensearch':
          formData.type = DataSourceType.OPEN_SEARCH
          formData.dataType = DataType.LOG
          formData.url = 'http://localhost:9200/'
          break
        case 'elasticsearch':
        default:
          formData.type = DataSourceType.ELASTIC_SEARCH
          formData.dataType = DataType.LOG
          formData.url = 'http://localhost:9200/'
          break
      }
    }

    // 表单验证规则
    const rules = {
      name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
      url: [
        { required: true, message: '请输入URL', trigger: 'blur' },
        { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' },
      ],
      type: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
      dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
      username: [
        {
          required: computed(() => formData.authType === AuthType.BASIC_AUTH),
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: computed(() => formData.authType === AuthType.BASIC_AUTH),
          message: '请输入密码',
          trigger: 'blur',
        },
      ],
      timeout: [
        { required: true, message: '请输入请求超时时间', trigger: 'blur' },
        // { type: 'number', min: 1000, message: '超时时间不能小于1000ms', trigger: 'blur' },
      ],
      maxShard: [
        { required: true, message: '请输入最大并发分片请求量', trigger: 'blur' },
        // { type: 'number', min: 1, message: '最大并发分片请求量不能小于1', trigger: 'blur' },
      ],
      timeFieldName: [{ required: true, message: '请输入时间戳字段', trigger: 'blur' }],
    }

    // 添加HTTP标头
    const addHttpHeader = () => {
      formData.httpHeader.push({ key: '', value: '' })
    }

    // 删除HTTP标头
    const removeHttpHeader = (index: number) => {
      if (formData.httpHeader.length > 1) {
        formData.httpHeader.splice(index, 1)
      }
    }

    // 提交表单
    const submitForm = async () => {
      try {
        loading.value = true
        await formRef.value?.validate()

        // 过滤空的HTTP标头
        const validHeaders = formData.httpHeader.filter(
          (header) => header.key.trim() && header.value.trim(),
        )

        const submitData: CreateDataSourceParams | UpdateDataSourceParams = {
          name: formData.name,
          type: formData.type,
          dataType: formData.dataType,
          description: formData.description,
        }

        // 根据数据源类型添加特定配置
        switch (formData.type) {
          case DataSourceType.ELASTIC_SEARCH:
            submitData.elasticSearch = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              version: formData.elasticSearchVersion,
              maxShard: formData.maxShard,
              timeFieldName: formData.timeFieldName,
            }
            break
          case DataSourceType.PROMETHEUS:
            submitData.prometheus = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              type: formData.prometheusType,
            }
            break
          case DataSourceType.OPEN_SEARCH:
            submitData.openSearch = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              version: formData.openSearchVersion,
              maxShard: formData.maxShard,
              timeFieldName: formData.timeFieldName,
            }
            break
        }

        if (isEdit.value) {
          await updateDataSource(route.query.id as string, submitData as UpdateDataSourceParams)
          ElMessage.success('更新成功')
        } else {
          await createDataSource(submitData as CreateDataSourceParams)
          ElMessage.success('创建成功')
        }
        router.push({ path: 'dataSource' })
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      } finally {
        loading.value = false
      }
    }

    // 测试连接
    const testConnection = async () => {
      try {
        loading.value = true
        await formRef.value?.validate()

        const validHeaders = formData.httpHeader.filter(
          (header) => header.key.trim() && header.value.trim(),
        )

        const testData: CreateDataSourceParams = {
          name: formData.name,
          type: formData.type,
          dataType: formData.dataType,
          description: formData.description,
        }
        if (isEdit.value) {
          testData.id = route.query.id as string // 如果是编辑模式，添加id字段
        }

        // 根据数据源类型添加特定配置
        switch (formData.type) {
          case DataSourceType.ELASTIC_SEARCH:
            testData.elasticSearch = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              version: formData.elasticSearchVersion,
              maxShard: formData.maxShard,
              timeFieldName: formData.timeFieldName,
            }
            break
          case DataSourceType.PROMETHEUS:
            testData.prometheus = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              type: formData.prometheusType,
            }
            break
          case DataSourceType.OPEN_SEARCH:
            testData.openSearch = {
              url: formData.url,
              authType: formData.authType,
              username: formData.authType === AuthType.BASIC_AUTH ? formData.username : undefined,
              password: formData.authType === AuthType.BASIC_AUTH ? formData.password : undefined,
              skipTlsVerify: formData.skipTlsVerify,
              httpHeader: validHeaders,
              timeout: formData.timeout,
              version: formData.openSearchVersion,
              maxShard: formData.maxShard,
              timeFieldName: formData.timeFieldName,
            }
            break
        }

        const result = await testDataSourceConnection(testData as CreateDataSourceParams)
        if (result.data.ok) {
          ElMessage.success('连接测试成功')
        } else {
          ElMessage.error(`连接测试失败: ${result.data.message}`)
        }
      } catch (error) {
        console.error('连接测试失败:', error)
        ElMessage.error('连接测试失败')
      } finally {
        loading.value = false
      }
    }

    // 初始化数据（编辑模式）
    const initData = async () => {
      if (isEdit.value) {
        try {
          loading.value = true
          const res = await getDataSourceDetail(route.query.id as string)
          const data = res.data.datasource
          // 填充基本信息
          formData.name = data.name
          formData.type = data.type
          formData.dataType = data.dataType
          formData.description = data.description || ''

          // 根据数据源类型填充特定配置
          switch (data.type) {
            case DataSourceType.ELASTIC_SEARCH:
              if (data.elasticSearch) {
                formData.url = data.elasticSearch.url
                formData.authType = data.elasticSearch.authType
                formData.username = data.elasticSearch.username || ''
                formData.password = data.elasticSearch.password || ''
                formData.skipTlsVerify = data.elasticSearch.skipTlsVerify
                formData.httpHeader =
                  data.elasticSearch.httpHeader.length > 0
                    ? data.elasticSearch.httpHeader
                    : [{ key: '', value: '' }]
                formData.timeout = data.elasticSearch.timeout
                formData.elasticSearchVersion = data.elasticSearch.version
                formData.maxShard = data.elasticSearch.maxShard
                formData.timeFieldName = data.elasticSearch.timeFieldName
              }
              break
            case DataSourceType.PROMETHEUS:
              if (data.prometheus) {
                formData.url = data.prometheus.url
                formData.authType = data.prometheus.authType
                formData.username = data.prometheus.username || ''
                formData.password = data.prometheus.password || ''
                formData.skipTlsVerify = data.prometheus.skipTlsVerify
                formData.httpHeader =
                  data.prometheus.httpHeader.length > 0
                    ? data.prometheus.httpHeader
                    : [{ key: '', value: '' }]
                formData.timeout = data.prometheus.timeout
                formData.prometheusType = data.prometheus.type
              }
              break
            case DataSourceType.OPEN_SEARCH:
              if (data.openSearch) {
                formData.url = data.openSearch.url
                formData.authType = data.openSearch.authType
                formData.username = data.openSearch.username || ''
                formData.password = data.openSearch.password || ''
                formData.skipTlsVerify = data.openSearch.skipTlsVerify
                formData.httpHeader =
                  data.openSearch.httpHeader.length > 0
                    ? data.openSearch.httpHeader
                    : [{ key: '', value: '' }]
                formData.timeout = data.openSearch.timeout
                formData.openSearchVersion = data.openSearch.version
                formData.maxShard = data.openSearch.maxShard
                formData.timeFieldName = data.openSearch.timeFieldName
              }
              break
          }
        } catch (error) {
          console.error('加载数据失败:', error)
          ElMessage.error('加载数据失败')
        } finally {
          loading.value = false
        }
      } else {
        setDefaultValues()
      }
    }
    // 返回上一页
    const handleBack = () => {
      router.back()
    }

    onMounted(() => {
      initData()
    })

    return () => (
      <div class={styles.formContainer} v-loading={loading.value}>
        {/* 添加返回按钮 */}
        <div class={styles.header}>
          <el-icon onClick={handleBack} class={styles.backButton} size={20}>
            <Back />
          </el-icon>
        </div>
        <ElForm
          ref={formRef}
          model={formData}
          rules={rules}
          label-width='0'
          class={styles.editForm}
        >
          {/* 1. 基本信息 */}
          <div class={styles.section}>
            <div class={styles.sectionHeader}>
              <span class={styles.sectionNumber}>1</span>
              <span class={styles.sectionTitle}>基本信息</span>
              <ElDivider class={styles.sectionDivider} />
            </div>

            <div class={styles.sectionContent}>
              <ElFormItem prop='name'>
                <span class={[styles.customLabel, styles.required].join(' ')}>数据源名称</span>
                <ElInput v-model={formData.name} placeholder='请输入' clearable />
              </ElFormItem>

              <ElFormItem prop='url'>
                <span class={[styles.customLabel, styles.required].join(' ')}>URL</span>
                <ElInput v-model={formData.url} placeholder='请输入' clearable />
              </ElFormItem>

              <ElFormItem prop='dataType'>
                <span class={[styles.customLabel, styles.required].join(' ')}>数据类型</span>
                <ElSelect v-model={formData.dataType} placeholder='请选择'>
                  <ElOption label='日志' value={DataType.LOG} />
                  <ElOption label='指标' value={DataType.METRICS} />
                </ElSelect>
              </ElFormItem>

              <ElFormItem prop='description'>
                <span class={styles.customLabel}>描述</span>
                <ElInput
                  v-model={formData.description}
                  type='textarea'
                  placeholder='请输入'
                  rows={3}
                />
              </ElFormItem>
            </div>
          </div>

          {/* 2. 认证信息 */}
          <div class={styles.section}>
            <div class={styles.sectionHeader}>
              <span class={styles.sectionNumber}>2</span>
              <span class={styles.sectionTitle}>认证信息</span>
              <ElDivider class={styles.sectionDivider} />
            </div>

            <div class={styles.sectionContent}>
              <ElFormItem prop='authType'>
                <span class={styles.customLabel}>认证方式</span>
                <ElSelect v-model={formData.authType} placeholder='请选择'>
                  <ElOption label='无认证' value={AuthType.NONE} />
                  <ElOption label='基本认证 (Basic Authentication)' value={AuthType.BASIC_AUTH} />
                </ElSelect>
              </ElFormItem>

              {formData.authType === AuthType.BASIC_AUTH && (
                <>
                  <div class={styles.authRow}>
                    <ElFormItem prop='username' class={styles.authItem}>
                      <span class={[styles.customLabel, styles.required].join(' ')}>用户名</span>
                      <ElInput v-model={formData.username} placeholder='请输入' clearable />
                    </ElFormItem>
                    <ElFormItem prop='password' class={styles.authItem}>
                      <span class={[styles.customLabel, styles.required].join(' ')}>密码</span>
                      <ElInput
                        v-model={formData.password}
                        type='password'
                        placeholder='请输入'
                        show-password
                      />
                    </ElFormItem>
                  </div>
                </>
              )}

              <ElFormItem prop='skipTlsVerify'>
                <div class={styles.checkboxRow}>
                  <ElCheckbox v-model={formData.skipTlsVerify}>跳过TLS验证</ElCheckbox>
                  <el-tooltip
                    class='box-item'
                    placement='top'
                    v-slots={{
                      content: () => (
                        <div>
                          跳过TLS证书验证会降低连接的安全性，因为这将使客户端接受任何证书
                          <br />
                          （包括自签名证书和过期证书）。这可能会使您的连接受到中间人攻击。建议
                          <br />
                          仅在测试环境或绝对必要的情况下使用。
                        </div>
                      ),
                    }}
                  >
                    <ElIcon class={styles.infoIcon}>
                      <InfoFilled />
                    </ElIcon>
                  </el-tooltip>
                </div>
              </ElFormItem>

              <ElFormItem prop='httpHeader' class={styles.httpHeaderFormItem}>
                <span class={styles.customLabel}>自定义HTTP标头</span>
                <div class={styles.httpHeaderContainer}>
                  {formData.httpHeader.map((header, index) => (
                    <div key={index} class={styles.httpHeaderRow}>
                      <ElInput
                        v-model={header.key}
                        placeholder='HTTP标头'
                        class={styles.headerInput}
                      />
                      <ElInput v-model={header.value} placeholder='值' class={styles.headerInput} />
                      {formData.httpHeader.length > 1 && (
                        <ElButton
                          type='danger'
                          icon={<Delete />}
                          circle
                          size='small'
                          onClick={() => removeHttpHeader(index)}
                        />
                      )}
                    </div>
                  ))}
                  <ElButton
                    type='primary'
                    icon={<Plus />}
                    onClick={addHttpHeader}
                    class={styles.addHeaderBtn}
                  >
                    添加条件
                  </ElButton>
                </div>
              </ElFormItem>
            </div>
          </div>

          {/* 3. 高级设置 */}
          <div class={styles.section}>
            <div class={styles.sectionHeader}>
              <span class={styles.sectionNumber}>3</span>
              <span class={styles.sectionTitle}>高级设置</span>
              <ElDivider class={styles.sectionDivider} />
            </div>

            <div class={styles.sectionContent}>
              <ElFormItem prop='timeout'>
                <span class={styles.customLabel}>请求超时 (ms)</span>
                <ElInput
                  v-model={formData.timeout}
                  type='number'
                  placeholder='请输入'
                  onInput={(val: string) => {
                    formData.timeout = Number(val) || 0
                  }}
                />
              </ElFormItem>

              {/* ElasticSearch 特定字段 */}
              {formData.type === DataSourceType.ELASTIC_SEARCH && (
                <>
                  <ElFormItem prop='elasticSearchVersion'>
                    <span class={styles.customLabel}>版本</span>
                    <ElSelect v-model={formData.elasticSearchVersion} placeholder='请选择'>
                      <ElOption label='8.x (ElasticSearch)' value={Version.ES8_SERIES} />
                      <ElOption label='9.x (ElasticSearch)' value={Version.ES9_SERIES} />
                      <ElOption label='<= 7.10.x (OpenSearch)' value={Version.UPTO_ES710_SERIES} />
                    </ElSelect>
                  </ElFormItem>

                  <ElFormItem prop='maxShard'>
                    <span class={styles.customLabel}>
                      最大并发分片请求量
                      <el-tooltip
                        class='box-item'
                        placement='top'
                        v-slots={{
                          content: () => (
                            <div>
                              每次查询可并发访问的 shard 数，控制性能与负载平衡。默认 5。值越大，
                              <br />
                              查询越快但 ES 压力越大。
                            </div>
                          ),
                        }}
                      >
                        <ElIcon class={styles.infoIcon}>
                          <InfoFilled />
                        </ElIcon>
                      </el-tooltip>
                    </span>
                    <ElInput
                      v-model={formData.maxShard}
                      type='number'
                      placeholder='请输入'
                      onInput={(val: string) => {
                        formData.maxShard = Number(val) || 0
                      }}
                    />
                  </ElFormItem>

                  <ElFormItem prop='timeFieldName'>
                    <span class={styles.customLabel}>时间戳字段</span>
                    <ElInput v-model={formData.timeFieldName} placeholder='请输入' clearable />
                  </ElFormItem>
                </>
              )}

              {/* Prometheus 特定字段 */}
              {formData.type === DataSourceType.PROMETHEUS && (
                <>
                  <ElFormItem prop='prometheusType'>
                    <span class={styles.customLabel}>
                      Prometheus类型
                      <el-tooltip
                        class='box-item'
                        placement='top'
                        v-slots={{
                          content: () => (
                            <div>
                              不同 Prometheus 类型实现有不同的 API 特性和行为，选择正确的类型可以
                              <br />
                              确保平台与数据源正常通信并获得最佳性能。不确定请保持默认的 查询越快但
                              <br />
                              ES 压力越大。 “Prometheus”。
                            </div>
                          ),
                        }}
                      >
                        <ElIcon class={styles.infoIcon}>
                          <InfoFilled />
                        </ElIcon>
                      </el-tooltip>
                    </span>
                    <div class={styles.prometheusTypeRow}>
                      <ElSelect v-model={formData.prometheusType} placeholder='请选择'>
                        <ElOption label='Prometheus' value={PrometheusType.PROMETHEUS} />
                        <ElOption
                          label='Victoria Metrics'
                          value={PrometheusType.VICTORIA_METRICS}
                        />
                      </ElSelect>
                    </div>
                  </ElFormItem>
                </>
              )}

              {/* OpenSearch 特定字段 */}
              {formData.type === DataSourceType.OPEN_SEARCH && (
                <>
                  <ElFormItem prop='openSearchVersion'>
                    <span class={styles.customLabel}>版本</span>
                    <ElSelect v-model={formData.openSearchVersion} placeholder='请选择'>
                      <ElOption label='1.x (OpenSearch)' value={OpenSearchVersion.OS1_SERIES} />
                      <ElOption label='2.x (OpenSearch)' value={OpenSearchVersion.OS2_SERIES} />
                      <ElOption label='3.x (OpenSearch)' value={OpenSearchVersion.OS3_SERIES} />
                    </ElSelect>
                  </ElFormItem>

                  <ElFormItem prop='maxShard'>
                    <span class={styles.customLabel}>
                      最大并发分片请求量
                      <el-tooltip
                        class='box-item'
                        placement='top'
                        v-slots={{
                          content: () => (
                            <div>
                              每次查询可并发访问的 shard 数，控制性能与负载平衡。默认 5。值越大，
                              <br />
                              查询越快但 ES 压力越大。
                            </div>
                          ),
                        }}
                      >
                        <ElIcon class={styles.infoIcon}>
                          <InfoFilled />
                        </ElIcon>
                      </el-tooltip>
                    </span>
                    <ElInput
                      v-model={formData.maxShard}
                      type='number'
                      placeholder='请输入'
                      onInput={(val: string) => {
                        formData.maxShard = Number(val) || 0
                      }}
                    />
                  </ElFormItem>

                  <ElFormItem prop='timeFieldName'>
                    <span class={styles.customLabel}>时间戳字段</span>
                    <ElInput v-model={formData.timeFieldName} placeholder='请输入' clearable />
                  </ElFormItem>
                </>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div class={styles.formActions}>
            <ElButton type='primary' onClick={submitForm}>
              保存
            </ElButton>
            <ElButton onClick={testConnection}>连接测试</ElButton>
          </div>
        </ElForm>
      </div>
    )
  },
})
