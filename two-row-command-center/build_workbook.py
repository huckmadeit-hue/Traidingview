#!/usr/bin/env python3
"""Builds Turo_Command_Center.xlsx - fleet profitability tracker for a 2-car Tesla Model Y
rental business on the Turo app."""
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment

FONT_NAME = "Arial"

HEADER_FILL = PatternFill("solid", fgColor="1F2937")
HEADER_FONT = Font(name=FONT_NAME, bold=True, color="FFFFFF", size=10)
TITLE_FONT = Font(name=FONT_NAME, bold=True, size=14, color="1F2937")
SUBTITLE_FONT = Font(name=FONT_NAME, italic=True, size=10, color="6B7280")
INPUT_FONT = Font(name=FONT_NAME, color="0000FF")
FORMULA_FONT = Font(name=FONT_NAME, color="000000")
LINK_FONT = Font(name=FONT_NAME, color="008000")
EXAMPLE_FILL = PatternFill("solid", fgColor="FFF9DB")
ASSUMPTION_FILL = PatternFill("solid", fgColor="FFFF00")
SECTION_FILL = PatternFill("solid", fgColor="E5E7EB")
SECTION_FONT = Font(name=FONT_NAME, bold=True, size=11, color="1F2937")
THIN = Side(style="thin", color="D1D5DB")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

wb = Workbook()
wb.remove(wb.active)

