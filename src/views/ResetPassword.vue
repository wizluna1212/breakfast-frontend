<template>
  <div class="relative max-x-md mx-auto mt-10 center-x">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">重設密碼</div>
    <div class="border border-gray-300 w-[90%] mx-auto">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="p-5 w-[70%] mx-auto mt-3"
        label-width="120px"
      >
        <!-- 新密碼 -->
        <el-form-item label="新密碼" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            show-password
            placeholder="密碼需8-12位，需有英文大小寫及數字"
          />
        </el-form-item>
        <!-- 確認新密碼 -->
        <el-form-item label="確認新密碼" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="請輸入相同的新密碼"
          />
        </el-form-item>
      </el-form>
      <el-button class="w-[200px] mx-auto block mb-5 !rounded-md" type="primary" @click="submit"
        >重設密碼</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/api/api'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
// 表單資料
const form = reactive({
  newPassword: '',
  confirmPassword: '',
})

// 表單驗證規則
const rules = {
  newPassword: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,12}$/,
      message: '密碼需8-12位，含英文大小寫與數字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '請輸入確認密碼', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 提交表單
const submit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    const token = route.query.token

    const res = await resetPassword({
      token: token,
      newPassword: form.newPassword,
    })
    if (res.code === 0) {
      ElMessage.success('密碼重設成功，請重新登入')
      router.push('/')
    } else {
      ElMessage.error(res.message || '密碼重設失敗')
    }
  } catch (error) {
    console.error('驗證失敗', error)
    ElMessage.error('密碼重設失敗')
  }
}
</script>
