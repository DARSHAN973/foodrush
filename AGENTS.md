# Darshan's Web Dev Mentorship Context

## Who I Am

- I know React and Tailwind basics
- I built a React FoodRush app and migrated it to Next.js App Router
- I learn by doing — I understand concepts but struggle writing code from memory
- I want honest mentorship, not just answers handed to me
- https://foodrush-nu.vercel.app

## How I Learn Best — ALWAYS FOLLOW THIS, never skip

- Never give full code directly at the start
- First explain WHAT we're building and WHY (keep it short and practical)
- Then show a similar example from FoodRush or a slightly different context
  so I can see the pattern without copying directly
- Ask me to try writing it myself first
- Only then guide me, hint me, or correct me
- Point out mistakes clearly and explain WHY it's wrong
- For quizzes/revision, ask one question at a time, wait for my answer, then
  correct or improve it before asking the next one.
- For coding practice, give me the smallest useful hint or skeleton, let me try,
  then review my attempt instead of giving the full solution first.
- Build my muscle memory — I should be able to write code myself eventually
- No unnecessary theory — keep it practical and real
- For revision/comment sessions: ask me the WHY first, then give me the clean
  comment to paste/type myself. Do not directly edit comments into files unless
  I explicitly ask.
- Do not change code without my permission.

## FoodRush As My Reference Project — IMPORTANT

- FoodRush is not just a learning project — it is my personal reference bible.
- Every concept I learn gets commented properly in the actual file where it first appears.
- Future projects I will read FoodRush code instead of docs or AI for patterns.
- So code quality must always be clean, production-grade, and well structured.
- Always help me write code I can be proud of and reuse.
- Keep `mysql.md` and `prisma.md` updated after database/Prisma learning sessions.

## Commenting Strategy — ALWAYS FOLLOW THIS

- Comment the WHY and the concept name, not the obvious what.
- First time a concept appears → full explanation comment.
- Same concept in another file → one line + reference like:
  // See app/(user)/restaurants/page.js → generateStaticParams
- Never comment obvious things like "this is a useState" or "this adds 1".
- Comment complex logic always.
- Comment after each session — not at the end of the whole project.
- Tailwind/styling → NO comments needed, AI handles that anyway.
- Outside JSX use `// comment`.
- Inside JSX use `{/* comment */}` because JSX needs `{}` to enter JavaScript mode.

### Good comment example:

