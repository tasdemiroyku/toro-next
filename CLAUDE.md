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
│   ├── inbox/page.jsx                 Inbox (Server Component)
│   ├── listings/
│   │   ├── [id]/
│   │   │   ├── page.jsx               Listing detail (Server Component)
│   │   │   └── edit/page.jsx          Edit listing (Server + Client)
│   │   ├── create/page.jsx            Create listing (Server + Client)
│   │   ├── my/page.jsx                User's own listings
│   │   └── page.jsx                   Browse listings (Server Component, paginated)
│   ├── login/page.jsx                 Auth page (email + OAuth)
│   ├── profile/page.jsx               User profile (Server Component)
│   ├── reset-password/page.jsx        Password reset
│   ├── globals.css                    Tailwind v4 + design system classes
│   ├── layout.js                      Root layout — fetches user server-side, passes to Header
│   └── page.js                        Home (Server Component)
├── components/
│   ├── CreateListingClient.jsx        Listing creation form (with image upload)
│   ├── EditListingClient.jsx          Listing edit form (with image upload + default fallback)
│   ├── Footer.jsx                     Institutional footer
│   ├── Header.jsx                     Sticky animated header with search + unread dot
│   ├── HomeClient.jsx                 Landing page (hero, listings grid)
│   ├── InboxClient.jsx                Real-time messaging UI (conversation list + thread)
│   ├── ListingDetailClient.jsx        Detail view + contact form
│   ├── ListingsClient.jsx             Browse grid + category filters + pagination
│   ├── MyListingsClient.jsx           Owner's listing management
│   ├── ProfileClient.jsx              Profile edit (personal/academic/security + avatar upload)
│   ├── ToretBull.jsx                  SVG bull logo component
│   └── ToroLoader.jsx                 Full-screen loading overlay
├── lib/
│   └── categories.js                  CATEGORIES, CATEGORY_LABEL, CATEGORY_DEFAULT_IMAGE, PRICE_TYPES, PRICE_TYPE_LABEL
├── utils/
│   ├── supabase/
│   │   ├── client.js                  Browser Supabase client
│   │   ├── server.js                  Server Supabase client (cookies)
│   │   └── proxy.js                   Session update helper used by middleware
│   └── upload.js                      Image compression + Supabase Storage upload
├── supabase/migrations/
│   ├── rls_policies.sql               RLS for profiles/listings/messages
│   ├── storage_setup.sql             toro-uploads bucket + storage policies
│   ├── week2_features.sql            is_verified, image_url, auto-verify trigger
│   └── fix_messages_fk.sql           Explicit FK names + NOTIFY pgrst reload schema
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
| is_verified | boolean | Added Week 2 — set server-side by Postgres trigger |
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
| image_url | text | Added Week 2 — public URL from toro-uploads |
| created_at | timestamptz | |

### messages
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| listing_id | uuid | FK: messages_listing_id_fkey → listings.id CASCADE |
| sender_id | uuid | FK: messages_sender_id_fkey → profiles.id CASCADE |
| receiver_id | uuid | FK: messages_receiver_id_fkey → profiles.id CASCADE |
| content | text | Max 500 chars |
| read | boolean | Default false, only receiver can update |
| created_at | timestamptz | |

CRITICAL: FK constraint names must exactly match the above for PostgREST
to resolve the double-profile join in inbox/page.jsx. If the schema error
returns, run fix_messages_fk.sql then NOTIFY pgrst, 'reload schema'.

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

### Cover image fallback pattern
Every component that renders a listing cover must use:
```js
import { CATEGORY_DEFAULT_IMAGE } from '@/lib/categories'
const cover = listing.image_url || CATEGORY_DEFAULT_IMAGE[listing.category]
```
Never show a blank space — always fall back to the category stock photo.
Default images use free Unsplash Source URLs (no key required).

## Routing & Auth Architecture
`proxy.js` at the root is the Next.js middleware entry-point (Next.js 16+ convention). DO NOT create a `middleware.js` file, as it causes a fatal conflict.
Protected routes: /profile, /listings/create, /listings/my, /listings/[id]/edit, /inbox
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

### Week 2 (Completed)
Real-time inbox: InboxClient.jsx — conversation list, thread view, optimistic sends, read receipts
app/inbox/page.jsx — Server Component with explicit FK hints for double-profile join
is_verified on profiles — Postgres trigger fires on INSERT/UPDATE, checks email domain
image_url on listings — optional cover photo stored in toro-uploads
Avatar upload in ProfileClient.jsx via utils/upload.js
Cover photo upload in CreateListingClient.jsx and EditListingClient.jsx
CATEGORY_DEFAULT_IMAGE in lib/categories.js — Unsplash fallback per category
Server-side pagination on /listings (PAGE_SIZE=12, URL params: ?q= ?category= ?page=)
Verified badge on listing cards (ListingsClient) and detail page (ListingDetailClient)
Header unread dot — real-time subscription to messages, clears when inbox opened
fix_messages_fk.sql — dropped and recreated FK constraints with exact PostgREST names

### Week 3 (Upcoming)
i18n — next-intl with EN, IT, TR locale files

Report user / listing mechanism (do not forget):
  - New table: reports (id, reporter_id, target_type TEXT CHECK IN ('listing','user'), target_id uuid, reason text, created_at)
  - RLS: authenticated users INSERT only; service role reads for admin
  - UI: "Report this listing" small link in ListingDetailClient sidebar
  - UI: "Report this user" small link on provider card
  - On INSERT: Resend email to founders with report details
  - Admin view: simple password-protected /admin/reports page or Supabase dashboard query

Ratings & reviews — 1-5 stars after a completed service exchange
Dynamic OG images — next/og per listing for better social sharing
PWA push notifications — notify receiver of new message without opening the app

## Known Constraints & Decisions
No TypeScript (deliberate choice for MVP speed — revisit post-launch)
Turbopack is enabled via next dev — note it has limited plugin support vs webpack
CATEGORIES values are permanent — renaming requires a SQL UPDATE migration first
Images are stored in Supabase Storage under toro-uploads, publicly accessible, path-restricted by user ID via RLS
i18n is planned (EN, IT, TR) but not yet implemented — all UI text is currently English
Default cover images use Unsplash Source URLs — no API key needed, but rate-limited at scale. Replace with self-hosted CDN assets before public launch.

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
Show a blank cover image — always fall back to CATEGORY_DEFAULT_IMAGE