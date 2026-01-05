import 'pinia'

declare module 'pinia' {
  interface DefineStoreOptionsBase<S, Store> {
    /**
     * pinia-plugin-persistedstate 配置
     */
    persist?: boolean | {
      key?: string
      storage?: Storage
      paths?: string[]
    }
  }
}