def style_headers(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER

def autosize(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

def set_font_all(ws, max_row, max_col, font=FORMULA_FONT):
    for r in range(1, max_row + 1):
        for c in range(1, max_col + 1):
            cell = ws.cell(row=r, column=c)
            if cell.value is not None and not cell.font.bold:
                cell.font = font

# ---------------------------------------------------------------------------
# INSTRUCTIONS
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Instructions")
ws.sheet_view.showGridLines = False
ws["B2"] = "Turo Fleet Command Center"
ws["B2"].font = Font(name=FONT_NAME, bold=True, size=18, color="1F2937")
ws["B3"] = "Profitability tracker for your Tesla Model Y fleet on the Turo app"
ws["B3"].font = SUBTITLE_FONT

instructions = [
    ("", ""),
    ("HOW THIS WORKBOOK WORKS", ""),
    ("1. Vehicles tab", "One row per car with fixed info (purchase price, financing, insurance, renewal dates). Update odometer/maintenance fields periodically."),
    ("2. Trips tab", "Log every booking. Fastest way: export your trip history / payout history from the Turo app and paste the values into the blue-font columns (Trip ID, Vehicle, dates, earnings, miles)."),
    ("3. Expenses tab", "Log every cost as it happens: loan/lease payments, insurance, maintenance, tires, cleaning, registration, subscriptions, damage claims, misc."),
    ("4. Charging tab", "Log charging sessions (home electricity or public/Supercharger). This is what feeds true cost-per-mile."),
    ("5. Summary tab", "Everything else is computed automatically with formulas — don't type numbers there. This is your profitability command center: per-car and fleet-wide."),
    ("", ""),
    ("KEEPING THE DASHBOARD UPDATED", ""),
    ("Weekly", "Add new trips + any new expenses/charging sessions."),
    ("Monthly", "Reconcile against your Turo payout statements and bank/credit card statement."),
    ("For the HTML Command Center dashboard", "Export each tab as CSV (File > Download > CSV, one file per tab: Vehicles, Trips, Expenses, Charging) and upload them into the dashboard's 'Update Data' panel. It recalculates everything client-side and remembers your last upload."),
    ("", ""),
    ("COLOR KEY", ""),
    ("Blue text", "Type your own data here."),
    ("Black text", "Formula — do not overwrite."),
    ("Pale yellow row", "Example row showing expected format — delete or overwrite it once you add real data."),
]
r = 5
for label, desc in instructions:
    if desc == "" and label != "":
        ws.cell(row=r, column=2, value=label).font = SECTION_FONT
        ws.cell(row=r, column=2).fill = SECTION_FILL
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
    elif label:
        ws.cell(row=r, column=2, value=label).font = Font(name=FONT_NAME, bold=True, size=10)
        ws.cell(row=r, column=3, value=desc).font = Font(name=FONT_NAME, size=10)
        ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=7)
        ws.cell(row=r, column=3).alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[r].height = 30
    r += 1
autosize(ws, [3, 22, 14, 14, 14, 14, 14, 14])

# ---------------------------------------------------------------------------
# VEHICLES
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Vehicles")
headers = ["Vehicle ID", "VIN", "In-Service Date", "Purchase Price", "Financing Type",
           "Monthly Loan/Lease Payment", "Loan Balance Remaining", "Monthly Insurance Premium",
           "Annual Registration/Tax", "Turo Commission Rate (Protection Plan)", "Current Odometer (mi)",
           "Next Maintenance Due (mi)", "Next Maintenance Due (date)", "Tire Replacement Due (mi)",
           "Insurance Renewal Date", "Registration Renewal Date", "Status"]
for i, h in enumerate(headers, start=1):
    ws.cell(row=1, column=i, value=h)
style_headers(ws, 1, len(headers))
ws.freeze_panes = "A2"

vehicles_example = [
    ["Model Y #1 - White", "5YJYGDEE1NF000001", "2024-03-01", 52000, "Loan", 850, 31000, 180,
     420, 0.25, 28500, 35000, "2026-09-01", 40000, "2027-03-01", "2027-03-01", "Active"],
    ["Model Y #2 - Black", "5YJYGDEE2NF000002", "2024-06-15", 54000, "Cash", 0, 0, 175,
     420, 0.25, 21000, 30000, "2026-08-15", 40000, "2027-06-15", "2027-06-15", "Active"],
]
for r_i, row in enumerate(vehicles_example, start=2):
    for c_i, val in enumerate(row, start=1):
        cell = ws.cell(row=r_i, column=c_i, value=val)
        cell.font = INPUT_FONT
        cell.fill = EXAMPLE_FILL
        cell.border = BORDER
ws["C2"].number_format = "yyyy-mm-dd"
ws["C3"].number_format = "yyyy-mm-dd"
ws["M2"].number_format = "yyyy-mm-dd"; ws["M3"].number_format = "yyyy-mm-dd"
ws["O2"].number_format = "yyyy-mm-dd"; ws["O3"].number_format = "yyyy-mm-dd"
ws["P2"].number_format = "yyyy-mm-dd"; ws["P3"].number_format = "yyyy-mm-dd"
for col in ("D", "F", "G", "H", "I"):
    ws[f"{col}2"].number_format = "$#,##0"
    ws[f"{col}3"].number_format = "$#,##0"
ws["J2"].number_format = "0%"; ws["J3"].number_format = "0%"
ws["A1"].comment = Comment("Example rows shown in pale yellow — edit these two rows with your real vehicles, or add more rows for a larger fleet.", "Command Center")
autosize(ws, [20, 20, 14, 14, 14, 16, 16, 16, 14, 14, 14, 14, 16, 14, 14, 14, 12])

status_dv = DataValidation(type="list", formula1='"Active,Maintenance,Off-platform,Sold"', allow_blank=True)
ws.add_data_validation(status_dv)
status_dv.add("Q2:Q500")
fin_dv = DataValidation(type="list", formula1='"Cash,Loan,Lease"', allow_blank=True)
ws.add_data_validation(fin_dv)
fin_dv.add("E2:E500")

# ---------------------------------------------------------------------------
# TRIPS
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Trips")
headers = ["Trip ID", "Vehicle", "Guest Name", "Trip Start Date", "Trip End Date", "Trip Days",
           "Guest Trip Price ($)", "Host Net Earnings ($)", "Turo Fee ($)",
           "Miles Driven", "Trip Rating (1-5)", "Month", "Notes"]
for i, h in enumerate(headers, start=1):
    ws.cell(row=1, column=i, value=h)
style_headers(ws, 1, len(headers))
ws.freeze_panes = "A2"

example = ["TR-1001", "Model Y #1 - White", "Jordan P.", "2026-06-02", "2026-06-05",
           "=E2-D2+1", 480, 360, "=IF(G2=0,\"\",G2-H2)", 210, 5, '=TEXT(D2,"yyyy-mm")', "Airport pickup"]
for c_i, val in enumerate(example, start=1):
    cell = ws.cell(row=2, column=c_i, value=val)
    cell.fill = EXAMPLE_FILL
    cell.border = BORDER
    cell.font = FORMULA_FONT if isinstance(val, str) and val.startswith("=") else INPUT_FONT
ws["D2"].number_format = "yyyy-mm-dd"; ws["E2"].number_format = "yyyy-mm-dd"
ws["G2"].number_format = "$#,##0"; ws["H2"].number_format = "$#,##0"; ws["I2"].number_format = "$#,##0"
ws["A1"].comment = Comment(
    "One row per booking. Paste Turo trip-history export here, or enter manually.\n"
    "Guest Trip Price = optional (what the guest paid). Host Net Earnings = required (what you actually received) — this is the revenue figure everything else is based on.\n"
    "Trip Days, Turo Fee, and Month are formulas — fill them down after adding a row.",
    "Command Center")
autosize(ws, [10, 20, 16, 15, 15, 10, 16, 18, 14, 12, 14, 10, 22])

veh_dv = DataValidation(type="list", formula1="=Vehicles!$A$2:$A$50", allow_blank=True)
ws.add_data_validation(veh_dv)
veh_dv.add("B2:B2000")

# ---------------------------------------------------------------------------
# EXPENSES
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Expenses")
headers = ["Date", "Vehicle", "Category", "Description", "Amount ($)", "Month", "Notes"]
for i, h in enumerate(headers, start=1):
    ws.cell(row=1, column=i, value=h)
style_headers(ws, 1, len(headers))
ws.freeze_panes = "A2"

example = ["2026-06-01", "Model Y #1 - White", "Loan/Lease Payment", "June loan payment", 850,
           '=TEXT(A2,"yyyy-mm")', ""]
for c_i, val in enumerate(example, start=1):
    cell = ws.cell(row=2, column=c_i, value=val)
    cell.fill = EXAMPLE_FILL
    cell.border = BORDER
    cell.font = FORMULA_FONT if isinstance(val, str) and val.startswith("=") else INPUT_FONT
ws["A2"].number_format = "yyyy-mm-dd"
ws["E2"].number_format = "$#,##0"
ws["A1"].comment = Comment(
    "One row per expense transaction. Category feeds the fixed vs. variable cost split on the Summary tab — use the dropdown so spelling matches exactly.",
    "Command Center")
autosize(ws, [14, 20, 22, 28, 12, 10, 22])

veh_dv2 = DataValidation(type="list", formula1="=Vehicles!$A$2:$A$50", allow_blank=True)
ws.add_data_validation(veh_dv2)
veh_dv2.add("B2:B2000")

categories = ("Loan/Lease Payment,Insurance,Maintenance/Repair,Tires,Cleaning/Detailing,"
              "Registration/Tax,Subscription (FSD/Connectivity),Parking/Tolls,Damage/Claim,"
              "Supplies,Other")
cat_dv = DataValidation(type="list", formula1=f'"{categories}"', allow_blank=True)
ws.add_data_validation(cat_dv)
cat_dv.add("C2:C2000")

FIXED_CATEGORIES = ["Loan/Lease Payment", "Insurance", "Registration/Tax", "Subscription (FSD/Connectivity)"]

# ---------------------------------------------------------------------------
# CHARGING
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Charging")
headers = ["Date", "Vehicle", "Location Type", "kWh Added", "Cost ($)", "Cost per kWh",
           "Odometer at Charge (mi)", "Month", "Notes"]
for i, h in enumerate(headers, start=1):
    ws.cell(row=1, column=i, value=h)
style_headers(ws, 1, len(headers))
ws.freeze_panes = "A2"

example = ["2026-06-03", "Model Y #1 - White", "Supercharger", 42, 18.90, "=IF(D2=0,\"\",E2/D2)",
           28650, '=TEXT(A2,"yyyy-mm")', ""]
for c_i, val in enumerate(example, start=1):
    cell = ws.cell(row=2, column=c_i, value=val)
    cell.fill = EXAMPLE_FILL
    cell.border = BORDER
    cell.font = FORMULA_FONT if isinstance(val, str) and val.startswith("=") else INPUT_FONT
ws["A2"].number_format = "yyyy-mm-dd"
ws["E2"].number_format = "$#,##0.00"
ws["F2"].number_format = "$#,##0.00"
ws["A1"].comment = Comment(
    "One row per charging session. Home charging: estimate cost from your electricity rate x kWh added. This is what drives true energy cost per mile.",
    "Command Center")
autosize(ws, [14, 20, 16, 12, 12, 12, 18, 10, 20])

veh_dv3 = DataValidation(type="list", formula1="=Vehicles!$A$2:$A$50", allow_blank=True)
ws.add_data_validation(veh_dv3)
veh_dv3.add("B2:B2000")
loc_dv = DataValidation(type="list", formula1='"Home,Supercharger,Public/Other"', allow_blank=True)
ws.add_data_validation(loc_dv)
loc_dv.add("C2:C2000")

# ---------------------------------------------------------------------------
# SUMMARY (KPI table only - stage 3a)
# ---------------------------------------------------------------------------
ws = wb.create_sheet("Summary")
ws.sheet_view.showGridLines = False
ws["B1"] = "Turo Fleet Command Center — Summary"
ws["B1"].font = Font(name=FONT_NAME, bold=True, size=16, color="1F2937")
ws["B2"] = "Every cell below is a formula pulling from Vehicles / Trips / Expenses / Charging. Don't type values here."
ws["B2"].font = SUBTITLE_FONT

ws["B4"] = "FLEET KPI OVERVIEW"
ws["B4"].font = SECTION_FONT
ws["B4"].fill = SECTION_FILL
ws.merge_cells("B4:T4")

kpi_headers = ["Vehicle", "Days in Service", "Total Trips", "Booked Days", "Utilization %",
               "Gross Guest Revenue", "Host Net Earnings", "Turo Fees", "Avg Daily Rate",
               "Total Miles", "Charging Cost", "Cost/Mile (energy)", "Fixed Costs",
               "Variable Costs", "Total Costs", "Net Profit", "Net Margin %",
               "Profit/Available Day", "Break-even Utilization %"]
for i, h in enumerate(kpi_headers, start=2):
    ws.cell(row=6, column=i, value=h)
style_headers(ws, 6, len(kpi_headers) + 1)

TRIPS_RANGE = "Trips!$B$2:$B$2000"
TR_DAYS = "Trips!$F$2:$F$2000"
TR_GUEST = "Trips!$G$2:$G$2000"
TR_HOST = "Trips!$H$2:$H$2000"
TR_FEE = "Trips!$I$2:$I$2000"
TR_MILES = "Trips!$J$2:$J$2000"
EXP_VEH = "Expenses!$B$2:$B$2000"
EXP_CAT = "Expenses!$C$2:$C$2000"
EXP_AMT = "Expenses!$E$2:$E$2000"
CHG_VEH = "Charging!$B$2:$B$2000"
CHG_COST = "Charging!$E$2:$E$2000"

def fixed_cost_formula(veh_cell):
    parts = [f'SUMIFS({EXP_AMT},{EXP_VEH},{veh_cell},{EXP_CAT},"{cat}")' for cat in FIXED_CATEGORIES]
    return "=" + "+".join(parts)

vehicle_rows = [(7, "Vehicles!A2", "Vehicles!C2"), (8, "Vehicles!A3", "Vehicles!C3")]
for row, veh_ref, inservice_ref in vehicle_rows:
    veh_cell = f"B{row}"
    ws[f"B{row}"] = f"={veh_ref}"
    ws[f"C{row}"] = f"=TODAY()-{inservice_ref}"
    ws[f"D{row}"] = f"=COUNTIF({TRIPS_RANGE},{veh_cell})"
    ws[f"E{row}"] = f"=SUMIF({TRIPS_RANGE},{veh_cell},{TR_DAYS})"
    ws[f"F{row}"] = f"=IFERROR(E{row}/C{row},0)"
    ws[f"G{row}"] = f"=SUMIF({TRIPS_RANGE},{veh_cell},{TR_GUEST})"
    ws[f"H{row}"] = f"=SUMIF({TRIPS_RANGE},{veh_cell},{TR_HOST})"
    ws[f"I{row}"] = f"=SUMIF({TRIPS_RANGE},{veh_cell},{TR_FEE})"
    ws[f"J{row}"] = f"=IFERROR(H{row}/E{row},0)"
    ws[f"K{row}"] = f"=SUMIF({TRIPS_RANGE},{veh_cell},{TR_MILES})"
    ws[f"L{row}"] = f"=SUMIF({CHG_VEH},{veh_cell},{CHG_COST})"
    ws[f"M{row}"] = f"=IFERROR(L{row}/K{row},0)"
    ws[f"N{row}"] = fixed_cost_formula(veh_cell)
    ws[f"O{row}"] = f"=SUMIF({EXP_VEH},{veh_cell},{EXP_AMT})-N{row}"
    ws[f"P{row}"] = f"=N{row}+O{row}+L{row}"
    ws[f"Q{row}"] = f"=H{row}-P{row}"
    ws[f"R{row}"] = f"=IFERROR(Q{row}/H{row},0)"
    ws[f"S{row}"] = f"=IFERROR(Q{row}/C{row},0)"
    ws[f"T{row}"] = f"=IFERROR(N{row}/(J{row}*C{row}),0)"
    for col in "BCDEFGHIJKLMNOPQRST":
        ws[f"{col}{row}"].border = BORDER
        ws[f"{col}{row}"].font = FORMULA_FONT

# Fleet total row 9
ws["B9"] = "Fleet Total"
ws["B9"].font = Font(name=FONT_NAME, bold=True)
for col in "CDEGHIKLNOPQ":
    ws[f"{col}9"] = f"=SUM({col}7:{col}8)"
ws["F9"] = "=IFERROR(E9/C9,0)"
ws["J9"] = "=IFERROR(H9/E9,0)"
ws["M9"] = "=IFERROR(L9/K9,0)"
ws["R9"] = "=IFERROR(Q9/H9,0)"
ws["S9"] = "=IFERROR(Q9/C9,0)"
ws["T9"] = "=IFERROR(N9/(J9*C9),0)"
for col in "BCDEFGHIJKLMNOPQRST":
    ws[f"{col}9"].border = BORDER
    ws[f"{col}9"].font = Font(name=FONT_NAME, bold=True)
    ws[f"{col}9"].fill = PatternFill("solid", fgColor="F3F4F6")

for row in (7, 8, 9):
    for col in ("F", "R", "T"):
        ws[f"{col}{row}"].number_format = "0.0%"
    for col in ("G", "H", "I", "J", "L", "M", "N", "O", "P", "Q", "S"):
        ws[f"{col}{row}"].number_format = "$#,##0.00" if col in ("J", "M", "S") else "$#,##0"
    ws[f"C{row}"].number_format = "0"
    ws[f"K{row}"].number_format = "#,##0"

autosize(ws, [3] + [16] * 19)
ws.column_dimensions["B"].width = 20

# ---------------------------------------------------------------------------
# SUMMARY - Operational Alerts (stage 3b)
# ---------------------------------------------------------------------------
ws["B11"] = "OPERATIONAL ALERTS"
ws["B11"].font = SECTION_FONT
ws["B11"].fill = SECTION_FILL
ws.merge_cells("B11:F11")

alert_headers = ["Vehicle", "Alert", "Detail", "Status"]
for i, h in enumerate(alert_headers, start=2):
    ws.cell(row=12, column=i, value=h)
style_headers(ws, 12, 5)

alert_rows = [
    (13, "Vehicles!A2", "Insurance Renewal", '=B13&" renews "&TEXT(Vehicles!O2,"mmm d, yyyy")&" ("&(Vehicles!O2-TODAY())&" days)"',
     '=IF(Vehicles!O2-TODAY()<60,"Renew Soon","OK")'),
    (14, "Vehicles!A3", "Insurance Renewal", '=B14&" renews "&TEXT(Vehicles!O3,"mmm d, yyyy")&" ("&(Vehicles!O3-TODAY())&" days)"',
     '=IF(Vehicles!O3-TODAY()<60,"Renew Soon","OK")'),
    (15, "Vehicles!A2", "Registration Renewal", '=B15&" renews "&TEXT(Vehicles!P2,"mmm d, yyyy")&" ("&(Vehicles!P2-TODAY())&" days)"',
     '=IF(Vehicles!P2-TODAY()<60,"Renew Soon","OK")'),
    (16, "Vehicles!A3", "Registration Renewal", '=B16&" renews "&TEXT(Vehicles!P3,"mmm d, yyyy")&" ("&(Vehicles!P3-TODAY())&" days)"',
     '=IF(Vehicles!P3-TODAY()<60,"Renew Soon","OK")'),
    (17, "Vehicles!A2", "Maintenance Due", '=(Vehicles!L2-Vehicles!K2)&" mi until next service"',
     '=IF(Vehicles!L2-Vehicles!K2<1000,"Due Soon","OK")'),
    (18, "Vehicles!A3", "Maintenance Due", '=(Vehicles!L3-Vehicles!K3)&" mi until next service"',
     '=IF(Vehicles!L3-Vehicles!K3<1000,"Due Soon","OK")'),
    (19, "Vehicles!A2", "Utilization", '=TEXT(F7,"0.0%")&" of available days booked"',
     '=IF(F7<0.4,"Low Utilization","Healthy")'),
    (20, "Vehicles!A3", "Utilization", '=TEXT(F8,"0.0%")&" of available days booked"',
     '=IF(F8<0.4,"Low Utilization","Healthy")'),
    (21, "Vehicles!A2", "Profitability", '=TEXT(R7,"0.0%")&" net margin"',
     '=IF(R7<0,"Losing Money",IF(R7<0.15,"Thin Margin","Healthy"))'),
    (22, "Vehicles!A3", "Profitability", '=TEXT(R8,"0.0%")&" net margin"',
     '=IF(R8<0,"Losing Money",IF(R8<0.15,"Thin Margin","Healthy"))'),
]
for row, veh_ref, alert, detail_f, status_f in alert_rows:
    ws[f"B{row}"] = f"={veh_ref}"
    ws[f"C{row}"] = alert
    ws[f"D{row}"] = detail_f
    ws[f"E{row}"] = status_f
    for col in "BCDE":
        ws[f"{col}{row}"].border = BORDER
        ws[f"{col}{row}"].font = FORMULA_FONT
    ws.merge_cells(f"D{row}:D{row}")

from openpyxl.formatting.rule import CellIsRule
bad_fill = PatternFill("solid", fgColor="FEE2E2")
warn_fill = PatternFill("solid", fgColor="FEF3C7")
good_fill = PatternFill("solid", fgColor="DCFCE7")
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"OK"'], fill=good_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Healthy"'], fill=good_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Renew Soon"'], fill=warn_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Due Soon"'], fill=warn_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Low Utilization"'], fill=warn_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Thin Margin"'], fill=warn_fill))
ws.conditional_formatting.add("E13:E22", CellIsRule(operator="equal", formula=['"Losing Money"'], fill=bad_fill))
ws.column_dimensions["D"].width = 40
ws.column_dimensions["E"].width = 16

