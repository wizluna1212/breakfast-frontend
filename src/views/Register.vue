<template>
  <div class="relative max-x-md mx-auto mt-10 center-x">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">會員註冊</div>
    <div class="border border-gray-300 w-[90%] mx-auto">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="p-5 w-full max-w-[500px] mx-auto mt-3"
        label-width="120px"
      >
        <!-- 帳號 -->
        <el-form-item label="帳號" prop="email">
          <el-input v-model="form.email" placeholder="請輸入email做為您的帳號" />
        </el-form-item>
        <!-- 密碼 -->
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="密碼需8-12位，需有英文大小寫及數字"
          />
        </el-form-item>
        <!-- 再次輸入密碼 -->
        <el-form-item label="再次輸入密碼" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="請輸入相同的密碼"
          />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="會員姓名" prop="name">
          <el-input v-model="form.name" placeholder="請輸入真實姓名(如:王曉明)" />
        </el-form-item>
        <!-- 生日 -->
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="請選擇生日"
            format="YYYY/MM/DD"
            value-format="YYYY/MM/DD"
            :disabled-date="(date) => date.getTime() > Date.now()"
          />
        </el-form-item>
        <!-- 電話 -->
        <el-form-item label="手機號碼" prop="phone">
          <el-input
            v-model="form.phone"
            type="tel"
            maxlength="11"
            placeholder="請輸入手機號碼，如0900123456"
            @blur="formatPhone"
          />
        </el-form-item>
        <!-- 驗證碼 -->
        <el-form-item label="驗證碼" prop="captcha">
          <div class="center-x space-x-3">
            <el-input v-model="form.captcha" placeholder="請輸入4位數字驗證碼" class="w-[300px]" />
            <div class="border border-gray-300 px-2">{{ randomCode }}</div>
            <el-button @click="getRandomCode" link>重新產生</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button class="w-[200px] mx-auto block mb-5 !rounded-md" type="primary" @click="submit"
        >註冊</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { register } from '@/api/login'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const formRef = ref(null) //表單參考
const randomCode = ref('') //驗證碼
const userStore = useUserStore() //存使用者資料
const router = useRouter() //路由

//註冊表單
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  birthday: '',
  phone: '',
  captcha: '',
})

//表單規則
const rules = {
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    {
      type: 'email',
      message: '信箱格式錯誤',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,12}$/,
      message: '密碼需8-12位，含英文大小寫與數字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.password) {
          callback(new Error('密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  name: [
    { required: true, message: '請輸入姓名', trigger: 'blur' },
    { pattern: /^[^\d]+$/, message: '姓名不能包含數字', trigger: 'blur' }, //不能有數字
  ],
  phone: [
    { required: true, message: '請輸入電話', trigger: 'blur' },
    { pattern: /^09\d{2}-\d{6}$/, message: '電話格式長度錯誤', trigger: 'blur' }, //台灣手機格式09xx-xxxxxx
  ],
  captcha: [
    { required: true, message: '請輸入驗證碼', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '驗證碼錯誤', trigger: 'blur' },
  ],
}

//電話格式加-
const formatPhone = () => {
  const digits = form.phone.replace(/\D/g, '').slice(0, 10)

  if (digits > 4) {
    form.phone = digits.slice(0, 4) + '-' + digits.slice(4)
  } else {
    form.phone = digits
  }
}

//產生4位數驗證碼
const getRandomCode = () => {
  randomCode.value = Math.floor(1000 + Math.random() * 9000).toString()
}

const submit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()

    //驗證碼比對
    if (form.captcha !== randomCode.value) {
      ElMessage.error('驗證碼錯誤')
      getRandomCode()
      return
    }

    //手機格式去掉-
    const purePhone = form.phone.replace(/-/g, '')

    const res = await register({ ...form, phone: purePhone, createdAt: Date.now() })
    if (res.code === 0) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.user)
      console.log('登入成功', userStore.userInfo)
      ElMessage.success('註冊成功')
      setTimeout(() => {
        ElMessage.success('登入成功')
        router.push('/')
      }, 3000)
    } else {
      ElMessage.error(res.message || '註冊失敗')
      getRandomCode()
    }
  } catch (error) {
    ElMessage.error('請確認所有欄位正確')
    console.error('驗證失敗', error)
    getRandomCode()
  }
}
onMounted(() => {
  getRandomCode()
})
</script>
