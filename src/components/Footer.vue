<template>
  <footer class="bg-orange-400 py-5 text-white">
    <div class="w-full mx-auto md:h-[260px] sm:px-4">
      <div class="mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 店鋪資訊 -->
        <div>
          <h2 class="font-bold text-2xl pb-2">晨光早餐店</h2>
          <div>地址:台灣</div>
          <div>電話:02-1234-5678</div>
          <div>Email：breakfast@example.com</div>
          <div class="pt-1">營業時間：每日 06:00 - 11:00</div>
        </div>
        <!-- 社群連結 -->
        <div>
          <h2 class="font-bold text-2xl pb-2">快速連結</h2>

          <div class="flex gap-3 items-center">
            <Home class="w-6 h-6 text-amber-800" @click="$router.push('/')" />
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <Instagram class="w-6 h-6 text-pink-500"
            /></a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <Facebook class="w-6 h-6 text-blue-600"
            /></a>
          </div>
        </div>
        <!-- Google地圖 -->
        <div>
          <h2 class="font-bold text-2xl pb-2">店鋪位置</h2>
          <div class="w-full h-25 rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.2891151693194!2d120.80247207521537!3d23.50830888470479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e9a3b87a7b195%3A0x4d403f78057f3721!2z5paw5r2t5ZyL56uL!5e0!3m2!1szh-TW!2stw!4v1716035061319!5m2!1szh-TW!2stw"
              frameborder="0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <!-- 版權 -->
      <div class="text-center pt-3">© 2025 晨光早餐店 All rights reserved.此網站為練習作品</div>
      <div class="text-center">商品頁圖片來源：Unsplash、pexels</div>
      <div
        class="fixed bottom-6 right-3 h-10 w-10 center-xy rounded-full bg-orange-900"
        @click="scrollToTop"
      >
        <el-icon><Top /></el-icon>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Top } from '@element-plus/icons-vue'
import { Home, Facebook, Instagram } from 'lucide-vue-next'

//回到頂端
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
