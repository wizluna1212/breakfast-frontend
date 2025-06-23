<template>
  <header class="p-2 pt-3 mx-3 border-b border-gray-200 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between relative">
      <p
        class="text-lg font-extrabold text-center md:text-left mb-2 md:mb-0"
        @click="$router.push('/')"
      >
        晨光早餐店
      </p>
      <!-- 響應式導覽列 -->
      <el-button
        class="md:hidden absolute -right-1 -top-1 hover:bg-orange-100"
        @click="showDrawer = true"
        circle
        ><el-icon><MoreFilled /></el-icon
      ></el-button>
      <!-- 大螢幕選單（水平排列） -->
      <div class="hidden md:center-y space-x-3">
        <nav class="">
          <template v-for="item in displayNavItems" :key="item.path">
            <template v-if="item.label === '會員'">
              <el-dropdown v-if="userStore.isLoggedIn" trigger="click">
                <el-button link class="!h-[32px]">{{ item.label }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="$router.push('/member')"
                      >修改會員資料</el-dropdown-item
                    >
                    <el-dropdown-item @click="$router.push('/member/change-password')"
                      >修改密碼</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button v-else link class="!h-[32px]" @click="checkLogin">{{
                item.label
              }}</el-button>
            </template>
            <el-button v-else link @click="$router.push(item.path)" class="!h-[32px]">{{
              item.label
            }}</el-button>
          </template>
        </nav>
        <div>
          <div v-if="!userStore.isLoggedIn" class="center-y !px-0 !justify-start">
            <el-button @click="$router.push('/register')" link>註冊</el-button>
            <span class="text-gray-300">/</span>
            <el-button @click="openLogin" link>登入</el-button>
          </div>
          <span v-else class="mr-3"
            >歡迎 {{ userStore.userInfo.name }}
            <el-button @click="userStore.logout" link>登出</el-button>
          </span>
        </div>
      </div>
    </div>
    <Login ref="loginRef" />
    <!-- 小螢幕抽屜選單 -->
    <el-drawer
      v-model="showDrawer"
      direction="rtl"
      size="200px"
      :with-header="false"
      class="md:hidden"
    >
      <!-- 菜單 -->
      <nav class="flex flex-col space-y-2 items-start px-2">
        <template v-for="item in displayNavItems" :key="item.path">
          <div class="w-full">
            <template v-if="item.label === '會員'">
              <el-dropdown v-if="userStore.isLoggedIn" trigger="click">
                <el-button link class="!h-[32px]">{{ item.label }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDrawerNav('/member')"
                      >修改會員資料</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleDrawerNav('/member/change-password')"
                      >修改密碼</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button v-else link class="!h-[32px]" @click="checkLogin">{{
                item.label
              }}</el-button>
            </template>
            <el-button v-else link @click="handleDrawerNav(item.path)" class="!h-[32px]">{{
              item.label
            }}</el-button>
          </div>
        </template>
      </nav>
      <!-- 登入 -->
      <div class="flex justify-center pt-3 w-full">
        <div class="w-full px-2">
          <div v-if="!userStore.isLoggedIn" class="flex justify-start space-x-2">
            <el-button @click="$router.push('/register')" link>註冊</el-button>
            <span class="text-gray-300">/</span>
            <el-button @click="openLogin" link>登入</el-button>
          </div>
          <div v-else class="flex justify-start items-center space-x-2">
            <span>歡迎 {{ userStore.userInfo.name }}</span>
            <el-button @click="userStore.logout" link>登出</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import Login from './Login.vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const loginRef = ref(null)
const userStore = useUserStore()
const showDrawer = ref(false) //顯示選單按鈕
const router = useRouter()

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

// 點擊選單選項後會自動關閉抽屜並跳轉
const handleDrawerNav = (path) => {
  showDrawer.value = false
  router.push(path)
}
</script>
