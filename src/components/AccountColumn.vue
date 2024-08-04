<script setup>
defineProps({
  avatar: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  sid: {
    type: String,
    required: false,
    default: null
  }
})
</script>

<template>
  <div class="outer">
    <div class="avatar-box" :style="{backgroundImage: `url(${avatar}`}"></div>

    <div class="account-info">
      <span class="username">{{ username }}</span>

      <span class="sid" v-if="sid!=null">{{ sid }}</span>
    </div>
  </div>
</template>

<style scoped>

.username{
  font: var(--td-font-body-large);
}
.sid{
  font: var(--td-font-body-medium);
  color: #7f7f7f;
}
.avatar-box{
  width: 40px;
  height: 40px;
  background-size: cover;
  border-radius: 100px;
  background-position: center;
}

.account-info{
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
