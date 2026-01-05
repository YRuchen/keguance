// export interface DataQueryResponse {
//   /**
//    * The response data.  When streaming, this may be empty
//    * or a partial result set
//    */
//   data: DataQueryResponseData[];

//   /**
//    * When returning multiple partial responses or streams
//    * Use this key to inform Grafana how to combine the partial responses
//    * Multiple responses with same key are replaced (latest used)
//    */
//   key?: string;

//   /**
//    * Optionally include error info along with the response data
//    * @deprecated use errors instead -- will be removed in Grafana 10+
//    */
//   error?: DataQueryError;

//   /**
//    * Optionally include multiple errors for different targets
//    */
//   errors?: DataQueryError[];

//   /**
//    * Use this to control which state the response should have
//    * Defaults to LoadingState.Done if state is not defined
//    */
//   state?: LoadingState;

//   /**
//    * traceIds related to the response, if available
//    */
//   traceIds?: string[];
// }