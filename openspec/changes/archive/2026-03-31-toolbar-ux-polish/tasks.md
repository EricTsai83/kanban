## 1. Add Shadcn Avatar Component

- [x] 1.1 Create `components/ui/avatar.tsx` with Avatar, AvatarImage, and AvatarFallback components using Radix UI primitives

## 2. Replace Hand-Rolled Avatar in UserMenu

- [x] 2.1 Update `components/auth/user-menu.tsx` to import and use `<Avatar>`, `<AvatarImage>`, and `<AvatarFallback>` instead of the custom initials button

## 3. Restructure Toolbar in kanban-app.tsx

- [x] 3.1 Move `LanguageSwitcher` from the toolbar into the settings `<Sheet>` as the first item above the workflow columns editor
- [x] 3.2 Add a `<Separator orientation="vertical" />` between the view controls group (view mode + density) and the action buttons (filter, new item)
- [x] 3.3 Wrap each icon-only toolbar button (board, list, compact, detailed, gantt) with `<Tooltip>` / `<TooltipTrigger>` / `<TooltipContent>` showing the button label
