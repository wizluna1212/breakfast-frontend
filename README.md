# Breakfast 訂餐系統（前端作品集）

模擬早餐店的線上點餐平台，支援商品瀏覽、加料選擇、加入購物車、會員登入、查詢訂單等功能。  
本專案為 **個人前端練習作品**，使用 Vue 3 + Tailwind CSS 開發，搭配 JSON Server 與 Express 模擬 API。

> 前端部署：GitHub Pages｜後端 API：Koyeb  
> 後端程式碼：[breakfast-backend](https://github.com/wizluna1212/breakfast-backend)

---

## 線上體驗

- 前端網站：[https://wizluna1212.github.io/breakfast-frontend/](https://wizluna1212.github.io/breakfast-frontend/)
- 模擬 API：[https://superb-tiglon-wizluna1212-8f061ac6.koyeb.app/](https://superb-tiglon-wizluna1212-8f061ac6.koyeb.app/)

**測試帳號**

- 帳號：`user1@example.com`
- 密碼：`Test123123`

---

## 功能特色

- 商品分類、搜尋、加料選項
- 加入購物車、編輯數量與加料
- 註冊、登入、登出、重設密碼
- 支援會員 / 訪客下單邏輯
- 下單後可查詢個人歷史訂單
- 使用 Pinia 管理購物車與登入狀態
- JSON Server + Express 模擬 API 與驗證流程

---

## 使用技術

### 前端技術

- Vue 3（Composition API）
- Vite
- Tailwind CSS + Element Plus
- Vue Router + Pinia
- Axios（模組化 API 管理）

### 後端模擬

- JSON Server
- Express（模擬驗證與路由）

---

## 專案結構

本專案為前後端分離架構，分別放置於兩個 GitHub 倉庫：
Breakfast Project
├── frontend/ 前端專案（Vue）
├── backend/ 模擬後端（JSON Server + Express）

- 前端 GitHub： [breakfast-frontend](https://github.com/wizluna1212/breakfast-frontend)
- 後端 GitHub： [breakfast-backend](https://github.com/wizluna1212/breakfast-backend)

---

## 本地安裝與啟動

### 前端（Vue 3 + Vite）

```bash
npm install
npm run dev

```
