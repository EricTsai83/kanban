## ADDED Requirements

### Requirement: Auth context provides authentication state
系統 SHALL 提供一個 `AuthContext` 及對應的 `useAuth` hook，供應用中所有元件存取當前的登入狀態。Context 值 SHALL 包含：`user`（使用者物件或 null）、`isAuthenticated`（boolean）、`login`（登入函式）、`logout`（登出函式）。

#### Scenario: Access auth state when not logged in
- **WHEN** 使用者尚未登入
- **THEN** `useAuth()` 回傳 `{ user: null, isAuthenticated: false, login: fn, logout: fn }`

#### Scenario: Access auth state after login
- **WHEN** 使用者已透過 `login()` 完成登入
- **THEN** `useAuth()` 回傳 `{ user: { name, email, avatar }, isAuthenticated: true, login: fn, logout: fn }`

### Requirement: Login function simulates OAuth delay
`login()` 函式 SHALL 模擬網路延遲（1-2 秒），然後將 auth 狀態設為已登入，並填入硬編碼的假使用者資料：`{ name: "Demo User", email: "demo@example.com", avatar: <placeholder URL> }`。

#### Scenario: Successful mock login
- **WHEN** 呼叫 `login()` 函式
- **THEN** 系統顯示 loading 狀態 1-2 秒後，auth 狀態變為 `isAuthenticated: true`，`user` 填入假使用者資料

### Requirement: Logout function clears auth state
`logout()` 函式 SHALL 立即清除登入狀態，將 `user` 設為 null、`isAuthenticated` 設為 false。

#### Scenario: Successful logout
- **WHEN** 已登入使用者呼叫 `logout()` 函式
- **THEN** auth 狀態立即變為 `{ user: null, isAuthenticated: false }`

### Requirement: AuthProvider wraps the application
系統 SHALL 提供 `AuthProvider` 元件，MUST 包裹在應用最外層（與現有的 ThemeProvider、I18nProvider 並列），使所有子元件都能透過 `useAuth()` 存取 auth 狀態。

#### Scenario: AuthProvider in layout
- **WHEN** 應用啟動
- **THEN** `AuthProvider` 包裹在 layout 中，所有頁面元件均可使用 `useAuth()`
