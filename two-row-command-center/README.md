# Turo Fleet Command Center

Operational command center for a 2-car Tesla Model Y rental business on Turo. Two pieces that share the same data model:

1. **`Turo_Command_Center.xlsx`** — the system of record. Log every trip, expense, and charging session here. Formula-driven `Summary` tab computes utilization, cost-per-mile, fixed/variable cost split, net profit, net margin, break-even utilization, a 12-month trend, and renewal/maintenance alerts, per car and fleet-wide.
2. **`turo-command-center.html`** — a visual dashboard. Upload CSV exports of the four workbook tabs (Vehicles, Trips, Expenses, Charging) and it recalculates the same metrics client-side, with charts and an alerts panel. Nothing leaves the browser — data is kept in `localStorage` only.

## Workflow

1. Update `Turo_Command_Center.xlsx` as trips/expenses/charging happen (weekly is plenty).
2. When you want a refresh: export each tab as CSV (`File > Download > Comma Separated Values`).
3. Open `turo-command-center.html`, click **Update Data**, upload the four CSVs, click **Recalculate Dashboard**.

`build_workbook.py` regenerates the xlsx from scratch (`python3 build_workbook.py`, then recalc with LibreOffice — see the `xlsx` skill's `recalc.py`) if you want to change its structure.
