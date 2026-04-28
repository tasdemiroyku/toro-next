# AGENTS.md — Universal AI Coding Assistant Rulebook for Toro

This file is the authoritative rulebook for **any** AI coding assistant
(Claude, Cursor, Copilot, Gemini, etc.) working in this repository.
Read it before writing a single line of code.

---

## 1. Non-Negotiable Rules

These rules override any other instruction. They are never relaxed.

| Rule | Detail |
|---|---|
| **English only** | All variable names, function names, comments, commit messages, and database column names must be in English. No Italian, Turkish, or any other language in code. |
| **Do not break working code** | Only modify the specific files and features requested. Leave everything else untouched. |
| **Never use `getSession()`** | Always use `supabase.auth.getUser()` for server-side auth checks. `getSession()` trusts client cookies without server validation. |
| **No inline SQL in components** | All DB queries live in Server Components or Server Actions, never in Client Components. |
| **No `any` types** | If this project ever adopts TypeScript, never use `any`. |

---

## 2. Architecture Rules

### Server vs. Client Components

```
Server Component (page.jsx)       Client Component (...Client.jsx)
─────────────────────────────     ────────────────────────────────
Data fetching (Supabase)          useState, useEffect, useRef
generateMetadata                  Framer Motion animations
Redirect on auth failure          User interactions (forms, clicks)
SEO-critical rendering            Real-time subscriptions
```

**The pattern for every route:**

```
app/some-route/page.jsx        ← Server Component, fetches data, passes props
components/SomeRouteClient.jsx ← Client Component, receives props, handles UX
```

Never fetch data inside a Client Component if it can be done in the parent
Server Component.

### Middleware — Next.js 16 convention

**⚠ Next.js 16 renamed the middleware file from `middleware.js` to `proxy.js`.**

The middleware entry-point for this project is `proxy.js` at the root.
It exports a function named `proxy` and a `config` object — both must be
defined directly in that file (not re-exported from another module, as
Next.js 16 cannot resolve re-exported configs).

```js
// proxy.js — correct ✅
export async function proxy(request) { ... }
export const config = { matcher: [...] }
```

**Never create a `middleware.js` file.** Next.js 16 will throw a hard error
if both files exist simultaneously.

The session helper lives at `utils/supabase/proxy.js` and is imported by
the root `proxy.js` — do not confuse the two files.

### File naming

- Pages: `page.jsx` (Next.js App Router convention)
- Client components: `PascalCaseClient.jsx`
- Utilities: `camelCase.js` inside `utils/` or `lib/`
- SQL: `supabase/migrations/snake_case_description.sql`

### Imports

Always use the `@/` alias for absolute imports. Never use relative paths that
climb more than one level (`../../`).

```js
// ✅ Correct
import { createClient } from '@/utils/supabase/client'
import { CATEGORIES } from '@/lib/categories'

// ❌ Wrong
import { createClient } from '../../utils/supabase/client'
```

---

## 3. Database Rules

- **Single joined queries** whenever possible:
  `.select('*, profiles(*)')` — not two separate queries.
- **UUID guard** before any `.eq('id', id)` query:
  ```js
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-..../i
  if (!UUID.test(id)) notFound()
  ```
- **Never write raw SQL** in JS files. Keep all SQL in `supabase/migrations/`.
- **`router.refresh()`** must be called after every mutation (insert, update,
  delete, auth change) to sync server state with the client.
- **All tables have RLS enabled.** Never disable it. Never use the service role
  key on the client side.

### Column naming

- Use `snake_case` for all column names.
- Boolean columns: prefix with `is_` (e.g., `is_active`, `is_verified`).
- Timestamps: suffix with `_at` (e.g., `created_at`, `updated_at`).
- Foreign keys: `{referenced_table_singular}_id` (e.g., `user_id`, `listing_id`).

---

## 4. Design System Rules

### Colors — never use raw hex inside components

| Token | Value | Use |
|---|---|---|
| `toro-dark` | `#132600` | Text, backgrounds, buttons |
| `toro-gold` | `#C9963E` | Accents, CTAs, icons |
| `toro-light` | `#FAFAF7` | Page background, light text |

Always reference colors via Tailwind tokens (`text-toro-dark`, `bg-toro-gold`),
not raw hex strings in `className`.

### Component classes — always use the global classes from `globals.css`

| Class | Use |
|---|---|
| `.toro-input` | All `<input>`, `<textarea>`, `<select>` elements |
| `.toro-btn-primary` | Primary CTA buttons (submit, publish, save) |
| `.toro-btn-gold` | Marketplace CTA buttons ("Post your service") |
| `.toro-btn-outline` | Secondary / cancel buttons |
| `.toro-empty-state` | Empty state containers |

**Never** hardcode `rounded-full px-5 py-3 border border-toro-dark/15 ...`
when `.toro-input` achieves the same thing.

### Shapes

- Inputs and buttons: `rounded-full`
- Cards and modals: `rounded-[2rem]` or `rounded-2xl`
- **Never use dashed borders** — always solid, always thin (`border-toro-dark/10`)

### Empty states

Every empty state must follow this exact pattern:

```jsx
<div className="toro-empty-state">
  <div className="w-16 h-16 text-toro-dark/15">
    <ToretBull className="w-full h-full" />
  </div>
  <div className="flex flex-col gap-1.5">
    <p className="text-toro-dark text-lg font-bold">Descriptive heading</p>
    <p className="text-toro-dark/40 text-sm max-w-xs mx-auto">Supporting text.</p>
  </div>
  <button className="toro-btn-primary">CTA label</button>
</div>
```

---

## 5. Security Rules

- **Route protection** lives in `proxy.js` (Next.js 16 convention — not `middleware.js`).
- **Defense in depth**: even if `proxy.js` guards a route, Server Component
  pages must also call `getUser()` and redirect if `!user`.
- **UUID validation** before every parameterized DB query.
- **No secrets in client code** — only `NEXT_PUBLIC_` vars are allowed in
  Client Components.
- **`redirectTo` must be validated** before using it in `router.push()` to
  prevent open redirect attacks. Only redirect to paths starting with `/`.

---

## 6. Prohibited Patterns

```js
// ❌ Never do these:

supabase.auth.getSession()          // Use getUser() instead
import ... from '../../utils/...'   // Use @/ alias
const CATEGORIES = [...]            // Import from @/lib/categories
<div style={{ color: '#132600' }}>  // Use Tailwind tokens
border border-dashed                // Never dashed borders
// middleware.js                    // NEVER create this file — Next.js 16 uses proxy.js
```

---

## 7. When in Doubt

1. Read the existing code in the file you're about to modify.
2. Check `lib/categories.js` before defining any list constants.
3. Check `globals.css` before writing new Tailwind utility combinations.
4. Check `CLAUDE.md` for project-specific memory.
5. Ask before refactoring working code that wasn't part of the request.