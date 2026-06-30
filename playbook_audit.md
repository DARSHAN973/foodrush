# 🔍 DEVELOPER_PLAYBOOK.md — Full Audit Report

**Verdict:** The playbook is a strong foundation, but it's **not ready to be a 1000-project bible yet.** It covers ~40% of the patterns you already use in FoodRush. The 60% that's missing are patterns you've already learned and coded — they just aren't documented here.

I've organized everything by **severity** so you can tackle the critical gaps first.

---

## 🔴 MISSING — Patterns You Already Use But Aren't in the Playbook

These are production patterns that exist in your actual FoodRush code right now, but someone reading only the playbook would never learn them.

### 1. Prisma Client Singleton Pattern (`lib/prisma.js`)

Your project has a critical `lib/prisma.js` that prevents creating hundreds of database connections during development hot-reloads. This pattern is **mandatory for every Next.js + Prisma project** and is completely absent from the playbook.

**What to document:**

- Why `globalThis` caching is needed (Next.js hot reload creates new modules every save)
- The `if (NODE_ENV !== "production")` guard
- Your MariaDB adapter setup

---

### 2. Server Actions + `revalidatePath` Pattern

Your `cartActions.js` is a textbook example of the Server Action mutation cycle:

1. `"use server"` directive
2. Authenticate with `getServerSession`
3. Mutate the database
4. Call `revalidatePath()` to refresh cached server-rendered UI

The playbook has the auth protection pattern (§ Secure Multi-Role Auth), but **never shows `revalidatePath`** — the mechanism that makes server-rendered pages reflect mutations. This is THE core mutation pattern in Next.js App Router.

---

### 3. `error.js` Error Boundary Pattern

The pre-flight checklist mentions "Is there an `error.js`?" but never shows the template. Your `restaurants/error.js` is a perfect reusable pattern:

- `"use client"` directive (mandatory for error boundaries)
- `{ error, reset }` props
- Reset button that retries the route segment

**Should be a copyable template** just like the skeleton template.

---

### 4. `not-found.js` Pattern + `notFound()` Trigger

Your `[id]/not-found.js` and the `notFound()` call in the page are a clean pattern pair. The playbook says nothing about:

- When to use `not-found.js` (dynamic routes where IDs might not exist)
- The separation of concerns: helper returns `null`, page calls `notFound()`
- How Next.js finds the nearest `not-found.js` in the route tree

---

### 5. Route Param Validation Pattern

Your `lib/restaurants.js` has this crucial guard:

```javascript
const restaurantId = Number(id);
if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
  return null;
}
```

URL params are always strings. Before querying the database, you must validate and cast them. This prevents Prisma errors and potential injection. **Not in the playbook.**

---

### 6. `generateStaticParams` (SSG for Dynamic Routes)

Your `[id]/page.js` uses `generateStaticParams` to pre-build the top 10 restaurant pages at build time. This is a core Next.js performance pattern:

- Which routes to pre-build vs. render on-demand
- Why params must be strings
- The `.slice(0, 10)` strategy for large datasets

---

### 7. Prisma Decimal Serialization Pattern

Your code has this pattern in **every single data function**:

```javascript
return { ...restaurant, rating: Number(restaurant.rating) };
```

Prisma returns `Decimal` fields as objects, not plain numbers. If you forget this, your UI breaks or you get `[object Object]` in the browser. This is a universal Prisma gotcha that must be documented.

---

### 8. `next.config.mjs` — Remote Image Allowlist

Your config explicitly allows `images.unsplash.com` and `res.cloudinary.com`. Without this, `next/image` throws a runtime error for any external image URL. Every new project with remote images needs this.

---

### 9. File Upload Pattern (Cloudinary)

Your `lib/cloudinary.js` contains a complete file upload system:

- SDK configuration from environment variables
- `upload_stream` wrapped in a Promise (callback → async/await conversion)
- `stream.end(imageBuffer)` to flush the buffer
- `deleteImageFromCloudinary` for cleanup

This is a reusable pattern for any project with user-uploaded images.

---

### 10. Webhook Signature Verification Pattern

Your `api/webhooks/razorpay/route.js` has a production-grade webhook handler:

- Reading raw body with `req.text()` (not `req.json()`)
- HMAC-SHA256 signature comparison
- Idempotent database updates

This is reusable for Stripe, Razorpay, GitHub, or any webhook provider.

---

### 11. React Context + Provider Pattern

Your `CartContext.js` demonstrates:

- `createContext()` + Provider wrapper
- Lazy state initializer with `typeof window` SSR guard
- `localStorage` sync via `useEffect`
- Derived state (`cartCount`, `totalCartPrice` via `.reduce()`)

