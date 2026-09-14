# Registration Entry Fee Update

## 1. Background
The registration entry fee for BU Codex is set to **450tk** per team (updated from the previous fee).

## 2. Centralized Source of Truth
The update is centrally declared and managed in [`lib/constants.ts`](file:///home/jaber/Documents/bu_codex/lib/constants.ts):
- `EVENT_DETAILS.ENTRY_FEE_AMOUNT`: `"450tk"`
- `EVENT_DETAILS.ENTRY_FEE_TEXT`: `"450tk per team"`

```typescript
export const EVENT_DETAILS = {
  // ...
  ENTRY_FEE_AMOUNT: "450tk",
  ENTRY_FEE_TEXT: "450tk per team",
  // ...
}
```

## 3. Affected Components & Consumption
All customer-facing UI components consume `EVENT_DETAILS` directly from [`lib/constants.ts`](file:///home/jaber/Documents/bu_codex/lib/constants.ts), ensuring zero duplicate hardcoded fees across the codebase:
- [`components/home/hero.tsx`](file:///home/jaber/Documents/bu_codex/components/home/hero.tsx): Displays `EVENT_DETAILS.ENTRY_FEE_TEXT` in quick logistics overview.
- [`components/home/stats.tsx`](file:///home/jaber/Documents/bu_codex/components/home/stats.tsx): Displays entry fee in stats grid.
- [`components/home/faq.tsx`](file:///home/jaber/Documents/bu_codex/components/home/faq.tsx): Answers fee questions using `EVENT_DETAILS.ENTRY_FEE_TEXT`.
- [`components/motion/ticker.tsx`](file:///home/jaber/Documents/bu_codex/components/motion/ticker.tsx): Loops ticker items including `ENTRY FEE: ${EVENT_DETAILS.ENTRY_FEE_AMOUNT}`.
- [`components/pages/register-page.tsx`](file:///home/jaber/Documents/bu_codex/components/pages/register-page.tsx): Informs teams of payment instructions and fee verification (`EVENT_DETAILS.ENTRY_FEE_AMOUNT` and `EVENT_DETAILS.ENTRY_FEE_TEXT`).

## 4. Rule Compliance & Context Persistence
- **`RULE[user_global]`**: Maintained tool precision, verified central definitions, and persisted synthesized context into `context/price_update.md`.
- **`RULE[default-context-grill.md]`**: Grounded against central constant definitions and documented affected components and state implications for repository-wide context integrity.
