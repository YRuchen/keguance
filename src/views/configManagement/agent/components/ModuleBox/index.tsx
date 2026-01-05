import { defineComponent, ref, watch } from 'vue'
import Space from '~/basicComponents/space'
import styles from './index.module.scss'
import Logo from '@/assets/image/logo.png'
const props = {
  // 传入的数据
  data: {
    type: Object,
    default: () => ({}),
  },
  selectedValues: {
    type: Object,
    default: () => ({}),
  },
  // 大卡片
  selectedItemName: {
    type: String,
    default: '',
  },
  // 控制是否显示标题
  showName: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  name: 'InfoPanel',
  props,
  setup(props, { emit, slots }) {
    return () => {
      return (
        <Space direction='column' fill align='left' size={8}>
          {props.showName && (
            <Space direction='row' fill align='left' size={0}>
              <span class={styles.block}></span>
              <span class={styles.name}>{props.data?.name}</span>
            </Space>
          )}
          <Space class={styles.cardContainer} direction='row' align='left' size={80}>
            {props.data?.moduleList.map((item, index) => (
              <div key={index}>
                <el-card
                  class={`${styles.card} ${
                    props.selectedItemName == item.name ||
                    props.selectedValues[item.label]?.length > 0
                      ? styles.selected
                      : ''
                  }`}
                  shadow='hover'
                  key={index}
                  onClick={() => emit('update:handleIconClick', item)}
                >
                  <Space
                    direction='row'
                    align='center'
                    justify='center'
                    size={20}
                    class={styles.cardContent}
                  >
                    {item.svgName && (
                      <div>
                        <svg-icon
                          iconClass={item.svgName}
                          style='font-size: 70px; cursor: pointer; width: 70px;'
                        />
                      </div>
                    )}
                    <span class={styles.name}>{item.name}</span>
                  </Space>
                </el-card>
                <p>{item.descripe}</p>
                {item?.itemList?.length > 0 && (
                  <el-checkbox-group
                    modelValue={props.selectedValues[item.label] ?? []}
                    onUpdate:modelValue={(val) => {
                      emit('update:selectedValues', {
                        ...props.selectedValues,
                        [item.label]: val,
                      })
                    }}
                    size='large'
                  >
                    {item.itemList?.map((v) => (
                      <el-checkbox label={v} value={v} border key={v} class={styles.marginBottom} />
                    ))}
                  </el-checkbox-group>
                )}
              </div>
            ))}
          </Space>
        </Space>
      )
    }
  },
})
