## 1. Foundation — Shadcn Init & Theme Infrastructure

- [x] 1.1 Install `next-themes` and initialize Shadcn UI (`npx shadcn@latest init`) with new-york style, CSS variables mode
- [x] 1.2 Add the required Shadcn components: Button, Input, Textarea, Select, Label, Badge, Tooltip, Sheet, Command (CommandDialog)
- [x] 1.3 Rewrite `globals.css` — replace custom CSS variables with Shadcn's `:root` / `.dark` convention; keep sidebar and priority custom tokens; remove inline animations now handled by Shadcn
- [x] 1.4 Create `components/theme-provider.tsx` wrapping `next-themes` ThemeProvider
- [x] 1.5 Update `app/layout.tsx` — add `suppressHydrationWarning` to `<html>`, wrap children in `ThemeProvider`

## 2. Sidebar Rail Migration

- [x] 2.1 Replace `SidebarBtn` with Shadcn `Button` (variant=ghost, size=icon) wrapped in `Tooltip`
- [x] 2.2 Add a theme toggle button at the bottom of the sidebar using `useTheme()` — cycles light → dark → system with Sun/Moon/Monitor icons

## 3. Board Chrome & Layout

- [x] 3.1 Replace header bar raw `<button>` elements with Shadcn `Button` components
- [x] 3.2 Replace the onboarding "create board" form inputs and button with Shadcn `Input` and `Button`
- [x] 3.3 Update error banner and "Filtered" badge to use Shadcn `Badge`

## 4. Work Item Row & Inline Elements

- [x] 4.1 Replace priority and blocked indicators in `WorkItemRow` with Shadcn `Badge`
- [x] 4.2 Replace hover-expand metadata tags (labels, estimate, due date, status) with Shadcn `Badge` variant=secondary

## 5. Slide-over Detail Panel

- [x] 5.1 Replace the custom `Overlay`-based item form with Shadcn `Sheet` (side=right); use `SheetContent`, `SheetHeader`, `SheetTitle`
- [x] 5.2 Replace form fields — `Input`, `Textarea`, `Select` (with `SelectTrigger`, `SelectContent`, `SelectItem`), `Label`, `Checkbox`
- [x] 5.3 Replace submit/cancel buttons with Shadcn `Button`

## 6. Command Bar Overlay

- [x] 6.1 Replace the custom command bar with Shadcn `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`

## 7. Settings Drawer

- [x] 7.1 Replace the custom settings `Overlay` with Shadcn `Sheet` (side=right); use `SheetContent`, `SheetHeader`, `SheetTitle`
- [x] 7.2 Replace column config inputs and action buttons with Shadcn `Input` and `Button`

## 8. Cleanup & Verification

- [x] 8.1 Delete custom sub-components (`Overlay`, `SidebarBtn`, `SheetField`, `CmdGroup`, `CmdItem`) and `<style jsx global>` block from `kanban-app.tsx`
- [x] 8.2 Run `npm run lint` and `npm run build` — fix any errors
- [x] 8.3 Visually verify both light and dark themes render correctly across all views (board, command bar, detail sheet, settings drawer)
