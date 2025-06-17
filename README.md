# Breakfast 訂餐系統（前端作品集）

模擬早餐店的線上點餐平台，支援商品瀏覽、加料選擇、加入購物車、會員登入、查詢訂單等功能。  
本專案為**個人前端練習作品**，使用 Vue 3 + Tailwind CSS 開發，搭配 JSON Server 與 Express 模擬 API。

> 前端部署：GitHub Pages｜後端 API：Render

---

## **線上體驗**

- 前端網站：https://wizluna1212.github.io/breakfast-frontend/
- 模擬 API（Render）：https://dashboard.render.com/web/srv-d180r7mmcj7s73cduoi0

---

## **功能特色**

- 商品分類、搜尋、加料選項
- 加入購物車、編輯數量與加料
- 註冊、登入、登出、重設密碼
- 支援會員 / 訪客下單邏輯
- 使用者下單後可查詢歷史訂單紀錄
- 區分會員與訪客下單流程，並儲存對應訂單
- 使用 Pinia 狀態管理與 Axios 串接後端
- JSON Server + Express 模擬登入驗證與資料庫

---

## **使用技術**

**前端技術**

- Vue 3（Composition API）
- Vite
- Tailwind CSS + Element Plus
- Vue Router + Pinia
- Axios（模組化 API 管理）

**後端模擬**

- JSON Server
- Express（模擬驗證與路由）

---

## **專案結構**
```
Breakfast/
├── frontend/ 前端專案（Vue）
├── backend/ 模擬後端（JSON Server + Express）
```
