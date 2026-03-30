## Why

The current UI uses hand-rolled Tailwind components — custom overlays, inline `<style jsx>` blocks, and manually defined CSS variables. This creates maintenance overhead, inconsistent interaction patterns, and no dark mode support. Migrating to Shadcn UI gives us accessible, theme-aware primitives out of the box, while adding a proper light/dark theme system that responds to user preference.

## What Changes

- Initialize Shadcn UI with its CSS variable–based theming system (light + dark palettes).
- Replace all hand-built UI primitives in `kanban-app.tsx` with Shadcn components: Button, Input, Textarea, Select, Sheet (slide-over panel and settings drawer), Command (command bar), Badge, Tooltip, and Dialog.
- Remove the custom `Overlay`, `SheetField`, `CmdGroup`, `CmdItem`, `SidebarBtn` sub-components and the `<style jsx global>` block — replaced by Shadcn equivalents.
- Add a theme toggle (light / dark / system) in the sidebar rail.
- Update `globals.css` to use Shadcn's CSS variable convention with both `:root` (light) and `.dark` (dark) palettes.
- Update `layout.tsx` to include a `ThemeProvider` wrapping the app, using `next-themes`.
- **BREAKING**: The custom CSS variables (`--surface`, `--sidebar`, `--accent`, etc.) will be replaced by Shadcn's standard variables (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--accent`, `--border`, etc.).

## Capabilities

### New Capabilities

- `shadcn-component-system`: Replace all hand-built UI elements with Shadcn UI components and establish the component usage patterns for the kanban workspace.
- `dark-mode-theming`: Add a light/dark/system theme toggle with CSS variable–based palettes that apply across the entire application.

### Modified Capabilities

None.

## Impact

- Full rewrite of `components/kanban-app.tsx` to use Shadcn components.
- New `components/ui/` directory with Shadcn-generated component files.
- New `components/theme-provider.tsx` and `components/theme-toggle.tsx`.
- Updated `globals.css` — new CSS variable system replaces the current custom tokens.
- Updated `app/layout.tsx` — adds ThemeProvider and dark class support.
- New dependency: `next-themes`.
- No changes to API routes, data model, or persistence layer.

## Non-goals

- Redesigning the board layout or interaction patterns — the spatial design (sidebar rail, inline rows, command bar, slide-over) stays the same.
- Adding new functional features beyond theme switching.
- Creating a standalone design-system package.