# ---------------------------------------------------------------------------
# SUMMARY - Monthly Trend (stage 3c)
# ---------------------------------------------------------------------------
ws["B24"] = "MONTHLY TREND (trailing 12 months)"
ws["B24"].font = SECTION_FONT
ws["B24"].fill = SECTION_FILL
ws.merge_cells("B24:P24")

trend_headers = ["Month", "Month Label", "MonthKey", "V1 Net Earnings", "V1 Costs", "V1 Profit",
                  "V1 Utilization %", "V2 Net Earnings", "V2 Costs", "V2 Profit",
                  "V2 Utilization %", "Fleet Net Earnings", "Fleet Costs", "Fleet Profit",
                  "Fleet Utilization %"]
for i, h in enumerate(trend_headers, start=2):
    ws.cell(row=26, column=i, value=h)
style_headers(ws, 26, len(trend_headers) + 1)

first_row = 27
for i in range(12):
    r = first_row + i
    if i == 0:
        ws[f"B{r}"] = "=EDATE(TODAY(),-11)"
    else:
        ws[f"B{r}"] = f"=EDATE(B{r-1},1)"
    ws[f"C{r}"] = f'=TEXT(B{r},"mmm-yy")'
    ws[f"D{r}"] = f'=TEXT(B{r},"yyyy-mm")'
    ws[f"E{r}"] = f"=SUMIFS({TR_HOST},{TRIPS_RANGE},$B$7,Trips!$L$2:$L$2000,D{r})"
    ws[f"F{r}"] = (f"=SUMIFS({EXP_AMT},{EXP_VEH},$B$7,Expenses!$F$2:$F$2000,D{r})"
                    f"+SUMIFS({CHG_COST},{CHG_VEH},$B$7,Charging!$H$2:$H$2000,D{r})")
    ws[f"G{r}"] = f"=E{r}-F{r}"
    ws[f"H{r}"] = f"=IFERROR(SUMIFS({TR_DAYS},{TRIPS_RANGE},$B$7,Trips!$L$2:$L$2000,D{r})/DAY(EOMONTH(B{r},0)),0)"
    ws[f"I{r}"] = f"=SUMIFS({TR_HOST},{TRIPS_RANGE},$B$8,Trips!$L$2:$L$2000,D{r})"
    ws[f"J{r}"] = (f"=SUMIFS({EXP_AMT},{EXP_VEH},$B$8,Expenses!$F$2:$F$2000,D{r})"
                    f"+SUMIFS({CHG_COST},{CHG_VEH},$B$8,Charging!$H$2:$H$2000,D{r})")
    ws[f"K{r}"] = f"=I{r}-J{r}"
    ws[f"L{r}"] = f"=IFERROR(SUMIFS({TR_DAYS},{TRIPS_RANGE},$B$8,Trips!$L$2:$L$2000,D{r})/DAY(EOMONTH(B{r},0)),0)"
    ws[f"M{r}"] = f"=E{r}+I{r}"
    ws[f"N{r}"] = f"=F{r}+J{r}"
    ws[f"O{r}"] = f"=G{r}+K{r}"
    ws[f"P{r}"] = f"=IFERROR(SUMIFS({TR_DAYS},Trips!$L$2:$L$2000,D{r})/(COUNTA(Vehicles!$A$2:$A$50)*DAY(EOMONTH(B{r},0))),0)"
    ws[f"B{r}"].number_format = "yyyy-mm-dd"
    for col in "EFGIJKMNO":
        ws[f"{col}{r}"].number_format = "$#,##0"
    for col in "HLP":
        ws[f"{col}{r}"].number_format = "0.0%"
    for col in "BCDEFGHIJKLMNOP":
        ws[f"{col}{r}"].border = BORDER
        ws[f"{col}{r}"].font = FORMULA_FONT
