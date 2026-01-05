<script setup lang="ts">
import { ref, VNode } from 'vue'
import { Check, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ text: string | VNode }>()

const Icon = ref(CopyDocument)

const doCopy = async () => {
  if (typeof props.text !== 'string') {
    ElMessage.error('当前内容不是纯文本，无法复制')
    return
  }

  await navigator.clipboard.writeText(props.text)
  ElMessage.success('复制成功')

  Icon.value = Check
  setTimeout(() => {
    Icon.value = CopyDocument
  }, 500)
}
</script>

<template>
  <el-icon @click="doCopy">
    <component :is="Icon" />
  </el-icon>
</template>
