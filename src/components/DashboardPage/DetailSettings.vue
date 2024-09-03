<script setup>

import { LogoWechatStrokeIcon } from 'tdesign-icons-vue-next'

import logo from '@/assets/logo.png'
import { userInfo } from '../../stores/userInfo.js'

</script>


<template>
  <!-- 修改个人信息卡片 -->
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
                <span>手机号: {{ userInfo.telephone }}</span>
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
                <span>邮箱: {{ userInfo.email }}</span>
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
      </t-list>
    </t-card>

    <t-card :bordered="false" class="card-section">
      <template #title>
        <span style="font: var(--td-font-body-large); font-size: 1.3em">账号操作</span>
      </template>
      <t-list>
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
