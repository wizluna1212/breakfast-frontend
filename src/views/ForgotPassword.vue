<template>
  <div class="relative max-x-md mx-auto mt-10 center-x">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">忘記密碼</div>
    <div class="border border-gray-300 w-[90%] mx-auto">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="p-5 w-full max-w-[500px] mx-auto mt-3"
        label-width="70px"
        label-position="left"
      >
        <!-- 信箱 -->
        <el-form-item label="信箱" prop="email" class="mx-auto max-w-xs">
          <el-input
            v-model="form.email"
            placeholder="請輸入註冊時的信箱"
            class="w-full max-w-[250px]"
          />
        </el-form-item>
      </el-form>
      <el-button class="w-[200px] mx-auto block mb-5 !rounded-md" type="primary" @click="submit"
        >送出</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { forgotPassword } from '@/api/api'

const formRef = ref(null)
const router = useRouter()

// 表單資料
const form = reactive({
  email: '',
})

// 表單驗證規則
const rules = {
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    { type: 'email', message: '信箱格式錯誤', trigger: 'blur' },
  ],
}

// 提交表單
const submit = async () => {
  await formRef.value.validate()
  // 模擬寄出郵件與導向 reset 頁面
  const res = await forgotPassword({ email: form.email })
  const token = res.token
  if (res.code === 0) {
    ElMessage.success('重設密碼連結已寄出，請至信箱查收（模擬）')
    setTimeout(() => {
      router.push(`/reset-password?token=${token}`)
    }, 2000)
  } else {
    ElMessage.error(res.data.message || '發送失敗')
  }
}
</script>
