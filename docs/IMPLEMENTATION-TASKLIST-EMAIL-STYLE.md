# IMPLEMENTATION — Tasklist Dashboard Email-Style Redesign

**Date:** 2026-02-19
**File:** `src/app/pages/Dashboard/components/TasklistWidget/getTasklistColumns.js`

---

## Objective

Redesign the tasklist table to resemble an email inbox — subject prominent, body as a concise human-readable preview, and approval decision visible as a dedicated status column.

---

## Column Changes

| # | Column | Before | After |
|---|--------|--------|-------|
| 1 | NO | Same | Same |
| 2 | TASK SUBJECT | Plain text | Same |
| 3 | TASK BODY | Raw JSON bullet list labelled "ADDITIONAL INFO" | Crafted preview from `TASK_BODY` fields — no underscores, `·`-separated |
| 4 | APPROVAL STATUS | Not present | New — from `COMPLETION_ACTION` |
| 5 | STATUS | `TASK_STATUS` badge | Same |
| 6 | PRIORITY | Coloured badge | Same |
| 7 | SENDER | Plain text | Same |
| 8 | CREATED AT | Formatted date | Same |
| — | REMARKS | Plain text | Removed |
| — | UPDATED AT | Formatted date | Removed |
| — | ADDITIONAL INFO | Raw JSON `<ul>` list | Removed — replaced by TASK BODY |

---

## Task Body Preview Logic

Source: `TASK_BODY` JSON field (already extracted and structured by BE).

### Field Label Mapping (snake_case → Human Label)

Underscores are replaced by human-readable labels. Internal or redundant keys (`category`, `entity_id`, `message`) are skipped.

### Priority Fields per Category

Each category shows its 4 most meaningful fields first:

| Category | Priority Fields |
|----------|----------------|
| `PAYMENT_RELATION` | Account No · Account · Customer · Amount + Currency |
| `SERVICE_AGREEMENT` | SA Number · Customer · Contract Value · Service Type |
| `BILLING` | Billing Number · Customer · Total Amount · Period |
| `PRICING` | Pricing Name · Base Price · Currency · Product |
| *(default)* | First 4 non-null non-skipped fields |

Output format: `Account No: ACC-001  ·  Customer: John Doe  ·  Amount: IDR 5,000,000`

---

## Approval Status Column

Source: `COMPLETION_ACTION` field in task response.

| `COMPLETION_ACTION` | `TASK_STATUS` | Display | Colour |
|--------------------|--------------|---------|--------|
| `null` | `PENDING` / `IN_PROGRESS` | Awaiting Approval | pending (yellow) |
| `APPROVE` | `COMPLETED` | Approved | approved (green) |
| `REJECT` | `COMPLETED` / `REJECTED` | Rejected | rejected (red) |
| `DELEGATE` | `DELEGATED` | Delegated | pending (orange) |
| `null` | `CANCELLED` | Cancelled | cancelled (red) |
| `null` | `EXPIRED` | Expired | inactive (red) |

---

## Data Sources

Both fields come from `TaskDetailResponseDTO` returned by the list endpoint:
- `TASK_BODY` — extracted fields from `M_NOTIFICATIONS.ADDITIONAL_DATA` via `TaskBodyBuilderService`
- `COMPLETION_ACTION` — the approval decision recorded on task completion
