import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'
import { Promotion, CaretRight } from '@element-plus/icons-vue'
import { RouterKey, routeKeyMap } from '../../../constants'
import AppLink from '../link'
import DisabledWrapper from '../../disabledWrapper'
import styles from './index.module.scss'

import type { PropType } from 'vue'
import type { IRouteRecordRaw } from '~/interfaces/common'

const props = {
  /** 单个路由 */
  item: {
    type: Object as PropType<IRouteRecordRaw>,
    required: true,
  },
}

export default defineComponent({
  name: 'SubItem',
  props,
  setup(props) {
    const router = useRouter()
    const hasOneShowingChild = (children: IRouteRecordRaw[] = []) => {
      const showingChildren = children.filter(v => !v.meta?.hidden) // 显示的子菜单
      return [1, 0].includes(showingChildren.length)
    }
    const appLinkTsx = () => {
      const icon = props.item.meta?.icon
      const elMenuItem = <ElMenuItem
        class={[props.item.meta?.disabledInMenu && ['is-disabled', styles.disabled]]}
        index={props.item[routeKeyMap[RouterKey.NAME]]}
        onClick={() => !props.item.meta?.disabledInMenu && props.item?.meta?.action?.({ router })}
        v-slots={{
          title: () => (props.item.meta?.title)
        }}
      >
        <ElIcon size={20}>
          <icon />
        </ElIcon>
      </ElMenuItem>
      return (
        <DisabledWrapper
          visible={props.item.meta?.disabledInMenu}
          v-slots={{
            default: () => (
              props.item?.meta
                && (
                props.item?.meta?.action
                  ? elMenuItem
                  : <AppLink
                    {
                      ...(
                        props.item.meta?.disabledInMenu
                          ? {
                            class: [props.item.meta?.disabledInMenu && ['is-disabled', styles.disabled]]
                          }
                          : { 
                            to: props.item[routeKeyMap[RouterKey.NAME]],
                          }
                      )
                    }
                  >
                    {elMenuItem}
                  </AppLink>
              )
            )
          }}
        />
      )
    }
    const Icon = (props.item.meta?.icon || Promotion) as typeof Promotion
    const subMenuTsx = () => (
      <DisabledWrapper
        visible={props.item.meta?.disabledInMenu}
        v-slots={{
          default: () => (
            <ElSubMenu
              class={[props.item.meta?.disabledInMenu && ['is-disabled', styles.disabled]]}
              index={props.item[routeKeyMap[RouterKey.NAME]]}
              expandOpenIcon={CaretRight}
              expandCloseIcon={CaretRight}
              popper-style={{
                borderRadius: '8px',
                backgroundColor: '#e6edfa',
              }}
              teleported
              v-slots={{
                title: () => (
                  <>
                    <ElIcon size={20}> <Icon /></ElIcon>
                    <span>{ props.item.meta?.title }</span>
                  </>
                )
              }}
            >
              {
                props.item.children.map(v => (
                  <subItem key={v[routeKeyMap[RouterKey.NAME]]} item={v} />
                ))
              }
            </ElSubMenu>
          )
        }}
      />
    )
    return () => (
      (!props.item.meta?.hidden)
        ? (
            (!props.item.meta?.alwaysShow && hasOneShowingChild(props.item.children) || props.item.meta?.level >= 2)
              ? appLinkTsx()
              : subMenuTsx()
          )
        : null
    )
  }
})
