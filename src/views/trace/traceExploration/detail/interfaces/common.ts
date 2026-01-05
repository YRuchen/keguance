
import { MappingType, FieldType, preferredVisualizationTypes, DataQueryErrorType } from '../constants'

import type { DataFrame } from './dataFrame'
import type { FieldConfig } from './res/field'

/**
 * These are the common properties available to all queries in all datasources.
 * Specific implementations will *extend* this interface, adding the required
 * properties for the given context.
 */
export interface CommonDataQuery {
  /**
   * For mixed data sources the selected datasource is on the query level.
   * For non mixed scenarios this is undefined.
   * TODO find a better way to do this ^ that's friendly to schema
   * TODO this shouldn't be unknown but DataSourceRef | null
   */
  datasource?: unknown;
  /**
   * If hide is set to true, Grafana will filter out the response(s) associated with this query before returning it to the panel.
   */
  hide?: boolean;
  /**
   * Specify the query flavor
   * TODO make this required and give it a default
   */
  queryType?: string;
  /**
   * A unique identifier for the query within the list of targets.
   * In server side expressions, the refId is used as a variable name to identify results.
   * By default, the UI will assign A->Z; however setting meaningful names may be useful.
   */
  refId: string;
}

export type DecimalCount = number | null | undefined;
export interface ValueMappingResult {
  text?: string;
  color?: string;
  icon?: string;
  index?: number;
}
export interface RangeMapOptions {
  from: number | null; // changed from string
  to: number | null;
  result: ValueMappingResult;
}
export interface ValueMap {
  type: MappingType.ValueToText;
  options: Record<string, ValueMappingResult>
}
export interface RangeMap {
  type: MappingType.RangeToText;
  options: RangeMapOptions
}
export interface RegexMap {
  type: MappingType.RegexToText;
}
export interface SpecialValueMap {
  type: MappingType.SpecialValue;
}
export type ValueMapping = ValueMap | RangeMap | RegexMap | SpecialValueMap;
export interface Threshold {
  value: number;
  color: string;
  /** Warning, Error, LowLow, Low, OK, High, HighHigh etc */
  state?: string;
}
export type FieldColorSeriesByMode = 'min' | 'max' | 'last';
/** DataLink */

/** res在用的DataQuery */
export interface DataQuery {
  /**
   * Unique, guid like, string (used only in explore mode)
   */
  key?: string;

  // TODO remove explicit nulls
  datasource?: {
    /**
     *  Datasource API version
     */
    apiVersion?: string;
    /**
     * The plugin type-id
     */
    type?: string;
    /**
     * Specific datasource instance
     */
    uid?: string;
  } | null;
  /**
   * If hide is set to true, Grafana will filter out the response(s) associated with this query before returning it to the panel.
   */
  hide?: boolean;
  /**
   * Specify the query flavor
   * TODO make this required and give it a default
   */
  queryType?: string;
  /**
   * A unique identifier for the query within the list of targets.
   * In server side expressions, the refId is used as a variable name to identify results.
   * By default, the UI will assign A->Z; however setting meaningful names may be useful.
   */
  refId: string;
}
/**
 * Describes where a specific data frame field is located within a
 * dataset of type DataFrame[]
 *
 * @internal -- we will try to make this unnecessary
 */
export interface FormattedValue {
  text: string;
  prefix?: string;
  suffix?: string;
}
export interface DisplayValue extends FormattedValue {
  /**
   *  Use isNaN to check if it is a real number
   */
  numeric: number;
  /**
   *  0-1 between min & max
   */
  percent?: number;
  /**
   *  0-1 percent change across range
   */
  percentChange?: number;
  /**
   *  Color based on mappings or threshold
   */
  color?: string;
  /**
   *  Icon based on mappings or threshold
   */
  icon?: string;
  title?: string;

  /**
   * Used in limited scenarios like legend reducer calculations
   */
  description?: string;
}

