import { h, nextTick, ref } from 'vue'
import { ElText, ElButton, ElTag } from 'element-plus'
import { Space } from '~/KeepUp'
import BaseSvgIcon from '~/components/SvgIcon/index.vue'
import {
  domainStatusMap,
  sslStatusMap,
  icpStatusMap,
  wallStatusMap,
  polluteStatusMap,
  hijackStatusMap,
} from '~/api/domainManagement/common'
import {
  domainStatusOptions,
  sslStatusOptions,
  wallStatusOptions,
  icpStatusOptions,
  polluteStatusOptions,
  hijackStatusOptions,
} from '~/api/domainManagement/common/constants'
import { setStorage } from '~/utils/storage'
import { actionMap } from './constants'
import { getHistoryListApi as getDomainHistoryListApi } from '~/api/domainManagement/domainInspect'
import { getHistoryListApi as getSslHistoryListApi } from '~/api/domainManagement/sslInspect'
import { getHistoryListApi as getIcpHistoryListApi } from '~/api/domainManagement/inspectionICP'
import { getSchema as domainSchema } from '../domainInspect/detail/schema'
import { getSchema as sslSchema } from '../sslInspect/detail/schema'
import { getSchema as icpSchema } from '../inspectionICP/detail/schema'
import styles from './index.module.scss'

import type { ICommonObj, IField } from '~/KeepUp'
import type { ICommonInfoPreviewParams, IGetFieldsParams } from './interfaces'

import useAiChat from '../../common/useAiChat'
const drawerRef = ref<any>(null)

