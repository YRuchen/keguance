<template>
  <div class="app-container m-user">
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <BasicInfo />
      </el-tab-pane>
      <el-tab-pane label="消息通知"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
  import BasicInfo from './components/basicInfo.vue'

  function handleOpen(key: string) {
    console.log(key)
  }

  function handleClose(key: string) {
    console.log(key)
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
