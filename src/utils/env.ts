export function getMetricsUrl(path: string): string {
  const base = import.meta.env.VITE_APP_BASE_API_METRICS
  // 确保不会出现重复的 `/`
  return `${base?.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
