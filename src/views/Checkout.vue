<template>
  <div class="min-h-screen flex flex-col max-w-5xl mx-auto">
    <div class="bg-gray-100 w-full center-xy">
      <div
        class="flex flex-col xs:flex-row p-4"
        :class="step === 1 ? 'border-b-2 border-orange-300' : ''"
      >
        <div :class="step === 1 ? 'text-orange-300 font-bold' : 'text-gray-400'">Step 1.</div>
        <div :class="step === 1 ? 'text-black' : 'text-gray-400'">取餐方式</div>
      </div>
      <div class="text-gray-600">➔</div>
      <div
        class="flex flex-col xs:flex-row p-4"
        :class="step === 2 ? 'border-b-2 border-orange-300' : ''"
      >
        <div :class="step === 2 ? 'text-orange-300 font-bold' : 'text-gray-400'">Step 2.</div>
        <div :class="step === 2 ? 'text-black' : 'text-gray-400'">訂購資訊</div>
      </div>
      <div
        class="flex flex-col xs:flex-row p-4"
        :class="step === 3 ? 'border-b-2 border-orange-300' : ''"
      >
        <div :class="step === 3 ? 'text-orange-300 font-bold' : 'text-gray-400'">Step 3.</div>
        <div :class="step === 3 ? 'text-black' : 'text-gray-400'">訂購完成</div>
      </div>
    </div>
    <div class="flex-grow">
      <!-- Step 1 取餐方式-->
      <div v-if="step === 1" class="center-xy flex flex-col">
        <div class="mt-4 p-2 font-semibold text-lg">商品明細</div>
        <div class="w-[80%]">
          <!-- 標頭列 -->
          <div class="center-x border-b py-1 font-bold bg-gray-100 text-gray-400 text-center">
            <div class="w-1/2">商品名稱</div>
            <div class="w-1/4">數量</div>
            <div class="w-1/4 text-right pr-2">價格</div>
          </div>
          <!-- 商品列 -->
          <div v-for="cartItem in cartItems" :key="cartItem.cartId" class="border-b">
            <div class="center-xy py-1">
              <div class="w-1/2 text-lg">{{ cartItem.name }}</div>
              <div class="w-1/4 text-center">{{ cartItem.quantity }}</div>
              <div class="w-1/4 text-right pr-2">${{ cartItem.price * cartItem.quantity }}</div>
            </div>
            <!-- 加料列 -->
            <div v-if="cartItem.extras && cartItem.extras.length > 0">
              <div v-for="extra in cartItem.extras" :key="extra.id">
                <div v-for="opt in extra.options" :key="opt.id" class="center-xy w-full py-1">
                  <div class="w-1/2 pl-4">{{ opt.name }} (${{ opt.price }})</div>
                  <div class="w-1/4 text-center">{{ opt.quantity }}</div>
                  <div class="w-1/4 text-right pr-2">${{ opt.price * opt.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 小計 -->
          <div class="center-xy py-2 mt-2">
            <span class="text-lg font-bold">小計：</span>
            <span class="text-2xl font-bold text-red-500 ml-2">${{ totalPrice }}</span>
          </div>
        </div>
        <div class="mt-4 p-2 font-semibold text-lg">取餐方式</div>
        <div>
          <el-button
            class="!rounded-full"
            :type="pickupType === 'dine-in' ? 'primary' : 'default'"
            @click="selectPickup('dine-in')"
            :disabled="!isBusinessHours"
            >內用</el-button
          >
          <el-button
            class="!rounded-full"
            :type="pickupType === 'takeout' ? 'primary' : 'default'"
            @click="selectPickup('takeout')"
            >自取</el-button
          >
        </div>
        <div v-if="!isBusinessHours" class="text-red-500 text-sm mt-1">
          目前不在營業時間內，無法選擇內用
        </div>
        <div class="w-[240px] center-xy mt-4 flex-col" v-if="pickupType === 'dine-in'">
          <div>桌號：<el-input v-model="tableNumber" class="!w-10" />桌</div>
          <div>請確認有座位後再填寫桌號，謝謝</div>
        </div>

        <div v-if="pickupType === 'dine-in'">
          <div class="mt-4 p-2 font-semibold text-lg center-xy">桌號</div>
          <div class="border !rounded-full w-[300px] h-8 text-center">{{ tableNumber }}桌</div>
          <div class="mt-4 p-2 font-semibold text-lg center-xy">取餐時間</div>
          <div class="border !rounded-full w-[300px] h-8 text-center">
            {{ takeTimeText }}
          </div>
        </div>

        <div v-if="pickupType === 'takeout'">
          <div class="mt-4 p-2 font-semibold text-lg center-xy">取餐時間</div>
          <div class="border !rounded-full w-[300px] h-8 text-center" @click="toggleTakeoutDialog">
            {{ takeTimeText }}
          </div>
        </div>
      </div>
      <!-- Step 2 -->
      <div v-if="step === 2" class="center-x w-full">
        <div class="w-full sm:w-[80%] flex flex-col p-2">
          <div class="center-x text-xl pt-5 font-semibold">早餐店</div>
          <!-- 店家及取餐資訊 -->
          <div v-for="(info, index) in checkoutInfo" :key="index" class="border-b w-full p-2">
            <span class="font-semibold pr-2">{{ info.label }}</span>
            <span>{{ info.value }}</span>
          </div>
          <!-- 購物車內容 -->
          <div class="m-1">
            <!-- 標頭列 -->
            <div class="center-x border-b py-1 font-bold bg-gray-100 text-gray-400 text-center">
              <div class="w-1/2">商品名稱</div>
              <div class="w-1/4">數量</div>
              <div class="w-1/4 text-right pr-2">價格</div>
            </div>
            <!-- 商品列 -->
            <div v-for="cartItem in cartItems" :key="cartItem.cartId" class="border-b">
              <div class="center-xy py-1">
                <div class="w-1/2 text-lg">{{ cartItem.name }}</div>
                <div class="w-1/4 text-center">{{ cartItem.quantity }}</div>
                <div class="w-1/4 text-right pr-2">${{ cartItem.price * cartItem.quantity }}</div>
              </div>
              <!-- 加料列 -->
              <div v-if="cartItem.extras && cartItem.extras.length > 0">
                <div v-for="extra in cartItem.extras" :key="extra.id">
                  <div v-for="opt in extra.options" :key="opt.id" class="center-xy w-full py-1">
                    <div class="w-1/2 pl-4">{{ opt.name }} (${{ opt.price }})</div>
                    <div class="w-1/4 text-center">{{ opt.quantity }}</div>
                    <div class="w-1/4 text-right pr-2">${{ opt.price * opt.quantity }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-orange-200 rounded w-full text-center h-8 center-xy">
            總共{{ totalQuantity }}項/<span class="text-red-500">${{ totalPrice }}</span>
          </div>
          <!-- 訂購資訊 -->
          <div class="center-x text-xl pt-5 font-semibold">請輸入訂購資訊</div>
          <el-form
            :model="orderData"
            :rules="rules"
            label-width="100px"
            class="max-w-md mx-auto"
            ref="formRef"
          >
            <el-form-item label="訂購人姓名" prop="name">
              <el-input v-model="orderData.name" placeholder="請輸入姓名" />
            </el-form-item>
            <el-form-item label="手機號碼" prop="phone">
              <el-input
                v-model="orderData.phone"
                placeholder="請輸入手機號碼，如0910123456"
                maxlength="10"
              />
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethod">
              <el-radio-group v-model="orderData.paymentMethod">
                <el-radio value="cash">現金付款</el-radio>
                <el-radio value="linPay" :disabled="true">Line pay(尚未開放)</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="訂單備註" prop="note">
              <el-input
                v-model="orderData.note"
                type="textarea"
                :rows="2"
                placeholder="有需要可填寫備註"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- step 3 -->
      <div v-if="step === 3" class="center-x w-full my-8 p-2">
        <div v-if="orderStore.completedOrder" class="space-y-2">
          <p class="text-lg font-semibold">您的訂單已成功送出！</p>
          <p>訂單編號：{{ orderStore.completedOrder.orderId }}</p>
          <p>
            取餐方式：{{ orderStore.completedOrder.pickupType === 'dine-in' ? '內用' : '外帶' }}
          </p>
          <p>
            {{
              orderStore.completedOrder.pickupType === 'dine-in'
                ? `桌號： ${orderStore.completedOrder.tableNumber} `
                : `請於  ${formatWeekTW(orderStore.completedOrder.takeTime)}
            後取餐。`
            }}
          </p>
          <p>
            付款方式：{{
              orderStore.completedOrder.paymentMethod === 'cash' ? '現金，取餐時付款' : '信用卡'
            }}
          </p>
          <p>總金額：{{ orderStore.completedOrder.totalPrice }}元</p>
          <p>感謝您的訂購！如有需要，請洽現場服務人員或撥打店家電話。</p>
        </div>
      </div>
      <!-- 選擇日期時間彈窗 -->
      <el-dialog v-model="showPickup" class="center-xy w-full xs:w-[70%] max-w-md">
        <div class="py-2">
          <div class="text-lg">選擇日期</div>
          <el-date-picker
            v-model="selectedDate"
            type="date"
            place-holder="selectedDate"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD ( ddd )"
            value-format="YYYY-MM-DD"
          />
        </div>
        <div class="py-4">
          <div class="text-lg">選擇時間</div>
          <el-select v-model="selectedTime" :disabled="!selectedDate" placeholder="請先選擇日期">
            <el-option
              v-for="time in availableTime"
              :key="time"
              :label="formatTime"
              :value="time"
            />
          </el-select>
        </div>

        <div class="center-xy">
          <el-button @click="closeDialog">關閉</el-button>
          <el-button type="primary" @click="confirmTakeout">確定</el-button>
        </div>
      </el-dialog>

      <!-- 固定最下方區域 -->
      <div
        v-if="step !== 3"
        class="sticky bottom-0 left-0 w-full h-12 mt-4 bg-gray-100 z-10 center-xy"
      >
        <div v-if="step === 1">
          <el-button class="!rounded-full w-[120px] !text-white !bg-gray-500" @click="continueOrder"
            >繼續選購</el-button
          >
          <el-button class="!rounded-full w-[120px] !text-white !bg-orange-400" @click="stepToTwo"
            >下一步</el-button
          >
        </div>
        <div v-if="step === 2">
          <el-button class="!rounded-full w-[120px] !text-white !bg-gray-500" @click="stepToOne"
            >上一步</el-button
          >
          <el-button
            class="!rounded-full w-[120px] !text-white !bg-orange-400"
            @click="checkSendOrder"
            >送出訂單</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useUserStore } from '@/stores/userStore'
import { useOrderHistoryStore } from '@/stores/historyStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { logRaw } from '@/utils/Logger'

const formRef = ref(null)
const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()
const historyStore = useOrderHistoryStore()
const router = useRouter()

//訂單資料
const cartItems = computed(() => cartStore.cartItems)
const totalQuantity = computed(() => cartStore.cartCount)
const totalPrice = computed(() => cartStore.totalPrice)
const orderData = orderStore.orderData

const step = ref(1) //結帳步驟，預設值第1步
const showPickup = ref(false) //開關外帶時間的彈窗
const pickupType = ref('') //取餐方式
const selectedDate = ref(null) //選擇的外帶日期(el-date-picker)
const selectedTime = ref('') //選擇的外帶時間(el-select)
const tempDate = ref(null) //暫存的外帶日期
const tempTime = ref('') //暫存的外帶時間
const availableTime = ref([]) //外帶可選時間
const tableNumber = ref('') //內用桌號
const takeTimeText = ref('') //取餐時間顯示格式 YYYY-MM-DD(ddd)hh:mm

const takeTimeISO = ref('') //取餐時間ISO格式
const checkoutInfo = computed(() => [
  {
    label: '取餐方式:',
    value:
      pickupType.value === 'dine-in'
        ? `內用: ${tableNumber.value}桌`
        : pickupType.value === 'takeout'
          ? '外帶'
          : '',
  },
  { label: '取餐時間:', value: takeTimeText },
  { label: '店家地址:', value: '台灣的某個地方' },
  { label: '店家電話:', value: '02-1234-5678' },
])

// 判斷是否在營業時間內
const isBusinessHours = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  // 營業時間 6:00-15:00
  const isAfterOpen = hour > 6 || (hour === 6 && minute >= 0)
  const isBeforeClose = hour < 15 || (hour === 15 && minute === 0)

  return isAfterOpen && isBeforeClose
})