This is the foundational state management pattern before you reach for Zustand or Redux.

---

### 12. `EmptyState` / Reusable UI Component Pattern

Your `EmptyState.js` is a clean example of a reusable display component with props. The playbook shows skeletons but never mentions the "what to show when data is empty" pattern — which is equally critical for UX.

---

### 13. Environment Variables + `.env` Setup

The playbook never mentions:

- `.env` file structure (what keys a project needs)
- `NEXT_PUBLIC_` prefix for client-exposed variables
- `.env.example` convention for team/repo sharing
- Which variables must be set for dev vs. production

---

## 🟡 INCOMPLETE — Existing Sections That Need Additions

### 14. SEO Section — Missing `openGraph` Image + Structured Data

Your SEO section is solid for titles and descriptions, but doesn't cover:

- **Open Graph images** (`og:image`) — what shows up when you share a link on WhatsApp/Twitter
- **`robots.txt`** and **`sitemap.xml`** generation
- Canonical URLs for duplicate content prevention
- The `viewport` meta tag (critical for mobile rendering)

### 15. Media Section — Missing `next/image` `sizes` Attribute

Your `RestaurantCard.js` uses:

```jsx
sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
```

The playbook's hero image example uses `sizes="100vw"` but never explains the responsive `sizes` pattern — which is how you prevent the browser from downloading a 2000px image for a 300px card.

### 16. Pre-Flight Checklist — Missing Items

The checklist is good but should also include:

- [ ] **Empty States:** Does every list page show a meaningful UI when the data array is empty?
- [ ] **Not-Found Pages:** Does every `[dynamic]` route have a `not-found.js`?
- [ ] **Param Validation:** Are URL params validated/cast before database queries?
- [ ] **Decimal Fields:** Are all Prisma `Decimal` returns converted to `Number()` before sending to UI?
- [ ] **Remote Images:** Are all external image domains added to `next.config.mjs`?
- [ ] **Env Variables:** Are all required environment variables documented in `.env.example`?
- [ ] **Prisma Singleton:** Is the Prisma client using the `globalThis` caching pattern?

---

## ⚪ MINOR — Polish and Small Fixes

### 17. Skeleton Template Has a Nonexistent Tailwind Class

Line 50: `bg-gray-250` — this class doesn't exist in Tailwind. Should be `bg-gray-200` or `bg-gray-300`.

### 18. Debounce Section — Missing `router.replace` vs `router.push`

Your debounce example uses `router.push()`, which adds every search keystroke to the browser history. For search filters, `router.replace()` is usually better so the user doesn't have to press Back 20 times.

### 19. Section Organization

The playbook currently has 6 sections. For a 1000-project bible, consider organizing into a clear hierarchy:

1. **Pre-Flight Checklist** (keep at top ✅)
2. **Project Setup** (Prisma singleton, env vars, next.config, folder structure)
3. **Data Layer** (Prisma queries, transactions, N+1, Decimal serialization, param validation)
4. **Server Patterns** (Server Actions, revalidatePath, generateStaticParams, generateMetadata, webhooks)
5. **Client Patterns** (Context/state, debouncing, localStorage sync)
6. **UI Patterns** (Skeletons, error boundaries, not-found, empty states)
7. **Media & Performance** (next/image, video, Cloudinary upload)
8. **Security** (Auth, role protection, webhook verification)
9. **SEO** (Metadata, OG tags, sitemap, robots)
10. **Deployment** (Vercel, env vars, build scripts)

---

## 📊 Summary Table

| Category                                    | Status          | Count  |
| ------------------------------------------- | --------------- | ------ |
| 🔴 Missing patterns (you already use them!) | Not documented  | 13     |
| 🟡 Incomplete sections                      | Needs additions | 3      |
| ⚪ Minor fixes                              | Polish          | 3      |
| **Total gaps**                              |                 | **19** |

---

## ✅ What's Already Good

- Skeleton template with code example ✅
- SEO title template system ✅
- `generateMetadata` for dynamic pages ✅
- Prisma indexing explanation ✅
- N+1 query prevention ✅
- `$transaction` pattern ✅
- Server action auth protection ✅
- Input debouncing ✅
- Hero image `priority` ✅
- Background video attributes ✅

---

## 🎯 Recommended Next Step

Before I write any code — **you tell me**: do you want to tackle all 19 gaps in one session, or break it into chunks? I'd recommend we go section by section, where I explain the pattern, show you an example, and you write it into the playbook yourself — consistent with how you learn best.

Which gap do you want to start with?
