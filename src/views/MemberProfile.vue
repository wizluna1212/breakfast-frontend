<template>
  <div class="relative">
    <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">修改會員資料</div>
    <div class="border border-gray-300 w-[90%] mx-auto">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="p-5 w-[70%] mx-auto mt-3"
        label-width="120px"
      >
        <!-- 姓名（只顯示） -->
        <el-form-item label="姓名">
          <span class="text-gray-700">{{ form.name }}</span>
        </el-form-item>
        <!-- 電話 -->
        <el-form-item label="手機" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="請輸入手機號碼"
            @blur="formatPhone"
            maxlength="11"
          />
        </el-form-item>
        <!-- 生日 -->
        <el-form-item label="生日" prop="birthday">
          <template v-if="form.birthday">
            <span class="text-gray-700">{{ form.birthday }}</span>
          </template>
          <template v-else>
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="請選擇生日"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
              :disabled-date="(date) => date.getTime() > Date.now()"
            />
          </template>
        </el-form-item>
      </el-form>
      <el-button class="w-[200px] mx-auto block mb-5 !rounded-md" type="primary" @click="submit"
        >確認修改</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { updateProfile } from '@/api/api'

defineOptions({
  name: 'MemberProfileView',
})

const formRef = ref(null)
const userStore = useUserStore()

// 表單資料
const form = reactive({
  name: '',
  phone: '',
  birthday: '',
})

// 表單驗證規則
const rules = {
  phone: [
    { required: true, message: '請輸入電話', trigger: 'blur' },
    { pattern: /^09\d{2}-\d{6}$/, message: '電話格式錯誤', trigger: 'blur' },
  ],
}

// 電話格式加-
const formatPhone = () => {
  const digits = form.phone.replace(/\D/g, '').slice(0, 10)
  if (digits.length > 4) {
    form.phone = digits.slice(0, 4) + '-' + digits.slice(4)
  } else {
    form.phone = digits
  }
}

// 提交表單
const submit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()

    const res = await updateProfile(userStore.userId, {
      phone: form.phone.replace(/-/g, ''),
      birthday: form.birthday || null,
    })

    if (res.code === 0) {
      ElMessage.success('會員資料修改成功')
      userStore.setUserInfo({
        ...userStore.userInfo,
        phone: form.phone,
        birthday: form.birthday,
      })
    } else {
      ElMessage.error(res.message || '會員資料修改失敗')
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
        default:
          ElMessage.error(error.response.data?.message || '會員資料修改失敗')
      }
    } else {
      ElMessage.error('請確認所有欄位正確')
    }
    console.error('驗證失敗', error)
  }
}

// 初始化表單資料
onMounted(() => {
  form.name = userStore.userInfo.name
  form.phone = userStore.userInfo.phone
  form.birthday = userStore.userInfo.birthday
})
</script>
