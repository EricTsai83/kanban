## ADDED Requirements

### Requirement: Login page displays Google sign-in button
登入頁面 SHALL 位於 `/login` 路由，頁面中央顯示一個 Google 品牌風格的登入按鈕。按鈕 SHALL 包含 Google logo 圖示和「Sign in with Google」文字，樣式符合 Google 品牌指南（白底、圓角、陰影）。

#### Scenario: Login page renders correctly
- **WHEN** 使用者訪問 `/login` 路由
- **THEN** 頁面顯示應用名稱/logo、Google 風格登入按鈕，整體佈局置中且符合應用的暗色主題

#### Scenario: Login page on different screen sizes
- **WHEN** 使用者在手機或桌面裝置訪問登入頁面
- **THEN** 登入表單始終水平垂直置中，按鈕大小適當

### Requirement: Clicking login button triggers mock auth flow
點擊 Google 登入按鈕後，系統 SHALL 顯示 loading 狀態（如 spinner 或按鈕變為 loading），模擬 OAuth 驗證延遲，完成後自動導向 Kanban 主頁面（`/`）。

#### Scenario: Successful login flow
- **WHEN** 使用者點擊 Google 登入按鈕
- **THEN** 按鈕顯示 loading 狀態，1-2 秒後使用者被導向至 `/` 主頁面

#### Scenario: Button disabled during loading
- **WHEN** 登入流程正在進行中
- **THEN** 登入按鈕 SHALL 處於 disabled 狀態，防止重複點擊

### Requirement: Already authenticated users are redirected
如果已登入的使用者訪問 `/login` 頁面，系統 SHALL 自動重導至 `/` 主頁面。

#### Scenario: Redirect authenticated user from login
- **WHEN** 已登入使用者訪問 `/login`
- **THEN** 自動重導至 `/`

### Requirement: User info display after login
登入後，應用 SHALL 在側邊欄或頂部區域顯示使用者頭像和名稱，並提供登出按鈕。

#### Scenario: User avatar and name visible
- **WHEN** 使用者已登入並在 Kanban 主頁面
- **THEN** 介面上顯示使用者頭像（圓形）、名稱，以及一個登出按鈕/選項

#### Scenario: Logout returns to login page
- **WHEN** 使用者點擊登出按鈕
- **THEN** 登入狀態清除，使用者被重導至 `/login` 頁面
