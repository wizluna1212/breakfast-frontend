```path=src/views/OrderView.vue
<!-- Order.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- 上方固定 -->
    <div class="sticky top-0 z-10 bg-orange-300">
      <div class="center-xy my-3">開始訂購</div>
      <div class="bg-gray-100 overflow-x-auto space-x-3">
        <el-button
          v-for="category in cartStore.categories"
          :key="category.id"
          @click="cartStore.btnCategories(category)"
          class="my-3 !rounded-full relative"
          >{{ category.name }}
          <div
            v-if="cartStore.categoryQuantity(category.id) > 0"
            class="absolute -top-1 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full center-xy"
          >
            {{ cartStore.categoryQuantity(category.id) }}
          </div></el-button
        >

        <el-button @click="cartStore.toggleCategories()">▼</el-button>
      </div>
      <div class="bg-white p-2 flex center-y border-b">
        <el-icon class="mx-2"><Search /></el-icon>
        <input
          type="text"
          placeholder="搜尋所有商品"
          class="border-b border-black flex-1 outline-none"
          v-model="cartStore.searchQuery"
          @click="cartStore.searchProduct"
        />
      </div>
    </div>

    <!-- 商品列表(可滾動區域)) -->
    <div class="bg-white">
      <p
        v-if="cartStore.searchQuery === '' && cartStore.selectedCategoryId"
        class="center-x m-3 text-lg font-bold"
      >
        {{ cartStore.selectedCategoryName || '加載中...' }}
      </p>
      <div
        v-for="product in cartStore.searchProduct"
        :key="product.id"
        @click="cartStore.toggleProduct(product)"
        class="border-b text-lg p-3 ml-2 center-y justify-between"
      >
        <!-- 左側商品 -->
        <div>
          <div>{{ product.name }}</div>
          <div>${{ product.price }}</div>
        </div>
        <!-- 右側商品總計數量 -->
        <div
          v-if="cartStore.productQuantity(product.id) > 0"
          class="bg-orange-300 w-8 h-8 rounded-full center-xy"
        >
          {{ cartStore.productQuantity(product.id) }}
        </div>
      </div>
    </div>

    <!-- 固定底部區：訂單小計 -->
    <div class="bg-gray-100 fixed bottom-0 h-12 w-full center-y justify-between px-5">
      <p class="ml-3">
        訂單小計<span class="text-red-500 bold ml-2">${{ cartStore.totalPrice }}</span>
      </p>
      <el-button
        class="center-xy bg-orange-400 text-white !rounded-full w-[200px] h-[80%]"
        @click="confirmOrder()"
        >確認訂單</el-button
      >
    </div>
  </div>

  <!-- 購物車 -->
  <div
    class="bg-gray-500 size-12 rounded-full center-xy fixed right-4 bottom-12"
    @click="cartStore.toggleCart"
  >
    <div
      v-if="cartStore.cartItemsQuantity > 0"
      class="absolute -top-1 -right-0 rounded-full w-5 h-5 bg-red-500 text-white text-xs center-xy"
    >
      {{ cartStore.cartItemsQuantity }}
    </div>
    <el-icon class="!text-white !text-2xl"><ShoppingCart /></el-icon>
  </div>

  <!-- 購物車元件 -->
  <Cart
    v-model:showCart="cartStore.showCart"
    :cartItems="cartStore.cartItems"
    :totalPrice="cartStore.totalPrice"
    :confirmOrder="confirmOrder"
    @edit-product="cartStore.toggleProduct"
    @delete-product="cartStore.deleteProduct"
  />

  <!-- --------------------------彈窗------------------------- -->

  <!-- 商品類別彈窗 -->
  <el-dialog v-model="cartStore.showCategories" title="商品類別" :fullscreen="true">
    <div
      v-for="category in cartStore.categories"
      :key="category.id"
      @click="cartStore.selectDialogCategory(category)"
      class="border border-black p-4"
    >
      {{ category.name }}
    </div>
  </el-dialog>

  <!-- 商品內容彈窗 -->
  <el-dialog v-model="cartStore.showProduct" class="">
    <p class="text-lg font-bold">{{ cartStore.selectedProduct.name }}</p>
    <p class="text-lg font-bold">${{ cartStore.selectedProduct.price }}</p>
    <div
      v-if="
        Array.isArray(cartStore.selectedProduct.extras) &&
        cartStore.selectedProduct.extras.length > 0
      "
    >
      <div v-for="extra in cartStore.selectedProduct.extras" :key="extra.id">
        <!-- 可多選加料 -->
        <div v-if="extra.type === 'add-on'">
          <p class="text-lg font-bold">加料</p>
          <el-button
            v-for="option in extra.options"
            :key="option.id"
            @click="cartStore.selectMultipleExtras(extra, option)"
            >{{ option.name }} + ${{ option.price }}</el-button
          >
        </div>
        <!-- 必選的單選加料 -->
        <div v-if="['single-choice', 'size', 'tempture'].includes(extra.type)">
          <p class="text-lg font-bold">
            <span class="text-red-500 mx-1">必選</span>{{ cartStore.getExtraTitle(extra.type) }}
          </p>
          <el-radio-group
            :model-value="
              cartStore.selectedExtra.find((item) => item.type === extra.type)?.id || null
            "
            @update:model-value="(val) => cartStore.selectSingleExtra(extra, val)"
          >
            <el-radio v-for="option in extra.options" :key="option.id" :label="option.id">
              {{ option.name }} + ${{ option.price }}</el-radio
            >
          </el-radio-group>
        </div>
      </div>

      <div
        v-if="
          Array.isArray(cartStore.selectedExtra) &&
          cartStore.selectedExtra.some((extra) => extra.type === 'add-on')
        "
      >
        <p class="text-lg font-bold">已選擇的加料</p>
        <div v-for="extra in cartStore.addOnExtra" :key="extra.id" class="center-y mb-2">
          <el-select v-model="extra.quantity" class="!w-20"
            >▼
            <el-option
              v-for="n in cartStore.quantityOptions"
              :key="n"
              :value="n"
              :label="n"
              @change="(quantity) => cartStore.getExtraNum(extra, quantity)"
            ></el-option>
          </el-select>
          <div class="mx-2">
            {{ extra.name }}　${{ extra.price * extra.quantity }} ({{ extra.price }}元 x
            {{ extra.quantity }}個)
          </div>
        </div>
      </div>
    </div>

    <div class="center-xy flex-col">
      <el-input-number v-model="cartStore.selectedProduct.quantity" :min="0" class="my-3" />
      <div>
        <el-button class="!bg-gray-200 !rounded-full" @click="cartStore.showProduct = false"
          >回目錄</el-button
        >
        <el-button class="!bg-orange-200 !rounded-full" @click="cartStore.addToCart()"
          >選好了</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStoreOld'
import { ElMessage } from 'element-plus'
import { Search, ShoppingCart } from '@element-plus/icons-vue'
import Cart from '@/components/CartModalOld.vue'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

//確認購買
const confirmOrder = () => {
  if (cartStore.cartItems.length === 0) {
    ElMessage.error('購物車是空的喔')
    return
  }
  router.push('/checkout')
}

onMounted(() => {
  cartStore.fetchCategories()
})
</script>
