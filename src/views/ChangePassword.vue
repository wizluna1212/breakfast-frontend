<template>
  <div class="relative">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">修改密碼</div>
    <div class="border border-gray-300 w-[90%] mx-auto">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="p-5 w-[70%] mx-auto mt-3"
        label-width="120px"
      >
        <!-- 舊密碼 -->
        <el-form-item label="舊密碼" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            show-password
            placeholder="請輸入舊密碼"
          />
        </el-form-item>
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
        >確認修改</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { changePassword } from '@/api/api'

defineOptions({
  name: 'ChangePasswordView',
})

const formRef = ref(null)
const userStore = useUserStore()
const router = useRouter()

// 表單資料
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表單驗證規則
const rules = {
  oldPassword: [
    { required: true, message: '請輸入舊密碼', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,12}$/,
      message: '密碼需8-12位，含英文大小寫與數字',
      trigger: 'blur',
    },
  ],
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

    const res = await changePassword(userStore.userId, {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    })

    if (res.code === 0) {
      ElMessage.success('密碼修改成功')
      router.push('/')
      form.oldPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
    } else {
      ElMessage.error(res.message || '密碼修改失敗')
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          ElMessage.error('無權限修改')
          break
        case 404:
          ElMessage.error('找不到用戶')
          break
        case 405:
          ElMessage.error('舊密碼錯誤')
          break
        default:
          ElMessage.error(error.response.data?.message || '密碼修改失敗')
      }
    } else {
      ElMessage.error('請確認所有欄位正確')
    }
    console.error('驗證失敗', error)
  }
}
</script>