ws.column_dimensions["D"].hidden = False  # keep visible; useful for auditing formulas

# ---------------------------------------------------------------------------
# SUMMARY - Charts (stage 3d)
# ---------------------------------------------------------------------------
from openpyxl.chart.marker import Marker, DataPoint
from openpyxl.drawing.colors import ColorChoice

VEH1_COLOR = "1F9E8F"
VEH2_COLOR = "D97706"
FLEET_COLOR = "374151"

def style_bar_series(chart, colors):
    for s, color in zip(chart.series, colors):
        s.graphicalProperties.solidFill = color
        s.graphicalProperties.line.noFill = True

def style_line_series(chart, colors):
    for s, color in zip(chart.series, colors):
        s.graphicalProperties.line.solidFill = color
        s.graphicalProperties.line.width = 20000
        s.marker = Marker(symbol="circle", size=6)
        s.marker.graphicalProperties.solidFill = color
        s.marker.graphicalProperties.line.solidFill = color
        s.smooth = False

cats = Reference(ws, min_col=2, min_row=7, max_row=8)

chart1 = BarChart()
chart1.type = "col"
chart1.title = "Net Profit by Vehicle"
chart1.y_axis.title = "Net Profit ($)"
chart1.y_axis.numFmt = '$#,##0'
chart1.legend = None
chart1.gapWidth = 60
data1 = Reference(ws, min_col=17, min_row=6, max_row=8)
chart1.add_data(data1, titles_from_data=True)
chart1.set_categories(cats)
for pt_idx, color in enumerate([VEH1_COLOR, VEH2_COLOR]):
    dp = DataPoint(idx=pt_idx)
    dp.graphicalProperties.solidFill = color
    chart1.series[0].data_points.append(dp)
