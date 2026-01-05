import { watch } from 'vue'
import { ElMessage } from 'element-plus'

import type { Ref } from 'vue'
import type { ICommonObj } from '../../interfaces'
import type { IQueryParams, IUsePageActionsExpose } from './interfaces'
import type { IOpenParams } from '../commonEditor'

// TODO：后续尽量保证数据层和ui层的解耦
export const usePageActions = (
  paginationConfig,
  downloadApi,
  exportApi,
  formatExportParams,
  commonFilterRef,
  commonEditorRef,
  commonTableRef,
): IUsePageActionsExpose => {
  /** 查询 */
  const query = async ({ page, text }: IQueryParams = {}) => {
    await commonTableRef.value?.getList(page || 1, paginationConfig.pageSize, text)
  }
  /** 打开侧边栏 */
  const openEditor = (params: IOpenParams) => {
    commonEditorRef.value?.open?.(params)
  }
  /** 创建 */
  const create = () => {
    commonEditorRef.value?.open?.({ mode: 'CREATE', rowData: {}, rowIndex: 0 } as IOpenParams)
  }
  /** 重置筛选条件 */
  const filterReset = async () => {
    await commonFilterRef.value?.reset()
    query({ text: '重置' })
  }
  /** 下载 */
  const download = async () => {
    try {
      await downloadApi?.()
      ElMessage({
        message: '下载成功',
        type: 'success'
      })
    } catch (error: any) {
      console.error(`下载失败，失败原因：${error}`)
    }
  }
  /** 导出 */
  const exportFn = async () => {
    const values = commonFilterRef.value?.getForm()?.values
    const isFunction = typeof formatExportParams === 'function'
    try {
      await exportApi?.(
        isFunction
          ? formatExportParams(values)
          : values
      )
    } catch (error: any) {
      console.error(`导出失败，失败原因：${error}`)
    }
  }
  /** 监听target，改变时触发listApi */
  const watchList = (target: Ref<ICommonObj[]>) => {
    watch(() => target.value, async () => {
      try {
        await query()
      } catch (error: any) {
        console.error(`watchList副作用执行失败，失败原因：${error}`)
      }
    }, { deep: true })
  }
  return {
    query,
    openEditor,
    create,
    filterReset,
    download,
    exportFn,
    watchList,
  }
}
