<template>
  <el-scrollbar class="scrollbar">
    <el-tree
      ref="systemFoldersRef"
      :data="menuData"
      :highlight-current="true"
      :props="defaultProps"
      :node-key="nodeKey"
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <slot name="node-content" :node="node" :data="data">
          <!-- 默认节点内容 -->
          <span class="node-label">{{ node.label }}</span>
        </slot>
      </template>
    </el-tree>
  </el-scrollbar>
</template>

<script setup>
  const props = defineProps({
    // 统一配置默认值
    menuData: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        children: 'children',
      }),
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
  })

  const emit = defineEmits(['node-click'])

  const handleNodeClick = (data, node) => {
    // 统一处理节点点击逻辑
    console.log('Selected node:', data)
    emit('node-click', data, node)

    // 可添加通用业务逻辑
    if (data.type === 'special') {
      // 特殊节点处理
    }
  }
</script>

<style scoped>
  /* 组件专属样式 */
  .business-tree {
    :deep(.el-tree-node__content) {
      height: 40px;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background-color: var(--el-color-primary-light-9);
      font-weight: 600;
    }

    .node-label {
      font-size: 14px;
      color: #333;
    }
  }
</style>
