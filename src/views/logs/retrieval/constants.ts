import { IndexType } from '~/api/logs/retrieval/constants'

/** 索引类型 */
export const indexOptions = [
  { label: '索引模版', value: IndexType.SEARCH_INDEX_TYPE_TEMPLATE },
  { label: '原始索引', value: IndexType.SEARCH_INDEX_TYPE_ORIGINAL },
]