//根據取餐方式顯示相對應的填寫資訊
//內用:桌號，取餐時間為當下20分鐘後
//外帶:取餐時間
const selectPickup = (type) => {
  // 如果是內用且不在營業時間內，不允許選擇
  if (type === 'dine-in' && !isBusinessHours.value) {
    ElMessage.warning('目前不在營業時間內，無法選擇內用')
    return
  }

  pickupType.value = type
  const now = new Date()
  const inTwentyMinutes = new Date(now.getTime() + 21 * 60000) // 20 分鐘後

  if (type === 'dine-in') {
    //內用，取餐時間為當前時間20分鐘後
    takeTimeISO.value = inTwentyMinutes.toISOString()
    takeTimeText.value = formatWeekTW(takeTimeISO.value)
    logRaw('內用akeTimeISO', takeTimeISO.value)
    logRaw('內用takeTimeText', takeTimeText.value)
  } else if (type === 'takeout') {
    //外帶
    tableNumber.value = ''

    // 檢查當前時間是否已過營業時間
    const current = now.getHours()
    const isClose = current >= 15
    const beforeOpen = current <= 6
    const defaultDate = new Intl.DateTimeFormat('sv-SE').format(inTwentyMinutes) //YYYY-MM-DD(str)
    const defaultTime = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(inTwentyMinutes) //HH:mm(str)
    selectedDate.value = defaultDate

    if (!isClose) {
      if (beforeOpen) {
        selectedTime.value = '06:00'
      } else {
        selectedTime.value = defaultTime
      }
      const combiSelect = `${selectedDate.value}T${selectedTime.value}:00.000`
      takeTimeISO.value = new Date(combiSelect).toISOString()
      takeTimeText.value = formatWeekTW(takeTimeISO.value)
      getAvailableTime()
    } else {
      // 已過營業時間，清空選擇
      selectedDate.value = null
      selectedTime.value = ''
      takeTimeISO.value = ''
      takeTimeText.value = '今日已過營業時間，請選擇其它日期'
    }
  }
}

