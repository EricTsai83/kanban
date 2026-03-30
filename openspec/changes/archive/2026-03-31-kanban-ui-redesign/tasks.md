## 1. Dependencies and design tokens

- [x] 1.1 Install Shadcn UI (init + Sheet, Command, Dialog, Button components) and Lucide Icons
- [x] 1.2 Update globals.css with new CSS custom properties, animation keyframes, and base surface colors for the dark sidebar and light content area

## 2. Layout shell

- [x] 2.1 Add a dark sidebar rail component with icon navigation and settings entry point
- [x] 2.2 Update app layout to render the sidebar rail alongside the main content area

## 3. Board visual overhaul

- [x] 3.1 Rewrite the board column layout to use minimal containers with whitespace separation instead of bordered cards
- [x] 3.2 Replace work item cards with slim inline rows showing priority accent, title, and assignee initial
- [x] 3.3 Add hover-expand behavior on work item rows to reveal labels, estimate, due date, and blocked badge

## 4. Interaction overlays

- [x] 4.1 Build the slide-over detail panel (Shadcn Sheet) for viewing and editing a work item on click
- [x] 4.2 Build the command-bar filter overlay (Shadcn Command) for search, filter, and group-by — remove the permanent filter bar
- [x] 4.3 Build the settings drawer (Shadcn Sheet) for column configuration — remove the inline accordion

## 5. Motion and polish

- [x] 5.1 Add drag-and-drop column highlight transitions and smooth item reorder animations
- [x] 5.2 Verify all existing spec scenarios (board creation, column CRUD, item CRUD, drag-and-drop, filters, grouped views, WIP/blocked indicators) still work with the new UI
