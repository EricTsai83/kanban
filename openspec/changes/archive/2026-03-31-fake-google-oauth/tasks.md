## 1. Auth Context 與 Provider

- [x] 1.1 建立 `lib/auth-context.tsx`，定義 `AuthContext`、`User` type、`AuthContextValue` interface（包含 user、isAuthenticated、login、logout、isLoading）
- [x] 1.2 實作 `AuthProvider` 元件，使用 `useState` 管理 auth 狀態，`login()` 模擬 1-2 秒延遲後設定硬編碼假使用者資料，`logout()` 立即清除狀態
- [x] 1.3 匯出 `useAuth()` hook，內含 context 未提供時的錯誤處理

## 2. 登入頁面

- [x] 2.1 建立 `app/login/page.tsx` 登入頁面路由，頁面置中佈局
- [x] 2.2 建立 `components/auth/google-login-button.tsx`，實作 Google 品牌風格按鈕（Google logo SVG、「Sign in with Google」文字、白底圓角陰影樣式）
- [x] 2.3 整合按鈕點擊事件：呼叫 `login()`，顯示 loading spinner，完成後用 `useRouter` 導向 `/`
- [x] 2.4 加入已登入使用者自動重導邏輯：若 `isAuthenticated` 為 true，直接導向 `/`

## 3. Auth Guard 與路由保護

- [x] 3.1 建立 `components/auth/auth-guard.tsx` 元件，檢查 auth 狀態，未登入時重導至 `/login`，loading 時顯示 spinner
- [x] 3.2 在 `app/layout.tsx` 中加入 `AuthProvider` 包裹整個應用
- [x] 3.3 在 Kanban 主頁面加入 `AuthGuard` 包裹，保護 `/` 路由

## 4. 使用者資訊顯示與登出

- [x] 4.1 建立 `components/auth/user-menu.tsx`，顯示使用者頭像（圓形）與名稱，附帶登出按鈕
- [x] 4.2 將 `UserMenu` 整合至 Kanban 應用的側邊欄或頂部區域
- [x] 4.3 實作登出功能：點擊登出後清除狀態並重導至 `/login`
