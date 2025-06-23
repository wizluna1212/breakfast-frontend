import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import Home from '@/views/Home.vue'
// import Order from '@/views/Order.vue'
import About from '@/views/About.vue' //放git連結
import Checkout from '@/views/Checkout.vue'
import Register from '@/views/Register.vue'
import Product from '@/views/Product.vue'
import History from '@/views/History.vue'
import Member from '@/views/Member.vue'
import MemberProfile from '@/views/MemberProfile.vue'
import ChangePassword from '@/views/ChangePassword.vue' //修改密碼
import ForgotPassword from '@/views/ForgotPassword.vue' //忘記密碼
import ResetPassword from '@/views/ResetPassword.vue' //忘記密碼後重設密碼
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: Home },
        // { path: 'order', name: 'order', component: Order },
        { path: 'about', name: 'about', component: About },
        { path: 'checkout', name: 'checkout', component: Checkout },
        { path: 'register', name: 'register', component: Register },
        { path: 'product', name: 'product', component: Product },
        { path: 'history', name: 'history', component: History },
        { path: 'forgot-password', name: 'forgotPassword', component: ForgotPassword },
        { path: 'reset-password', name: 'resetPassword', component: ResetPassword },
        {
          path: 'member',
          name: 'member',
          component: Member,
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              name: 'memberProfile',
              component: MemberProfile,
              meta: { requiresAuth: true },
            },
            {
              path: 'change-password',
              name: 'changePassword',
              component: ChangePassword,
              meta: { requiresAuth: true },
            },
          ],
        },
      ],
    },
  ],
})

// 需登入才能造訪的頁面
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
