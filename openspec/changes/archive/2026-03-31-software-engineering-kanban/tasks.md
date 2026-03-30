## 1. Data model and server foundation

- [x] 1.1 Define board, column, and work item types plus validation rules for engineering metadata
- [x] 1.2 Implement server-side persistence paths for creating boards, loading boards, and saving column configuration
- [x] 1.3 Implement server-side create and update flows for work items, including blocked state and ordering data

## 2. Board workflow experience

- [x] 2.1 Build the engineering kanban board shell with default workflow columns and board header
- [x] 2.2 Add column configuration UI for adding, renaming, reordering, and removing valid columns
- [x] 2.3 Integrate drag-and-drop card movement with optimistic UI and server reconciliation

## 3. Work item management

- [x] 3.1 Build create and edit flows for work items with title, description, assignee, priority, labels, estimate, due date, and blocker state
- [x] 3.2 Render board cards and detail surfaces so engineering metadata and blocked indicators are visible
- [x] 3.3 Enforce workflow integrity rules, including preventing removal of non-empty columns

## 4. Views and verification

- [x] 4.1 Add board filtering by assignee, priority, label, and status
- [x] 4.2 Add grouped views for assignee, priority, and status using the shared board dataset
- [x] 4.3 Add lightweight WIP and blocked summary indicators and verify the main scenarios from the new specs
