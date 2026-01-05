<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from "dayjs"
import { CommonPage } from '~/businessComponents'
import { getAgentList, getAgentLogsApi } from '~/api/configManagement/agentManagement'
import { getFields } from './fields'

import type { IExpose, IField } from '~/businessComponents/commonPage'
import type { ICommonObj } from '~/interfaces/common'
import type { AgentListReplyAgentInfo, AgentListRequest } from '~/api/configManagement/agentManagement/types'

const commonPageRef = ref<IExpose>()

/**弹窗 */
const showDialog = ref(false);
const tableData = ref<Array<ICommonObj>>([]);
const getAgentLogs = async (agentId: number) => {
    const res = await getAgentLogsApi({ agentId })
    if (res) {
        tableData.value = res.map((item) => {
            return {
                timestamp: item.timestamp,
                name: item.name,
                logJson: JSON.stringify(item.logJson)
            }
        })
    }
}
const handleViewLatestMetrics = (row: AgentListReplyAgentInfo) => {
    ElMessage.info(`Agent「${row?.agentName ?? '-'}」指标查看功能开发中`)
}

const handleViewLatestLogs = (row: AgentListReplyAgentInfo) => {
    showDialog.value = true
    getAgentLogs(row.id)

}

const fields = getFields({
    onViewLatestLogs: handleViewLatestLogs,
    onViewLatestMetrics: handleViewLatestMetrics,
}) as IField[]

const formatListParams = (formValues: ICommonObj = {}): AgentListRequest => {
    const payload: AgentListRequest = {}
    if (formValues.agentName) {
        payload.agentName = String(formValues.agentName).trim()
    }
    if (formValues.hostname) {
        payload.hostname = String(formValues.hostname).trim()
    }
    if (formValues.status !== undefined && formValues.status !== null && formValues.status !== '') {
        payload.status = formValues.status
    }
    return payload
}

</script>

<template>
    <CommonPage ref="commonPageRef" :fields="fields" :list-api="getAgentList" :format-list-params="formatListParams"
        page-key="agentManagement" row-key="id" :filter-columns="4" :need-pagination="true" :refreshable="true" />

    <ElDialog v-model="showDialog" title="最近采集日志" width="600">
        <ElTable :data="tableData" style="width: 100%">
            <ElTableColumn label="时间">
                <template #default="{ row }">
                    {{ row.timestamp ? dayjs(row.timestamp).format("YYYY-MM-DD HH:mm:ss") : "" }}
                </template>
            </ElTableColumn>

            <ElTableColumn prop="name" label="索引" width="180">
                <template #default="{ row }">
                    {{ row.logJson._index || '-' }}
                </template>
            </ElTableColumn>
            <ElTableColumn prop="logJson" label="日志内容" />
        </ElTable>
        <template #footer>
            <div class="dialog-footer">
                <ElButton size="small" @click="showDialog = false">关闭</ElButton>
            </div>
        </template>
    </ElDialog>
</template>