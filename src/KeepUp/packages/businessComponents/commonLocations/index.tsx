import { defineComponent, watch } from 'vue'
import { useLocations } from './useLocations'
import { valueKey } from './constants'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { ILocationItem } from './interfaces'

const props = {
  /** value */
  value: {
    type: Array as PropType<string[]>,
    default: () => ([]),
  },
  /** 主要用于做数据回显 */
  options: {
    type: Array as PropType<ILocationItem[]>,
    default: () => ([]),
  },
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'Locations',
  props,
  setup(props, { emit }) {
    const {
      locations,
      allLocations,
    } = useLocations(props)

    /** 配合formily的value/change模式 */
    watch(() => allLocations.value.selectedChildren, (val) => {
      emit('change', val)
    })
    
    return () => {
      return (
        <el-space class={styles.container} direction='column' alignment='space-between' fill={true} style={{ padding: '0 16px' }}>
          {
            Object.entries(locations.value)
              .sort(([aKey]) => aKey === 'all' ? -1 : 0)
              .map(([k, v]) => (
                <div 
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between'
                  }}
                >
                  <el-checkbox
                    v-model={v.isAllChecked}
                    indeterminate={v.isHalfChecked}
                    disabled={props.disabled}
                    onChange={v.onChange}
                  >{v.label}</el-checkbox>
                  <el-checkbox-group
                    v-model={v.selectedChildren}
                    disabled={props.disabled}
                    style={{
                      width: 'calc(100% - 132px - 8px)'
                    }}
                  >
                    {v.children.map(v1 => (
                      <el-checkbox 
                        key={v1.label} 
                        label={v1.label} 
                        value={v1[valueKey]} 
                        {...(v.label === '全选' ? { indeterminate: v1.isHalfChecked } : {})}
                        onChange={v1.onChange}
                      >{v1.label}</el-checkbox>
                    ))}
                  </el-checkbox-group>
                </div>
              ))
          }
        </el-space>
      )
    }
  }
})
