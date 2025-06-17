<template>
  <el-tabs v-model="activeCategory" class="px-4">
    <!-- 商品類別 -->
    <el-tab-pane
      v-for="category in categories"
      :key="category.id"
      :label="category.name"
      :name="category.id"
    />
  </el-tabs>
  <!-- 查詢 -->
  <div class="w-[80%] mx-auto mb-4">
    <el-input v-model="searchKeyword" placeholder="搜尋商品">
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
  <!-- 商品 -->
  <div class="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
    <el-card
      v-for="product in displayProducts"
      :key="product.id"
      class="h-[300px] w-[300px] mb-5 relative"
    >
      <div class="h-[200px] w-full overflow-hidden">
        <img
          :src="`/breakfast-frontend/images/${product.image}.jpg`"
          :alt="product.name"
          loading="lazy"
          class="w-full h-full object-cover object-center"
        />
      </div>
      <div class="text-xl font-semibold pt-2">{{ product.name }}</div>
      <div class="text-red-500">${{ product.price }}</div>
      <div
        class="h-8 w-8 rounded-full center-xy bg-slate-200 absolute right-5 bottom-5 cursor-pointer hover:bg-orange-100"
        @click="toggleProductDia(product)"
      >
        <el-icon><ShoppingCart /></el-icon>
      </div>
    </el-card>
  </div>
  <!-- 購物車圖示 -->
  <div
    class="fixed bottom-[80px] right-3 h-10 w-10 center-xy rounded-full bg-orange-400 text-white"
    @click="cartStore.toggleCart"
  >
    <div
      v-if="cartStore.cartItems.length > 0"
      class="absolute -top-1 -right-0 h-5 w-5 rounded-full bg-red-600 text-white center-xy text-sm"
    >
      {{ cartStore.cartItems.length }}
    </div>
    <el-icon><ShoppingCart /></el-icon>
  </div>
  <!-- 商品頁彈窗 -->
  <el-dialog v-model="cartStore.showProduct" class="!w-full md:!w-[50%]">
    <el-card class="!h-full overflow-y-auto">
      <div class="h-[220px] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          :src="`/breakfast-frontend/images/${selectedProduct.image}.jpg`"
          :alt="selectedProduct.name"
          loading="lazy"
          class="max-w-full max-h-full object-contain"
        />
      </div>
      <div class="text-xl font-bold">
        {{ selectedProduct.name }}
        <span class="text-red-800 ml-4 text-lg">${{ selectedProduct.price }}</span>
      </div>
      <!-- 加料複選有數量 -->
      <div v-for="extra in hasExtras" :key="extra.id">
        <div v-if="extra.type === 'add-on'">
          <el-button
            v-for="opt in extra.options"
            :key="opt.id"
            @click="addMultipleExtras(extra, opt)"
          >
            <div>{{ opt.name }}</div>
            <div>${{ opt.price }}</div></el-button
          >
          <!-- 被選擇的選項 -->
          <div class="py-2">
            <div class="font-bold">加料區</div>
            <!-- 可複選加料 -->
            <div
              v-for="item in selectedExtra.find((e) => e.id === extra.id)?.options || []"
              :key="item.id"
              class="flex gap-2"
            >
              <div v-if="item.quantity > 0" class="flex gap-2">
                <el-input-number v-model="item.quantity" :min="0" :max="3" class="h-5 w-30" />
                <div>{{ item.name }}</div>
                <div>共${{ item.price * item.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 加料單選 -->
        <div v-if="['single-choice', 'size', 'tempture'].includes(extra.type)">
          <div class="font-bold">{{ getType(extra.type) }}</div>
          <el-radio-group v-model="singleSelected[extra.type]">
            <el-radio
              v-for="opt in extra.options"
              :key="opt.id"
              :value="opt.name"
              @click="addSingleExtras(extra, opt)"
            >
              {{ opt.name }} +${{ opt.price }}</el-radio
            >
          </el-radio-group>
        </div>
        <!-- 加料複選 -->
        <div v-if="extra.type === 'condiments'">
          <div class="font-bold">{{ extra.name }}</div>
          <el-checkbox-group v-model="selectedCondiments">
            <el-checkbox
              v-for="opt in extra.options"
              :key="opt.id"
              :label="opt.name"
              @click="addMultipleExtras(extra, opt)"
              >{{ opt.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>

      <!-- 加入購物車 -->
      <div class="center-xy py-3 gap-3">
        <el-input-number
          v-if="selectedProduct.quantity"
          v-model="selectedProduct.quantity"
          :min="1"
          class="w-[100px]"
        />

        <el-button
          class="flex-1 rounded-md text-white text-lg font-semibold relative"
          type="primary"
          @click="addToCart"
          >加入購物車 <span class="absolute right-2">+${{ productPrice }}</span></el-button
        >
      </div>
    </el-card>
  </el-dialog>
  <!-- 購物車抽屜 -->
  <CartDrawer @edit-item="editItem" />
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { Search, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cartStore'
import { logRaw } from '@/utils/Logger'
import CartDrawer from '@/components/CartDrawer.vue'
import { getMenu } from '@/api/api'

const cartStore = useCartStore()
const activeCategory = ref(0)
const searchKeyword = ref('')
const categories = ref([])
const products = ref([])
const extras = ref([])

const filteredProducts = computed(() => {
  if (activeCategory.value === 0) {
    return products.value
  }
  return products.value.filter((p) => p.cateId === activeCategory.value)
})

//根據關鍵字搜尋商品
const searchedProducts = computed(() => {
  if (!searchKeyword.value) return []
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})

//最終顯示的商品列表
const displayProducts = computed(() => {
  return searchKeyword.value ? searchedProducts.value : filteredProducts.value
})

// ----- 商品選擇相關 -----
const selectedProduct = ref({
  name: '',
  price: 0,
  quantity: 1,
  extraType: [],
  extras: [],
}) //點選的商品
const hasExtras = ref([]) //有加料選擇的商品
const selectedExtra = ref([]) //選擇的加料
const selectedCondiments = ref([]) //選擇的調味料

//打開商品彈窗
const toggleProductDia = (product) => {
  logRaw('toggleProductDia 被調用，傳入商品:', product)
  // 如果是從購物車編輯過來的
  if (cartStore.editingItem) {
    logRaw('從購物車編輯模式，editingItem:', cartStore.editingItem)
    selectedProduct.value = { ...cartStore.editingItem }
    hasExtras.value = cartStore.editingItem.extraType?.length
      ? extras.value.filter((extra) => cartStore.editingItem.extraType.includes(extra.id))
      : []
    selectedExtra.value = cartStore.editingItem.extras || []
    selectedCondiments.value = cartStore.editingItem.extras
      .filter((extra) => extra.type === 'condiments')
      .flatMap((extra) => extra.options.map((opt) => opt.name))
    logRaw('編輯模式下的初始化狀態:', {
      selectedProduct: selectedProduct.value,
      hasExtras: hasExtras.value,
      selectedExtra: selectedExtra.value,
      selectedCondiments: selectedCondiments.value,
    })
  } else {
    logRaw('新增商品模式，product:', product)
    selectedProduct.value = { ...product, quantity: 1 }
    hasExtras.value = product.extraType?.length
      ? extras.value.filter((extra) => product.extraType.includes(extra.id))
      : []
    selectedExtra.value = []
    selectedCondiments.value = []
    logRaw('新增模式下的初始化狀態:', {
      selectedProduct: selectedProduct.value,
      hasExtras: hasExtras.value,
      selectedExtra: selectedExtra.value,
      selectedCondiments: selectedCondiments.value,
    })
  }

  // 設置單選加料的預設值
  hasExtras.value.forEach((extra) => {
    if (['single-choice', 'size', 'tempture'].includes(extra.type)) {
      const selectedOption = selectedExtra.value.find((e) => e.type === extra.type)?.options[0]
      singleSelected.value[extra.type] = selectedOption?.name || extra.options[0].name
      if (!selectedOption) {
        addSingleExtras(extra, extra.options[0])
      }
    }
  })
  logRaw('設置單選加料後的狀態:', {
    singleSelected: singleSelected.value,
    selectedExtra: selectedExtra.value,
  })

  cartStore.showProduct = true
}

//單選加料放進selectedExtra
const addSingleExtras = (extra, opt) => {
  const extraIndex = selectedExtra.value.findIndex((e) => e.type === extra.type)

  if (extraIndex === -1) {
    // 如果不存在該類型的選項，添加新的
    selectedExtra.value.push({
      id: extra.id,
      name: extra.name,
      type: extra.type,
      options: [{ ...opt, quantity: 1 }].sort((a, b) => a.id - b.id),
    })
  } else {
    // 如果已存在該類型的選項，更新選項
    selectedExtra.value[extraIndex].options = [{ ...opt, quantity: 1 }].sort((a, b) => a.id - b.id)
  }
  // 對 selectedExtra 進行排序
  selectedExtra.value.sort((a, b) => a.id - b.id)
  selectedExtra.value = [...selectedExtra.value]
}

//可複選加料(add-on)
const addMultipleExtras = (extra, opt) => {
  const extraIndex = selectedExtra.value.findIndex((e) => e.id === extra.id)

  if (extraIndex === -1) {
    selectedExtra.value.push({
      id: extra.id,
      name: extra.name,
      type: extra.type,
      options: [{ ...opt, quantity: 1 }].sort((a, b) => a.id - b.id),
    })
  } else {
    const options = selectedExtra.value[extraIndex].options
    const optIndex = options.findIndex((o) => o.id === opt.id)

    if (optIndex === -1) {
      options.push({ ...opt, quantity: 1 })
    } else {
      // 如果是調味料，保持數量為1
      if (extra.type === 'condiments') {
        options[optIndex].quantity = 1
      } else {
        // 其他加料類型可以調整數量
        if (options[optIndex].quantity === 0) {
          options[optIndex].quantity = 1
        }
      }
    }
    // 對選項進行排序
    options.sort((a, b) => a.id - b.id)
  }
  // 對 selectedExtra 進行排序
  selectedExtra.value.sort((a, b) => a.id - b.id)
  // 強制更新 selectedExtra
  selectedExtra.value = [...selectedExtra.value]
}

//監聽調味料的選擇
watch(
  selectedCondiments,
  (newVal) => {
    // 找到所有調味料類型的加料
    const condimentExtras = hasExtras.value.filter((extra) => extra.type === 'condiments')

    condimentExtras.forEach((extra) => {
      const extraIndex = selectedExtra.value.findIndex((e) => e.id === extra.id)

      // 只保留被選擇的選項，並設置數量為1
      const selectedOptions = extra.options
        .filter((opt) => newVal.includes(opt.name))
        .map((opt) => ({ ...opt, quantity: 1 }))
        .sort((a, b) => a.id - b.id)

      if (extraIndex === -1) {
        // 如果是新的調味料類型，且至少有一個選項被選擇
        if (selectedOptions.length > 0) {
          selectedExtra.value.push({
            id: extra.id,
            name: extra.name,
            type: extra.type,
            options: selectedOptions,
          })
        }
      } else {
        // 更新現有調味料的選項
        if (selectedOptions.length > 0) {
          selectedExtra.value[extraIndex].options = selectedOptions
        } else {
          // 如果沒有選項被選擇，移除這個調味料類型
          selectedExtra.value.splice(extraIndex, 1)
        }
      }
    })

    // 對 selectedExtra 進行排序
    selectedExtra.value.sort((a, b) => a.id - b.id)
    // 強制更新 selectedExtra
    selectedExtra.value = [...selectedExtra.value]
  },
  { deep: true },
)

//加料總類的名稱
const getType = (type) => {
  switch (type) {
    case 'single-choice':
      return '麵包選擇'
    case 'size':
      return '尺寸'
    case 'tempture':
      return '溫度'
    default:
      return '必選'
  }
}

//加料單選的綁定
const singleSelected = ref({ size: '', tempture: '', 'single-choice': '' })

// 計算商品總價
const productPrice = computed(() => {
  // 過濾掉數量為0的選項
  const filteredExtras = selectedExtra.value
    .map((extra) => ({
      ...extra,
      options: extra.options.filter((opt) => opt.quantity > 0),
    }))
    .filter((extra) => extra.options.length > 0)

  const product = {
    ...selectedProduct.value,
    extras: filteredExtras,
  }
  return cartStore.getItemTotal(product)
})

//加入購物車
const addToCart = () => {
  // 確保商品有基本屬性
  const productToAdd = {
    ...selectedProduct.value,
    cartId: selectedProduct.value.cartId || crypto.randomUUID(),
    extraType: selectedProduct.value.extraType || [],
  }

  // 確保 extras 是有效的數組，並過濾掉數量為 0 的選項
  const extrasToAdd = (selectedExtra.value || [])
    .map((extra) => ({
      ...extra,
      options: extra.options.filter((opt) => opt.quantity > 0).sort((a, b) => a.id - b.id), //按id排列，以便做相同商品合併
    }))
    .filter((extra) => extra.options.length > 0)
    .sort((a, b) => a.id - b.id)

  cartStore.addToCart(productToAdd, extrasToAdd)
  cartStore.showProduct = false
  cartStore.clearEditingItem()

  // 清空所有狀態
  selectedProduct.value = {
    name: '',
    price: 0,
    quantity: 1,
    extraType: [],
    extras: [],
  }
  selectedExtra.value = []
  selectedCondiments.value = []
  hasExtras.value = []
  singleSelected.value = { size: '', tempture: '', 'single-choice': '' }
}

//觀測用
watch(
  selectedExtra,
  (newVal) => {
    logRaw('選擇的加料更新了:', newVal)
  },
  { deep: true },
)

// 處理編輯商品
const editItem = (item) => {
  cartStore.setEditingItem(item)
  toggleProductDia(item)
}

// 監聽商品彈窗顯示狀態
watch(
  () => cartStore.showProduct,
  (newVal) => {
    if (newVal && cartStore.editingItem) {
      logRaw('商品彈窗打開，初始化編輯商品:', cartStore.editingItem)
      nextTick(() => {
        toggleProductDia(cartStore.editingItem)
      })
    }
  },
)

// ----- API -----
const fetchMenu = async () => {
  try {
    const res = await getMenu()
    if (res && res.data) {
      categories.value = res.data.categories || []
      products.value = res.data.products || []
      extras.value = res.data.extras || []
    }
  } catch (error) {
    logRaw('獲取菜單失敗:', error)
  }
}

onMounted(() => {
  fetchMenu()
})

// 監聽類別變化
watch(activeCategory, () => {
  searchKeyword.value = ''
})
</script>
