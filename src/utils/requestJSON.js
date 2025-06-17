import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
})

// 請求攔截器：自動加 token
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 回應攔截器：判斷後端回傳 code 是否成功
service.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code === 0) {
      return response.data
    } else {
      return Promise.reject(new Error(response.data.message || 'API請求錯誤'))
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