//外帶時間彈窗
const toggleTakeoutDialog = () => {
  if (showPickup.value) {
    tempDate.value = selectedDate.value
    tempTime.value = selectedTime.value
  }
  showPickup.value = !showPickup.value
}

//外帶日期限制，7天內並排除周日
const disabledDate = (time) => {
  const timeObj = new Date(time)
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 6)

  // 判斷今天是否已過營業時間（15:00）
  const isToday = timeObj.toDateString() === today.toDateString()
  const now = new Date()
  const afterClose = now.getHours() > 15 || (now.getHours() === 15 && now.getMinutes() > 0)

  return (
    timeObj.getTime() < today.setHours(0, 0, 0, 0) ||
    timeObj.getTime() > maxDate.setHours(23, 59, 59, 999) ||
    timeObj.getDay() === 0 ||
    (isToday && afterClose)
  )
}

//根據外帶選擇的日期顯示可選時間
//先列出所有選項
//判斷今天，則列出剩下的營業時段，並插入馬上的時間
const getAvailableTime = () => {
  availableTime.value = []
  const now = new Date()
  const selected = new Date(selectedDate.value) //日期選擇器選的日子
  const isToday = selected.toDateString() === now.toDateString()

  // 生成所有可能的時間選項（6:00-15:00，每10分鐘）
  const allTimeSlots = []
  for (let hour = 6; hour <= 15; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      if (hour === 15 && minute > 0) break // 11:00 是最後一個選項
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      allTimeSlots.push(timeStr)
    }
  }

  // 如果是今天
  if (isToday) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes() //當前時間轉分鐘單位
    const beforeOpen = 6 * 60
    const closeMinutes = 15 * 60 // 15:00 的分鐘單位

    // 如果當前時間已經超過營業時間
    if (currentMinutes >= closeMinutes && currentMinutes < beforeOpen) {
      availableTime.value = ['今日已過營業時間，請選擇其他日期']
      selectedTime.value = availableTime.value[0]
      return
    }

    // 計算當前時間20分鐘後，最近的可選時間
    const nextSlotMinutes = Math.ceil((currentMinutes + 20) / 10) * 10

    // 過濾出可用的時間選項
    availableTime.value = allTimeSlots.filter((time) => {
      const [hour, minute] = time.split(':').map(Number)
      const slotMinutes = hour * 60 + minute
      return slotMinutes >= nextSlotMinutes
    })
  } else {
    // 非今天，顯示所有時間選項
    availableTime.value = allTimeSlots
  }
  //預設外帶時間為立即
  selectedTime.value = availableTime.value[0]
}

