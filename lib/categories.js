// Single source of truth for listing categories.
// All values must match what is stored in the database.

export const CATEGORIES = [
  { value: 'tutoring',          label: 'Tutoring' },
  { value: 'cleaning',          label: 'Cleaning' },
  { value: 'consular',          label: 'Consular Docs' },
  { value: 'elderly_care',      label: 'Elderly Care' },
  { value: 'moving',            label: 'Moving & Delivery' },
  { value: 'tech_help',         label: 'Tech Help' },
  { value: 'language_exchange', label: 'Language Exchange' },
]

// Quick lookup: value → label (e.g. CATEGORY_LABEL['tech_help'] → 'Tech Help')
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)