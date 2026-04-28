# CLAUDE.md — Project Memory Bank
This file is Claude's persistent memory for the Toro project. It is read at the start of every session and kept up to date after each significant change. It references AGENTS.md for universal rules.

@AGENTS.md

## Project Identity
Toro is a hyperlocal services marketplace for Turin (Torino), Italy. Anyone can offer or book services: tutoring, cleaning, consular document help, elderly care, moving assistance, tech support, and language exchange.
Founders: Ogi (business, UniTO) and Öykü (computer engineering, Politecnico). Both are immigrant students from Turkey, building this for the local and expat community in Turin.
Brand story: Named after the Toret — Turin's iconic cast iron bull fountains. The SVG logo (components/ToretBull.jsx) is a custom bull head illustration.
Tagline: Il marketplace degli studenti di Torino. (The marketplace of Turin's students.)
Production URL: https://toro-next.vercel.app

## Tech Stack
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.4 |
| Language | JavaScript (JSX) | — |
| Styling | Tailwind CSS | v4 |
| Database | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth (email + Google + LinkedIn) | — |
| Storage | Supabase Storage (toro-uploads bucket) | — |
| Animations | Framer Motion | 12.x |
| Email | Resend | — |
| Hosting | Vercel | — |
| Build tool | Turbopack (via next dev) | — |

## File Structure
toro-next/
├── app/
│   ├── auth/callback/route.js         OAuth callback handler
│   ├── listings/
│   │   ├── [id]/
│   │   │   ├── page.jsx               Listing detail (Server Component)
│   │   │   └── edit/page.jsx          Edit listing (Server + Client)
│   │   ├── create/page.jsx            Create listing (Server + Client)
│   │   ├── my/page.jsx                User's own listings
│   │   └── page.jsx                   Browse listings (Server Component)
│   ├── login/page.jsx                 Auth page (email + OAuth)
│   ├── profile/page.jsx               User profile (Server Component)
│   ├── reset-password/page.jsx        Password reset
│   ├── globals.css                    Tailwind v4 + design system classes
│   ├── layout.js                      Root layout — fetches user server-side, passes to Header
│   └── page.js                        Home (Server Component)
├── components/
│   ├── CreateListingClient.jsx        Listing creation form
│   ├── EditListingClient.jsx          Listing edit form
│   ├── Footer.jsx                     Institutional footer
│   ├── Header.jsx                     Sticky animated header with search
│   ├── HomeClient.jsx                 Landing page (hero, listings grid)
│   ├── ListingDetailClient.jsx        Detail view + contact form
│   ├── ListingsClient.jsx             Browse grid + category filters
│   ├── MyListingsClient.jsx           Owner's listing management
│   ├── ProfileClient.jsx              Profile edit (personal/academic/security)
│   ├── ToretBull.jsx                  SVG bull logo component
│   └── ToroLoader.jsx                 Full-screen loading overlay
├── lib/
│   └── categories.js                  CATEGORIES, CATEGORY_LABEL, PRICE_TYPES, PRICE_TYPE_LABEL
├── utils/
│   ├── supabase/
│   │   ├── client.js                  Browser Supabase client
│   │   ├── server.js                  Server Supabase client (cookies)
│   │   └── proxy.js                   Session update helper used by middleware
│   └── upload.js                      Image compression + Supabase Storage upload
├── supabase/migrations/
│   ├── rls_policies.sql               RLS policies for profiles/listings/messages
│   └── storage_setup.sql             toro-uploads bucket + storage policies
├── proxy.js                           Next.js middleware entry-point (Next.js 16+ convention)
├── AGENTS.md                          Universal AI assistant rules
├── CLAUDE.md                          This file — Claude's memory bank
└── .vscode/settings.json             File watcher exclusions (M1 perf fix)

## Database Schema
### profiles
| Column | Type | Notes |
|---|---|---|
| id | uuid | References auth.users, primary key |
| full_name | text | |
| avatar_url | text | Public URL from toro-uploads bucket |
| bio | text | Max 300 chars |
| languages | text[] | e.g. ['Italian', 'English', 'Turkish'] |
| location | text | |
| skills | text | Comma-separated |
| phone_number | text | Added Week 1 |
| university | text | Added Week 1 |
| department | text | Added Week 1 |
| created_at | timestamptz | |

### listings
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | References profiles.id CASCADE |
| title | text | Max 100 chars |
| description | text | Max 1000 chars |
| category | text | Must match a value in lib/categories.js |
| price | numeric | |
| price_type | text | hour, session, day, fixed, free |
| location | text | |
| languages | text[] | |
| is_active | boolean | Default true |
| created_at | timestamptz | |

### messages
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| listing_id | uuid | References listings.id |
| sender_id | uuid | References profiles.id |
| receiver_id | uuid | References profiles.id |
| content | text | Max 500 chars |
| read | boolean | Default false, only receiver can update |
| created_at | timestamptz | |

## Design System Summary
### Colors
toro-dark → #132600 — deep Toret green
toro-gold → #C9963E — warm antique gold
toro-light → #FAFAF7 — warm off-white

### Typography
Headings / Logo: var(--font-cormorant), serif (Cormorant Garamond, weights 600/700)
Body: font-sans (system sans-serif)

### Global component classes (defined in globals.css)
.toro-input — all form inputs and textareas
.toro-btn-primary — primary CTA (dark green)
.toro-btn-gold — marketplace CTA (gold)
.toro-btn-outline — secondary / cancel
.toro-empty-state — empty state containers
.toro-card — card containers

## Routing & Auth Architecture
`proxy.js` at the root is the Next.js middleware entry-point (Next.js 16+ convention). DO NOT create a `middleware.js` file, as it causes a fatal conflict.
Protected routes: /profile, /listings/create, /listings/my, /listings/[id]/edit
Pattern: proxy.js redirects to /login?redirectTo={pathname}
login/page.jsx reads ?redirectTo and ?next params and redirects after login
OAuth callbacks flow through /auth/callback/route.js which reads ?next
app/layout.js fetches the user server-side and passes it to <Header> to prevent the logged-out → logged-in flicker on every page load.

## Development History
### Week 1 (Completed)
SQL migration: added phone_number, university, department to profiles
Security fix: replaced getSession() with getUser() in create/page.jsx
Category fix: unified all category values under lib/categories.js
Values: tutoring, cleaning, consular, elderly_care, moving, tech_help, language_exchange
Design system: consolidated .toro-input, .toro-btn-* in globals.css
Navigation bugfix: Header.jsx mobile menu now closes on route change via usePathname
PRICE_TYPES moved to lib/categories.js alongside CATEGORIES

### Week 1.5 (Tech Debt / Architecture — Completed)
RLS policies written for profiles, listings, messages
toro-uploads storage bucket + storage RLS policies
utils/upload.js — reusable image compression + upload utility
Design system refactor: login/page.jsx, ProfileClient.jsx now use .toro-* classes
redirectTo fix: login page correctly redirects to the originally requested route
.vscode/settings.json — file watcher exclusions for M1 performance
CLAUDE.md and AGENTS.md written

### Week 2 (Completed — Security & Consistency Pass)
Critical fix: Established `proxy.js` as the sole middleware file for Next.js 16 compatibility.
Auth fix: app/layout.js now fetches user server-side and passes it to <Header> — eliminates the logged-out → logged-in flicker on every page load.
Props fix: HomeClient.jsx now correctly consumes the user prop; the "Post a service" CTA properly redirects unauthenticated users to /login.
Cache fix: ListingDetailClient.jsx calls router.refresh() after handleToggleActive so navigating away and back reflects the updated state.
Design fix: MyListingsClient.jsx fully aligned with Toro design system (ToretBull empty state, toro colour tokens, rounded-[2rem] cards, toro buttons).
Design fix: EditListingClient.jsx replaced private inputClass string with .toro-input, aligned labels, buttons, and error states with design system.
Design fix: ListingDetailClient.jsx textarea now uses .toro-input.
Video fallback: HomeClient.jsx hero <video> now has poster="/torino.jpeg" so the background is never blank if the WebM fails to load.
CLAUDE.md schema updated to include Week 1 profiles columns.

### Week 3 (Upcoming)
Messaging UI: inbox page + real-time message thread
Avatar upload: wire utils/upload.js → ProfileClient.jsx file input

## Known Constraints & Decisions
No TypeScript (deliberate choice for MVP speed — revisit post-launch)
Turbopack is enabled via next dev — note it has limited plugin support vs webpack
CATEGORIES values are permanent — renaming requires a SQL UPDATE migration first
Images are stored in Supabase Storage under toro-uploads, publicly accessible, path-restricted by user ID via RLS
i18n is planned (EN, IT, TR) but not yet implemented — all UI text is currently English

## Things I Must Never Do
Use getSession() anywhere server-side
Create a `middleware.js` file — Next.js 16 uses `proxy.js`. Having both breaks the app.
Define CATEGORIES or PRICE_TYPES locally in a component
Use dashed borders
Use raw hex colors in className instead of Tailwind tokens
Fetch data in a Client Component when a Server Component parent exists
Forget router.refresh() after mutations
Use relative ../ imports more than one level deep
Disable RLS on any table
Write custom input styling instead of using .toro-input