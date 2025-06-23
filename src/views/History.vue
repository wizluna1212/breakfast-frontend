<template>
  <div class="p-5 px-10 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">訂單歷史記錄</h2>

    <!-- 搜尋區域 -->
    <div class="flex flex-col md:flex-row gap-5 mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="請輸入訂單編號"
        class="!w-full md:!w-[250px]"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        class="!w-full md:!w-[200px]"
        @change="search"
      />
    </div>

    <!-- 訂單列表 -->
    <div class="mt-6 center-xy">
      <div class="mx-auto w-full text-center">
        <el-table :data="filteredOrders" style="width: 100%">
          <el-table-column prop="orderId" label="訂單編號" width="200" />
          <el-table-column prop="timestamp" label="訂單產生時間" width="230">
            <template #default="{ row }">
              {{ formatDate(row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="pickupType" label="取餐方式" width="120">
            <template #default="{ row }">
              {{ row.pickupType === 'dine-in' ? '內用' : '外帶' }}
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="總金額" width="80">
            <template #default="{ row }"> ${{ row.totalPrice }} </template>
          </el-table-column>
          <el-table-column prop="takeTime" label="取餐時間" width="180">
            <template #default="{ row }">
              {{ formatDate(row.takeTime) }}
            </template>
          </el-table-column>
          <el-table-column label="訂單詳細" min-width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="showOrderDetails(row)"> 查看詳情 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 訂單詳情對話框 -->
    <el-dialog v-model="showHistory" title="訂單詳情" width="100% md:60% ">
      <div v-if="selectedOrder" class="p-3 md:p-5">
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">訂單編號：</span>
          <span>{{ selectedOrder.orderId }}</span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">訂單產生時間：</span>
          <span>{{ formatDate(selectedOrder.timestamp) }} </span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">訂購人：</span>
          <span>{{ selectedOrder.customer.name }}</span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">電話：</span>
          <span>{{ selectedOrder.customer.phone }}</span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">取餐方式：</span>
          <span>{{ selectedOrder.pickupType === 'dine-in' ? '內用' : '外帶' }}</span>
        </div>
        <div v-if="selectedOrder.pickupType === 'dine-in'" class="flex items-center mb-4">
          <span class="font-bold w-24">桌號：</span>
          <span>{{ selectedOrder.tableNumber }}</span>
        </div>
        <div v-if="selectedOrder.pickupType === 'takeout'" class="flex items-center mb-4">
          <span class="font-bold w-24">取餐時間：</span>
          <span>
            {{ selectedOrder.takeTime ? formatDate(selectedOrder.takeTime) : '未設定' }}
          </span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">付款方式：</span>
          <span>{{ selectedOrder.paymentMethod === 'cash' ? '現金' : '信用卡' }}</span>
        </div>
        <div class="flex items-center mb-4">
          <span class="font-bold w-24">備註：</span>
          <span>{{ selectedOrder.note || '無' }}</span>
        </div>

        <div class="mt-6">
          <h4 class="text-lg font-bold mb-4">訂購項目</h4>
          <!-- 標頭列 -->
          <div class="center-x border-b py-1 font-bold bg-gray-100 text-gray-400 text-center">
            <div class="w-1/2">商品名稱</div>
            <div class="w-1/4">數量</div>
            <div class="w-1/4 text-right pr-2">價格</div>
          </div>
          <!-- 商品列 -->
          <div v-for="item in selectedOrder.items" :key="item.cartId" class="border-b">
            <div class="center-xy py-1">
              <div class="w-1/2 text-lg">{{ item.name }}</div>
              <div class="w-1/4 text-center">{{ item.quantity }}</div>
              <div class="w-1/4 text-right pr-2">${{ item.price * item.quantity }}</div>
            </div>
            <!-- 加料列 -->
            <div v-if="item.extras && item.extras.length > 0">
              <div v-for="extra in item.extras" :key="extra.id">
                <div v-for="opt in extra.options" :key="opt.id" class="center-xy w-full py-1">
                  <div class="w-1/2 pl-4">{{ opt.name }} (${{ opt.price }})</div>
                  <div class="w-1/4 text-center">{{ opt.quantity }}</div>
                  <div class="w-1/4 text-right pr-2">${{ opt.price * opt.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 text-right">
          <span class="font-bold">總金額：</span>
          <span class="text-xl text-red-500 font-bold ml-2">${{ selectedOrder.totalPrice }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderHistoryStore } from '@/stores/historyStore'
import { Search } from '@element-plus/icons-vue'

const historyStore = useOrderHistoryStore()
const searchQuery = ref('')
const dateRange = ref([])
const showHistory = ref(false)
const selectedOrder = ref(null)

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 過濾訂單
const filteredOrders = computed(() => {
  let orders = historyStore.historyOrders

  // 根據訂單編號搜尋
  if (searchQuery.value) {
    orders = orders.filter((order) =>
      order.orderId.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // 根據日期範圍篩選
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    orders = orders.filter((order) => {
      const orderDate = new Date(order.timestamp)
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate + ' 23:59:59')
    })
  }

  return orders
})

// 顯示訂單詳情
const showOrderDetails = (order) => {
  console.log('訂單詳情:', {
    orderId: order.orderId,
    pickupType: order.pickupType,
    takeTime: order.takeTime,
    timestamp: order.timestamp,
  })
  selectedOrder.value = order
  showHistory.value = true
}

// 處理搜尋
const handleSearch = () => {
  // 搜尋邏輯已通過 computed 屬性實現
}

onMounted(async () => {
  await historyStore.init()
})
</script>
