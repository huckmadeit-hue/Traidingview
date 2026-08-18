/* ============================================================
   Reserve EV — fleet data (EDIT ME)
   One record per vehicle. Add, remove, or reorder records and the
   Fleet page, homepage preview, comparison table, Trip Fit selector,
   and vehicle detail pages all update automatically.

   RULES
   - Never guess a trim, range, or spec. Leave a field as "" (empty)
     and the site renders "Details coming soon".
   - "estRangeMi" is the EPA-estimated range WHEN NEW, from the
     official spec — the site labels it that way automatically.
   - Never put VINs, plates, addresses, lockbox codes, or tracker
     info anywhere in this file. It ships to every visitor.
   ============================================================ */

window.RSRV_FLEET = [
  {
    id: "rsrv-01",
    unit: "01",
    name: "Reserve EV Vehicle 01", // e.g. "2023 Tesla Model 3 Long Range"
    year: "",
    model: "", // "Model 3" | "Model Y" | "Model S" | "Model X"
    trim: "",
    exteriorColor: "",
    interiorColor: "",
    bodyStyle: "", // e.g. "Sedan", "Compact SUV"
    seats: "",
    estRangeMi: "", // EPA-estimated range when new, numbers only
    cargo: "", // short cargo description
    bestFor: [], // e.g. ["Business travel", "First-time Tesla guests"]
    highlights: [], // 3–6 short feature strings (verified only)
    comfortNotes: "", // verified accessibility/comfort notes
    firstTimerNote: "", // what a first-time driver should know about THIS car
    mainImage: "", // e.g. "assets/img/fleet/rsrv-01-main.jpg"
    gallery: [], // additional image paths
    turoUrl: "", // this vehicle's Turo listing URL
    availability: "", // e.g. "Typically available" — leave "" until confirmed
    displayPrice: "", // leave "" to show "View live price on Turo"
    featured: true,
    sort: 1,
  },
  {
    id: "rsrv-02",
    unit: "02",
    name: "Reserve EV Vehicle 02",
    year: "",
    model: "",
    trim: "",
    exteriorColor: "",
    interiorColor: "",
    bodyStyle: "",
    seats: "",
    estRangeMi: "",
    cargo: "",
    bestFor: [],
    highlights: [],
    comfortNotes: "",
    firstTimerNote: "",
    mainImage: "",
    gallery: [],
    turoUrl: "",
    availability: "",
    displayPrice: "",
    featured: false,
    sort: 2,
  },
  {
    id: "rsrv-03",
    unit: "03",
    name: "Reserve EV Vehicle 03",
    year: "",
    model: "",
    trim: "",
    exteriorColor: "",
    interiorColor: "",
    bodyStyle: "",
    seats: "",
    estRangeMi: "",
    cargo: "",
    bestFor: [],
    highlights: [],
    comfortNotes: "",
    firstTimerNote: "",
    mainImage: "",
    gallery: [],
    turoUrl: "",
    availability: "",
    displayPrice: "",
    featured: false,
    sort: 3,
  },
  {
    id: "rsrv-04",
    unit: "04",
    name: "Reserve EV Vehicle 04",
    year: "",
    model: "",
    trim: "",
    exteriorColor: "",
    interiorColor: "",
    bodyStyle: "",
    seats: "",
    estRangeMi: "",
    cargo: "",
    bestFor: [],
    highlights: [],
    comfortNotes: "",
    firstTimerNote: "",
    mainImage: "",
    gallery: [],
    turoUrl: "",
    availability: "",
    displayPrice: "",
    featured: false,
    sort: 4,
  },
  {
    id: "rsrv-05",
    unit: "05",
    name: "Reserve EV Vehicle 05",
    year: "",
    model: "",
    trim: "",
    exteriorColor: "",
    interiorColor: "",
    bodyStyle: "",
    seats: "",
    estRangeMi: "",
    cargo: "",
    bestFor: [],
    highlights: [],
    comfortNotes: "",
    firstTimerNote: "",
    mainImage: "",
    gallery: [],
    turoUrl: "",
    availability: "",
    displayPrice: "",
    featured: false,
    sort: 5,
  },
];

/* "Choose Your Drive" use-case labels. Point each use case at a vehicle id
   once the fleet records are filled in; while vehicleId is "" the site
   shows an editable "to be matched" state instead of guessing. */
window.RSRV_TRIP_FIT = [
  {
    id: "business",
    label: "Business travel",
    blurb:
      "Meetings in Raleigh, Durham, or RTP — a quiet, composed drive that arrives charged and looking sharp.",
    vehicleId: "",
  },
  {
    id: "cargo",
    label: "Extra cargo",
    blurb:
      "Luggage for the whole crew, campus move-in boxes, or gear for a weekend away.",
    vehicleId: "",
  },
  {
    id: "couples",
    label: "Couples & solo",
    blurb:
      "A weekend for two or a solo reset — easy to park, fun to drive, simple to live with.",
    vehicleId: "",
  },
  {
    id: "longdrive",
    label: "Longer drives",
    blurb:
      "Coast or mountains — plan around range and Supercharger stops and the miles take care of themselves.",
    vehicleId: "",
  },
  {
    id: "firsttime",
    label: "First-time Tesla",
    blurb:
      "Never driven electric? We'll point you to the most forgiving car in the fleet and walk you through it.",
    vehicleId: "",
  },
];
