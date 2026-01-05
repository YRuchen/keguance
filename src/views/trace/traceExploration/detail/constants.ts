/** 基础信息字段 */
export const basicDataField = [
  'spanID', 
  'startTime', 
  'serviceName', 
]

/** 基础信息字段排序 */
export const basicDataFieldSort = [
  'spanID', 
  'startTime', 
  'serviceName', 
]

/** 基础信息字段英文到中文映射 */
export const basicDataFieldMap = {
  /** spanID */
  spanID: 'spanID',
  /** pan开始时间 */
  startTime: 'span开始时间',
  /** 服务名 */
  serviceName: '服务名',
  /** 请求返回码 */
  statusCode: '请求返回码',
}

/** common */
/**
 *  Display mode
 */
export enum ThresholdsMode {
  Absolute = 'absolute',
  /**
   *  between 0 and 1 (based on min/max)
   */
  Percentage = 'percentage',
}
export enum MappingType {
  ValueToText = 'value', // was 1
  RangeToText = 'range', // was 2
  RegexToText = 'regex',
  SpecialValue = 'special',
}
export enum FieldColorModeId {
  Thresholds = 'thresholds',
  PaletteClassic = 'palette-classic',
  PaletteClassicByName = 'palette-classic-by-name',
  PaletteSaturated = 'palette-saturated',
  ContinuousGrYlRd = 'continuous-GrYlRd',
  ContinuousRdYlGr = 'continuous-RdYlGr',
  ContinuousBlYlRd = 'continuous-BlYlRd',
  ContinuousYlRd = 'continuous-YlRd',
  ContinuousBlPu = 'continuous-BlPu',
  ContinuousYlBl = 'continuous-YlBl',
  ContinuousBlues = 'continuous-blues',
  ContinuousReds = 'continuous-reds',
  ContinuousGreens = 'continuous-greens',
  ContinuousPurples = 'continuous-purples',
  Fixed = 'fixed',
  Shades = 'shades',
}
export enum NullValueMode {
  Null = 'null',
  Ignore = 'connected',
  AsZero = 'null as zero',
}
/** common */
export const ENTITY_MAP = {
  /** （暂不消费） */
  Inf: Infinity,
  /** （暂不消费） */
  NegInf: -Infinity,
  /** （暂不消费） */
  Undef: undefined,
  /** （暂不消费） */
  NaN: NaN,
};

/** meta */
export enum DataFrameType {
  TimeSeriesWide = 'timeseries-wide',
  TimeSeriesLong = 'timeseries-long',

  /** @deprecated in favor of TimeSeriesMulti */
  TimeSeriesMany = 'timeseries-many',

  TimeSeriesMulti = 'timeseries-multi',

  /** Numeric types: https://grafana.com/developers/dataplane/numeric */
  NumericWide = 'numeric-wide',
  NumericMulti = 'numeric-multi',
  NumericLong = 'numeric-long',

  /** Logs types: https://grafana.com/developers/dataplane/logs */
  LogLines = 'log-lines',

  /** Directory listing */
  DirectoryListing = 'directory-listing',

  /**
   * First field is X, the rest are ordinal values used as rows in the heatmap
   */
  HeatmapRows = 'heatmap-rows',

  /**
   * Explicit fields for:
   *  xMin, yMin, count, ...
   *
   * All values in the grid exist and have regular spacing
   *
   * If the y value is actually ordinal, use `meta.custom` to specify the bucket lookup values
   */
  HeatmapCells = 'heatmap-cells',

  /**
   * Explicit fields for:
   *  xMin, xMax, count
   */
  Histogram = 'histogram',
}
/** meta */

/** fields */
export enum FieldType {
  time = 'time', // or date
  number = 'number',
  string = 'string',
  boolean = 'boolean',

  // Used to detect that the value is some kind of trace data to help with the visualisation and processing.
  trace = 'trace',
  geo = 'geo',
  enum = 'enum',
  other = 'other', // Object, Array, etc
  frame = 'frame', // DataFrame

  // @alpha Nested DataFrames. This is for example used with tables where expanding a row will show a nested table.
  // The value should be DataFrame[] even if it is a single frame.
  nestedFrames = 'nestedFrames',
}
export enum ActionType {
  Fetch = 'fetch',
  Infinity = 'infinity',
}
export enum HttpRequestMethod {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export enum ActionVariableType {
  String = 'string',
}
/** fields */

export const preferredVisualizationTypes = [
  'graph',
  'table',
  'logs',
  'trace',
  'nodeGraph',
  'flamegraph',
  'rawPrometheus',
] as const;

/** dataFrame的错误信息 */
export enum DataQueryErrorType {
  Cancelled = 'cancelled',
  Timeout = 'timeout',
  Unknown = 'unknown',
}
export enum LoadingState {
  NotStarted = 'NotStarted',
  Loading = 'Loading',
  Streaming = 'Streaming',
  Done = 'Done',
  Error = 'Error',
}
/** dataFrame的报错 */
