<script setup>
import { UserCircleIcon } from 'tdesign-icons-vue-next'
</script>

<template>
  <div class="outer">
    <div class="avatar-box">
      <UserCircleIcon size="25px" class="avatar-icon" />
    </div>

    <div class="account-info">
      <span class="username">切换账号登录</span>

    </div>
  </div>
</template>

<style scoped>

.username {
  font: var(--td-font-body-large);
}

.sid {
  font: var(--td-font-body-medium);
  color: #7f7f7f;
}

.avatar-icon {
  color: #222222;
}

.avatar-box {

  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.outer {
  user-select: none;
  gap: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
