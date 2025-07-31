<template>
  <div class="w-full">
    <el-carousel :interval="0" class="relative h-[60vh] md:h-[600px] xl:h-[700px]">
      <el-carousel-item
        v-for="item in banners"
        :key="item.id"
        class="h-[60vh] md:h-[600px] xl:h-[700px]"
      >
        <img
          :src="`/breakfast-frontend/images/${item.image}.jpg`"
          :alt="item.title"
          loading="lazy"
          class="h-full w-full object-cover"
        />
        <!-- 遮罩 -->
        <div class="absolute inset-0 z-10 bg-black bg-opacity-10"></div>
        <div class="absolute inset-0 z-20 text-white center-xy flex-col space-y-3">
          <!-- 淡入效果 -->
          <div
            class="center-xy flex-col text-shadow space-y-4 opacity-0 transition-opacity duration-[2000ms]"
            :class="{ 'opacity-100': showText }"
          >
            <h2 class="text-3xl md:text-5xl font-bold">{{ item.title }}</h2>
            <p class="text-xl md:text-3xl font-bold">{{ item.description }}</p>
          </div>
          <!-- 按鈕由下方淡入 -->
          <div
            class="transition duration-700"
            :class="{
              'translate-y-6 opacity-0': !showButton,
              'translate-y-0 opacity-100': showButton,
            }"
          >
            <el-button
              :href="item.ctaLink || '#'"
              type="default"
              class="!bg-white !text-black !rounded-full !px-6 !py-3 !text-lg !font-semibold !border-none hover:opacity-90 transition duration-300"
              @click="$router.push('/product')"
            >
              {{ item.ctaText }}
            </el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBanners } from '@/api/api'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const route = useRoute()
const banners = ref()
const showText = ref(false) //首圖標題顯示
const showButton = ref(false) //首圖按鈕顯示
const isLoading = ref(true)

const fetchBanners = async () => {
  try {
    isLoading.value = true
    const res = await getBanners()
    if (res.code === 0) {
      banners.value = res.data.list
    } else {
      ElMessage.error('取得輪播資料失敗')
    }
  } catch (error) {
    console.error('API 請求失敗:', error)
    ElMessage.error('取得輪播資料失敗')
  } finally {
    isLoading.value = false
  }
}

const initializeComponent = async () => {
  // 重置動畫狀態
  showText.value = false
  showButton.value = false

  await fetchBanners()

  // 文字先淡入
  setTimeout(() => {
    showText.value = true
  }, 100)

  // 按鈕再淡入
  setTimeout(() => {
    showButton.value = true
  }, 1500)
}

onMounted(async () => {
  await initializeComponent()
})

// 監聽路由變化，當回到首頁時重新初始化
watch(
  () => route.path,
  async (newPath, oldPath) => {
    // 只有當從其他頁面跳轉到首頁時才重新初始化
    if (newPath === '/' && oldPath !== '/') {
      await initializeComponent()
    }
  },
)
</script>
