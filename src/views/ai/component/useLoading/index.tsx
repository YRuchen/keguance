import { h, type VNode } from 'vue'
import styles from './index.module.scss'

/**
 * 返回一个半圆旋转 Loading VNode
 * @param size loading大小，默认 20
 * @param color loading颜色，默认 '#409EFF'
 */
export function useLoading(size = 20, color = '#409EFF'): VNode {
  return h(
    'div',
    {
      class: styles['custom-loading-wrapper'],
      style: 'display: inline-flex; align-items: center;',
    },
    h(
      'svg',
      {
        class: styles.circular,
        viewBox: '0 0 50 50',
        style: `width:${size}px; height:${size}px; margin-right:6px;`,
      },
      h('path', {
        class: styles.path,
        d: 'M25,5 A20,20 0 1,1 24.99,5',
        fill: 'none',
        'stroke-width': 4,
        stroke: color,
        'stroke-linecap': 'round',
      }),
    ),
  )
}