//關閉外帶時間(值不變更)
const closeDialog = () => {
  selectedDate.value = tempDate.value
  selectedTime.value = tempTime.value
  showPickup.value = false
}

//確認外帶的取餐時間
const confirmTakeout = () => {
  logRaw('selectedDate:', selectedDate.value)
  logRaw('selectedTime:', selectedTime.value)
  const str = `${selectedDate.value}T${selectedTime.value}`
  takeTimeISO.value = new Date(str).toISOString()
  logRaw('pickupISO外帶時間:', takeTimeISO.value)
  takeTimeText.value = formatWeekTW(takeTimeISO.value)
  showPickup.value = false
}

//將ISO轉成台灣時間YYYY-MM-DD HH:mm
const formatWeekTW = (iso) => {
  const date = new Date(String(iso))
  return date
    .toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'narrow',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replaceAll('/', '-')
}

//表單驗證規則
const rules = {
  name: [
    { required: true, message: '請輸入姓名', trigger: 'blur' },
    { pattern: /^[^\d]+$/, message: '姓名不能包含數字', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '請輸入電話', trigger: 'blur' },
    { max: 10, message: '手機號碼最多10個數字', trigger: 'blur' },
    {
      pattern: /^09\d{8}$/,
      message: '請輸入正確的手機號碼格式',
      trigger: 'blur',
    },
  ],
  paymentMethod: [{ required: true, message: '請選擇付款方式', trigger: 'change' }],
}

