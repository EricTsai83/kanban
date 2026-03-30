## Context

The board header currently contains seven distinct controls in a single flat row: a view mode switcher, a density/gantt switcher, a language selector, a filter button, and a new-item button. There is no visual grouping between them. The `UserMenu` component in the sidebar uses a hand-built circular `<button>` with CSS initials fallback instead of the existing Shadcn `Avatar` component.

## Goals / Non-Goals

**Goals:**
- Group toolbar controls visually: view controls (view mode + density) together, separated from action buttons (filter, new)
- Add `Tooltip` to every icon-only button in the toolbar for discoverability
- Move the language switcher out of the toolbar and into the settings sheet (reduces clutter)
- Replace the hand-rolled avatar in `UserMenu` with Shadcn `Avatar` + `AvatarFallback`

**Non-Goals:**
- No changes to view mode logic, density logic, or i18n internals
- No user photo upload or API integration
- No changes to settings sheet data model

## Decisions

### Decision 1: Language switcher moves to settings sheet

**Choice**: Place the `LanguageSwitcher` as the first item inside the existing settings `<Sheet>`, above the workflow columns editor.

**Rationale**: Language is a persistent preference, not a momentary board action. The settings sheet is the natural home; removing it from the toolbar reduces the button count by one and eliminates the wide `w-[152px]` dropdown from the tight header.

**Alternative**: Keep in toolbar but collapse to icon — icon-only language switching is low discoverability.

### Decision 2: Toolbar grouping via visual divider

**Choice**: Separate the view controls group from the action buttons with a `<Separator orientation="vertical" />` (Shadcn) rather than extra margin or a container border.

**Rationale**: Minimal DOM addition, semantically correct, consistent with Shadcn patterns elsewhere.

### Decision 3: Shadcn Avatar for UserMenu

**Choice**: Replace the bespoke initials button in `components/auth/user-menu.tsx` with `<Avatar>` + `<AvatarFallback>` from `@/components/ui/avatar`.

**Rationale**: `Avatar` is a standard Shadcn component. Using it provides: correct accessible `role`, consistent styling tokens, and a ready-made `<AvatarImage>` slot for when a real photo URL is available from the auth provider. The component does not yet exist in the project — it needs to be added (`npx shadcn@latest add avatar` or manual copy).

**Alternative**: Keep bespoke button — works but drifts from the design system.

### Decision 4: Tooltip wrapper pattern

All icon-only toolbar buttons already use `<Button size="icon-xs">`. Wrap each with the existing `<Tooltip>` / `<TooltipTrigger render={<Button … />}>` pattern already present in the sidebar rail. No new dependencies.

## Risks / Trade-offs

- **[Avatar component missing]** → Must be added to `components/ui/avatar.tsx` before `UserMenu` can import it. Low risk — standard Shadcn file.
- **[Language switcher in settings]** → Users who relied on quick language switching from the toolbar must now open settings. Acceptable given the target audience (developers) and rarity of mid-session locale changes.
- **[Tooltip on already-labeled buttons]** → Filter and New Item buttons have text labels, so tooltips are redundant but harmless.
