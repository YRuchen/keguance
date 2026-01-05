import { h, nextTick } from 'vue'
import { ElTag } from 'element-plus'
import { getSchema as domainSchema } from '../domainInspect/detail/schema'
import { getSchema as sslSchema } from '../sslInspect/detail/schema'
import { getSchema as icpSchema } from '../inspectionICP/detail/schema'

/** 替换状态 */
export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail,'
}

/** 替换状态 */
export const statusMap = {
  [Status.SUCCESS]: {
    text: '成功',
    type: 'success',
  },
  [Status.FAIL]: {
    text: '失败',
    type: 'danger',
  },
}

/** 替换记录 */
export const columns = [
  {
    prop: 'createdAt',
    label: '替换时间',
    width: 174,
  },
  {
    prop: 'oldDomain',
    label: '旧域名',
    width: 174,
  },
  {
    prop: 'newDomain',
    label: '新域名',
    width: 174,
  },
  {
    prop: 'status',
    label: '替换状态',
    width: 174,
    render: ({ rowData }) =>
      h(
        ElTag,
        { type: statusMap[rowData.status]?.type },
        () => statusMap[rowData.status]?.text,
      ),
  },
]

/** 详情类型 */
export enum DetailType {
  DOMAIN = 'DOMAIN',
  SSL = 'SSL',
  ICP = 'ICP',
  DNS = 'DNS',
  WALL = 'WALL',
  POLLUTION = 'POLLUTION',
  HIJACK = 'HIJACK',
}

/** 详情类型到api的映射 */
export const detailTypeToApiMap = {
  /** 域名 */
  DOMAIN: async ({ task }) => {
    return ({
      status: 'SUCCESS',
      title: 'www.domain.com',
      createdAt: '2025-12-02',
    })
  },
  /** SSL */
  SSL: async ({ task }) => {
    return ({
      status: 'SUCCESS',
      title: 'www.domain.com',
      createdAt: '2025-12-02',
    })
  },
  /** ICP */
  ICP: async ({ task }) => {
    return ({
      status: 'SUCCESS',
      title: 'www.domain.com',
      createdAt: '2025-12-02',
    })
  },
}

/** 不同类型的schema */
export const detailTypeToGetSchemaMap = {
  [DetailType.DOMAIN]: domainSchema(),
  [DetailType.SSL]: sslSchema(),
  [DetailType.ICP]: icpSchema(),
}

const action = async ({
  id,
  type,
  schema,
  commonDrawerRef,
  formRef,
  detail,
}) => {
  try {
    schema.value = detailTypeToGetSchemaMap[type] as any
    commonDrawerRef.value?.open()
    const res = await detailTypeToApiMap[type]?.({ task: id })
    await nextTick()
    formRef.value.values = res
    detail.value = res
    formRef.value.readPretty = true
  } catch (error: any) {
    console.error(`获取详情失败，失败原因：${error}`)
  }
}
export const actionMap = {
  [DetailType.DOMAIN]: action,
  [DetailType.SSL]: action,
  [DetailType.ICP]: action,
  [DetailType.DNS]: ({ id, router }) => {
    router.push({ name: 'DnsInspectOverview', query: { task: id, name: 12112 } })
  },
  [DetailType.WALL]: ({ id, router }) => {
    router.push({ name: 'InspectionWallDetail', query: { task: id } })
  },
  [DetailType.POLLUTION]: ({ id, router }) => {
    router.push({ name: 'InspectionPollutionDetail', query: { task: id } })
  },
  [DetailType.HIJACK]: ({ id, router }) => {
    router.push({ name: 'HijackDetectionView', query: { task: id } })
  },
}
