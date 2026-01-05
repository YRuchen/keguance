<template>
  <div class="app-container flex_x_row">
    <Side @change="changeAction" />
    <right-table ref="table" />
  </div>
</template>

<script setup lang="ts">
import RightTable from './components/rightTable.vue'
import Side from './components/Side.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const table = ref()

sessionStorage.removeItem('iframeUrl')
const changeAction = (data) => {
  table.value.getList(data)
}
</script>

<style scoped lang="scss">
@import './index';
</style>