const commonInfoPreview = ({
  text,
  id,
  type,
  commonDrawerRef,
  formRef,
  schema,
  detail,
  router,
}: ICommonInfoPreviewParams) => {
  return h(
    Space,
    {
      direction: 'column',
      align: 'start',
    },
    [
      h(ElText, { style: commonStyle }, text),
      !id
        ? h(ElText, { style: commonStyle }, '-')
        : h(
            ElButton,
            {
              type: 'primary',
              text: true,
              onClick: () => {
                actionMap[type]?.({
                  id,
                  type,
                  schema,
                  commonDrawerRef,
                  formRef,
                  detail,
                  router,
                })
              },
            },
            '详情',
          ),
    ],
  )
}
const commonEmpty = h(
  ElTag,
  {
    type: 'info',
  },
  '未检测',
)
const commonStyle = {
  width: '100%',
  textAlign: 'left',
}
export const getFields = ({
  router,
  commonDrawerRef,
  formRef,
  schema,
  detail,
}: IGetFieldsParams): IField[] => [
  {
    prop: 'periodicTask',
    label: '',
    isColumn: true,
    columnConfig: {
      width: 50,
      fixed: 'left',
      render: ({ rowData }) =>
        h('div', {}, [
          h(
            useAiChat,
            {
              ref: drawerRef,
            },
            {
              default: () =>
                h(BaseSvgIcon, {
                  class: styles.hoverIcon,
                  style: { fontSize: '24px', cursor: 'pointer' },
                  iconClass: 'ai_entrance',
                  hoverIconClass: 'ai_entrance_hover',
                  onClick: (e) => drawerRef.value?.open(e, rowData),
                }),
            },
          ),
        ]),
    },
  },
  {
    prop: 'domain',
    label: '域名',
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        label: '域名',
      },
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: '请输入',
      },
    },
  },
  {
    prop: 'monitorTarget',
    label: '监控对象',
    isColumn: true,
    columnConfig: {
      minWidth: 150,
      fixed: 'left',
    },
  },
  {
    prop: 'domainExpiryCheck',
    label: '域名过期检测',
    isColumn: true,
    columnConfig: {
      minWidth: 120,
      render: ({ rowData }) =>
        domainStatusMap[rowData.domainExpiryCheck]
          ? h(
              ElTag,
              { type: domainStatusMap[rowData.domainExpiryCheck]?.type },
              domainStatusMap[rowData.domainExpiryCheck]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: domainStatusOptions,
    },
  },
  {
    prop: 'domainExpiry',
    label: '域名到期时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.domainExpiry),
            !rowData.domainId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    onClick: async () => {
                      try {
                        schema.value = domainSchema()
                        commonDrawerRef.value?.open()
                        const res = await getDomainHistoryListApi({
                          task: rowData.domainId,
                          page: 1,
                          pageSize: 10,
                        })
                        await nextTick()
                        const result: ICommonObj = res?.list?.[0]
                        formRef.value.readPretty = true
                        formRef.value.values = {
                          domainExpiryStatus: result.domainExpiryStatus,
                          expiryDate: result.expiryDate,
                          domain: result.domain,
                          registrarName: result.registrarName,
                          createDate: result.createDate,
                          updateDate: result.updateDate,
                          dnsServer: result.dnsServer, // TODO: 列表中没有，从哪里拿
                          domainStatus: result.domainStatus, // TODO: 列表中没有，从哪里拿
                          result: result.result,
                        }
                        detail.value = {
                          status: domainStatusMap[result?.status]?.type,
                          label: domainStatusMap[result?.status]?.label,
                          title: result.domain,
                          createdAt: result?.createdAt,
                        }
                        const resultField = formRef.value.query('result')?.take()
                        resultField.setComponentProps({
                          ...(resultField.componentProps || {}),
                          data: result?.result,
                        })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'sslStatus',
    label: 'SSL证书状态',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        sslStatusMap[rowData.sslStatus]
          ? h(
              ElTag,
              { type: sslStatusMap[rowData.sslStatus]?.type },
              sslStatusMap[rowData.sslStatus]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: sslStatusOptions,
    },
  },
  {
    prop: 'sslExpiry',
    label: '证书到期时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.sslExpiry),
            !rowData.sslId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    disabled: !rowData.sslId,
                    onClick: async () => {
                      try {
                        schema.value = sslSchema()
                        commonDrawerRef.value?.open()
                        const res = await getSslHistoryListApi({
                          task: rowData.sslId,
                          page: 1,
                          pageSize: 10,
                        })
                        await nextTick()
                        const result: ICommonObj = res?.list?.[0]
                        formRef.value.readPretty = true
                        formRef.value.values = {
                          status: result.status,
                          /** 剩余时间 */
                          remainingTime: result.leftDays,
                          /** 公用名 */
                          commonName: result.cn,
                          /** 证书签发机构 */
                          issuer: result.issuer.ou,
                          /** 组织（O） */
                          organization: result.issuer.o,
                          /** 证书生效时间 */
                          validFrom: result.effectiveDate,
                          /** 证书过期时间 */
                          validTo: result.expiryDate,
                          /** 证书类型 */
                          certificateType: result.type,
                          /** 证书 */
                          cert: result.finger.fingerprint,
                          /** 公钥 */
                          publicKey: result.finger.fingerprint256,
                          result: result.result,
                        }
                        detail.value = {
                          status: sslStatusMap[result?.status]?.type,
                          label: sslStatusMap[result?.status]?.label,
                          title: result.domain,
                          createdAt: result?.createdAt,
                        }
                        const resultField = formRef.value.query('result')?.take()
                        resultField.setComponentProps({
                          ...(resultField.componentProps || {}),
                          data: result?.result,
                        })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'icpStatus',
    label: 'ICP 备案状态',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        icpStatusMap[rowData.icpStatus]
          ? h(
              ElTag,
              { type: icpStatusMap[rowData.icpStatus]?.type },
              icpStatusMap[rowData.icpStatus]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: icpStatusOptions,
    },
  },
  {
    prop: 'icpInfo',
    label: '备案信息',
    isColumn: true,
    columnConfig: {
      minWidth: 350,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.icpInfo),
            !rowData.icpId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    onClick: async () => {
                      try {
                        schema.value = icpSchema()
                        commonDrawerRef.value?.open()
                        const res = await getIcpHistoryListApi({
                          task: rowData.icpId,
                          page: 1,
                          pageSize: 10,
                        })
                        await nextTick()
                        const result: ICommonObj = res?.list?.[0]
                        formRef.value.readPretty = true
                        formRef.value.values = {
                          domain: result?.domain,
                          status: result?.status,
                          websiteName: result?.websiteName,
                          organizerName: result?.organizerName,
                          subjectType: result?.subjectType,
                          websiteLicense: result?.websiteLicense,
                          checkTime: result?.checkTime,
                          result: result?.result,
                        }
                        detail.value = {
                          status: icpStatusMap[result?.status]?.type,
                          label: icpStatusMap[result?.status]?.label,
                          title: result.domain,
                          createdAt: result?.createdAt,
                        }
                        const resultField = formRef.value.query('result')?.take()
                        resultField.setComponentProps({
                          ...(resultField.componentProps || {}),
                          data: result?.result,
                        })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'dnsAvgLatency',
    label: 'DNS监测平均耗时',
    isColumn: true,
    columnConfig: { width: 190 },
  },
  {
    prop: 'dnsCheckTime',
    label: 'DNS检测时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.dnsCheckTime),
            !rowData.dnsId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    onClick: async () => {
                      try {
                        setStorage('dnsInspectViewFilterParams', {
                          startTime: rowData.dnsCheckTime,
                          endTime: rowData.dnsCheckTime,
                        })
                        router.push({ name: 'DnsInspectOverview', query: { id: rowData.dnsId } })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'wallStatus',
    label: '被墙检测结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        wallStatusMap[rowData.wallStatus]
          ? h(
              ElTag,
              { type: wallStatusMap[rowData.wallStatus]?.type },
              wallStatusMap[rowData.wallStatus]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: wallStatusOptions,
    },
  },
  {
    prop: 'wallCheckTime',
    label: '被墙检测时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.wallCheckTime),
            !rowData.wallId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    disabled: !rowData.wallId,
                    onClick: async () => {
                      try {
                        setStorage('inspectionWallInspectViewFilterParams', {
                          startTime: rowData.wallCheckTime,
                          endTime: rowData.wallCheckTime,
                        })
                        router.push({ name: 'InspectionWallDetail', query: { id: rowData.wallId } })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'pollutionStatus',
    label: '污染检测结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        polluteStatusMap[rowData.pollutionStatus]
          ? h(
              ElTag,
              { type: polluteStatusMap[rowData.pollutionStatus]?.type },
              polluteStatusMap[rowData.pollutionStatus]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: polluteStatusOptions,
    },
  },
  {
    prop: 'pollutionCheckTime',
    label: '污染检测时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.pollutionCheckTime),
            !rowData.pollutionId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    onClick: async () => {
                      try {
                        setStorage('pollutionInspectionViewFilterParams', {
                          startTime: rowData.pollutionCheckTime,
                          endTime: rowData.pollutionCheckTime,
                        })
                        router.push({
                          name: 'InspectionPollutionDetail',
                          query: { id: rowData.pollutionId },
                        })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
  {
    prop: 'hijackStatus',
    label: '劫持检测结果',
    isColumn: true,
    columnConfig: {
      width: 120,
      render: ({ rowData }) =>
        hijackStatusMap[rowData.hijackStatus]
          ? h(
              ElTag,
              { type: hijackStatusMap[rowData.hijackStatus]?.type },
              hijackStatusMap[rowData.hijackStatus]?.label,
            )
          : commonEmpty,
    },
    isFilter: true,
    filterConfig: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
        placeholder: '请选择',
      },
      enum: hijackStatusOptions,
    },
  },
  {
    prop: 'hijackCheckTime',
    label: '劫持检测时间',
    isColumn: true,
    columnConfig: {
      width: 190,
      render: ({ rowData }) => {
        return h(
          Space,
          {
            direction: 'column',
            align: 'start',
          },
          [
            h(ElText, { style: commonStyle }, rowData.hijackCheckTime),
            !rowData.hijackId
              ? h(ElText, { style: commonStyle }, '-')
              : h(
                  ElButton,
                  {
                    type: 'primary',
                    text: true,
                    onClick: async () => {
                      try {
                        setStorage('hijackDetectionViewFilterParams', {
                          startTime: rowData.hijackCheckTime,
                          endTime: rowData.hijackCheckTime,
                        })
                        router.push({
                          name: 'HijackDetectionView',
                          query: { id: rowData.hijackId },
                        })
                      } catch (error: any) {
                        console.error(`获取icp详情失败，失败原因：${error}`)
                      }
                    },
                  },
                  '详情',
                ),
          ],
        )
      },
    },
  },
]
