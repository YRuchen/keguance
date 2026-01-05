import { ref, computed, defineComponent, watch, nextTick, onMounted } from 'vue'
import {
  ElButton,
  ElInput,
  ElPopover,
  ElMessage,
  ElDropdown,
  ElMessageBox,
  ElIcon,
} from 'element-plus'
import { Search, Plus, MoreFilled } from '@element-plus/icons-vue'
import { IconFont } from '~/KeepUp'
import { setNameApi, deteleNameApi } from '@/api/domainManagement/ai'
import styles from './index.module.scss'
import { number } from 'echarts'

export default defineComponent({
  name: 'SideBar',
  props: {
    // 对话列表的展开收起状态
    collapsed: {
      type: Boolean,
      default: false,
    },
    // 选中的对话信息
    resetKey: {
      type: Number,
      default: 0,
    },
    //会话历史
    chatHistory: {
      type: Array as any,
      default: () => [],
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'toggle', 'newChat', 'sessionDetail', 'refreshList'],
  setup(props, { emit }) {
    // const keyword = defineModel<string>('keyword')
    const keyword = ref(props.modelValue)
    const toggleSidebar = () => {
      emit('toggle')
    }
    const createNewChat = () => {
      emit('newChat')
    }
    /**
     * 根据更新时间戳计算时间分类
     */
    const getTimeCategory = (updateTimestamp: number): string => {
      // 确定时间戳单位（假设可能是秒或毫秒）
      const timestamp = updateTimestamp < 10000000000 ? updateTimestamp * 1000 : updateTimestamp // 如果是秒，转为毫秒

      const now = Date.now()
      const diffMs = now - timestamp
      const diffDays = diffMs / (1000 * 60 * 60 * 24) // 转换为天数

      if (diffDays <= 7) {
        return '7天内'
      } else if (diffDays <= 30) {
        return '30天内'
      } else if (diffDays <= 365) {
        return '一年内'
      } else {
        return '一年前'
      }
    }

    const processedList = computed(() =>
      (props.chatHistory || []).map((item) => ({
        ...item,
        timeCategory: getTimeCategory(item.updateTimestamp || item.createTimestamp || Date.now()),
      })),
    )

    // 按时间分类分组
    const groupedByCategory = computed(() =>
      processedList.value.reduce((groups, item) => {
        const category = item.timeCategory
        ;(groups[category] ||= []).push(item)
        return groups
      }, {} as Record<string, typeof processedList.value>),
    )

    // 选择历史会话
    const selectedSessionId = ref<number | null>(null)
    const handleSelectHistory = (sessionId) => {
      selectedSessionId.value = sessionId
      emit('sessionDetail', sessionId)
      createNewChat()
    }
    const categoryOrder = ['7天内', '30天内', '一年内', '一年前']
    // 编辑状态
    const editingId = ref<number | null>(null)
    const editingName = ref('')

    // 鼠标悬停状态 - 使用 Set 来存储多个 item 的 hover 状态
    const hoveredItemIds = ref<Set<number>>(new Set())
    // 下拉框打开状态 - 使用 Set 来存储多个 item 的下拉框打开状态
    const openDropdownIds = ref<Set<number>>(new Set())

    // 处理鼠标进入
    const handleMouseEnter = (sessionId: number) => {
      hoveredItemIds.value.add(sessionId)
    }

    // 处理鼠标离开
    const handleMouseLeave = (sessionId: number) => {
      // 如果下拉框没有打开，才移除 hover 状态
      if (!openDropdownIds.value.has(sessionId)) {
        hoveredItemIds.value.delete(sessionId)
      }
    }

    // 处理下拉框打开
    const handleDropdownOpen = (sessionId: number) => {
      openDropdownIds.value.add(sessionId)
    }

    // 处理下拉框关闭
    const handleDropdownClose = (sessionId: number) => {
      openDropdownIds.value.delete(sessionId)
      // 如果鼠标已经移开，移除 hover 状态
      if (!hoveredItemIds.value.has(sessionId)) {
        hoveredItemIds.value.delete(sessionId)
      }
    }

    // 判断是否显示图标
    const shouldShowIcon = (sessionId: number) => {
      return hoveredItemIds.value.has(sessionId) || openDropdownIds.value.has(sessionId)
    }

    const handleEditClick = (item) => {
      editingId.value = item.sessionId
      editingName.value = item.sessionName
    }

    const finishEdit = async (item) => {
      if (!editingName.value.trim()) {
        editingId.value = null
        return
      }
      try {
        await setNameApi({
          sessionId: item.sessionId,
          sessionName: editingName.value.trim(),
        })
        // 本地更新名称
        item.sessionName = editingName.value.trim()
        ElMessage.success('重命名成功')
        emit('refreshList')
      } catch (err) {
        ElMessage.error('重命名失败，请稍后重试')
      } finally {
        editingId.value = null
      }
    }

    const handleDelete = async (item) => {
      try {
        await ElMessageBox.confirm('确定删除该会话吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await deteleNameApi(item.sessionId)
        ElMessage.success('删除成功')
        emit('refreshList')
      } catch (err) {
        // 用户取消或接口异常
      }
    }

    watch(keyword, (v) => {
      emit('update:modelValue', v)
    })
    watch(
      () => props.resetKey,
      () => {
        selectedSessionId.value = null
      },
    )

    // 缩略的tips展示 - 使用 sessionId 作为 key
    const overflowMap = ref<Record<number, boolean>>({})

    // 检测元素是否溢出
    const checkOverflow = (sessionId: number, el: HTMLElement | null) => {
      if (!el) {
        overflowMap.value[sessionId] = false
        return
      }
      const isOver = el.scrollWidth > el.clientWidth
      overflowMap.value[sessionId] = isOver
    }

    // 判断是否溢出
    const isOverflow = (sessionId: number) => {
      return overflowMap.value[sessionId] === true
    }

    return () => (
      <>
        {props.collapsed && (
          <div class={styles['sidebar-expand-btn']} onClick={toggleSidebar}>
            <IconFont name='right_panel_open' class={styles['collapse-icon']}></IconFont>
          </div>
        )}
        {!props.collapsed && (
          <div class={styles['ai-chat-sidebar']}>
            <div class={styles['sidebar-content']}>
              <div class={styles['sidebar-actions']}>
                <el-button type='primary' onClick={createNewChat}>
                  <el-icon>
                    <Plus />
                  </el-icon>
                  <span>新建对话</span>
                </el-button>
                <div class={styles['collapse-icon']} onClick={toggleSidebar}>
                  <IconFont name='right_panel_close'></IconFont>
                </div>
              </div>
              <el-input
                v-model={keyword.value}
                placeholder='搜索对话名称'
                clearable
                v-slots={{
                  prefix: () => <Search />,
                }}
              />
              {/* 历史对话记录 */}
              <el-scrollbar class={styles['chat-history-scrollbar']}>
                {Object.keys(groupedByCategory.value).length === 0 && (
                  <div class={styles['no-history']}>暂无历史对话</div>
                )}
                {Object.keys(groupedByCategory.value).length !== 0 &&
                  categoryOrder.map((category) => {
                    const items = groupedByCategory.value[category] || []
                    // 只显示有数据的分类
                    if (items.length === 0) {
                      return null
                    }
                    return (
                      <div key={category} class={styles['chatHistoryCategory']}>
                        <div class={styles['chatHistoryCategoryTitle']}>{category}：</div>
                        {items.map((item) => (
                          <div
                            key={item.sessionId}
                            class={[
                              styles['chatHistoryItem'],
                              selectedSessionId.value === item.sessionId ? styles['active'] : '',
                            ]}
                            onMouseenter={() => handleMouseEnter(item.sessionId)}
                            onMouseleave={() => handleMouseLeave(item.sessionId)}
                            onClick={() => handleSelectHistory(item.sessionId)}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <div
                                class={styles['chat-history-title']}
                                style={{ flex: 1 }}
                                ref={(el) => {
                                  // 这里用父级 div（带省略号样式）来判断是否溢出
                                  if (el) {
                                    checkOverflow(item.sessionId, el)
                                  }
                                }}
                              >
                                {editingId.value === item.sessionId ? (
                                  <el-input
                                    modelValue={editingName.value}
                                    size='small'
                                    autofocus
                                    onClick={(e) => e.stopPropagation()}
                                    maxlength={100}
                                    onUpdate:modelValue={(val) => (editingName.value = val)}
                                    onBlur={() => finishEdit(item)}
                                    onKeydown={(e) => {
                                      if (e.key === 'Enter') {
                                        finishEdit(item)
                                      }
                                    }}
                                  />
                                ) : isOverflow(item.sessionId) ? (
                                  <ElPopover
                                    content={item.sessionName}
                                    effect='dark'
                                    width={300}
                                    placement='top'
                                    v-slots={{
                                      reference: () => <span>{item.sessionName}</span>,
                                    }}
                                  ></ElPopover>
                                ) : (
                                  <span>{item.sessionName}</span>
                                )}
                              </div>
                              <ElDropdown
                                hideOnClick={false}
                                onVisibleChange={(visible: boolean) => {
                                  if (visible) {
                                    handleDropdownOpen(item.sessionId)
                                  } else {
                                    handleDropdownClose(item.sessionId)
                                  }
                                }}
                                v-slots={{
                                  dropdown: () => (
                                    <el-dropdown-menu>
                                      <el-dropdown-item onClick={() => handleEditClick(item)}>
                                        编辑
                                      </el-dropdown-item>
                                      <el-dropdown-item divided onClick={() => handleDelete(item)}>
                                        删除
                                      </el-dropdown-item>
                                    </el-dropdown-menu>
                                  ),
                                }}
                              >
                                <ElButton
                                  link
                                  class={styles.iconButton}
                                  style={{
                                    opacity: shouldShowIcon(item.sessionId) ? 1 : 0,
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <IconFont name='more_vert' />
                                </ElButton>
                              </ElDropdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
              </el-scrollbar>
            </div>
          </div>
        )}
      </>
    )
  },
})
