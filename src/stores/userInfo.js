import * as account from '@/apis/account.js'
import { defineStore } from 'pinia'


export const useUserInfoStore = defineStore('user_info_store', {
  state: () => ({
    _userInfo: {}
  }),
  getters: {
    userInfo(state) {
      if (Object.keys(state._userInfo) === 0) this.fetchUserInfo()
      return state._userInfo
    }
  },
  actions: {
    async fetchUserInfo() {
      this._userInfo = await account.getUserInfo()
    }
  }
})