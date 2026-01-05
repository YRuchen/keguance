import { defineComponent, ref } from 'vue'
import { ElDialog, ElCard, ElButton } from 'element-plus'
import styles from './index.module.scss'
import PrometheusImg from '@/assets/image/dataSource/prometheus_img.png'
import ElasticSearchImg from '@/assets/image/dataSource/elasticSearch_img.webp'
import OpenSearchImg from '@/assets/image/dataSource/openSearch_img.png'

// 数据源类型定义
const DATA_SOURCE_TYPES = [
  {
    id: 'prometheus',
    name: 'Prometheus',
    img: PrometheusImg,
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
    img: ElasticSearchImg,
  },
  {
    id: 'opensearch',
    name: 'OpenSearch',
    img: OpenSearchImg,
  },
]

export default defineComponent({
  name: 'DataSourceTypeDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue)

    const handleTypeSelect = (typeId: string) => {
      emit('select', typeId)
      visible.value = false
    }

    const handleClose = () => {
      visible.value = false
    }

    return () => (
      <ElDialog
        modelValue={visible.value}
        onUpdate:modelValue={(val: boolean) => {
          visible.value = val
          emit('update:modelValue', val)
        }}
        title='选择数据源类型'
        width='800px'
        class={styles.dialog}
        onClose={handleClose}
      >
        <div class={styles.content}>
          <div class={styles.typeGrid}>
            {DATA_SOURCE_TYPES.map((type) => (
              <ElCard
                key={type.id}
                class={styles.typeCard}
                shadow='hover'
                onClick={() => handleTypeSelect(type.id)}
              >
                <div class={styles.cardContent}>
                  <div class={styles.iconContainer}>
                    <img class={styles.img} src={type.img} alt={type.name} />
                  </div>
                  <div class={styles.typeInfo}>
                    <h3 class={styles.typeName}>{type.name}</h3>
                  </div>
                </div>
              </ElCard>
            ))}
          </div>
        </div>
      </ElDialog>
    )
  },
})
