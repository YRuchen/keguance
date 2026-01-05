// components/FastFilterPanel.tsx
import { defineComponent, PropType, ref, computed, watch } from 'vue'
import { ElCheckbox, ElCheckboxGroup, ElInput, ElIcon, ElCollapse, ElCollapseItem } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { fastFilterTypeToLabelMap } from './constants'
import styles from './index.module.scss'

export interface FastFilterItem {
  name: string
  value: number
}

export interface FastFilterData {
  [key: string]: FastFilterItem[]
}

export default defineComponent({
  name: 'FastFilterPanel',
  props: {
    data: {
      type: Object as PropType<FastFilterData>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Record<string, string[]>>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const searchKeyword = ref('')
    const activeNames = ref<string[]>(Object.keys(props.data))
    
    // 过滤后的数据（根据搜索关键字）
    const filteredData = computed(() => {
      if (!searchKeyword.value.trim()) {
        return props.data
      }
      
      const keyword = searchKeyword.value.trim().toLowerCase()
      const filtered: FastFilterData = {}
      
      Object.keys(props.data).forEach((key) => {
        const items = props.data[key]
        const matchedItems = items.filter(item => 
          item.name.toLowerCase().includes(keyword)
        )
        if (matchedItems.length > 0) {
          filtered[key] = matchedItems
        }
      })
      
      return filtered
    })
    
    // 处理复选框变化
    const handleCheckboxChange = (key: string, checkedValues: string[]) => {
      const currentValue = { ...props.modelValue }
      currentValue[key] = checkedValues
      emit('update:modelValue', currentValue)
      emit('change', currentValue)
    }
    
    // 获取某个组的选中值
    const getCheckedValues = (key: string): string[] => {
      return props.modelValue[key] || []
    }
    
    // 获取某个组的所有值（用于全选）
    const getAllValues = (key: string): string[] => {
      return props.data[key]?.map(item => item.name) || []
    }
    
    // 检查是否全选
    const isAllChecked = (key: string): boolean => {
      const checked = getCheckedValues(key)
      const all = getAllValues(key)
      return checked.length === all.length && all.length > 0
    }
    
    // 处理全选/取消全选
    const handleToggleAll = (key: string) => {
      const all = getAllValues(key)
      const checked = getCheckedValues(key)
      if (isAllChecked(key)) {
        // 取消全选
        handleCheckboxChange(key, [])
      } else {
        // 全选
        handleCheckboxChange(key, [...all])
      }
    }
    
    // 监听数据变化，更新手风琴的展开项
    watch(() => props.data, (newData) => {
      activeNames.value = Object.keys(newData)
    }, { immediate: true })
    
    // 检查是否有数据
    const hasData = computed(() => {
      const dataKeys = Object.keys(props.data)
      return dataKeys.length > 0 && dataKeys.some(key => {
        const items = props.data[key]
        return items && items.length > 0
      })
    })
    
    return () => (
      <div class={styles.container}>
        <div class={styles.title}>快速筛查</div>
        {hasData.value ? (
          <>
            <div class={styles.fastFilterSearch}>
              <ElInput
                v-model={searchKeyword.value}
                placeholder='搜索选项'
                clearable
              >
                {{
                  prefix: () => (
                    <ElIcon>
                      <Search />
                    </ElIcon>
                  ),
                }}
              </ElInput>
            </div>
            <ElCollapse v-model={activeNames.value} class={styles.fastFilterCollapse}>
              {Object.keys(filteredData.value).map((key) => {
                const items = filteredData.value[key]
                const checkedValues = getCheckedValues(key)
                const allValues = getAllValues(key)
                const hasItems = items && items.length > 0
                
                return (
                  <ElCollapseItem key={key} name={key} title={key}>
                    {{
                      title: () => (
                        <div class={styles.fastFilterGroupTitle}>
                          <span>{fastFilterTypeToLabelMap[key]}</span>
                        </div>
                      ),
                      default: () => (
                        <div class={styles.fastFilterGroupContent}>
                          {hasItems ? (
                            <ElCheckboxGroup
                              modelValue={checkedValues}
                              onChange={(values: string[]) => handleCheckboxChange(key, values)}
                              class={styles.checkboxList}
                            >
                              {items.map((item) => (
                                <ElCheckbox
                                  key={item.name}
                                  label={item.name}
                                  value={item.name}
                                >
                                  {item.name} ({item.value})
                                </ElCheckbox>
                              ))}
                            </ElCheckboxGroup>
                          ) : (
                            <div class={styles.itemEmpty}>暂无数据</div>
                          )}
                        </div>
                      ),
                    }}
                  </ElCollapseItem>
                )
              })}
            </ElCollapse>
          </>
        ) : (
          <div class={styles.empty}>暂无数据</div>
        )}
      </div>
    )
  },
})

