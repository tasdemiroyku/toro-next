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
 *  - `defaultImage` → fallback shown when a listing has no uploaded cover photo.
 *              Uses free Unsplash Source URLs (no API key required).
 *              Safe to swap the URL at any time — DB is unaffected.
 *  - Adding new entries to either array is always safe.
 */

// ─── Listing Categories ───────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    value: 'tutoring',
    label: 'Tutoring',
    // Books / studying / warm library light
    defaultImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=75&fit=crop',
  },
  {
    value: 'cleaning',
    label: 'Cleaning',
    // Clean bright interior
    defaultImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=75&fit=crop',
  },
  {
    value: 'consular',
    label: 'Consular Docs',
    // Official documents / pen on paper
    defaultImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=75&fit=crop',
  },
  {
    value: 'elderly_care',
    label: 'Elderly Care',
    // Warm helping hands
    defaultImage: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=75&fit=crop',
  },
  {
    value: 'moving',
    label: 'Moving & Delivery',
    // Cardboard boxes / moving
    defaultImage: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=75&fit=crop',
  },
  {
    value: 'tech_help',
    label: 'Tech Help',
    // Laptop / code / workspace
    defaultImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=75&fit=crop',
  },
  {
    value: 'language_exchange',
    label: 'Language Exchange',
    // Two people talking / conversation
    defaultImage: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=800&q=75&fit=crop',
  },
]

/**
 * Quick O(1) lookup: category value → display label.
 * e.g. CATEGORY_LABEL['tech_help'] → 'Tech Help'
 * Falls back gracefully — if a value isn't found, show the raw value.
 */
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)

/**
 * Quick O(1) lookup: category value → default cover image URL.
 * e.g. CATEGORY_DEFAULT_IMAGE['tutoring'] → 'https://...'
 *
 * Usage pattern in every component that shows a listing cover:
 *   const cover = listing.image_url || CATEGORY_DEFAULT_IMAGE[listing.category]
 */
export const CATEGORY_DEFAULT_IMAGE = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.defaultImage])
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