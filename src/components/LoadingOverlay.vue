<template>
  <div class="absolute inset-0 bg-slate-50 z-50 center-xy flex-col text-center">
    <el-icon class="animate-spin text-5xl text-orange-400 mb-6">
      <Loading />
    </el-icon>
    <h2 class="text-2xl font-semibold text-orange-400 mb-2">正在載入中...</h2>
    <p class="text-orange-400 text-lg leading-relaxed px-6">
      免費伺服器會在閒置時自動休眠，<br />
      請耐心等候
    </p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
</script>
