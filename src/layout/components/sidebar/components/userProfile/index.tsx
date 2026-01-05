import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElAvatar, ElText } from 'element-plus'
import Space from '~/basicComponents/space'
import { useUserStore } from '@/store/modules/useAuthStore'
import { useTagsViewStore } from '~/store/modules/tagsView'
import { usePermissionStore } from '~/store/modules/permission'
import avatar from '~/assets/image/avatar.png'
import { getActions } from '../../constants'
import styles from './index.module.scss'

const props = {
  /** 折叠 */
  isCollapse: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'UserProfile',
  props,
  setup(props) {
    const router = useRouter()
    const UserStore = useUserStore()
    const TagsViewStore = useTagsViewStore()
    const PermissionStore = usePermissionStore()
    const userInfo = computed(() => UserStore.userInfo)
    const actions = computed(() => getActions(router, UserStore, TagsViewStore, PermissionStore))
    return () => (
      <el-popover
        width={200}
        placement='right'
        showArrow={false}
        offset={20}
        popper-style={{
          backgroundColor: '#E6EDFA',
          padding: '5px 0px',
        }}
        v-slots={{
          reference: () =>
            props.isCollapse ? (
              <ElAvatar size={30} src='/src/assets/image/avatar.png' />
            ) : (
              <Space class={styles.container} size={6}>
                <ElAvatar size={30} src={avatar} />
                <ElText class={styles.text} truncated>
                  {userInfo.value.username}
                </ElText>
              </Space>
            ),
          default: () => (
            <Space direction='column' size={0}>
              {actions.value.map((v) => (
                <ElText class={styles.content} onClick={v.click}>
                  {v.label}
                </ElText>
              ))}
            </Space>
          ),
        }}
      />
    )
  },
})
