import {
  ThresholdsMode,
  FieldColorModeId,
  NullValueMode,
  DataFrameType,
} from '../../constants'

import type { 
  DecimalCount, 
  ValueMapping, 
  Threshold, 
  FieldColorSeriesByMode,
  DataLink,
} from '../common'

/**
 *  Config that is passed to the ThresholdsEditor
 */
export interface ThresholdsConfig {
  mode: ThresholdsMode;
  /** Must be sorted by 'value', first value is always -Infinity */
  steps: Threshold[];
}
export interface FieldColor {
  /** The main color scheme mode */
  mode: FieldColorModeId | string;
  /** Stores the fixed color value if mode is fixed */
  fixedColor?: string;
  /** Some visualizations need to know how to assign a series color from by value color schemes */
  seriesBy?: FieldColorSeriesByMode;
}
export interface QueryResultMetaStat {
  value: number;
  /**
   * The display value for this field.  This supports template variables blank is auto.
   * If you are a datasource plugin, do not set this. Use `field.value` and if that
   * is not enough, use `field.config.displayNameFromDS`.
   */
  displayName?: string;

  /**
   * This can be used by data sources that need to customize how values are named.
   * When this property is configured, this value is used rather than the default naming strategy.
   */
  displayNameFromDS?: string;

  /**
   * Human readable field metadata
   */
  description?: string;

  /**
   * An explicit path to the field in the datasource.  When the frame meta includes a path,
   * This will default to `${frame.meta.path}/${field.name}
   *
   * When defined, this value can be used as an identifier within the datasource scope, and
   * may be used to update the results
   */
  path?: string;

  /**
   * True if data source can write a value to the path.  Auth/authz are supported separately
   */
  writeable?: boolean;

  /**
   * True if data source field supports ad-hoc filters
   */
  filterable?: boolean;

  // Numeric Options
  unit?: string;
  decimals?: DecimalCount; // Significant digits (for display)
  min?: number | null;
  max?: number | null;

  // Interval indicates the expected regular step between values in the series.
  // When an interval exists, consumers can identify "missing" values when the expected value is not present.
  // The grafana timeseries visualization will render disconnected values when missing values are found it the time field.
  // The interval uses the same units as the values.  For time.Time, this is defined in milliseconds.
  interval?: number | null;

  // Convert input values into a display string
  mappings?: ValueMapping[];

  // Map numeric values to states
  thresholds?: ThresholdsConfig;

  // Map values to a display color
  color?: FieldColor;

  // Used when reducing field values
  nullValueMode?: NullValueMode;

  // The behavior when clicking on a result
  links?: DataLink[];

  // actions?: Action[];

  // // Alternative to empty string
  // noValue?: string;

  // // The field type may map to specific config
  // type?: FieldTypeConfig;

  // // Panel Specific Values
  // custom?: TOptions;

  // // Calculate min max per field
  // fieldMinMax?: boolean;
}

/**
 * QueryResultMetaNotice is a structure that provides user notices for query result data
 * @public
 */
export interface QueryResultMetaNotice {
  /**
   * Specify the notice severity
   */
  severity: 'info' | 'warning' | 'error';

  /**
   * Notice descriptive text
   */
  text: string;

  /**
   * An optional link that may be displayed in the UI.
   * This value may be an absolute URL or relative to grafana root
   */
  link?: string;

  /**
   * Optionally suggest an appropriate tab for the panel inspector
   */
  inspect?: 'meta' | 'error' | 'data' | 'stats';
}
/**
 * Should be kept in sync with https://github.com/grafana/grafana-plugin-sdk-go/blob/main/data/frame_meta.go
 * @public
 */
export interface QueryResultMeta {
  type?: DataFrameType;
  /**
   * TypeVersion is the version of the Type property. Versions greater than 0.0 correspond to the dataplane
   * contract documentation https://github.com/grafana/grafana-plugin-sdk-go/tree/main/data/contract_docs.
   */
  typeVersion?: [number, number];
  /** DatasSource Specific Values */
  custom?: Record<string, any>;
  /** Stats */
  stats?: QueryResultMetaStat[];
  /** Meta Notices */
  notices?: QueryResultMetaNotice[];
  /** Set the panel plugin id to use to render the data when using Explore. If the plugin cannot be found
   * will fall back to {@link preferredVisualisationType}.
   *
   * @alpha
   */
  preferredVisualisationPluginId?: string;
  /** The path for live stream updates for this frame */
  channel?: string;
  /** Did the query response come from the cache */
  isCachedResponse?: boolean;
  // /**
  //  * Optionally identify which topic the frame should be assigned to.
  //  * A value specified in the response will override what the request asked for.
  //  */
  // // dataTopic?: DataTopic;
  // /**
  //  * This is the raw query sent to the underlying system.  All macros and templating
  //  * as been applied.  When metadata contains this value, it will be shown in the query inspector
  //  */
  // executedQueryString?: string;
  // /**
  //  * A browsable path on the datasource
  //  */
  // path?: string;
  // /**
  //  * defaults to '/'
  //  */
  // pathSeparator?: string;
  // /** A time shift metadata indicating a result of comparison */
  // timeCompare?: {
  //   diffMs: number;
  //   isTimeShiftQuery: boolean;
  // };
  // /**
  //  * Legacy data source specific, should be moved to custom
  //  * */
  // searchWords?: string[]; // used by log models and loki
  // limit?: number; // used by log models and loki
  // json?: boolean; // used to keep track of old json doc values
  // instant?: boolean;
  // /**
  //  * Array of field indices which values create a unique id for each row. Ideally this should be globally unique ID
  //  * but that isn't guarantied. Should help with keeping track and deduplicating rows in visualizations, especially
  //  * with streaming data with frequent updates.
  //  * Example: TraceID in Tempo, table name + primary key in SQL
  //  */
  // uniqueRowIdFields?: number[];
}