chart1.height, chart1.width = 8, 14
ws.add_chart(chart1, "B40")

chart2 = BarChart()
chart2.type = "col"
chart2.title = "Utilization % by Vehicle"
chart2.y_axis.title = "Utilization %"
chart2.y_axis.numFmt = "0%"
chart2.legend = None
chart2.gapWidth = 60
data2 = Reference(ws, min_col=6, min_row=6, max_row=8)
chart2.add_data(data2, titles_from_data=True)
chart2.set_categories(cats)
for pt_idx, color in enumerate([VEH1_COLOR, VEH2_COLOR]):
    dp = DataPoint(idx=pt_idx)
    dp.graphicalProperties.solidFill = color
    chart2.series[0].data_points.append(dp)
chart2.height, chart2.width = 8, 14
ws.add_chart(chart2, "J40")

chart3 = BarChart()
chart3.type = "col"
chart3.grouping = "stacked"
chart3.overlap = 100
chart3.title = "Cost Breakdown by Vehicle"
chart3.y_axis.title = "Cost ($)"
chart3.y_axis.numFmt = '$#,##0'
data3 = Reference(ws, min_col=13, min_row=6, max_row=8)  # Fixed Costs (N)
data3b = Reference(ws, min_col=14, min_row=6, max_row=8)  # Variable Costs (O)
data3c = Reference(ws, min_col=12, min_row=6, max_row=8)  # Charging Cost (L)
chart3.add_data(data3, titles_from_data=True)
chart3.add_data(data3b, titles_from_data=True)
chart3.add_data(data3c, titles_from_data=True)
chart3.set_categories(cats)
style_bar_series(chart3, ["374151", "9CA3AF", "1F9E8F"])
chart3.height, chart3.width = 8, 14
ws.add_chart(chart3, "B58")

