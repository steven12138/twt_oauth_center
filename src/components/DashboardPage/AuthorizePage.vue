<script setup>
const columns = [
  { colKey: 'app_name', title: '应用名称', width: 150 },
  { colKey: 'app_desc', title: '应用描述' },
  { colKey: 'authorized_scope', title: '授权内容', ellipsis: true },
  { colKey: 'trusted', title: '是否信任' },
  { colKey: 'actions', title: '操作' }
]

const defaultData = [
  {
    app_name: '微北洋App',
    app_desc: '天外天校园服务App',
    authorized_scope: '全部信息',
    trusted: true,
    actions: '不可操作'
  },
  {
    app_name: '党建系统',
    app_desc: '信息化党建系统, 覆盖入党, 在线学习等功能',
    authorized_scope: '全部信息',
    trusted: true,
    actions: '不可操作'
  },
  {
    app_name: '社会实践平台',
    app_desc: '实践队报名, 招募平台',
    authorized_scope: '全部信息',
    trusted: true,
    actions: '不可操作'
  }
]

</script>

<template>
  <t-card :bordered="false">
    <template #title>
      <span style="font: var(--td-font-body-large); font-size: 1.3em;">隐私与第三方应用</span>
    </template>
    <t-table
      row-key="key"
      table-layout="auto"
      :columns="columns"
      :data="defaultData"
    >
      <template #trusted="{row}">
        <t-tag v-if="row.trusted" theme="success" variant="outline" shape="round">官方应用</t-tag>
        <t-tag v-else theme="warning" variant="outline" shape="round">第三方应用</t-tag>
      </template>
    </t-table>
  </t-card>
</template>

<style scoped>

</style>