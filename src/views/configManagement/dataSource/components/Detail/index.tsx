import { defineComponent, ref } from 'vue'
import { ElDrawer, ElTag, ElButton, ElMessage } from 'element-plus'
import {
  DataSourceType,
  DataType,
  AuthType,
  Version,
  PrometheusType,
  OpenSearchVersion,
} from '@/api/configManagement/dataSource/interfaces'
import type {
  DataSourceDetail,
  CreateDataSourceParams,
} from '@/api/configManagement/dataSource/interfaces'
import { testDataSourceConnection } from '@/api/configManagement/dataSource'
import styles from './index.module.scss'

export default defineComponent({
  name: 'DataSourceDetailDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Object as () => DataSourceDetail | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue)
    const testLoading = ref(false)
    const handleClose = () => {
      visible.value = false
    }

    // 测试连接
    const testConnection = async () => {
      if (!props.dataSource) return

      try {
        testLoading.value = true
        const testData: CreateDataSourceParams = {
          id: props.dataSource.id,
          name: props.dataSource.name,
          type: props.dataSource.type,
          dataType: props.dataSource.dataType,
          description: props.dataSource.description,
        }

        // 根据数据源类型添加特定配置
        switch (props.dataSource.type) {
          case DataSourceType.ELASTIC_SEARCH:
            if (props.dataSource.elasticSearch) {
              testData.elasticSearch = {
                url: props.dataSource.elasticSearch.url,
                authType: props.dataSource.elasticSearch.authType,
                username: props.dataSource.elasticSearch.username,
                password: props.dataSource.elasticSearch.password,
                skipTlsVerify: props.dataSource.elasticSearch.skipTlsVerify,
                httpHeader: props.dataSource.elasticSearch.httpHeader,
                timeout: props.dataSource.elasticSearch.timeout,
                version: props.dataSource.elasticSearch.version,
                maxShard: props.dataSource.elasticSearch.maxShard,
                timeFieldName: props.dataSource.elasticSearch.timeFieldName,
              }
            }
            break
          case DataSourceType.PROMETHEUS:
            if (props.dataSource.prometheus) {
              testData.prometheus = {
                url: props.dataSource.prometheus.url,
                authType: props.dataSource.prometheus.authType,
                username: props.dataSource.prometheus.username,
                password: props.dataSource.prometheus.password,
                skipTlsVerify: props.dataSource.prometheus.skipTlsVerify,
                httpHeader: props.dataSource.prometheus.httpHeader,
                timeout: props.dataSource.prometheus.timeout,
                type: props.dataSource.prometheus.type,
              }
            }
            break
          case DataSourceType.OPEN_SEARCH:
            if (props.dataSource.openSearch) {
              testData.openSearch = {
                url: props.dataSource.openSearch.url,
                authType: props.dataSource.openSearch.authType,
                username: props.dataSource.openSearch.username,
                password: props.dataSource.openSearch.password,
                skipTlsVerify: props.dataSource.openSearch.skipTlsVerify,
                httpHeader: props.dataSource.openSearch.httpHeader,
                timeout: props.dataSource.openSearch.timeout,
                version: props.dataSource.openSearch.version,
                maxShard: props.dataSource.openSearch.maxShard,
                timeFieldName: props.dataSource.openSearch.timeFieldName,
              }
            }
            break
          case DataSourceType.STAR_VIEW:
            if (props.dataSource.starView) {
              testData.starView = {
                url: props.dataSource.starView.url,
                authType: props.dataSource.starView.authType,
                username: props.dataSource.starView.username,
                password: props.dataSource.starView.password,
                skipTlsVerify: props.dataSource.starView.skipTlsVerify,
                httpHeader: props.dataSource.starView.httpHeader,
                timeout: props.dataSource.starView.timeout,
              }
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
        testLoading.value = false
      }
    }

    const getDataSourceTypeLabel = (type: DataSourceType) => {
      const typeMap = {
        [DataSourceType.ELASTIC_SEARCH]: 'ElasticSearch',
        [DataSourceType.OPEN_SEARCH]: 'OpenSearch',
        [DataSourceType.PROMETHEUS]: 'Prometheus',
        [DataSourceType.STAR_VIEW]: 'StarView',
        [DataSourceType.TYPE_UNKNOWN]: '未知',
      }
      return typeMap[type] || '未知'
    }

    const getDataTypeLabel = (dataType: DataType) => {
      const typeMap = {
        [DataType.LOG]: '日志',
        [DataType.METRICS]: '指标',
        [DataType.DATA_TYPE_UNKNOWN]: '未知',
      }
      return typeMap[dataType] || '未知'
    }

    const getAuthTypeLabel = (authType: AuthType) => {
      const typeMap = {
        [AuthType.NONE]: '无认证',
        [AuthType.BASIC_AUTH]: '基本认证',
        [AuthType.AUTH_TYPE_UNKNOWN]: '未知',
      }
      return typeMap[authType] || '未知'
    }

    const getVersionLabel = (version: Version | OpenSearchVersion | PrometheusType) => {
      const versionMap = {
        [Version.ES8_SERIES]: '8.x (ElasticSearch)',
        [Version.ES9_SERIES]: '9.x (ElasticSearch)',
        [Version.UPTO_ES710_SERIES]: '7.x及以下 (ElasticSearch)',
        [OpenSearchVersion.OS1_SERIES]: '1.x (OpenSearch)',
        [OpenSearchVersion.OS2_SERIES]: '2.x (OpenSearch)',
        [OpenSearchVersion.OS3_SERIES]: '3.x (OpenSearch)',
        [PrometheusType.PROMETHEUS]: 'Prometheus',
        [PrometheusType.VICTORIA_METRICS]: 'Victoria Metrics',
      }
      return versionMap[version] || '未知'
    }

    return () => (
      <ElDrawer
        modelValue={visible.value}
        onUpdate:modelValue={(val: boolean) => {
          visible.value = val
          emit('update:modelValue', val)
        }}
        title={props.dataSource?.name || '数据源详情'}
        size='50%'
        class={styles.drawer}
        onClose={handleClose}
      >
        {props.dataSource && (
          <div class={styles.content} v-loading={props.loading}>
            {/* 1. 基本信息 */}
            <div class={styles.section}>
              <div class={styles.sectionHeader}>
                <span class={styles.sectionTitle}>基本信息</span>
              </div>

              <div class={styles.sectionContent}>
                <div class={styles.infoRow}>
                  <span class={styles.infoLabel}>数据源类型:</span>
                  <ElTag type='primary'>{getDataSourceTypeLabel(props.dataSource.type)}</ElTag>
                </div>

                <div class={styles.infoRow}>
                  <span class={styles.infoLabel}>数据类型:</span>
                  <ElTag type='success'>{getDataTypeLabel(props.dataSource.dataType)}</ElTag>
                </div>

                {props.dataSource.type !== DataSourceType.STAR_VIEW && (
                  <div class={styles.infoRow}>
                    <span class={styles.infoLabel}>URL:</span>
                    <span class={styles.infoValue}>
                      {props.dataSource.elasticSearch?.url ||
                        props.dataSource.prometheus?.url ||
                        props.dataSource.openSearch?.url ||
                        props.dataSource.starView?.url ||
                        '无'}
                    </span>
                  </div>
                )}
                <div class={styles.infoRow}>
                  <span class={styles.infoLabel}>描述:</span>
                  <span class={styles.infoValue}>{props.dataSource.description || '无'}</span>
                </div>
              </div>
            </div>
            {/* 2. 认证信息 */}
            {props.dataSource.type !== DataSourceType.STAR_VIEW && (
              <div class={styles.section}>
                <div class={styles.sectionHeader}>
                  <span class={styles.sectionTitle}>认证信息</span>
                </div>

                <div class={styles.sectionContent}>
                  <div class={styles.infoRow}>
                    <span class={styles.infoLabel}>认证方式:</span>
                    <span class={styles.infoValue}>
                      {getAuthTypeLabel(
                        props.dataSource.elasticSearch?.authType ||
                          props.dataSource.prometheus?.authType ||
                          props.dataSource.openSearch?.authType ||
                          props.dataSource.starView?.authType ||
                          AuthType.NONE,
                      )}
                    </span>
                  </div>

                  {(props.dataSource.elasticSearch?.authType === AuthType.BASIC_AUTH ||
                    props.dataSource.prometheus?.authType === AuthType.BASIC_AUTH ||
                    props.dataSource.openSearch?.authType === AuthType.BASIC_AUTH ||
                    props.dataSource.starView?.authType === AuthType.BASIC_AUTH) && (
                    <>
                      <div class={styles.infoRow}>
                        <span class={styles.infoLabel}>用户名:</span>
                        <span class={styles.infoValue}>
                          {props.dataSource.elasticSearch?.username ||
                            props.dataSource.prometheus?.username ||
                            props.dataSource.openSearch?.username ||
                            props.dataSource.starView?.username ||
                            '无'}
                        </span>
                      </div>

                      <div class={styles.infoRow}>
                        <span class={styles.infoLabel}>密码:</span>
                        <span class={styles.infoValue}>
                          {props.dataSource.elasticSearch?.password ||
                          props.dataSource.prometheus?.password ||
                          props.dataSource.openSearch?.password ||
                          props.dataSource.starView?.password
                            ? '******'
                            : '无'}
                        </span>
                      </div>
                    </>
                  )}

                  <div class={styles.infoRow}>
                    <span class={styles.infoLabel}>跳过TLS验证:</span>
                    <span class={styles.infoValue}>
                      {props.dataSource.elasticSearch?.skipTlsVerify ||
                      props.dataSource.prometheus?.skipTlsVerify ||
                      props.dataSource.openSearch?.skipTlsVerify ||
                      props.dataSource.starView?.skipTlsVerify
                        ? '是'
                        : '否'}
                    </span>
                  </div>

                  <div class={styles.infoRow}>
                    <span class={styles.infoLabel}>自定义HTTP标头:</span>
                    <div class={styles.httpHeaderTable}>
                      <div class={styles.tableHeader}>
                        <span class={styles.headerCell}>参数名称</span>
                        <span class={styles.headerCell}>值</span>
                      </div>
                      {(() => {
                        const hasHeaders =
                          props.dataSource.elasticSearch?.httpHeader?.length > 0 ||
                          props.dataSource.prometheus?.httpHeader?.length > 0 ||
                          props.dataSource.openSearch?.httpHeader?.length > 0 ||
                          props.dataSource.starView?.httpHeader?.length > 0

                        if (hasHeaders) {
                          const headers =
                            props.dataSource.elasticSearch?.httpHeader ||
                            props.dataSource.prometheus?.httpHeader ||
                            props.dataSource.openSearch?.httpHeader ||
                            props.dataSource.starView?.httpHeader ||
                            []
                          return headers.map((header, index) => (
                            <div key={index} class={styles.tableRow}>
                              <span class={styles.tableCell}>{header.key}</span>
                              <span class={styles.tableCell}>{header.value}</span>
                            </div>
                          ))
                        } else {
                          return (
                            <div class={styles.emptyRow}>
                              <span>暂无自定义HTTP标头</span>
                            </div>
                          )
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 3. 高级设置 */}
            {props.dataSource.type !== DataSourceType.STAR_VIEW && (
              <div class={styles.section}>
                <div class={styles.sectionHeader}>
                  <span class={styles.sectionTitle}>高级设置</span>
                </div>

                <div class={styles.sectionContent}>
                  <div class={styles.infoRow}>
                    <span class={styles.infoLabel}>请求超时时间:</span>
                    <span class={styles.infoValue}>
                      {props.dataSource.elasticSearch?.timeout ||
                        props.dataSource.prometheus?.timeout ||
                        props.dataSource.openSearch?.timeout ||
                        props.dataSource.starView?.timeout ||
                        0}
                      ms
                    </span>
                  </div>

                  {/* ElasticSearch 特定字段 */}
                  {props.dataSource.type === DataSourceType.ELASTIC_SEARCH &&
                    props.dataSource.elasticSearch && (
                      <>
                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>版本:</span>
                          <span class={styles.infoValue}>
                            {getVersionLabel(props.dataSource.elasticSearch.version)}
                          </span>
                        </div>

                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>最大并发分片请求量:</span>
                          <span class={styles.infoValue}>
                            {props.dataSource.elasticSearch.maxShard}
                          </span>
                        </div>

                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>时间戳字段:</span>
                          <span class={styles.infoValue}>
                            {props.dataSource.elasticSearch.timeFieldName}
                          </span>
                        </div>
                      </>
                    )}

                  {/* Prometheus 特定字段 */}
                  {props.dataSource.type === DataSourceType.PROMETHEUS &&
                    props.dataSource.prometheus && (
                      <>
                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>Prometheus类型:</span>
                          <span class={styles.infoValue}>
                            {getVersionLabel(props.dataSource.prometheus.type)}
                          </span>
                        </div>
                      </>
                    )}

                  {/* OpenSearch 特定字段 */}
                  {props.dataSource.type === DataSourceType.OPEN_SEARCH &&
                    props.dataSource.openSearch && (
                      <>
                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>版本:</span>
                          <span class={styles.infoValue}>
                            {getVersionLabel(props.dataSource.openSearch.version)}
                          </span>
                        </div>

                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>最大并发分片请求量:</span>
                          <span class={styles.infoValue}>
                            {props.dataSource.openSearch.maxShard}
                          </span>
                        </div>

                        <div class={styles.infoRow}>
                          <span class={styles.infoLabel}>时间戳字段:</span>
                          <span class={styles.infoValue}>
                            {props.dataSource.openSearch.timeFieldName}
                          </span>
                        </div>
                      </>
                    )}
                </div>
              </div>
            )}
            {/* 操作按钮 */}
            <div class={styles.actions}>
              <ElButton type='primary' onClick={testConnection} loading={testLoading.value}>
                连接测试
              </ElButton>
            </div>
          </div>
        )}
      </ElDrawer>
    )
  },
})
