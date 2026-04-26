/**
 * lib/categories.js
 *
 * Single source of truth for listing taxonomy constants.
 * Import from here — never redefine locally in components.
 *
 * Rules:
 *  - `value`  → stored in the database. Treat as permanent.
 *              Renaming requires a SQL migration first.
 *  - `label`  → display text only. Safe to change at any time.
 *  - Adding new entries to either array is always safe.
 */

// ─── Listing Categories ───────────────────────────────────────────────────────

export const CATEGORIES = [
  { value: 'tutoring',          label: 'Tutoring' },
  { value: 'cleaning',          label: 'Cleaning' },
  { value: 'consular',          label: 'Consular Docs' },
  { value: 'elderly_care',      label: 'Elderly Care' },
  { value: 'moving',            label: 'Moving & Delivery' },
  { value: 'tech_help',         label: 'Tech Help' },
  { value: 'language_exchange', label: 'Language Exchange' },
]

/**
 * Quick O(1) lookup: category value → display label.
 * e.g. CATEGORY_LABEL['tech_help'] → 'Tech Help'
 * Falls back gracefully — if a value isn't found, show the raw value.
 */
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)

// ─── Price Types ──────────────────────────────────────────────────────────────

/**
 * How a listing price is denominated.
 *  - `value`  → stored in the database. Treat as permanent.
 *  - `label`  → shown in dropdowns and listing cards.
 *
 * The 'free' entry is special: components should set price = 0
 * and disable the price input when this is selected.
 */
export const PRICE_TYPES = [
  { value: 'hour',    label: 'per hour' },
  { value: 'session', label: 'per session' },
  { value: 'day',     label: 'per day' },
  { value: 'fixed',   label: 'fixed price' },
  { value: 'free',    label: 'free' },
]

/**
 * Quick O(1) lookup: price type value → display label.
 * e.g. PRICE_TYPE_LABEL['hour'] → 'per hour'
 */
export const PRICE_TYPE_LABEL = Object.fromEntries(
  PRICE_TYPES.map(p => [p.value, p.label])
)