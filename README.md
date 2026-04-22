# Blended Finance refinement pack

This pack keeps the existing app and adds an Excel-driven RPA workflow route at `/rpa`.

## What this changes

- Parses the workbook as a 5-step model instead of a flat score row
- Preserves Step 3 diagnosis narratives and evidence
- Converts Step 4 into a structured blended-finance recommendation engine
- Converts Step 5 into a structured global-expansion recommendation engine
- Adds user-adjustable weighting so the recommendation logic stays transparent

## Added/updated files

- `types/rpa.ts`
- `lib/rpa-reference-data.ts`
- `lib/rpa-scorecard-parser.ts`
- `lib/rpa-recommendation-engine.ts`
- `components/rpa-scorecard-dashboard.tsx`
- `app/rpa/page.tsx`

## Required package

`xlsx` is already installed in this repo.

## Local run

```bash
npm run dev
```

Open:
- `/` for the existing dashboard
- `/rpa` for the new RPA workflow dashboard
