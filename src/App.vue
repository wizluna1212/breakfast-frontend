<template>
  <RouterView />
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 監聽登入狀態變化
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    const currentRoute = router.currentRoute.value

    if (!isLoggedIn) {
      // 用戶登出時，只有特定頁面需要跳轉到首頁
      const routesToRedirect = ['memberProfile', 'changePassword']
      if (routesToRedirect.includes(currentRoute.name)) {
        router.push('/')
      }
    }
  },
  { immediate: true },
)
</script>
