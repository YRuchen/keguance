<script setup lang="ts">
import { ref, computed, h, type VNode, isVNode } from 'vue'
import { ElButton, ElDrawer, ElInput, ElScrollbar, ElMessage } from 'element-plus'
import AIChatDrawer from './component/AIChatDrawer.vue'
import { CHAT_SCENE } from '~/api/domainManagement/ai/constants'
import aiEntrance from '~/assets/image/charts/ai_entrance.svg'

import { getListApi } from '~/api/domainManagement/dnsInspect'

// 抽屉显示状态
const drawerVisible = ref(false)

// 打开抽屉
// const openDrawer = () => {
//   drawerVisible.value = true
// }
// 测试用的
const openDrawer = async () => {
  drawerVisible.value = true
  const res = await getListApi({ page: 1, pageSize: 10, total: 9, taskType: 'TASK_TYPE_HIJACK' })
  console.log(drawerVisible.value)

  const filtered =
    res.list.length != 0
      ? Object.fromEntries(Object.entries(res.list[0]).filter(([_, v]) => !Array.isArray(v)))
      : {}
  localStorage.setItem('metaData', JSON.stringify(filtered))
}
</script>
<template>
  <div>
    <!-- <el-button @click="openDrawer">AI</el-button> -->
    <img :src="aiEntrance" @click="openDrawer" />
    <AIChatDrawer v-model="drawerVisible" :chatScene="CHAT_SCENE.DOMAIN" />
  </div>
</template>
