import { LoadingState } from '../../constants'

import type { Field, DataQueryError } from '../common'
import type { QueryResultMeta } from '../res/meta'

export interface QueryResultBase {
  /**
   * Matches the query target refId
   */
  refId?: string

  /**
   * Used by some backend data sources to communicate back info about the execution (generated sql, timing)
   */
  meta?: QueryResultMeta
}

/** 接口出参转换后的数据：data */
export interface DataFrame extends QueryResultBase {
  name?: string
  fields: Field[] // All fields of equal length

  // The number of rows
  length: number
}

/** 接口出参转换后的数据 */
export interface DataQueryResponse {
  /**
   * The response data.  When streaming, this may be empty
   * or a partial result set
   */
  data: DataFrame[]

  /**
   * When returning multiple partial responses or streams
   * Use this key to inform Grafana how to combine the partial responses
   * Multiple responses with same key are replaced (latest used)
   */
  key?: string

  /**
   * Optionally include error info along with the response data
   * @deprecated use errors instead -- will be removed in Grafana 10+
   */
  error?: DataQueryError

  /**
   * Optionally include multiple errors for different targets
   */
  errors?: DataQueryError[]

  /**
   * Use this to control which state the response should have
   * Defaults to LoadingState.Done if state is not defined
   */
  state?: LoadingState

  /**
   * traceIds related to the response, if available
   */
  traceIds?: string[]
}
