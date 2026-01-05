import {
  FieldType, 
  ThresholdsMode, 
  FieldColorModeId,
  NullValueMode,
  ActionType,
  HttpRequestMethod,
  ActionVariableType,
} from '../../constants'

import type { CSSProperties } from 'vue';
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

  /**
   *  Must be sorted by 'value', first value is always -Infinity
   */
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
export interface FetchOptions {
  method: HttpRequestMethod;
  url: string;
  body?: string;
  queryParams?: Array<[string, string]>;
  headers?: Array<[string, string]>;
}
export interface InfinityOptions extends FetchOptions {
  datasourceUid: string;
}
export type ActionVariable = {
  key: string;
  name: string;
  type: ActionVariableType;
};
type ActionButtonCssProperties = Pick<CSSProperties, 'backgroundColor'>;
export interface Action {
  type: ActionType;
  title: string;
  [ActionType.Fetch]?: FetchOptions;
  [ActionType.Infinity]?: InfinityOptions;
  confirmation?: string;
  oneClick?: boolean;
  variables?: ActionVariable[];
  style?: ActionButtonCssProperties;
}
export interface EnumFieldConfig {
  text?: string[];
  color?: string[];
  icon?: string[];
  description?: string[];
}
export interface FieldTypeConfig {
  enum?: EnumFieldConfig;
}
/**
 * @public
 * Every property is optional
 *
 * Plugins may extend this with additional properties. Something like series overrides
 */
export interface FieldConfig<TOptions = any> {
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

  actions?: Action[];

  // Alternative to empty string
  noValue?: string;

  // The field type may map to specific config
  type?: FieldTypeConfig;

  // Panel Specific Values
  custom?: TOptions;

  // Calculate min max per field
  fieldMinMax?: boolean;
}
export interface FieldSchema {
  name: string; // The column name
  type?: FieldType;
  config?: FieldConfig;
  labels?: Record<string, string>;
}