months_cats = Reference(ws, min_col=3, min_row=27, max_row=38)

chart4 = LineChart()
chart4.title = "Monthly Profit Trend"
chart4.y_axis.title = "Net Profit ($)"
chart4.y_axis.numFmt = '$#,##0'
g1 = Reference(ws, min_col=7, min_row=26, max_row=38)   # V1 Profit
g2 = Reference(ws, min_col=11, min_row=26, max_row=38)  # V2 Profit
g3 = Reference(ws, min_col=15, min_row=26, max_row=38)  # Fleet Profit
chart4.add_data(g1, titles_from_data=True)
chart4.add_data(g2, titles_from_data=True)
chart4.add_data(g3, titles_from_data=True)
chart4.set_categories(months_cats)
style_line_series(chart4, [VEH1_COLOR, VEH2_COLOR, FLEET_COLOR])
chart4.height, chart4.width = 8, 14
ws.add_chart(chart4, "J58")

chart5 = LineChart()
chart5.title = "Monthly Utilization Trend"
chart5.y_axis.title = "Utilization %"
chart5.y_axis.numFmt = "0%"
u1 = Reference(ws, min_col=8, min_row=26, max_row=38)   # V1 Utilization
u2 = Reference(ws, min_col=12, min_row=26, max_row=38)  # V2 Utilization
u3 = Reference(ws, min_col=16, min_row=26, max_row=38)  # Fleet Utilization
chart5.add_data(u1, titles_from_data=True)
chart5.add_data(u2, titles_from_data=True)
chart5.add_data(u3, titles_from_data=True)
chart5.set_categories(months_cats)
style_line_series(chart5, [VEH1_COLOR, VEH2_COLOR, FLEET_COLOR])
chart5.height, chart5.width = 14, 14
ws.add_chart(chart5, "B76")

# ---------------------------------------------------------------------------
# Final polish
# ---------------------------------------------------------------------------
tab_colors = {"Instructions": "9CA3AF", "Vehicles": "374151", "Trips": "1F9E8F",
              "Expenses": "D97706", "Charging": "1F9E8F", "Summary": "111827"}
for name, color in tab_colors.items():
    wb[name].sheet_properties.tabColor = color
wb.active = wb.sheetnames.index("Instructions")

wb.save("Turo_Command_Center.xlsx")
print("Stage 4 (Final polish) done")
