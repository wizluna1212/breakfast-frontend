//訂單資訊

import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { sendOrder } from '@/api/api'
import { useCartStore } from './cartStore'
import { useUserStore } from './userStore'
import { ElMessage } from 'element-plus'
import { logRaw } from '@/utils/Logger'

export const useOrderStore = defineStore('order', () => {
  const cartStore = useCartStore()
  const userStore = useUserStore()

  //訂單資料
  const orderData = reactive({
    name: '', //訂購人姓名
    phone: '', //訂購人電話
    note: '', //訂單備註
    pickupType: '', //取餐方式
    tableNumber: '', // 若為內用
    takeTime: '', // 若為外帶
    paymentMethod: 'cash', // 付款方式
  })

  const completedOrder = ref(null) //完成的訂單內容

  // 重置訂單資料
  const resetOrderData = () => {
    orderData.name = ''
    orderData.phone = ''
    orderData.note = ''
    orderData.pickupType = ''
    orderData.tableNumber = ''
    orderData.takeTime = ''
    orderData.paymentMethod = 'cash'
  }

  const generateOrderData = () => {
    const isLoggedIn = !!userStore.token

    const dataToSend = {
      customer: {
        name: orderData.name,
        phone: orderData.phone,
      },
      pickupType: orderData.pickupType,
      tableNumber: orderData.tableNumber || '',
      takeTime: orderData.takeTime || '',
      paymentMethod: orderData.paymentMethod,
      items: cartStore.cartItems,
      totalPrice: cartStore.totalPrice,
      note: orderData.note || '',
    }

    // 清除空值欄位
    if (!dataToSend.tableNumber) delete dataToSend.tableNumber
    if (!dataToSend.note) delete dataToSend.note

    // 登入者加上 userId
    if (isLoggedIn) {
      dataToSend.userId = userStore.userId
    }

    logRaw('準備送出的訂單數據：', dataToSend)

    return dataToSend
  }

  const fetchSendOrder = async (orderData) => {
    try {
      const response = await sendOrder(orderData)

      if (response.code === 0) {
        const finalOrder = {
          ...orderData,
          orderId: response.data.orderId,
          timestamp: response.data.timestamp,
        }

        completedOrder.value = finalOrder

        logRaw('訂單送出成功，完整訂單數據：', finalOrder)

        cartStore.cartItems = []
        resetOrderData()

        return completedOrder.value
      } else {
        throw new Error(response.message || '送出訂單失敗')
      }
    } catch (error) {
      console.error('送出訂單錯誤:', error)
      ElMessage.error(error.message || '送出訂單失敗')
      throw error
    }
  }

  return {
    orderData,
    completedOrder,
    generateOrderData,
    fetchSendOrder,
    resetOrderData,
  }
})
