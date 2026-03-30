## ADDED Requirements

### Requirement: Protected routes redirect unauthenticated users
系統 SHALL 對受保護的路由（`/` 及其子路由）進行身份驗證檢查。未登入的使用者訪問受保護路由時，MUST 被自動重導至 `/login` 頁面。

#### Scenario: Unauthenticated user visits home page
- **WHEN** 未登入使用者訪問 `/`
- **THEN** 自動重導至 `/login`

#### Scenario: Authenticated user visits home page
- **WHEN** 已登入使用者訪問 `/`
- **THEN** 正常顯示 Kanban 主頁面

### Requirement: Login page is accessible without authentication
`/login` 路由 SHALL 為公開路由，任何人都能存取，不受 auth guard 保護。

#### Scenario: Public access to login page
- **WHEN** 未登入使用者訪問 `/login`
- **THEN** 正常顯示登入頁面，不會觸發重導循環

### Requirement: Auth guard shows loading state during check
在 auth 狀態初始化期間（context 尚未就緒），auth guard SHALL 顯示 loading 指示器而非立即重導，避免閃爍。

#### Scenario: Loading state on initial render
- **WHEN** 應用首次載入，auth 狀態尚未確定
- **THEN** 顯示 loading 指示器（如 spinner），不顯示頁面內容也不重導
