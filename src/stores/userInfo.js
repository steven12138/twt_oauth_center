import { ref } from 'vue'
import * as account from '@/apis/account.js'

// 这里不用Pinia的原因是因为Pinia有点玄学bug, 而且我们不是SSR应用所以问题不大
export let userInfo = ref({})

export async function getUserInfo() {
  console.log('fetchUserInfo', Object.keys(userInfo.value).length === 0)
  if (Object.keys(userInfo.value).length === 0) {
    try {
      console.log('get')
      userInfo.value = await account.getUserInfo()
    } catch (error) {
      console.error('Failed to fetch user info', error)
      return null
    }
  }
  return userInfo.value
}

export function setUserInfo(info) {
  userInfo.value = info
  console.error('Updated user info', userInfo)
}
