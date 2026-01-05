import { h } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDataSourceListApi, getIndexListApi } from '~/api/logs/retrieval'
import { indexOptions } from './constants'

import type { ComputedRef } from 'vue'
import type { Form, Field } from '@formily/core'
import type { ISchema } from '@formily/vue'

const commonFormatter = (res) => (res.data?.list || [])?.map(v => ({ label: v.name, value: v.id }))
export const getRightPaneSchema = (formRef: ComputedRef<Form>): ISchema => ({
  type: 'object',
  properties: {
    
  },
})
