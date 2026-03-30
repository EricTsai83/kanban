## Context

目前的 Kanban 應用是一個純前端的 Next.js 應用，使用 React context 管理狀態（如 ThemeProvider、I18nProvider）。應用沒有任何身份驗證機制，所有使用者匿名使用。

本次變更需要在現有架構上加入一個 mock auth 層，模擬 Google OAuth 登入流程。由於是假的驗證，不需要任何後端服務或外部 API 串接，所有邏輯都在前端完成。

## Goals / Non-Goals

**Goals:**
- 建立可替換的 auth 架構，日後可用真正的 OAuth provider 替換
- 提供視覺上逼真的 Google 登入體驗（品牌化按鈕、轉場動畫）
- 在整個應用中透過 React context 存取登入狀態

**Non-Goals:**
- 不實作真正的 OAuth token 交換流程
- 不做 session 持久化（localStorage/cookie）
- 不建立後端 API 或資料庫
- 不做多 provider 支援（僅 Google）

## Decisions

### 1. 使用 React Context 管理 auth 狀態（而非狀態管理庫）

**選擇**: 用 `AuthContext` + `useAuth` hook 管理登入狀態

**理由**: 專案現有架構已大量使用 React Context（ThemeProvider、I18nProvider），保持一致性。Auth 狀態簡單（user object + isAuthenticated boolean），不需要 Redux/Zustand 等額外依賴。

**替代方案**: 使用 Zustand 做全域狀態管理 — 對此用例而言過度設計。

### 2. 登入頁面作為獨立路由（而非 modal）

**選擇**: `/login` 路由作為全畫面的登入頁面

**理由**: 符合 OAuth 登入慣例（使用者習慣被重導到登入頁面）。更容易實作路由保護，也為日後真正 OAuth redirect 做好架構準備。

**替代方案**: 用 modal overlay — 不符合 OAuth 登入的標準 UX 模式。

### 3. 假使用者資料硬編碼在前端

**選擇**: 在 `lib/auth-context.tsx` 中定義一個固定的 mock user object

**理由**: 最簡單的實作方式，點擊按鈕後延遲 1-2 秒模擬網路請求，然後回傳硬編碼的使用者資料。

**Mock user**: `{ name: "Demo User", email: "demo@example.com", avatar: Google style avatar placeholder }`

### 4. 路由保護使用 client-side redirect

**選擇**: 在 layout 或 page 層級檢查 auth 狀態，未登入時 redirect 到 `/login`

**理由**: 純前端 mock，不需要 middleware 層級的保護。使用 `useRouter` + `useEffect` 實作簡單直接。

## Risks / Trade-offs

- **[狀態不持久]** → 頁面重整後登入狀態消失，使用者需重新點擊登入。這是有意為之的 non-goal，後續可加入 localStorage 持久化。
- **[假驗證無安全性]** → 任何人都能「登入」。這是 mock 的本質，不構成安全風險，因為應用本身沒有敏感資料。
- **[硬編碼使用者]** → 無法測試多使用者場景。可在後續階段擴展為可選擇不同 mock 使用者。
