<template>
  <el-dialog
    v-model="showLogin"
    title="會員登入"
    :before-close="handleClose"
    class="center-xy w-[400px] flex-col"
  >
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="信箱" prop="email">
        <el-input v-model="form.email" placeholder="請輸入信箱" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="form.password" type="password" placeholder="請輸入密碼" />
        <div
          class="text-gray-500 cursor-pointer hover:text-red-600-500"
          @click="goToforgotPassword"
        >
          忘記密碼
        </div>
      </el-form-item>
    </el-form>
    <div class="center-x">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleLogin">登入</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '@/api/login'
import { useUserStore } from '@/stores/userStore'
import { useRouter, useRoute } from 'vue-router'
import { logRaw } from '@/utils/Logger'

const showLogin = ref(false) //彈窗開關
const formRef = ref(null) //表單參考
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

//登入
const form = reactive({
  email: '',
  password: '',
})

//登入驗證規則
const rules = {
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    { type: 'email', message: '信箱格式錯誤', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少需 6 碼', trigger: 'blur' },
  ],
}

//登入按鈕邏輯
const handleLogin = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()

    const res = await login({ ...form })
    if (res.code === 0) {
      // 先設置會員資料，再設置 token
      userStore.setUserInfo(res.data.user)
      userStore.setToken(res.data.token)

      logRaw('登入成功，會員資料：', userStore.userInfo)
      logRaw('登入成功，token：', userStore.token)
      logRaw('登入狀態：', userStore.isLoggedIn)

      ElMessage.success('登入成功')
      showLogin.value = false

      //如果在註冊頁面則跳轉至首頁
      if (route.path === '/register') {
        router.push('/')
      }
    }
  } catch (error) {
    // 處理未預期的錯誤
    if (error.response) {
      // 處理 HTTP 錯誤
      switch (error.response.status) {
        case 401:
          ElMessage.error('找不到此帳號')
          break
        case 403:
          ElMessage.error('密碼錯誤')
          break
        default:
          ElMessage.error(error.response.data?.message || '登入失敗')
      }
    }
    console.error('登入錯誤：', error)
  }
}

//關閉彈窗
const handleClose = () => {
  showLogin.value = false
  formRef.value.resetFields()
}

//跳轉到忘記密碼頁面
const goToforgotPassword = () => {
  showLogin.value = false
  router.push('/forgot-password')
}

//父層可控制開關
defineExpose({
  open: () => (showLogin.value = true),
})
</script>
