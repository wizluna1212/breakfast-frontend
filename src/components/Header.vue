<template>
  <header class="center-xy p-2 justify-between mx-3">
    <div class="justify-around">
      <img src="" alt="" />
      <p class="text-lg font-extrabold" @click="$router.push('/')">早餐店</p>
    </div>
    <nav class="space-x-3">
      <template v-for="item in displayNavItems" :key="item.path">
        <template v-if="item.label === '會員'">
          <el-dropdown v-if="userStore.isLoggedIn" trigger="click">
            <el-button link class="!h-[32px]">{{ item.label }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/member')">修改會員資料</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/member/change-password')"
                  >修改密碼</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else link class="!h-[32px]" @click="checkLogin">{{ item.label }}</el-button>
        </template>
        <el-button v-else link @click="$router.push(item.path)" class="!h-[32px]">{{
          item.label
        }}</el-button>
      </template>
    </nav>
    <div>
      <div v-if="!userStore.isLoggedIn" class="flex items-center space-x-2">
        <el-button @click="$router.push('/register')" link>註冊</el-button>
        <span class="text-gray-300">/</span>
        <el-button @click="openLogin" link>登入</el-button>
      </div>
      <span v-else class="mr-3"
        >歡迎 {{ userStore.userInfo.name }}
        <el-button @click="userStore.logout" link>登出</el-button>
      </span>
    </div>
    <Login ref="loginRef" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import Login from './Login.vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const loginRef = ref(null)
const userStore = useUserStore()

const navItems = [
  { label: '產品列表', path: '/product' },
  { label: '查詢訂單', path: '/history' },
  // { label: '我的最愛', path: '/favorite' },
  { label: '會員', path: '/member' },
  { label: '關於', path: '/about' }, //github連結
]

//登入時不顯示註冊
const displayNavItems = computed(() => {
  return userStore.isLoggedIn ? navItems.filter((item) => item.label !== '註冊') : navItems
})

//開啟登入彈窗
const openLogin = () => {
  loginRef.value.open()
}

//處理會員點擊
const checkLogin = () => {
  if (!userStore.isLoggedIn) {
    openLogin()
  }
}
</script>
