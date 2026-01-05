import { defineComponent, ref, watch } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
import type { FormInstance, FormRules } from 'element-plus'
import ModuleBox from '../ModuleBox'
import { METRICCONFIG } from '../../constants'

const props = {
  configure: {
    type: Boolean,
    default: false,
  },
  explors: {
    type: Array,
    default: () => [],
  },

  type: {
    type: String,
    default: 'null',
  },
  direction: {
    type: String,
    default: 'rtl',
  },
}

export default defineComponent({
  name: 'InfoPanel',
  props,
  setup(props, { emit }) {
    return () => {
      const isOpen = ref(props.configure)
      const explors = ref([
        {
          moduleList: [
            {
              label: 'Iaas',
              itemList: ['Node'],
              name: '主机与基础设施指标（Iaas层）',
            },
          ],
        },
        {
          moduleList: [
            {
              label: 'Paas',
              descripe: '请根据不同数据库/中间件选择对应的采集方式:',
              itemList: [
                'mysql',
                'redis',
                'pg',
                'clickhose',
                'nginx',
                'redpanda',
                'kafaka',
                'scylladb',
              ],
              name: '中间件/数据库指标（Paas层）',
            },
          ],
        },
        {
          moduleList: [
            {
              label: 'Saas',
              descripe:
                '提示：若已有 Prometheus 体系，建议优先使用 Prometheus SDK，快速集成。若需要在动态环境（K8s/Serverless/多云）中运行，推荐使用 OpenTelemetry Metrics SDK采集。',
              itemList: ['Prometheus SDK', 'OpenTelemetry Metrics SDK'],
              name: '应用与业务指标（Saas层）',
            },
          ],
        },
      ])
      const form = ref({
        ...{
          name: '',
          region: 'utf-8',
          indexName: 'ga-logs',
        },
        ...(localStorage.getItem('logForm') ? JSON.parse(localStorage.getItem('logForm')) : {}),
      })
      const selectedValues = ref<Record<string, string[]>>({})
      const selectedItemName = ref('')
      const formRef = ref<FormInstance>()
      const rules: FormRules = {
        name: [
          { required: true, message: '请输入API名称', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在3到100个字符', trigger: 'blur' },
        ],
        indexName: [
          { required: true, message: '请输入索引名称', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在3到100个字符', trigger: 'blur' },
        ],
      }
      const handleIconClick = (item: any) => {
        selectedItemName.value = item
      }
      const confirmClick = () => {
        if (props.type == 'logs') {
          formRef.value?.validate((valid) => {
            if (valid) {
              localStorage.setItem('logForm', JSON.stringify(form.value))
              emit('update:confirmClick')
            }
          })
        } else {
          localStorage.setItem('metricConfig', METRICCONFIG)
          emit('update:confirmClick')
        }
      }
      return (
        <el-drawer
          class={styles.container}
          modelValue={isOpen.value}
          size='50%'
          onClose={() => emit('update:cancelClick')}
          onUpdate:modelValue={(val: boolean) => (isOpen.value = val)}
          direction={props.direction}
          v-slots={{
            header: () => <h4>{props.type == 'logs' ? '日志' : '指标'}采集配置</h4>,
            default: () =>
              props.type == 'logs' ? (
                <div>
                  <h3>
                    如果采集的日志类型是file，请填写日志路径（path）和字符编码（encoding），如未填写会导致采集失败。
                  </h3>
                  <div>
                    <el-form
                      ref={formRef}
                      model={form.value}
                      label-width='auto'
                      style='max-width: 600px'
                      rules={rules}
                    >
                      <el-form-item label='日志路径' prop='name'>
                        <el-input v-model={form.value.name} />
                      </el-form-item>
                      <el-form-item label='索引名称' prop='indexName'>
                        <el-input v-model={form.value.indexName} />
                      </el-form-item>
                      <el-form-item label='字符编码'>
                        <el-select v-model={form.value.region} placeholder='请选择'>
                          <el-option label='utf-8' value='utf-8' />
                          <el-option label='gb18030' value='gb18030' />
                          <el-option label='gb2312' value='gb2312' />
                          <el-option label='hz-gb2312' value='hz-gb2312' />
                          <el-option label='gbk' value='gbk' />
                          <el-option label='big5' value='big5' />
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              ) : props.type == 'metric' ? (
                <div>
                  <h3>请选择要采集的指标和采集方式（支持多选）:</h3>
                  <Space direction='column' align='left' size={8}>
                    {explors.value?.map((v, index) => (
                      <>
                        <ModuleBox
                          data={v}
                          selectedItemName={selectedItemName.value}
                          onUpdate:handleIconClick={handleIconClick}
                          selectedValues={selectedValues.value}
                          onUpdate:selectedValues={(val) => (selectedValues.value = val)}
                        ></ModuleBox>
                        {explors.value.length > 1 && index < explors.value.length - 1 && (
                          <el-divider border-style='dashed' class={styles.divider} />
                        )}
                      </>
                    ))}
                  </Space>
                </div>
              ) : null,
            footer: () => (
              <div style='flex: auto'>
                <el-button onClick={() => emit('update:cancelClick')}>取消</el-button>
                <el-button type='primary' onClick={confirmClick}>
                  确 认
                </el-button>
              </div>
            ),
          }}
        ></el-drawer>
      )
    }
  },
})