/** dataFrame */
export interface DataQueryError {
  data?: {
    /**
     * Short information about the error
     */
    message?: string
    /**
     * Detailed information about the error. Only returned when app_mode is development.
     */
    error?: string
  }
  message?: string
  status?: number
  statusText?: string
  refId?: string
  traceId?: string
  type?: DataQueryErrorType
}
/** dataFrame */
/** dataFrame的field */
export interface NumericRange {
  min?: number | null;
  max?: number | null;
  delta: number;
}
export interface DataFrameFieldIndex {
  frameIndex: number;
  fieldIndex: number;
}
/**
 * These represents the display value with the longest title and text.
 * Used to align widths and heights when displaying multiple DisplayValues
 */
export interface DisplayValueAlignmentFactors extends FormattedValue {
  title?: string;
}
export interface HideSeriesConfig {
  legend: boolean;
  tooltip: boolean;
  viz: boolean;
}
export interface FieldState {
  /**
   * An appropriate name for the field (does not include frame info)
   */
  displayName?: string | null;

  /**
   * Cache of reduced values
   */
  calcs?: Record<string, any>;

  /**
   * The numeric range for values in this field.  This value will respect the min/max
   * set in field config, or when set to `auto` this will have the min/max for all data
   * in the response
   */
  range?: NumericRange;

  /**
   * Appropriate values for templating
   */
  scopedVars?: ScopedVars;

  /**
   * Series index is index for this field in a larger data set that can span multiple DataFrames
   * Useful for assigning color to series by looking up a color in a palette using this index
   */
  seriesIndex?: number;

  /**
   * Location of this field within the context frames results
   *
   * @internal -- we will try to make this unnecessary
   */
  origin?: DataFrameFieldIndex;

  /**
   * Boolean value is true if field is in a larger data set with multiple frames.
   * This is only related to the cached displayName property above.
   */
  multipleFrames?: boolean;

  /**
   * Boolean value is true if a null filling threshold has been applied
   * against the frame of the field. This is used to avoid cases in which
   * this would applied more than one time.
   */
  nullThresholdApplied?: boolean;

  /**
   * Can be used by visualizations to cache max display value lengths to aid alignment.
   * It's up to each visualization to calculate and set this.
   */
  alignmentFactors?: DisplayValueAlignmentFactors;

  /**
   * This is the current ad-hoc state of whether this series is hidden in viz, tooltip, and legend.
   *
   * Currently this will match field.config.custom.hideFrom because fieldOverrides applies the special __system
   * override to the actual config during toggle via legend. This should go away once we have a unified system
   * for layering ad hoc field overrides and options but still being able to get the stateless fieldConfig and panel options
   */
  hideFrom?: HideSeriesConfig;
}
export type DisplayProcessor = (value: unknown, decimals?: DecimalCount) => DisplayValue;
export interface ValueLinkConfig {
  /**
   * Result of field reduction
   */
  calculatedValue?: DisplayValue;
  /**
   * Index of the value row within Field. Should be provided only when value is not a result of a reduction
   */
  valueRowIndex?: number;
}
export type LinkTarget = '_blank' | '_self' | undefined;
export interface DataSourceRef {
  /**
   *  Datasource API version
   */
  apiVersion?: string;
  /**
   * The plugin type-id
   */
  type?: string;
  /**
   * Specific datasource instance
   */
  uid?: string;
}
/** 时间范围 */
export interface TimeRange {
  // from: DateTime;
  // to: DateTime;
  // raw: RawTimeRange;
  // TODO： 用dayjs更好
}
export interface LinkModel<T = any> {
  href: string;
  title: string;
  target: LinkTarget;
  origin: T;

  // When a click callback exists, this is passed the raw mouse|react event
  onClick?: (e: any, origin?: any) => void;
  oneClick?: boolean;

  /**
   * @alpha
   */
  interpolatedParams?: {
    query?: {
      /**
       * Unique, guid like, string (used only in explore mode)
       */
      key?: string;

      // TODO remove explicit nulls
      datasource?: DataSourceRef | null;
    };
    timeRange?: TimeRange;
  };
}
/** 接口出参转换后的数据：Field */
export interface Field<T = any> {
  /**
   * Name of the field (column)
   */
  name: string;
  /**
   *  Field value type (string, number, etc)
   */
  type: FieldType;
  /**
   *  Meta info about how field and how to display it
   */
  config: FieldConfig;

