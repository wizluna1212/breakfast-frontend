<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="relative">
      <H1
        class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-2xl text-gray-700 font-semibold whitespace-nowrap text-center"
      >
        關於這個專案
      </H1>
      <div
        class="border-2 border-gray-200 rounded-lg shadow-lg w-[90%] mx-auto p-8 bg-white hover:border-orange-300 transition-colors duration-300"
      >
        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3 text-gray-700 border-b border-gray-100 pb-2">
            專案介紹
          </h2>
          <p class="mb-4 text-gray-600 leading-relaxed">
            這是一個早餐店點餐系統作品，使用 Vue 3、Pinia 做狀態管理，Element Plus 作為 UI 框架。
            包含會員系統、購物車、多種加料選項及訂單查詢等功能，模擬電商流程。
          </p>
          <ul class="list-disc pl-6 space-y-2 text-gray-600">
            <li>商品管理：支援商品分類、搜尋功能，可自定義加料選項</li>
            <li>購物車系統：可加入商品、編輯數量、選擇加料，即時計算總價</li>
            <li>會員系統：提供註冊、登入、登出功能，支援密碼重設</li>
            <li>訂單查詢：可依照會員或訪客身分顯示各自的訂單</li>
            <li>響應式設計：支援各種裝置尺寸，提供最佳使用體驗</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3 text-gray-700 border-b border-gray-100 pb-2">
            技術棧
          </h2>
          <ul class="list-disc ml-5 text-gray-600">
            <li>Vue 3 + Composition API</li>
            <li>Pinia 狀態管理</li>
            <li>Element Plus UI 元件</li>
            <li>TailwindCSS</li>
            <li>Axios 請求 API</li>
            <li>JSON Server + Express 模擬後端</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3 text-gray-700 border-b border-gray-100 pb-2">
            專案動機
          </h2>
          <p class="text-gray-600 leading-relaxed">
            非本科背景，轉職學習前端開發，並以
            Vue製作前後端分離的電商網站作為實作練習，整合登入驗證、購物車與查詢訂單等功能。
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3 text-gray-700 border-b border-gray-100 pb-2">
            GitHub 原始碼
          </h2>
          <p>
            <a
              href="https://github.com/wizluna1212/breakfast-frontend.git"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              原始碼連結
            </a>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'AboutPage',
})
</script>
