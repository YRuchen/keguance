<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <template #title>
        <span>基本信息</span>
      </template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <template #title>
        <span>消息通知</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
  function handleOpen(key: string) {
    console.log(key)
  }

  function handleClose(key: string) {
    console.log(key)
  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
