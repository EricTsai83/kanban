## Why

目前 Kanban 應用沒有任何登入機制，所有使用者都以匿名方式使用。為了後續支援多人協作及個人化設定，需要先建立基本的身份驗證流程。本階段先以 mock 方式實作 Google OAuth 登入按鈕與假的驗證流程，驗證 UI 流程與狀態管理架構是否正確，後續再替換為真正的 OAuth 串接。

## What Changes

- 新增登入頁面，包含 Google OAuth 登入按鈕（使用 Google 品牌風格）
- 點擊按鈕後模擬 OAuth 流程，使用硬編碼的假使用者資料完成登入
- 建立 auth context 管理登入狀態（已登入/未登入）
- 登入後導向主要的 Kanban 頁面
- 在側邊欄或頂部顯示使用者頭像與名稱，附帶登出功能
- 未登入時自動重導至登入頁面

## Non-goals

- 不實作真正的 Google OAuth 串接（無需 Google API credentials）
- 不做持久化的 session 管理（refresh 後登入狀態不保留）
- 不做使用者權限控制或角色管理
- 不做使用者資料庫或 backend API

## Capabilities

### New Capabilities
- `mock-auth-provider`: 假的 auth context provider，管理登入/登出狀態與假使用者資料
- `login-page`: Google OAuth 風格的登入頁面，含品牌化按鈕和登入流程 UI
- `auth-guard`: 路由保護機制，未登入使用者重導至登入頁面

### Modified Capabilities
（無）

## Impact

- 新增 `app/login/page.tsx` 登入頁面路由
- 新增 `components/auth/` 目錄放置 auth 相關元件
- 新增 `lib/auth-context.tsx` auth 狀態管理
- 修改 `app/layout.tsx` 加入 AuthProvider
- 修改 `app/page.tsx` 或 Kanban 元件加入 auth guard 邏輯
