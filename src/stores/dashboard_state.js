import { defineStore } from 'pinia'

export const usePageState = defineStore('page_state', {
  state: () => ({

    current_page: 'home'
  })

})