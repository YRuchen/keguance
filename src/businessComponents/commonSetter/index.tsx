import { defineComponent, ref, watch } from 'vue'
import { ElPopover, ElButton } from 'element-plus'
import Space from '~/basicComponents/space'
import { pagePreferencesToKeyMap, Common_Page_Preferences_Type } from './constants'
import DraggableList from './components/draggableList'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { IPagePreferenceItem } from '../commonPage/interfaces'

const props = {
  /** 全量用户偏好-筛选项 */
  allVisibleFilterFields: {
    type: Array as PropType<IPagePreferenceItem[]>,
    default: () => ([]),
  },
  /** 全量用户偏好-表格列 */
  allVisibleColumnFields: {
    type: Array as PropType<IPagePreferenceItem[]>,
    default: () => ([]),
  },
}

export default defineComponent({
  name: 'CommonSetter',
  inheritAttrs: true,
  props,
  setup(props, { slots, emit }) {
    const popoverRef = ref()
    const basicFields = ref({
      [pagePreferencesToKeyMap[Common_Page_Preferences_Type.FILTER]]: props.allVisibleFilterFields,
      [pagePreferencesToKeyMap[Common_Page_Preferences_Type.COLUMN]]: props.allVisibleColumnFields,
    })
    watch(() => [props.allVisibleFilterFields, props.allVisibleColumnFields], ([v1, v2]) => {
      basicFields.value = {
        [pagePreferencesToKeyMap[Common_Page_Preferences_Type.FILTER]]: v1,
        [pagePreferencesToKeyMap[Common_Page_Preferences_Type.COLUMN]]: v2,
      }
    }, { immediate: true, deep: true })
    return () => {
      const defaultTsx = () => (
        <Space direction='column' size={0}>  
          <Space align='stretch' size={4}>
            {/* <DraggableList
              fields={basicFields.value[pagePreferencesToKeyMap[Common_Page_Preferences_Type.FILTER]]}
              onUpdate:fields={(fields: IPagePreferenceItem[]) => {
                basicFields.value[pagePreferencesToKeyMap[Common_Page_Preferences_Type.FILTER]] = fields
              }}
            /> */}
            <DraggableList
              fields={basicFields.value[pagePreferencesToKeyMap[Common_Page_Preferences_Type.COLUMN]]}
              onUpdate:fields={(fields: IPagePreferenceItem[]) => {
                basicFields.value[pagePreferencesToKeyMap[Common_Page_Preferences_Type.COLUMN]] = fields
              }}
            />
          </Space>
          <Space justify='center' fill size={0} style={{ padding: '16px 0 0 0' }}>
            <ElButton onClick={() => { popoverRef.value?.hide?.() }}>取消</ElButton>
            <ElButton
              type='primary'
              onClick={() => {
                popoverRef.value?.hide?.()
                emit('confirm', basicFields.value)
              }}
            >确认</ElButton>
          </Space>
        </Space>
      )
      return (
        <ElPopover 
          ref={popoverRef}
          popperClass={styles.container}
          placement='bottom-end' 
          width='fit-content'
          trigger='click'
          v-slots={{
            reference: slots?.reference?.(),
            default: defaultTsx,
          }}
        />
      )
    }
  }
})
