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