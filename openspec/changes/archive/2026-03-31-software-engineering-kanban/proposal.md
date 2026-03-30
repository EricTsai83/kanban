## Why

Software Engineer Team needs a shared kanban space that reflects real engineering work, not a generic task board. The current gap makes it hard to track delivery status, limit work in progress, and surface blockers across planning, implementation, review, testing, and release.

## What Changes

- Add a kanban workspace tailored to software engineering workflows and terminology.
- Support engineering-oriented columns such as backlog, ready, in progress, in review, blocked, testing, and done.
- Add card metadata needed by engineering teams, including priority, assignee, labels, estimates, due dates, and blocker state.
- Provide filtering and grouping so engineers and leads can focus on sprint work, ownership, and bottlenecks.
- Add simple team-level visibility into work-in-progress and blocked items.

## Capabilities

### New Capabilities
- `engineering-kanban-board`: Create and manage kanban boards with configurable workflow columns for software engineering teams.
- `engineering-work-item-management`: Create, update, and move work items with engineering-specific metadata and blocker handling.
- `engineering-board-views`: Filter and group board data by assignee, priority, label, and status to support daily execution and delivery reviews.

### Modified Capabilities

None.

## Impact

- Adds new product requirements for board management, work item lifecycle, and team views.
- Affects frontend flows for board rendering, drag-and-drop interactions, and filtering controls.
- Likely touches backend models and APIs for boards, columns, cards, metadata, and status transitions.
- May require dependencies or implementation choices for drag-and-drop UI and real-time or near-real-time updates.

## Non-goals

- Full agile program management such as portfolio planning, roadmap management, or OKR tracking.
- Native integrations with Git providers, CI systems, chat tools, or calendar systems in this change.
- Advanced analytics, forecasting, or SLA reporting beyond lightweight WIP and blocker visibility.
