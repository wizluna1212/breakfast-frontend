import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getHistoryOrders } from '@/api/api'
import { logRaw } from '@/utils/Logger'
import { useUserStore } from './userStore'

export const useOrderHistoryStore = defineStore('orderHistory', () => {
  const historyOrders = ref([]) //歷史訂單紀錄
  const userStore = useUserStore()
  const isGuest = computed(() => !userStore.token)

  // 從 localStorage 載入訪客歷史訂單
  const loadGuestOrders = () => {
    const guestOrders = JSON.parse(localStorage.getItem('guest-orders') || '[]')
    historyOrders.value = guestOrders
  }

  // 從後端 API 取得歷史訂單 (有 token 才呼叫)
  const fetchHistoryOrders = async () => {
    try {
      if (!userStore.token) {
        throw new Error('未登入，無法取得歷史訂單')
      }
      const res = await getHistoryOrders()
      historyOrders.value = Array.isArray(res.data) ? res.data : []
    } catch (error) {
      console.error('取得歷史訂單失敗', error)
      // 失敗可 fallback 讀 localStorage
      loadGuestOrders()
    }
  }

  // 添加訂單到歷史記錄
  const addOrder = (order) => {
    const newOrder = JSON.parse(JSON.stringify(order))
    historyOrders.value.push(newOrder)
    if (!userStore.token) {
      localStorage.setItem('guest-orders', JSON.stringify(historyOrders.value))
    }
  }

  // 清除歷史訂單（多用於登出時清理）
  const clearHistory = () => {
    historyOrders.value = []
  }

  // 初始化，根據登入狀態決定要從哪裡載入資料
  const init = async () => {
    if (isGuest.value) {
      loadGuestOrders()
    } else {
      await fetchHistoryOrders()
    }
  }

  // 監聽登入狀態變化
  watch(
    () => userStore.token,
    async (newToken) => {
      if (newToken) {
        await fetchHistoryOrders()
      } else {
        loadGuestOrders() // 載入訪客訂單
      }
    },
    { immediate: true }, // 一進來就執行一次
  )

  return {
    historyOrders,
    loadGuestOrders,
    fetchHistoryOrders,
    addOrder,
    clearHistory,
    init,
  }
})
