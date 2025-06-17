import service from '@/utils/requestJSON'

//取得首頁橫幅
export function getBanners() {
  return service({
    url: '/banners',
    method: 'get',
  })
}

//取得菜單資料(商品種類、商品項目、加料)
export function getMenu() {
  return service({ url: '/menu', method: 'get' })
}

//送出訂單
export function sendOrder(data) {
  return service({
    url: '/orders',
    method: 'post',
    data: data,
  })
}

//會員登入
export function login(data) {
  return service({
    url: '/login',
    method: 'post',
    data,
  })
}

//註冊會員
export function register(data) {
  return service({
    url: '/register',
    method: 'post',
    data,
  })
}

//修改會員資料
export function updateProfile(userId, data) {
  return service({
    url: `/users/${userId}/profile`,
    method: 'put',
    data,
  })
}

//取得歷史訂單
export function getHistoryOrders() {
  return service({
    url: '/orders/history',
    method: 'get',
  })
}

//修改密碼
export function changePassword(userId, data) {
  return service({
    url: `/users/${userId}`,
    method: 'patch',
    data,
  })
}

//忘記密碼
export function forgotPassword(data) {
  return service({
    url: '/forgot-password',
    method: 'post',
    data,
  })
}

//重設密碼
export function resetPassword(data) {
  return service({
    url: '/reset-password',
    method: 'post',
    data,
  })
}