//繼續選購
const continueOrder = () => {
  cartStore.showCart = false
  router.push('/product')
}

//去第一步
const stepToOne = () => {
  step.value = 1
}

//去第二步
const stepToTwo = () => {
  //防呆，確認有商品
  if (cartItems.value.length === 0) {
    ElMessage.warning('購物車是空的，請選擇商品')
    return
  }
  //確認取餐方式
  if (!pickupType.value) {
    ElMessage.warning('請選擇取餐方式')
    return
  }
  //驗證內用桌號
  if (pickupType.value === 'dine-in' && (!tableNumber.value || tableNumber.value > 11)) {
    ElMessage.warning('請輸入桌號')
    return
  }

  //驗證自取/外帶時間
  if (pickupType.value === 'takeout') {
    if (!selectedDate.value || !selectedTime.value) {
      ElMessage.warning('請選擇自取的取餐時間')
      return
    }

    const [hour, minute] = selectedTime.value.split(':').map(Number)
    const isValidTime = hour >= 6 && (hour < 15 || (hour === 15 && minute === 0))
    if (!isValidTime) {
      ElMessage.warning('自取時間請選擇 06:00–15:00 間')
      return
    }
  }

  //內用的話，桌號放入pinia
  if (pickupType.value === 'dine-in') {
    orderData.tableNumber = tableNumber.value
  } else {
    orderData.tableNumber = ''
  }

  orderData.takeTime = takeTimeISO.value
  orderData.pickupType = pickupType.value
  step.value = 2
}

//送出訂單API
const checkSendOrder = async () => {
  // 表單驗證
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    ElMessage.error('請確認表單資料正確')
    return
  }
  //根據登入與否，把訂單資料存到db或local
  const isLoggedIn = !!userStore.token
  try {
    let orderData = await orderStore.generateOrderData()
    logRaw('準備發送的訂單數據：', orderData)

    if (isLoggedIn) {
      //有登入，資料傳後端(現用JSON server)
      await orderStore.fetchSendOrder(orderData)
      logRaw('訂單提交結果：', orderStore.completedOrder)
      ElMessage.success(`訂單成功，訂單編號: ${orderStore.completedOrder.orderId}`)
    } else {
      // 訪客，幫訂單補上 ID 和時間
      const guestOrder = {
        ...orderData,
        orderId: `G-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      }
      orderStore.completedOrder = guestOrder
      ElMessage.success(`訂單成功（訪客模式），訂單編號: ${guestOrder.orderId}`)
    }
    //訂單資料根據有無登入自動存 localStorage 或只更新記憶體
    historyStore.addOrder(orderStore.completedOrder)
    cartStore.cartItems = []
    orderStore.resetOrderData()
    step.value = 3
    logRaw('完成的訂單資訊：', orderStore.completedOrder)
  } catch (error) {
    console.error('送出訂單錯誤:', error)
    ElMessage.error(error.message || '送出訂單失敗')
  }
}

watch(selectedDate, () => {
  if (selectedDate.value) {
    getAvailableTime()
  }
})

// //登入後自動帶入資料
watch(
  () => step.value,
  (newStep) => {
    if (newStep === 2 && userStore.isLoggedIn) {
      orderData.name = userStore.userInfo.name
      orderData.phone = userStore.userInfo.phone
      // 重置表單驗證狀態
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
)

// 監聽登入狀態變化
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn && step.value === 2) {
      orderData.name = userStore.userInfo.name
      orderData.phone = userStore.userInfo.phone
      // 重置表單驗證狀態
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    } else if (!isLoggedIn) {
      orderData.name = ''
      orderData.phone = ''
    }
  },
)
</script>
