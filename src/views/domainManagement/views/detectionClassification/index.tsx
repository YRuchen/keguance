import { h, defineComponent, Transition, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ElText } from 'element-plus'
import { Space } from '~/KeepUp'
import { modules } from '~/routers/modules/domainManagement/module'
import { useDomainMasterData } from '~/store/modules/useDomainMasterData'
import styles from './index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/formilyForm/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonPage/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonFilter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonTable/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonSetter/components/draggableList/index.module.scss'
import '~/KeepUp/packages/businessComponents/commonEditor/index.module.scss'
import '~/KeepUp/packages/basicComponents/formilyCmps/sectionTitle/index.module.scss'

export default defineComponent({
  name: 'detectionClassification',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const domainMasterData = useDomainMasterData()
    const ready = ref(false)
    const linkTo = (routeName: string) => {
      router.push({ name: routeName })
    }
    const init = async () => {
      await domainMasterData.getMasterData()
      ready.value = true
    }
    init()
    return () => (
      <Space class={styles.container} direction='column' fill>
        <Space class={styles.linkList} fill>
          {modules.map(v => (
            v.meta?.hidden
              ? null
              : <Space class={[styles.link, { [styles.active]: route.name === v.name }]} onClick={() => { linkTo(v.name as string) }}>
                  <div class={styles.iconBox}>{h(v.meta?.icon)}</div>
                  <ElText class={styles.text}>{v.meta?.title}</ElText>
                </Space>
          ))}
        </Space>
        <Transition
          name="fade-slide" 
          mode="out-in" 
          appear
        >
          {
            ready.value 
              ? <RouterView /> 
              : <div style={{ width: '100%', height: '100%' }} vLoading={true} />
          }
        </Transition>
      </Space>
    )
  },
})
