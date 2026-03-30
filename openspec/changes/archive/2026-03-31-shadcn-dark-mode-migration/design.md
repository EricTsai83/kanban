## Context

The kanban workspace currently renders its entire UI through hand-built components inside a monolithic `kanban-app.tsx` (636 lines). Custom sub-components (`Overlay`, `SidebarBtn`, `SheetField`, `CmdGroup`, `CmdItem`) replicate patterns that Shadcn UI already provides — Sheet, Button, Label, Command, Badge, etc. A `<style jsx global>` block manually styles form inputs. CSS variables are hard-coded in `:root` with no dark palette, so dark mode is unsupported.

The project already lists Shadcn UI in its tech stack (`openspec/config.yaml`) but the library was never initialized.

### Current custom UI surface

| Custom element | Lines | Shadcn replacement |
|---|---|---|
| `Overlay` (backdrop + container) | 549-556 | `Sheet`, `Dialog` |
| `SidebarBtn` | 541-547 | `Button` variant=ghost size=icon + `Tooltip` |
| `SheetField` (label wrapper) | 558-565 | `Label` |
| `CmdGroup` / `CmdItem` | 567-583 | `Command` (CommandGroup, CommandItem) |
| `WorkItemRow` badges | 613-619 | `Badge` |
| Inline `<style jsx global>` (.sheet-input) | 520-534 | `Input`, `Textarea`, `Select` |
| All raw `<button>` and `<input>` | scattered | `Button`, `Input`, `Textarea`, `Select` |

## Goals / Non-Goals

**Goals:**

- Replace every custom UI primitive with its Shadcn counterpart so all interactive elements share a single, theme-aware design system.
- Introduce a CSS variable–based light/dark theme with `next-themes` that respects system preference and lets users toggle manually.
- Keep the existing spatial layout (sidebar rail, inline work-item rows, command-bar overlay, slide-over panel, settings drawer) unchanged.

**Non-Goals:**

- Adding new features or changing board logic (CRUD, drag-and-drop, persistence).
- Creating a standalone component library or design-system package.
- Server-side theming — theme is applied purely on the client via CSS class toggling.

## Decisions

### Decision 1: Initialize Shadcn UI with "new-york" style and CSS variables

**Choice**: Run `npx shadcn@latest init` using the "new-york" style with CSS variables mode.

**Why**: "new-york" style aligns with the current minimal, compact aesthetic (smaller radius, tighter spacing). CSS variables mode generates `:root` and `.dark` palettes automatically, which pairs directly with `next-themes`.

**Alternatives considered**:
- "default" style — slightly rounder and more spacious; doesn't match the Linear/Raycast aesthetic we already ship.
- Rolling our own Radix UI setup — more work, no real benefit over Shadcn which is just Radix + Tailwind underneath.

### Decision 2: Use `next-themes` ThemeProvider with `attribute="class"`

**Choice**: Wrap the app in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` inside `layout.tsx`.

**Why**: The `class` strategy adds `.dark` to `<html>`, letting Tailwind's `dark:` variant and Shadcn's CSS variables both respond correctly. `defaultTheme="system"` gives users the expected OS-respecting behavior out of the box.

**Alternatives considered**:
- `attribute="data-theme"` — requires extra Tailwind config and doesn't match Shadcn's default convention.
- Custom context-based theme — unnecessary complexity when `next-themes` already handles SSR hydration edge cases.

### Decision 3: Replace custom overlays with Shadcn Sheet and CommandDialog

**Choice**:
- Slide-over detail panel → `Sheet` (side="right")
- Settings drawer → `Sheet` (side="right")
- Command bar → `CommandDialog` (Shadcn wrapper around cmdk + Dialog)

**Why**: These Shadcn components include focus trapping, scroll locking, keyboard handling, and animations out of the box. Our `Overlay` component reimplements these behaviors incompletely (no focus trap, no scroll lock).

**Alternatives considered**:
- Keep custom `Overlay` but theme it — misses accessibility features and creates maintenance burden.

### Decision 4: Map custom color tokens to Shadcn's CSS variable convention

**Choice**: Replace `--sidebar`, `--surface`, `--border-subtle`, `--muted`, `--accent`, `--priority-*` with Shadcn's standard variables (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--destructive`, `--ring`) and add custom `--sidebar-*` and `--priority-*` tokens alongside.

**Why**: Shadcn components read from the standard variables. The sidebar and priority colors don't have Shadcn equivalents, so they stay as custom extensions.

**Alternatives considered**:
- Keep all custom variables and add a Shadcn compatibility shim — fragile; breaks when Shadcn updates.

### Decision 5: Add a ThemeToggle component in the sidebar rail

**Choice**: Add a small icon button at the bottom of the sidebar rail that cycles through light → dark → system using `useTheme()` from `next-themes`.

**Why**: Matches the spatial pattern — sidebar already houses actions (Search, New, Settings). The toggle is accessible but unobtrusive.

## Risks / Trade-offs

- **Risk: Shadcn + Tailwind CSS 4 compatibility** → Mitigation: Shadcn has supported Tailwind v4 since v2.3. We'll validate by running `npm run build` after init.
- **Risk: Flash of unstyled content (FOUC) on theme switch** → Mitigation: `next-themes` injects a blocking script that reads the stored theme before React hydrates. The `suppressHydrationWarning` attribute on `<html>` avoids console warnings.
- **Risk: Custom sidebar colors break in dark mode** → Mitigation: The dark sidebar (`--sidebar: #0f172a`) is already dark; in dark mode it gets a slightly different shade. We test both palettes visually.
- **Trade-off: Larger bundle from Shadcn/Radix primitives** → Acceptable; Radix primitives tree-shake well and the total addition is ~15-20 KB gzipped.
