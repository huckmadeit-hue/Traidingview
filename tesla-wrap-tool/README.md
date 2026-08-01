# Tesla Custom Wrap Logo Tool

A single self-contained HTML file for placing your own logo onto official Tesla
"Custom Wraps" templates and exporting spec-compliant wrap PNGs.

## Usage

Open `index.html` directly in a browser (double-click it, no server or install
needed). Everything — templates, editor, and export — runs locally in the
page; nothing is uploaded anywhere.

1. Upload your logo (PNG/SVG/JPG, transparency recommended).
2. Pick a vehicle tab: **Model Y (2023)**, **Model Y (2024)**, or **Model 3 (2025)**.
3. Drag the logo into place on the canvas (drag = move, wheel = scale, or use
   the sliders). Use **+ Add copy** to place it on more than one panel, and
   **⇋ Mirror** to clone it to the opposite side of the car.
4. Watch the status line under the canvas — it warns you if any part of the
   logo falls outside a paintable (white) zone, and highlights those pixels
   in red. Clipped pixels are dropped on export.
5. Export the current vehicle, or use **Batch export all 3** to generate all
   three wraps in one pass.
6. Your logo and placements are saved in the browser automatically
   (`localStorage`), so you can close the file and reopen it later without
   redoing setup — just re-run the export.

## Vehicle → template mapping

Tesla's `teslamotors/custom-wraps` repo does not have a distinct template per
model year — templates are keyed to body generation:

| Vehicle | Template used | Why |
|---|---|---|
| Model Y (2023) | `modely/template.png` | Pre-refresh Model Y body (no dedicated 2023 file exists) |
| Model Y (2024) | `modely/template.png` (same file) | The Model Y refresh ("Juniper") didn't ship until 2025, so 2023 and 2024 share one body/template |
| Model 3 (2025) | `model3-2024-base/template.png` **or** `model3-2024-performance/template.png` | The Model 3 refresh ("Highland") shipped as the 2024+ body and continues into 2025; pick your trim in the app (defaults to Standard & Premium) |

Because Model Y (2023) and (2024) share the exact same template file, the
tool keeps their placements in sync by default (toggle "Keep 2024 placement
identical to 2023" off to edit them independently) — and their exported PNGs
will be byte-identical.

**Model Y vs. Model 3 proportions differ enough that placement does not
transfer between them** — the Model Y template has a taller greenhouse/
windshield opening and different door-panel proportions than the Model 3
template. The tool intentionally keeps a separate, independent placement per
vehicle rather than a single shared setting, and defaults each vehicle's
logo to its own template's roof panel (a large paintable area on both
templates) as a safe, consistent starting point.

## Export spec

Exports are 1024×1024 PNGs (Tesla's requirement is 512–1024 px) kept under
1 MB (auto-downscaled if ever needed), with filenames limited to letters,
numbers, underscores, dashes, and spaces, 30 characters max.

## Loading wraps onto your car

* **Mobile app** (v4.59.0+): Creations → Wrap → Upload
* **USB drive**: put the exported PNGs in a folder named `Wraps`, then in the
  car go to Toybox → Paint Shop → Wraps tab

## Source

Templates are copied unmodified from Tesla's official
[teslamotors/custom-wraps](https://github.com/teslamotors/custom-wraps)
repository. This tool is unofficial and not affiliated with Tesla.
