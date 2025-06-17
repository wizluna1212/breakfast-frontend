<template>
  <div class="fixed inset-0 bg-slate-50 z-50 center-xy flex-col text-center">
    <el-icon class="animate-spin text-5xl text-orange-400 mb-6">
      <Loading />
    </el-icon>
    <h2 class="text-2xl font-semibold text-orange-600 mb-2">正在載入中...</h2>
    <p class="text-orange-500 mb-2 text-xl">
      由於使用免費伺服器，首次載入可能需要等待約 <span class="font-bold">50 秒</span>
    </p>
    <p class="text-orange-400 text-xl leading-relaxed px-6">
      免費伺服器會在閒置時自動休眠，<br />
      重新啟動需要一些時間，請耐心等候 🙏
    </p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
</script>
