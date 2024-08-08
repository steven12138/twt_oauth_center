<script setup>
import { userInfo } from '@/stores/userInfo.js'

const user_info = userInfo
</script>

<template>
  <div style="margin:10px;">
    <h1>Home Page</h1>
    {{ user_info }}
  </div>
</template>

<style scoped>

</style>