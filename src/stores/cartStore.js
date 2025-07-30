//購物車邏輯

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { logRaw } from '@/utils/Logger'

export const useCartStore = defineStore('cart', () => {
  // 狀態
  const cartItems = ref([]) // 購物車商品列表
  const showCart = ref(false) // 購物車顯示狀態
  const editingItem = ref(null) // 正在編輯的商品
  const showProduct = ref(false) // 商品彈窗顯示狀態

  // 計算屬性
  //單一購物車項目的總價
  const getItemTotal = (item) => {
    const basePrice = item.price * item.quantity
    const extrasPrice = item.extras.reduce((sum, extra) => {
      return (
        sum +
        extra.options.reduce((optSum, opt) => {
          return optSum + opt.price * (opt.quantity || 1)
        }, 0)
      )
    }, 0)

    return basePrice + extrasPrice * item.quantity
  }

  //購物車所有項目的總價
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + getItemTotal(item)
    }, 0)
  })

  //購物車內的商品總數量
  const cartCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0)
  })

  // 方法
  const toggleCart = () => {
    showCart.value = !showCart.value
  }

  const setEditingItem = (item) => {
    editingItem.value = { ...item }
  }

  const clearEditingItem = () => {
    editingItem.value = null
    showProduct.value = false
  }

  //加入購物車
  const addToCart = (product, extras) => {
    try {
      // 如果是編輯模式，使用原有的 cartId
      const cartId = editingItem.value ? editingItem.value.cartId : product.cartId

      const cartItem = {
        cartId: cartId,
        cateId: product.cateId,
        prodId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        extraType: product.extraType,
        extras: extras || [],
        image: product.image,
      }
      logRaw('準備加入的購物車項目:', cartItem)

      // 檢查是否存在相同的商品（包括加料）
      const sameItemIndex = cartItems.value.findIndex((item) => {
        return (
          item.prodId === cartItem.prodId &&
          JSON.stringify(item.extras) === JSON.stringify(cartItem.extras)
        )
      })

      // 如果是編輯模式，找到當前商品的位置
      const currentItemIndex = editingItem.value
        ? cartItems.value.findIndex((item) => item.cartId === cartId)
        : -1

      if (sameItemIndex !== -1) {
        // 如果找到相同商品，增加數量
        cartItems.value[sameItemIndex].quantity += product.quantity || 1
        ElMessage.success('已合併相同商品')

        // 如果是編輯模式，刪除當前正在編輯的商品
        if (currentItemIndex !== -1) {
          cartItems.value.splice(currentItemIndex, 1)
        }
      } else {
        // 如果是編輯模式且沒有找到相同商品，更新原位置
        if (currentItemIndex !== -1) {
          cartItems.value[currentItemIndex] = cartItem
          ElMessage.success('更新購物車成功')
        } else {
          // 如果是新商品，添加到購物車
          cartItems.value.push(cartItem)
          ElMessage.success('加入購物車成功')
        }
      }

      logRaw('當前購物車內容:', cartItems.value)
    } catch (error) {
      logRaw('加入購物車錯誤:', error)
      ElMessage.error('加入購物車失敗')
    }
  }

  const removeFromCart = (cartId) => {
    const index = cartItems.value.findIndex((item) => item.cartId === cartId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      ElMessage.success('移除商品成功')
    }
  }

  const clearCart = () => {
    cartItems.value = []
    ElMessage.success('清空購物車成功')
  }

  return {
    // 狀態
    cartItems,
    showCart,
    editingItem,
    showProduct,

    // 計算屬性
    totalPrice,
    cartCount,

    // 方法
    toggleCart,
    setEditingItem,
    clearEditingItem,
    addToCart,
    removeFromCart,
    clearCart,
    getItemTotal,
  }
})