// generateStaticParams — tells Next.js which dynamic routes to
// pre-build at build time (SSG). Without this, /restaurant/[id]
// would render on every request (SSR) instead of being pre-built.
export async function generateStaticParams() {

### Reference comment example (repeat usage):

// SSG via generateStaticParams — see app/(user)/restaurants/page.js
export async function generateStaticParams() {

## My Current Project

- Name: FoodRush (food delivery app like Swiggy/Zomato)
- Path: `/home/darshan/darshan/web_development_revision/foodrush`
- Stack: Next.js App Router, Tailwind CSS, React, MySQL, Prisma
- Product identity: FoodRush is a food ordering app, not a recipe finder.
- Correct product flow:
  user browses restaurants → opens a restaurant → sees menu items →
  adds menu items to cart → checks out cart → pays → receives restaurant-wise orders.
- FoodRush supports multi-restaurant checkout:
  one cart can contain items from multiple restaurants, one payment covers
  the full checkout, and the app splits it into restaurant-wise orders.

### Project Structure

```txt
app
├── layout.js
├── globals.css
├── actions
│   ├── authActions.js
│   ├── cartActions.js
│   ├── adminRestaurantActions.js
│   ├── adminMenuItemActions.js
│   ├── adminOrderActions.js
│   └── uploadActions.js
├── (user)
│   ├── layout.js
│   ├── page.js
│   ├── restaurants/page.js, loading.js, error.js
│   ├── restaurants/[id]/page.js, loading.js, error.js, not-found.js
│   ├── cart/page.js
│   ├── orders/page.js
│   └── login/page.js
├── admin
│   ├── layout.js, page.js
│   ├── orders/page.js
│   └── restaurants/page.js, [id]/menu-items/page.js
├── api
│   └── restaurants/route.js, [id]/route.js
components
├── AddToCartButton.js, Button.js, EmptyState.js
├── AdminRestaurantsClient.js, AdminMenuItemsClient.js, AdminOrdersClient.js
├── CartItemControls.js, ErrorMessage.js, Footer.js
├── ImageUpload.js, Input.js, Loading.js, MenuAddButton.js
├── MenuClient.js, Navbar.js, NavbarClient.js
├── RestaurantCard.js, ScrollToTop.js, Toast.js
context
└── CartContext.js
hooks
└── useRestaurants.js
lib
├── admin.js
├── cart.js
├── cloudinary.js
├── menuItems.js
├── orders.js
├── prisma.js
└── restaurants.js
prisma
├── schema.prisma
├── seed.js
└── migrations
public
└── videos/hero-video.mp4
```

### Current Prisma Schema Models

`User`, `Restaurant`, `MenuItem`, `Cart`, `CartItem`,
`ParentOrder`, `RestaurantOrder`, `OrderItem`, `Payment`,
`OperatingHours`, `VendorWarning`

### Current Prisma Enums

`UserRole` (USER | VENDOR | ADMIN), `RestaurantStatus` (PENDING | ACTIVE | SUSPENDED | REJECTED),
`DayOfWeek` (MON–SUN), `ParentOrderStatus`, `RestaurantOrderStatus`, `PaymentStatus`

---

## ✅ V1 — Complete

All core features shipped. Summary of what was built:

- **Next.js fundamentals** — SSR/SSG/CSR, metadata, route handlers, server actions,
  client vs server components, Suspense/streaming, generateStaticParams
- **Web & browser fundamentals** — HTTP, REST, localStorage/cookies, JWT/sessions,
  httpOnly cookies, CORS, Fetch API
- **MySQL + Prisma** — schema design, CRUD, relations, joins, transactions, indexes,
  normalization, database-backed API routes
- **Auth** — NextAuth.js, email/password with bcrypt, Google OAuth, protected routes,
  session-based user ID in cart and orders
- **Cart + Orders** — database-backed cart, multi-restaurant checkout, Razorpay payment,
  order history with ParentOrder → RestaurantOrder → OrderItem breakdown
- **Admin Dashboard** — protected admin routes, dashboard stats, restaurant CRUD,
  menu item CRUD, Cloudinary image upload/delete, order management with status updates
- **Deployment** — Vercel deploy, production MySQL database connected

---

## 🚀 V2 — Roadmap

V2 is the finishing and polishing version. Goal: make FoodRush feel like a real product.

### Known V1 Bugs to Fix First

- **Orphaned PAYMENT_PENDING orders** — If a user cancels the Razorpay popup without
  paying, the `ParentOrder`/`RestaurantOrder`/`OrderItem` rows stay stuck at
  `PAYMENT_PENDING` forever. Fix: implement **Razorpay Webhooks**
  (`POST /api/webhooks/razorpay`) — Razorpay calls this server-to-server when a
  payment is cancelled/failed/expired, and we update the order status to `CANCELLED`.

### V2 Schema Changes — ✅ ALL DONE

All schema changes for vendor onboarding are complete and live in the DB:

```
User.role            → VENDOR added (USER | VENDOR | ADMIN)
Restaurant.ownerId   → FK to User (one vendor = one restaurant, @@unique)
Restaurant.status    → RestaurantStatus enum (PENDING | ACTIVE | SUSPENDED | REJECTED)
Restaurant.isOpen    → boolean (vendor toggles this live) — was already there
Restaurant.address   → String? (restaurant physical address)
Restaurant.phone     → String? (contact number)
Restaurant.description → String? (about the restaurant)
Restaurant.rejectionReason → String? (admin fills when rejecting)
Restaurant.isActive  → REMOVED, replaced by status enum

New models added:
  OperatingHours  — per-day schedule (Mon–Sun open/close times + isOpen)
                    @@unique([restaurantId, openDay]) — no duplicate days
  VendorWarning   — admin warnings to vendor (message + isRead + restaurantId)
                    @@index([restaurantId]) — fast lookup by restaurant
```

Key lesson: `isActive Boolean` (true/false) was replaced by `RestaurantStatus` enum
because a boolean can't express PENDING, SUSPENDED, REJECTED states.

---

### 🔴 Phase 1 — MUST DO (non-negotiable, ~40–50 hrs)

#### [x] 1. Razorpay Webhooks — Fix V1 Bug (2–3 hrs)

- `POST /api/webhooks/razorpay` endpoint
- [x] Create Route Handler with signature verification
- [x] Update `placeOrder` & `verifyPayment` to create/track `Payment` records in DB
- [x] Implement database status updates for `payment.failed` in the webhook route handler
- **Teaches:** webhook pattern, signature verification, background event handling

#### [x] 2. Mobile-First UI + UI Upgrade & Profile Page (10–12 hrs)

- [x] Full mobile responsive pass — navbar hamburger menu, card grids, cart, orders, admin
- [x] Profile avatar with dropdown (Gmail-style first-letter avatar)
  - [x] Logged in: avatar → dropdown (My Orders, Logout)
  - [x] Logged out: Login button
- [x] Navbar icons with `lucide-react`
- [x] **Dedicated Profile Page (`/profile`)** — Show profile details, account info, and prepare UI/slots for saved addresses (Phase 2, Step 9).
- **Teaches:** responsive design, mobile-first thinking, NextAuth session profiling

#### [x] 3. Restaurant Search + Filter with searchParams (3–4 hrs)

- [x] Search bar on restaurants page (by name, cuisine)
- [x] Filter by cuisine type, rating, open/closed
- [x] URL-based state with `searchParams` — shareable links
- **Teaches:** searchParams, URL as state, server-side filtering

#### [x] 4. Loading States + SEO Audit (5–7 hrs)

- [x] Audit all pages: loading.js skeletons, empty states, error.js
- [x] Proper `generateMetadata` on all dynamic pages
- [x] Next Image optimization pass
- **Teaches:** SEO best practices, skeleton UI patterns

#### [~] 5. Vendor Onboarding + Admin Approval (8–10 hrs)

**Sub-steps and build plan (8 total):**

- [x] **Schema** — UserRole+VENDOR, RestaurantStatus enum, OperatingHours model,
      VendorWarning model, Restaurant fields (ownerId, status, address, phone,
      description, rejectionReason). Migration done.
- [x] **Vendor signup flow** — `app/actions/vendorActions.js` → `createVendorApplication`
      server action. Creates Restaurant with status PENDING + ownerId.
- [x] **Profile page Vendor tab** — 4-state UI:
  - State 1 (no app) → CTA banner + `VendorApplicationForm` client component
  - State 2 (PENDING) → amber "Under Review" card
  - State 3 (ACTIVE) → green card + "Go to Vendor Dashboard" link
  - State 4 (REJECTED) → red card with admin's rejectionReason
- [ ] **Admin Applications tab** — list PENDING restaurants, Approve/Reject with reason
  - Approve: set status=ACTIVE + user.role=VENDOR
  - Reject: set status=REJECTED + store rejectionReason
- [ ] **Admin Vendor Controls** — Suspend/Unsuspend, Send Warning to vendor
- [ ] **Vendor Layout + route protection** — `app/vendor/layout.js`,
      only VENDOR role can access, sidebar nav
- [ ] **Vendor Dashboard** (`/vendor`) — stats (orders, revenue, top items),
      admin warnings bell icon
- [ ] **Vendor Orders** (`/vendor/orders`) — incoming orders + status updates
      (Preparing → Out for Delivery → Delivered)
- [ ] **Vendor Management** (`/vendor/management`) — two tabs:
  - Tab 1: Restaurant Info (edit details, open/close toggle, operating hours)
  - Tab 2: Menu Items (add/edit/delete + available toggle)

**New files created this session:**

- `app/actions/vendorActions.js`
- `components/VendorApplicationForm.js`
- Modified: `app/(user)/profile/page.js`, `lib/restaurants.js`,
  `components/AdminRestaurantsClient.js`, `app/actions/adminRestaurantActions.js`,
  `prisma/seed.js`, `app/api/restaurants/[id]/route.js`

**Key concept learned:** `prisma generate` must be run after schema changes.
`db push` does not always regenerate the client. When you see "Unknown argument",
run `npx prisma generate` then delete `.next` and restart.

- **Teaches:** multi-role auth, role-based route protection, platform architecture

#### [ ] 6. Real-Time Order Tracking with SSE (4–6 hrs)

- Use **Server-Sent Events (SSE)** — correct tool for server→client only updates
- `GET /api/orders/[id]/stream` — streams status updates to the client
- Order tracking page shows live status (Placed → Preparing → Out for Delivery → Delivered)
- **Note:** SSE is native to HTTP, works on Vercel (unlike raw WebSockets).
  WebSockets require a persistent server — learn separately via a mini chat project.
- **Teaches:** SSE, ReadableStream in Next.js, real-time UX pattern

#### [ ] 7. Reviews + Ratings (5–6 hrs)

- Users can rate and review a restaurant after an order is delivered
- Star rating component, review text, posted with user name
- Restaurant card shows average rating (recalculate on new review)
- **Teaches:** aggregate queries in Prisma, review/trust-signal UX pattern

---

### 🟡 Phase 2 — SHOULD DO (high value, ~30–40 hrs)

#### [ ] 8. Framer Motion Animations (6–8 hrs)

- Page transitions, cart item animations, micro-interactions
- Framer Motion is React-native (not GSAP which is DOM-level)
- Do this during/after mobile UI pass for best effect

#### [ ] 9. Saved Delivery Addresses (4–5 hrs)

- Users save multiple addresses, pick one at checkout
- `SavedAddress` model in schema

#### [ ] 10. Promo Codes + Discounts (6–8 hrs)

- Admin creates promo codes with discount type (flat/percent), min order, expiry
- User applies code at checkout, discount reflected in total
- `PromoCode` model in schema
- **Teaches:** business logic, discount calculation, coupon UX

#### [ ] 11. Push Notifications (6–8 hrs)

- Web Push API + Service Workers
- Notify user when order status changes
- Firebase Cloud Messaging (FCM) or native Web Push
- **Teaches:** Service Workers, push API, background tasks

#### [ ] 12. AI Assistant (8–10 hrs)

- Customer assistant: "What's good here?", "Find me pizza under ₹200"
- Admin assistant: "Which restaurant had lowest sales this week?"
- Use OpenAI API or Gemini API
- **Teaches:** AI API integration, prompt engineering basics

#### [ ] 13. Pagination for Restaurants & Admin Tables (3–4 hrs)

- Implement page/limit state using `searchParams` on restaurant lists
- Add database-level pagination using Prisma `take` and `skip`
- Integrate pagination controls (Prev/Next buttons, page counters)
- **Teaches:** SQL Limit/Offset pagination, URL-based page tracking

---

### ⚪ Phase 3 — NICE TO HAVE (polish, ~25–30 hrs)

#### [ ] 14. Email Notifications with Nodemailer (5–6 hrs)

- Order confirmation email, vendor approval/rejection email
- Pairs with vendor onboarding flow

#### [ ] 15. Forgot Password + Reset (4–5 hrs)

- Send reset link via email (needs Nodemailer)
- Token-based reset flow

#### [ ] 16. Favorites / Wishlist (3–4 hrs)

- Save restaurants to favorites, quick access from profile

#### [ ] 17. Dark Mode (2–3 hrs)

- CSS variables + Tailwind dark class toggle
- Store preference in localStorage

#### [ ] 18. Saved Mobile Number (1–2 hrs)

- Paired with saved addresses at checkout

#### [ ] 19. Admin Dashboard Reports (6–8 hrs)

- Charts (revenue over time, orders per day)
- Use `recharts` or `chart.js`
- Top-performing restaurants, most ordered items

#### [ ] 20. README + Portfolio Writeup (3–4 hrs)

- Full README with setup instructions, tech stack, screenshots
- Architecture diagram, design decisions documented
- Step 53 from original roadmap — do this at the very end

---

## What's Next

- V1 is fully complete and deployed ✅
- Phase 1, Step 1 (Razorpay Webhooks) is complete ✅
- Phase 1, Step 2 (Mobile-First UI & Dedicated Profile Page) is complete ✅
- Phase 1, Step 3 (Restaurant Search + Filter with searchParams) is complete ✅
- Phase 1, Step 4 (Loading States + SEO Audit) is complete ✅
- Phase 1, Step 5 (Vendor Onboarding) is **IN PROGRESS** 🔄
  - Schema done ✅
  - Vendor signup form (Profile page Vendor tab) done ✅
  - **Next session:** Admin Applications tab (approve/reject vendor applications)
    → then Admin Vendor Controls → then full Vendor Panel (layout + dashboard + orders + management)

### Next Session Build Order

```
1. Admin: Applications tab — see PENDING apps, Approve/Reject
   (completes the signup flow so it's fully testable end-to-end)
2. Admin: Vendor controls — Send Warning, Suspend/Unsuspend
3. Vendor layout + route protection (VENDOR role only)
4. Vendor Dashboard — stats + warnings bell
5. Vendor Orders — incoming orders + status updates
6. Vendor Management — restaurant info + menu items (tabbed)
```
