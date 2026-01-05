import getReqByProxyModule from '~/config/request'
import { PROXY } from '~/config/constants'

import type { AxiosResponse } from 'axios'
import type { ICommonGetListRes, ICommonObj } from '~/interfaces/common'
import type { IListItem } from './interfaces'

const request = getReqByProxyModule({ proxyModule: PROXY.GATEWAY_OBSERVE })
// const request = getReqByProxyModule({ proxyModule: '' as any }) // TODO: 本地mock数据，上线前注释

const downloadFile = (response: AxiosResponse, filename?: string) => {
  try {
    // 处理响应头中的文件名(如果有)
    const contentDisposition = response.headers?.['content-disposition']
    if (contentDisposition && !filename) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (fileNameMatch?.[1]) {
        filename = fileNameMatch[1].replace(/['"]/g, '')
      }
    }

    // 创建并下载文件
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  } catch (err: any) {
    console.error('文件下载错误:', err)
  }
}

/** 资产管理列表 */
export const getListApi = async (params: ICommonObj): Promise<ICommonGetListRes<IListItem[]>> => {
  try {
    const sendData = {
      ...params,
      page: params.pagination?.page,
      pageSize: params.pagination?.pageSize,
    }
    delete sendData.pagination // TODO
    const res: ICommonObj = await request.get('/domain/api/v1/cmdb/info/', { params: sendData })
    // const res: ICommonObj = await request.get('/cmdb/info/')
    return Promise.resolve({
      list: res.data.list,
      pagination: res.data.pagination,
    })
  } catch (error: any) {
    console.error(`获取列表失败，失败原因：${error}`)
    return {
      list: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    }
  }
}

/** 创建 */
export const createApi = (params: ICommonObj) => {
  return request.post('/domain/api/v1/cmdb/info/', params)
}

/** 编辑 */
export const editApi = (params: ICommonObj) => {
  return request.put(`/domain/api/v1/cmdb/info/${params.id}/`, params)
}

/** 获取详情 */
export const getDetailApi = async (params: ICommonObj) => {
  const res = await request.get(`/domain/api/v1/cmdb/info/${params.id}/`)
  return res.data
}

/** 删除 */
export const deleteApi = (params: ICommonObj) => {
  return request.delete(`/domain/api/v1/cmdb/info/${params.id}/`)
}

/** 模版下载 */
export const downloadApi = async () => {
  const res = await request.get('/domain/api/v1/cmdb/file/download/', {
    responseType: 'blob'
  })
  downloadFile(res, 'template.xlsx')
}

/** 批量导入 */
export const batchImportApi = (file: any) => {
  const fileObj = {
    uid: file.uid,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    webkitRelativePath: file.webkitRelativePath,
  }
  const jsonString = JSON.stringify(fileObj);

  // 2. 创建 Blob 对象，指定 MIME 类型为 "application/json"
  const blob = new Blob([jsonString], { type: 'application/json' });
  const formData = new FormData()
  formData.append('file', blob)
  return request.post('/domain/api/v1/cmdb/file/upload/', formData)
}

/** 导出 */
export const exportApi = async () => {
  const res = await request.get('/domain/api/v1/cmdb/info/export/')
  downloadFile(res, 'cmdb_export.xlsx')
}
