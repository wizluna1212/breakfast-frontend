<template>
  <el-drawer
    v-model="cartStore.showCart"
    :size="isMobile ? '100%' : '40%'"
    direction="rtl"
    class="!p-0 !m-0 overflow-hidden"
    :with-header="false"
  >
    <!-- 頂部：固定標題 -->
    <div class="sticky top-0 bg-white p-2 pt-0 z-10 border-b">
      <div class="text-center">
        <div class="text-lg font-bold">購物車</div>
        <div class="center-xy mt-2">
          <div>你選擇了 {{ cartStore.cartCount }} 項商品</div>
        </div>
      </div>
    </div>

    <!-- 中間：滾動商品區域 -->
    <div class="overflow-y-auto md:px-4 pt-4" style="max-height: calc(100vh - 160px)">
      <div v-if="cartStore.cartItems.length === 0" class="text-center">購物車是空的</div>
      <!-- 購物車項目 -->
      <div v-else class="space-y-4">
        <div v-for="item in cartStore.cartItems" :key="item.cartId" class="border-b pb-4">
          <div class="center-x items-start">
            <div class="flex-1">
              <div class="font-bold">{{ item.name }}</div>
              <!-- 加料 -->
              <div class="text-sm text-gray-500 mt-1">
                <span v-for="(extra, index) in item.extras" :key="extra.id">
                  {{ extra.name }}:
                  <span v-for="(opt, optIndex) in extra.options" :key="opt.id">
                    {{ opt.name }}
                    <template v-if="extra.type === 'add-on'"> x{{ opt.quantity }} </template>
                    <template v-if="optIndex < extra.options.length - 1">, </template>
                  </span>
                  <template v-if="index < item.extras.length - 1"> | </template>
                </span>
              </div>
            </div>
            <!-- 數量 -->
            <div class="w-3">{{ item.quantity }}</div>
            <!-- 價格 -->
            <div class="text-red-500 w-10 text-right">${{ cartStore.getItemTotal(item) }}</div>
            <!-- 按鈕區 -->
            <div class="flex flex-col gap-2 items-end">
              <el-button circle size="small" class="hover:bg-gray-100" @click="editItem(item)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                circle
                size="small"
                class="hover:bg-gray-100"
                @click="cartStore.removeFromCart(item.cartId)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：固定按鈕 -->
    <div class="absolute bottom-0 left-0 right-0 bg-white p-4 border-t z-10">
      <div class="center-y justify-between mb-4 mx-2">
        <div class="text-lg">小計</div>
        <div class="text-xl font-bold">NTD ${{ cartStore.totalPrice }}</div>
      </div>
      <div class="flex gap-4">
        <el-button type="info" class="flex-1" @click="cartStore.showCart = false"
          >繼續購物</el-button
        >
        <el-button type="primary" class="flex-1" @click="checkout">確認結帳</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const isMobile = ref(window.innerWidth < 768)

const emits = defineEmits(['edit-item'])

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const editItem = (item) => {
  emits('edit-item', item)
  cartStore.showCart = false
}

const checkout = () => {
  if (cartStore.cartItems.length === 0) {
    ElMessage.warning('購物車是空的')
    return
  }
  cartStore.showCart = false
  router.push('/checkout')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.el-button.is-circle {
  background-color: white;
  color: #606266;
  border-color: #dcdfe6;
}

.el-button.is-circle:hover {
  background-color: #f5f7fa;
  border-color: #c6c8cc;
  color: #606266;
}
</style>
