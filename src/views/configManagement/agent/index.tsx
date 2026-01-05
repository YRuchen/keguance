import { defineComponent, onMounted, ref, watch } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
import StepBox from './components/StepBox'
import ModuleBox from './components/ModuleBox'
import ContentPanel from './components/ContentPanel'
import AddKeyPanel from './components/AddKeyPanel'
import ConfigurePanel from './components/configurePanel'
import type { DrawerProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/useAuthStore'
import { TextType } from './constants'
import { getAgentApi } from '~/api/configManagement/angent/index'
import { METRICCONFIG, createLogsConfig } from './constants'
export default defineComponent({
  name: 'LogsAgent',
  setup() {
    const userStore = useUserStore()
    const list = ref([
      { step: 1, text: '选安装采集日志Agent的平台', sucess: false },
      { step: 2, text: '安装Agent ', sucess: false },
    ])
    const moudleTypes = ref([
      {
        name: '容器平台',
        moduleList: [
          { svgName: 'kubernetes', name: 'Kubernetes', scriptName: 'install_agent_kubernetes.sh' },
          { svgName: 'docker', name: 'Docker', scriptName: 'install_agent_docker.sh' },
        ],
      },
      {
        name: '主机平台',
        moduleList: [{ svgName: 'linux', name: 'Linux', scriptName: 'install_agent_linux.sh' }],
      },
    ])
    const contantList = ref([
      { name: 'Agent功能说明', step: 1 },
      { name: 'Agent安装命令', step: 2 },
      { name: '在集群中启动Agent', step: 3 },
      { name: '确认Agent安装状态', step: 4 },
    ])
    const pagination = ref({
      page: 1,
      pageSize: 10,
      total: 0,
    })
    const active = ref(1)
    const drawer = ref(false)
    const configure = ref(false)
    const textarea = ref('')
    const startTextarea = ref('ga -start')
    const configureType = ref('')
    const tableData = ref([])
    const loading = ref(true)

    const direction = ref<DrawerProps['direction']>('rtl')
    const selectedItemName = ref<any>({})
    const logsValue = ref(false)
    const metricValue = ref(false)
    const handleIconClick = (item: any) => {
      selectedItemName.value = item
    }
    const handleCloseSwitch = (val: boolean, type: number) => {
      if (type === 1) {
        localStorage.removeItem('logForm')
      } else {
        localStorage.removeItem('metricConfig')
      }
      textarea.value = ''
      handleReadConfig()
    }
    const handleEnd = () => {
      localStorage.removeItem('APIKey')
      localStorage.removeItem('logForm')
      localStorage.removeItem('metricConfig')
      active.value = 1
      selectedItemName.value = {}
      textarea.value = ''
      drawer.value = false
      configure.value = false
      configureType.value = ''
      tableData.value = []
      logsValue.value = false
      metricValue.value = false
    }
    const handleNext = () => {
      if (active.value < list.value.length) {
        active.value++
        getAgetList()
        handleReadConfig()
      } else {
        active.value--
      }
    }
    const handleReadConfig = () => {
      const apiKey = localStorage.getItem('APIKey')?.trim() || ''
      const logPath = JSON.parse(localStorage.getItem('logForm'))?.name ?? ''
      const indexName = JSON.parse(localStorage.getItem('logForm'))?.indexName ?? ''
      const metricConfig = localStorage.getItem('metricConfig')?.trim() || ''
      const commands = []
      if (apiKey) commands.push(`GA_API_KEY=${apiKey} &&`)
      if (logPath)
        commands.push(createLogsConfig(selectedItemName.value.scriptName, logPath, indexName))
      if (metricConfig) commands.push(metricConfig)

      textarea.value = commands.join('\n')
    }
    const handleChangeApi = () => {
      drawer.value = true
    }
    const getAgetList = async () => {
      const response = await getAgentApi<MyResponse>({
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      })
      const { code, message, data } = response
      if (code == 200 && message == 'success') {
        loading.value = false
        tableData.value = data.list || []
        pagination.value = data?.pagination || pagination.value
      } else {
        ElMessage.error(data)
      }
    }
    const hanldeConfigure = (value) => {
      configure.value = true
      configureType.value = value
    }
    onMounted(() => {
      handleEnd()
    })

    const renderAgentDescription = (selectItem: any) => {
      const commonParagraph = (
        <div class={styles.marginLeft}>
          <div>
            <span>采集平台日志</span>
            <el-switch
              class={styles.marginLeft}
              v-model={logsValue.value}
              size='large'
              onChange={(val: boolean) => handleCloseSwitch(val, 1)}
            />
            <el-button
              link
              type='primary'
              onClick={() => hanldeConfigure('logs')}
              v-show={logsValue.value}
            >
              配置
            </el-button>
          </div>
          <div>
            <span>采集平台指标</span>
            <el-switch
              class={styles.marginLeft}
              modelValue={metricValue.value}
              size='large'
              onUpdate:modelValue={(val: boolean) => (metricValue.value = val)}
              onChange={(val: boolean) => handleCloseSwitch(val, 2)}
            />
            <el-button
              link
              type='primary'
              onClick={() => hanldeConfigure('metric')}
              v-show={metricValue.value}
            >
              配置
            </el-button>
          </div>
        </div>
      )
      const specificContent = (
        <div class={styles.marginLeft}>
          <p style='white-space: pre-line'>
            {selectItem.name === 'Kubernetes'
              ? TextType.KUBERNETES_TEXT
              : selectItem.name === 'Docker'
              ? TextType.DOCKER_TEXT
              : selectItem.name === 'Linux'
              ? TextType.LINUX_TEXT
              : null}
          </p>
        </div>
      )

      // 返回公共段落 + 特定内容
      return (
        <>
          {specificContent}
          {commonParagraph}
        </>
      )
    }
    return () => (
      <>
        <Space class={styles.container} direction='column' fill size={0}>
          <StepBox list={list.value} active={active.value}></StepBox>
          <div class={styles.contentContainer}>
            <Space direction='column' align='left' size={8}>
              {active.value == 1 &&
                moudleTypes.value?.map((v) => (
                  <ModuleBox
                    data={v}
                    showName={true}
                    selectedItemName={selectedItemName.value.name}
                    onUpdate:handleIconClick={handleIconClick}
                  ></ModuleBox>
                ))}
            </Space>
            <Space direction='column' align='left' size={8} v-show={active.value == 2}>
              {(selectedItemName.value.name === 'Kubernetes'
                ? contantList.value
                : contantList.value.filter((v) => v.name !== '在集群中启动Agent')
              )?.map((v, index) => (
                <ContentPanel data={v} step={index + 1}>
                  {v.name == 'Agent功能说明' && renderAgentDescription(selectedItemName.value)}
                  {v.name == 'Agent安装命令' && (
                    <Space direction='column' fill align='left' size={8} class={styles.marginLeft}>
                      <div>
                        <el-button type='primary' onClick={handleChangeApi}>
                          选择API key
                        </el-button>
                      </div>
                      <div style={{ position: 'relative', width: '80%' }}>
                        <el-input
                          modelValue={textarea.value}
                          onUpdate:modelValue={(val: string) => (textarea.value = val)}
                          readonly
                          rows={10}
                          resize='none'
                          type='textarea'
                          class={styles.textareaWrap}
                        />
                        {/* 复制按钮悬浮在右上角 */}
                        <el-button
                          size='small'
                          link
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '8px',
                            zIndex: 10,
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(textarea.value)
                            ElMessage.success('复制成功')
                          }}
                        >
                          复制代码
                        </el-button>
                      </div>
                    </Space>
                  )}
                  {selectedItemName.value.name == 'Kubernetes' && v.name == '在集群中启动Agent' && (
                    <Space direction='column' fill align='left' size={8} class={styles.marginLeft}>
                      <div style={{ position: 'relative', width: '80%' }}>
                        <el-input
                          modelValue={startTextarea.value}
                          onUpdate:modelValue={(val: string) => (startTextarea.value = val)}
                          readonly
                          rows={10}
                          resize='none'
                          type='textarea'
                          style={{ width: '100%' }}
                        />
                        {/* 复制按钮悬浮在右上角 */}
                        <el-button
                          size='small'
                          link
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '8px',
                            zIndex: 10,
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(textarea.value)
                            ElMessage.success('复制成功')
                          }}
                        >
                          复制代码
                        </el-button>
                      </div>
                    </Space>
                  )}
                  {v.name == '确认Agent安装状态' && (
                    <Space direction='column' fill align='left' size={8} class={styles.marginLeft}>
                      <el-table
                        v-loading={loading.value}
                        data={tableData.value}
                        style={{ width: '80%' }}
                        border
                        v-slots={{
                          empty: () => (
                            <div style='padding: 20px; text-align: center; color: gray;'>
                              未检测到Agent
                            </div>
                          ),
                        }}
                      >
                        <el-table-column property='hostName' label='主机名称' />
                        <el-table-column property='agentName' label='Agent名称' />
                        <el-table-column
                          property='runTime'
                          label='Agent运行时长'
                          showOverflowTooltip
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
                            (pagination.value.page = val), getAgetList()
                          )}
                          onUpdate:page-size={(val: number) => (
                            (pagination.value.pageSize = val), getAgetList()
                          )}
                        />
                      </div>
                    </Space>
                  )}
                </ContentPanel>
              ))}
            </Space>
            <div class={styles.bottomContainer}>
              {selectedItemName.value.name && (
                <>
                  <el-button type='primary' size='large' onClick={handleNext}>
                    {active.value < list.value.length ? '下一步' : '上一步'}
                  </el-button>
                  {active.value == list.value.length && (
                    <el-button type='primary' size='large' onClick={handleEnd}>
                      完 成
                    </el-button>
                  )}
                </>
              )}
            </div>
          </div>
        </Space>
        <AddKeyPanel
          drawer={drawer.value}
          direction={direction.value}
          onUpdate:cancelClick={() => (drawer.value = false)}
          onUpdate:confirmClick={() => ((drawer.value = false), handleReadConfig())}
        ></AddKeyPanel>
        <ConfigurePanel
          configure={configure.value}
          type={configureType.value}
          onUpdate:cancelClick={() => (configure.value = false)}
          onUpdate:confirmClick={() => ((configure.value = false), handleReadConfig())}
        ></ConfigurePanel>
      </>
    )
  },
})
