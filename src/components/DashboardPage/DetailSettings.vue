<script setup>


import { useUserInfoStore } from '@/stores/userInfo.js'

const userInfoStore = useUserInfoStore()

const emit = defineEmits(['show-change-password'])

function showPassword() {
  emit('show-change-password')
}

</script>


<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <t-card :bordered="false" class="card-section">
      <template #title>
        <span style="font: var(--td-font-body-large); font-size: 1.3em;">账户安全设置</span>
      </template>
      <t-list :split="true">
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>手机号: {{ userInfoStore.userInfo.telephone }}</span>
                <t-tag theme="success" variant="outline">已绑定</t-tag>
              </div>
            </template>
            <template #description>
              <span>绑定手机号可用于登录、找回密码、接收通知等功能</span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-link size="medium" theme="primary">更换绑定</t-link>
          </template>
        </t-list-item>
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>邮箱: {{ userInfoStore.userInfo.email }}</span>
                <t-tag theme="success" variant="outline">已绑定</t-tag>
              </div>
            </template>
            <template #description>
              <span>绑定邮箱账号用于辅助找回密码与验证身份</span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-link size="medium" theme="primary">更换绑定</t-link>
          </template>
        </t-list-item>
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>微信号:</span>
                <t-tag theme="danger" variant="outline">未绑定</t-tag>
                <t-tag theme="primary" variant="outline">开发中</t-tag>
              </div>
            </template>
            <template #description>
              <span>绑定微信账号以供使用微信登录, 接收通知等功能</span>
            </template>
          </t-list-item-meta>
          <template #action>
            <div class="action">
              <t-link :disabled="true" size="medium" theme="primary">绑定</t-link>
            </div>
          </template>
        </t-list-item>
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>修改密码</span>
              </div>
            </template>
            <template #description>
              <span>
                修改账户密码, 建议定期更换密码以保证账户安全
              </span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-link theme="primary" @click="showPassword">修改密码</t-link>
          </template>
        </t-list-item>
      </t-list>
    </t-card>

    <t-card :bordered="false" class="card-section">
      <template #title>
        <span style="font: var(--td-font-body-large); font-size: 1.3em">账号操作</span>
      </template>
      <t-list :split="true">
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>当前账号身份: {{ userInfoStore.userInfo.userNumber }} {{ userInfoStore.userInfo.stuType }}</span>
                <t-tag theme="primary" variant="outline">账号升级</t-tag>
              </div>
            </template>
            <template #description>
              <span>
                此功能使用于同校本升硕、硕升博等学号发生变化的情况
              </span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-link size="large" theme="warning">更新身份</t-link>
          </template>
        </t-list-item>
        <t-list-item>
          <t-list-item-meta>
            <template #title>
              <div style="display: flex;align-items: center; gap: 10px;">
                <span>账号注销</span>
                <t-tag theme="danger" variant="outline">危险操作</t-tag>
              </div>
            </template>
            <template #description>
              <span>
                注销账号将删除所有数据, 且不可恢复, 请谨慎操作
              </span>
            </template>
          </t-list-item-meta>
          <template #action>
            <t-link size="large" theme="danger">注销账号</t-link>
          </template>
        </t-list-item>
      </t-list>
    </t-card>
  </div>
</template>


<style scoped>


</style>
