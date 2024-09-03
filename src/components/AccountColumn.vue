<script setup>

import { useUserInfoStore } from '@/stores/userInfo.js'

defineProps({
  avatar: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  sid: {
    type: String,
    required: false,
    default: null
  }
})

const userInfoStore = useUserInfoStore()


</script>

<template>
  <div class="outer">
    <div class="avatar-box" :style="{backgroundImage: `url(${avatar}`}"></div>

    <div class="account-info">
      <span class="username">{{ username || userInfoStore.userInfo.nickname }}</span>
      <span class="sid">{{ sid || userInfoStore.userInfo.userNumber }}</span>
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

.avatar-box {
  width: 40px;
  height: 40px;
  background-size: cover;
  border-radius: 100px;
  background-position: center;
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
