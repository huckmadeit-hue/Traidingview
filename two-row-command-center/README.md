# Turo Fleet Command Center

Operational command center for a 2-car Tesla Model Y rental business on Turo.

## The dashboard (`turo-command-center.html`)

Upload four CSVs and it computes utilization, cost-per-mile, fixed/variable cost split, net profit/margin,
break-even utilization, a 12-month trend, and renewal/maintenance/margin alerts — per car and fleet-wide.
Nothing leaves the browser; data is kept in `localStorage` only.

| File | Where it comes from | Update cadence |
|---|---|---|
| **Trip earnings export** | Downloaded directly from Turo (Host tools > Earnings/Trips > Export) — no manual entry | Whenever you want a refresh |
| **`Vehicles.csv`** | `templates/Vehicles.csv`, pre-filled with your two cars' real Turo identity + VIN | One-time setup, then edit as things change (renewal dates, odometer, maintenance due) |
| **`Expenses.csv`** | `templates/Expenses.csv` | Log a row whenever a cost happens (loan/lease, insurance, maintenance, cleaning, registration, subscriptions, etc.) |
| **`Charging.csv`** | `templates/Charging.csv` | Log a row per charging session |

Turo's export is the system of record for trips — the `Vehicle` column in that export (e.g. `Hinton's Tesla (NC #MCT1292)`)
is the identity key. Make sure `Vehicles.csv`'s `Vehicle ID` column matches it exactly (already pre-filled for your two cars),
and use the same string in `Expenses.csv`/`Charging.csv`'s `Vehicle` column so everything joins up.

Trip status handling: `Completed`/`In-progress` trips count toward utilization, trip count, and miles. Earnings count for
every status except `Booked` (a cancellation fee is still real revenue; a future booking's revenue isn't realized yet).
`Booked` trips are surfaced separately as an "Upcoming Bookings" tile.

## Workflow

1. Fill in `Vehicles.csv` once (financial/maintenance fields Turo doesn't export).
2. Log `Expenses.csv` / `Charging.csv` rows as costs happen.
3. Whenever you want a refresh: download Turo's trip earnings export, click **Update Data** on the dashboard, upload all four files, click **Recalculate Dashboard**.

## `Turo_Command_Center.xlsx`

A supplementary formula-driven workbook for the same Vehicles/Expenses/Charging bookkeeping (useful for taxes/records).
Its own `Trips` tab uses an older hand-entry schema that predates the real Turo export format above and is not required
for the dashboard — you can ignore that tab and just track Vehicles/Expenses/Charging in it, or ask for it to be rebuilt
around the real export format if you want the workbook and dashboard fully unified.

`build_workbook.py` regenerates the xlsx from scratch (`python3 build_workbook.py`, then recalc with LibreOffice — see the `xlsx` skill's `recalc.py`) if you want to change its structure.
