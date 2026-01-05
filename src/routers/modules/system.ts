import { defineAsyncComponent } from 'vue'

import type { IRouteRecordRaw } from '~/interfaces/common'

const systemRouter: IRouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/basicInfo',
    meta: { 
      title: '账户信息', 
      level: 1, 
      hidden: true,
    },
    children: [
      {
        path: 'basicInfo',
        component: defineAsyncComponent(() => import('~/views/system/basicInfo/index.vue')),
        name: 'basicInfo',
        meta: { title: '账户信息', level: 2 },
      },
    ],
  },
]
export default systemRouter