  /**
   * The raw field values
   */
  values: T[];

  /**
   * When type === FieldType.Time, this can optionally store
   * the nanosecond-precision fractions as integers between
   * 0 and 999999.
   */
  nanos?: number[];

  labels?: Record<string, string>;

  /**
   * Cached values with appropriate display and id values
   */
  state?: FieldState | null;

  /**
   * Convert a value for display
   */
  display?: DisplayProcessor;

  /**
   * Get value data links with variables interpolated
   */
  getLinks?: (config: ValueLinkConfig) => Array<LinkModel<Field>>;
}
/** dataFrame的field */

export interface DataContextScopedVar {
  value: {
    data: DataFrame[];
    frame: DataFrame;
    field: Field;
    rowIndex?: number;
    frameIndex?: number;
    calculatedValue?: DisplayValue;
  };
}
export interface ScopedVar<T = any> {
  text?: any;
  value: T;
}
export interface ScopedVars {
  __dataContext?: DataContextScopedVar;
  [key: string]: ScopedVar | undefined;
}
export type InterpolateFunction = (value: string, scopedVars?: ScopedVars, format?: string | Function) => string;
/**
 * Callback info for DataLink click events
 */
export interface DataLinkClickEvent<T = any> {
  origin: T;
  replaceVariables: InterpolateFunction | undefined;
  e?: any; // mouse|react event
}
/** dataFrame在用的DataQuery */
export interface DataFrameDataQuery extends CommonDataQuery {
  /**
   * Unique, guid like, string (used only in explore mode)
   */
  key?: string;

  // TODO remove explicit nulls
  datasource?: DataSourceRef | null;
}
export type PreferredVisualisationType = (typeof preferredVisualizationTypes)[number];
export interface TraceSearchTag {
  id: string;
  key?: string;
  operator: string;
  value?: string;
}
export interface TraceSearchProps {
  serviceName?: string;
  serviceNameOperator: string;
  spanName?: string;
  spanNameOperator: string;
  from?: string;
  fromOperator: string;
  to?: string;
  toOperator: string;
  tags: TraceSearchTag[];
  query?: string;
  matchesOnly: boolean;
  criticalPathOnly: boolean;
}
export interface ExploreTracePanelState {
  spanId?: string;
  spanFilters?: TraceSearchProps;
}
export interface ExploreLogsPanelState {
  id?: string;
  columns?: Record<number, string>;
  visualisationType?: 'table' | 'logs';
  labelFieldName?: string;
  // Used for logs table visualisation, contains the refId of the dataFrame that is currently visualized
  refId?: string;
  displayedFields?: string[];
}
export interface ExplorePanelsState extends Partial<Record<PreferredVisualisationType, {}>> {
  trace?: ExploreTracePanelState;
  logs?: ExploreLogsPanelState;
}
/** @internal */
export interface InternalDataLink<T extends DataFrameDataQuery = any> {
  query: T | ((options: { replaceVariables: InterpolateFunction; scopedVars: ScopedVars }) => T);
  datasourceUid: string;
  datasourceName: string; // used as a title if `DataLink.title` is empty
  panelsState?: ExplorePanelsState;
  range?: TimeRange;
}
export interface DataLink<T extends DataQuery = any> {
  title: string;
  targetBlank?: boolean;

  // 3: The URL if others did not set it first
  url: string;

  // 2: If exists, use this to construct the URL
  // Not saved in JSON/DTO
  onBuildUrl?: (event: DataLinkClickEvent) => string;

  // 1: If exists, handle click directly
  // Not saved in JSON/DTO
  onClick?: (event: DataLinkClickEvent) => void;

  // If dataLink represents internal link this has to be filled. Internal link is defined as a query in a particular
  // data source that we want to show to the user. Usually this results in a link to explore but can also lead to
  // more custom onClick behaviour if needed.
  // @internal and subject to change in future releases
  internal?: InternalDataLink<T>;

  // origin?: DataLinkConfigOrigin;
  // meta?: {
  //   correlationData?: ExploreCorrelationHelperData;
  //   transformations?: DataLinkTransformationConfig[];
  // };

  oneClick?: boolean;
}
/** DataLink */