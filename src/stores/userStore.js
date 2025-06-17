// stores/userStore.js
import { defineStore } from 'pinia'
import { useOrderHistoryStore } from '@/stores/historyStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {
      id: null,
      name: '',
      email: '',
      phone: '',
      birthday: '',
      createdAt: '',
    },
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo.id,
    userId: (state) => state.userInfo.id,
  },
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUserInfo(info) {
      this.userInfo = info
    },

    logout() {
      this.token = ''
      this.userInfo = { id: null, name: '', email: '', phone: '', birthday: '', createdAt: '' }
      localStorage.removeItem('token')
      // 清除歷史訂單資料
      const historyStore = useOrderHistoryStore()
      historyStore.clearHistory()
    },
  },
})
