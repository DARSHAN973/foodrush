# Darshan's Web Dev Mentorship Context

## Who I Am
- I know React and Tailwind basics
- I built a React FoodRush app and migrated it to Next.js App Router
- I learn by doing — I understand concepts but struggle writing code from memory
- I want honest mentorship, not just answers handed to me

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
  Temporary DummyJSON recipe data is only placeholder data.
- Correct future product flow:
  user browses restaurants → opens a restaurant → sees menu items →
  adds menu items to cart → places an order.
- Future database/schema should model real ordering concepts:
  `Restaurant`, `MenuItem`, `Cart/CartItem`, `Order`, `OrderItem`, and later `User`.
- Do not design Prisma schema around DummyJSON recipe-only fields like
  `ingredients` and `instructions`; those can disappear when real FoodRush data
  replaces the placeholder API.

### Project Structure
```txt
app
├── layout.js
├── globals.css
├── (user)
│   ├── layout.js
│   ├── page.js
│   ├── restaurants/page.js, loading.js, error.js
│   ├── restaurants/[id]/page.js, loading.js, error.js, not-found.js
│   ├── cart/page.js
│   └── login/page.js
├── admin
│   ├── layout.js, page.js
│   ├── orders/page.js
│   └── restaurants/page.js
├── api
│   └── restaurants/route.js, [id]/route.js
components
├── AddToCartButton.js, Button.js, EmptyState.js
├── ErrorMessage.js, Footer.js, Input.js
├── Loading.js, Navbar.js, RestaurantCard.js
├── ScrollToTop.js, Toast.js
context
└── CartContext.js
hooks
└── useRestaurants.js
lib
├── prisma.js
├── restaurants.js
└── generated Prisma client output removed in favor of standard @prisma/client
prisma
├── schema.prisma
├── seed.js
└── migrations
public
└── videos/hero-video.mp4
```

## Current Database / Prisma State
- MySQL is installed and running locally.
- phpMyAdmin is installed and used for visual MySQL practice.
- `foodrush_db` is the local Prisma-owned database.
- Prisma version: `7.8.0`.
- Prisma 7 requires a driver adapter; FoodRush uses `@prisma/adapter-mariadb`.
- Current Prisma models: `Restaurant`, `MenuItem`.
- Current schema has:
  - `Restaurant` → `MenuItem[]`
  - `MenuItem.restaurantId` → `Restaurant.id`
  - native decimal types: `rating @db.Decimal(2, 1)`, `price @db.Decimal(10, 2)`
  - `imageUrl String?`
  - `isActive` and `isAvailable`
  - `createdAt` and `updatedAt`
- Current seed file:
  - uses Prisma 7 MariaDB adapter
  - uses `deleteMany()` to clear child rows before parent rows
  - seeds multiple restaurants with multiple menu items
  - uses a loop with `restaurant.create()` and nested `menuItems.create`
- `lib/prisma.js` is the reusable Prisma Client helper for Next.js server code.
  It uses `@prisma/adapter-mariadb` and a `globalThis` Prisma Client cache
  to avoid creating too many clients during development hot reloads.
- `lib/restaurants.js` has started replacing DummyJSON with Prisma:
  - `getRestaurants()` reads active restaurants from MySQL.
  - It uses `select` to return only list-card fields.
  - It converts `rating` from Prisma Decimal to a plain number before UI/API use.
  - `getRestaurant(id)` uses `findFirst`, includes available `menuItems`,
    returns `null` for missing data, and converts `rating`/`price` decimals.
  - `createRestaurant(data)` creates a Restaurant from POST body data and
    returns the created row with `rating` converted to a plain number.
  - `updateRestaurant(id, data)` supports PATCH-style partial updates for
    `name`, `cuisine`, and `deliveryTime`, checks only active restaurants,
    and converts `rating` before returning.
  - `deleteRestaurant(id)` performs a soft delete by setting `isActive: false`
    instead of hard-deleting the row.
- Reference files:
  - `mysql.md` for SQL/MySQL notes
  - `nextjs.md` for Next.js/App Router notes
  - `prisma.md` for Prisma notes

## ✅ Already Covered
- React basics
- Tailwind basics
- Built FoodRush in React
- Migrated FoodRush to Next.js App Router
- Client vs Server components (basics)
- Client vs Server components (deep dive)
- `useRouter`, `usePathname`, `useSearchParams` hooks
- `generateMetadata` basics and dynamic metadata
- SSR vs SSG vs CSR final revision
- Next.js fetch caching basics and deeper practice (`revalidate`, `no-store`, shared server cache)
- Environment variables basics: `.env`, `process.env`, server-only secrets, and `NEXT_PUBLIC_`.
- Cookies & headers basics with `cookies()` and `headers()` from `next/headers`.
- Middleware/proxy protected route basics using `proxy.js`, `NextResponse`, cookies, and matcher patterns.
- Server Actions basics: form actions, `FormData.get()`, Prisma/server helper usage, `revalidatePath`, and API routes vs Server Actions.
- Streaming & Suspense basics: route-level `loading.js`, component-level Suspense fallbacks, skeleton UI, and perceived speed.
- `generateStaticParams` basics: dynamic route params, params object shape, string URL params, and prebuild vs freshness tradeoff.
- Route handler GET basics: `GET /api/restaurants`, `GET /api/restaurants/[id]`,
  `Response.json()`, dynamic `params`, and `200`/`404`/`500` responses
- Route handler POST basics: `POST /api/restaurants`, `request.json()`,
  body validation, `400` for missing fields, `201 Created`, and Prisma-backed create.
- Route handler PATCH/DELETE basics: `PATCH /api/restaurants/[id]` partial update,
  `DELETE /api/restaurants/[id]` soft delete, `200` success, `400` validation,
  `404` missing/inactive rows, and `500` unexpected errors.
- MySQL basics with FoodRush examples:
  database, table, row, column, data types, constraints, primary key, foreign key,
  CRUD SQL, joins, aliases, aggregate functions, `GROUP BY`, `LEFT JOIN`,
  `HAVING`, basic transaction idea, indexes, many-to-many, NULL vs NOT NULL,
  and schema design basics
- Prisma basics so far:
  setup, MySQL connection, Prisma 7 adapter, migrations, native DB types,
  timestamps, active flags, image URL strategy, seed basics, `deleteMany`,
  `findMany`, `findUnique`, `create`, `update`, `delete`, `createMany`,
  `updateMany`, `where`, `orderBy`, `include`, `select`, `findFirst`,
  `connect`, `connectOrCreate`, stale client fix with `npx prisma generate`,
  nested create basics, soft delete basics, reusable Prisma Client helper,
  PATCH-style partial update objects, route handler request body debugging,
  and Decimal-to-number serialization for UI/API data.

## Full Learning Roadmap

### ✅ Phase 1 — Next.js Fundamentals (Complete)
- [x] 1. generateMetadata properly (SEO titles/descriptions)
- [x] 2. SSR vs SSG vs CSR final revision
- [x] 3. fetch caching deeper practice
- [x] 4. Route handlers / API routes GET basics (`GET /api/restaurants`, `GET /api/restaurants/[id]`)
- [x] 5. Environment variables basics
- [x] 6. Middleware + protected route basics
- [x] 7. Cookies & headers in Next.js (`cookies()`, `headers()`)
- [x] 8. Server Actions (forms without API routes)
- [x] 9. Client vs Server components (deep dive)
- [x] 10. Streaming & Suspense
- [x] 11. generateStaticParams for dynamic restaurant pages

### 🔄 Temporary Learning Order Update
- Phase 4 was started before finishing all remaining Phase 1 backend topics.
- Reason: MySQL + Prisma makes route handlers, orders, admin CRUD, and auth
  more real instead of practicing fake POST routes without persistence.
- Environment variables are being learned naturally through Prisma `DATABASE_URL`.
- Park serious `POST /api/orders`, full CRUD APIs, middleware, cookies, and auth
  until Prisma/database foundations are stronger.

### 🔄 Phase 2 — FoodRush UI Polish & Next.js Upgrade
- [ ] 12. Finish converting restaurant detail special files (loading, error, not-found)
- [x] 13. Improve homepage with server fetching
- [ ] 14. Improve filters/search using `searchParams`
- [ ] 15. Polish Next Image usage
- [ ] 16. Mobile responsive pass

### 🧹 Future FoodRush Refactor Tasks
- [x] Extract shared server restaurant helpers into `lib/restaurants.js`.
  - `getRestaurants()` is shared by homepage, restaurants page, and `/api/restaurants`.
  - `getRestaurant(id)` is shared by restaurant detail page and `generateMetadata`.
  - Helpers fetch data only; pages decide when missing data should call `notFound()`.
- Practice `searchParams` by converting restaurant filters/search/sort into URL state.
  - Example target URL: `/restaurants?cuisine=Italian&sort=rating`.
  - Goal: refresh/share/back-button should preserve selected filters.
- Keep `cache: "no-store"` as a future real-code comment only when FoodRush actually uses it for user/admin/payment data.
- Replace DummyJSON recipe-shaped data with real FoodRush database data.
  - Database-backed restaurant list/detail helpers and GET API routes are done.
  - Some UI placeholders may still be redesigned later with richer Restaurant fields.
- Refactor restaurant detail page from recipe ingredients/instructions to real restaurant menu items.
  - Started: menu items render from `restaurant.menuItems`.
  - Later: polish menu item cards and move cart flow to menu items instead of whole restaurants.

### ⏳ Phase 3 — Web & Browser Fundamentals (Don't skip)
- [ ] 17. How HTTP works (request, response, status codes)
- [ ] 18. REST API design principles
- [ ] 19. How browsers store data — localStorage, sessionStorage, cookies
- [ ] 20. Cookies vs Sessions vs JWT — how auth actually works in browser
- [ ] 21. httpOnly cookies — what they are and why they matter
- [ ] 22. CORS — what it is and why it breaks things
- [ ] 23. Fetch API deeply vs Axios

### 🔄 Phase 4 — MySQL + Prisma (In Progress)
- [x] 24. MySQL basics
- [x] 25. Prisma setup + connect to MySQL
- [ ] 26. Schema design (User, Restaurant, MenuItem, Order, OrderItem, Cart)
  - Current schema has `Restaurant` and `MenuItem`.
  - `Order`, `OrderItem`, `Cart/CartItem`, and `User` are still pending.
- [x] 27. Prisma CRUD operations
  - Covered: `findMany`, `findUnique`, `findFirst`, `create`, `update`,
    `updateMany`, `delete`, `deleteMany`, `createMany`, `where`, `orderBy`,
    `include`, `select`, and Decimal conversion before UI/API responses.
- [x] 28. Relations & joins properly
  - MySQL joins covered.
  - Prisma relation queries covered with nested create, `include`, `select`,
    `connect`, and `connectOrCreate` basics.
- [ ] 29. Transactions in Prisma
- [x] 30. Seed database with dummy data
  - Seed file now creates multiple FoodRush restaurants and menu items with
    real image URLs using a loop plus nested `menuItems.create`.
- [x] 31. Replace dummyjson API with real database
  - `getRestaurants()` and `getRestaurant(id)` are Prisma-backed.
  - `GET /api/restaurants` and `GET /api/restaurants/[id]` work in Thunder Client.
  - Helpers use `select`, active/available filters, id validation, and Decimal-to-number conversion.
- [ ] 32. Build backend APIs
- [x] 32a. Return to real route handlers with database-backed CRUD
- [ ] 32b. Revisit deeper MySQL topics after Prisma basics:
  indexes in Prisma, many-to-many in Prisma, deeper transactions,
  normalization, performance, locks/concurrency, views, stored procedures,
  and triggers.

### ⏳ Phase 5 — Authentication + Cart + Orders
- [ ] 33. NextAuth.js setup
- [ ] 34. Email/password signup + login
- [ ] 35. Google OAuth
- [ ] 36. Protected routes
- [ ] 37. Cart context improvements
- [ ] 38. Checkout flow
- [ ] 39. Order placement
- [ ] 40. Order history

### ⏳ Phase 6 — Admin Dashboard
- [ ] 41. Admin role setup
- [ ] 42. Protected admin routes
- [ ] 43. Dashboard stats
- [ ] 44. Restaurant CRUD
- [ ] 45. Menu item CRUD
- [ ] 46. Image upload with Cloudinary
- [ ] 47. Order management + status updates
- [ ] 48. Email notifications with Nodemailer

### ⏳ Phase 7 — Payments + Deployment
- [ ] 49. Razorpay integration
- [ ] 50. Payment success/failure handling
- [ ] 51. Deploy on Vercel
- [ ] 52. Connect production database
- [ ] 53. README + portfolio writeup

## Practice Projects (build between phases for independence)
- Mini routing app: home/list/detail/loading/error/not-found
- Product filter app: searchParams + client filters
- CRUD dashboard: Prisma + forms
- Auth notes app: protected routes
- Mini checkout app: cart + order flow

## Current System Design / Prisma Topics Pending For Next Session
Resume here:

```txt
1. Do a short FoodRush system design/scope session before adding more models.
   Goal: separate V1 portfolio scope from V2/V3 future product features.
2. Create or outline foodrush-system-design.md with:
   Vision, V1/V2/V3 scope, user/admin/vendor flows, entities, order lifecycle,
   pricing/costing ideas, delivery/courier ideas, and AI ideas.
3. After scope is clear, start MenuItem API route practice.
4. Suggested next routes:
   GET /api/restaurants/[id]/menu-items
   POST /api/restaurants/[id]/menu-items
5. Keep FoodRush product flow in mind:
   restaurants -> menu items -> cart -> orders.
```

Next.js topic order note:

```txt
Do not ignore remaining Next.js fundamentals, but learn them when they unlock
the next FoodRush feature:
- searchParams before URL-based restaurant filters/search
- Streaming/Suspense before polishing loading UX
- generateStaticParams before static/dynamic restaurant detail revision
```

## Last Session Covered
- Finished nested create with multiple menu items.
- Expanded `prisma/seed.js` to seed multiple restaurants and menu items with
  real image URLs.
- Learned why `createMany` does not support nested relation writes:
  `createMany` inserts many rows into one table, while nested create writes
  related rows across tables.
- Learned when to use loop + `restaurant.create()` + nested `menuItems.create`
  for relational seed data.
- Covered `connect` and `connectOrCreate` basics.
- Covered `findUnique`, `findFirst`, `include`, `select`, and nested relation
  selection for restaurant detail data.
- Practiced `update`, `updateMany`, hard delete vs soft delete, and why
  FoodRush should usually soft-delete restaurants with `isActive`.
- Created `lib/prisma.js`, the reusable Prisma Client helper for Next.js
  server code with MariaDB adapter and `globalThis` dev cache.
- Started replacing DummyJSON with database-backed helpers:
  `getRestaurants()` now uses Prisma, filters `isActive`, selects only fields
  needed by restaurant cards, orders by rating, and converts Decimal rating to
  a plain number.
- Confirmed `GET /api/restaurants` works from MySQL in Thunder Client.
- Updated restaurant list UI fields toward database names:
  `imageUrl` and `deliveryTime`.
- Discussed why route handlers/server components can use Prisma but Client
  Components should not import Prisma directly.
- Finished restaurant detail helper with nested `select`, invalid id validation,
  active/available filters, and Decimal conversion for `rating` and menu item `price`.
- Confirmed `GET /api/restaurants/[id]` works from MySQL in Thunder Client,
  including invalid/missing id behavior.
- Updated API route error handling pattern:
  log real server errors in the terminal, return safe generic `500` JSON to the frontend.
- Updated stale helper comments in `lib/restaurants.js`.
- Did a quick Prisma revision quiz covering method choice, `select`/`include`,
  Decimal conversion, nested create, `connect`, updates, soft delete, and error handling.
- Started Prisma-backed API CRUD after GET routes.
- Built and tested `POST /api/restaurants` successfully in Thunder Client:
  route reads JSON body with `await request.json()`, validates required fields,
  calls `createRestaurant(data)`, and returns the created restaurant with `201`.
- Learned that POST test data should come from Thunder Client/request body now,
  and later from an admin form using `fetch(..., { method: "POST", body })`.
- Revised GET/POST route handler basics through one-question-at-a-time quiz.
- Built and tested `PATCH /api/restaurants/[id]`:
  - Route reads JSON body with `await request.json()`.
  - Validation uses `&&` so at least one editable field is enough.
  - Helper builds `updateData` so PATCH only changes sent fields.
  - Missing, invalid, or inactive restaurants return `404`.
- Debugged a Thunder Client body issue where JSON was being sent as a string:
  - `typeof data` showed `string`.
  - `data.name` was `undefined`.
  - `Object.keys(data)` showed string indexes.
  - Fix was to send a real JSON object in Body → JSON without wrapping the
    whole object in quotes.
- Built and tested `DELETE /api/restaurants/[id]` as a soft delete:
  - Helper sets `isActive: false`.
  - Follow-up GET returns `404` because normal app queries filter
    `isActive: true`.
- Started a FoodRush system design doc at `foodrush-system-design.md`, but paused
  deeper schema decisions because auth/user flow affects cart and orders.
- Covered environment variables:
  - `DATABASE_URL` stays server-only in `.env`.
  - `NEXT_PUBLIC_` variables are browser-visible and must not contain secrets.
  - Restart dev server after changing `.env`.
- Covered cookies and headers with temporary learning routes:
  - `GET /api/learning/set-cookie` sets `foodrush_demo=darshan`.
  - `GET /api/learning/read-cookie` reads it with `cookies()`.
  - `GET /api/learning/read-headers` reads `user-agent` and raw `cookie`
    headers with `headers()`.
  - Learned `Set-Cookie` is server -> browser and `Cookie` is browser -> server.
- Covered database-session auth mental model:
  - Browser cookie carries `session_id`.
  - Database/server session maps session id to user.
  - Logout deletes/expires the server session and sends a cookie deletion response.
- Built a temporary protected-route demo with `proxy.js`:
  - `/admin/:path*` checks the `foodrush_demo` cookie.
  - Missing cookie redirects to `/login`.
  - Cookie exists allows admin routes.
- Covered Client vs Server Components deep dive:
  - Server Components can use Prisma/server helpers.
  - Client Components handle browser interaction.
  - Client Components call API routes or Server Actions, not Prisma helpers.
- Covered Server Actions basics:
  - Useful for Next.js form mutations.
  - Read form values with `formData.get()`.
  - Can use Prisma/server helpers because actions run on the server.
  - Use `revalidatePath()` after mutations to refresh affected paths.
  - API routes are still needed for Thunder Client, mobile apps, external clients,
    and REST endpoints.
- Completed Streaming & Suspense basics:
  - `loading.js` is route-level loading UI.
  - Suspense is component/section-level fallback UI.
  - Skeletons are usually better than random spinners for stable FoodRush UI.
  - Streaming improves perceived speed by showing ready sections earlier.
- Completed `generateStaticParams` basics:
  - Used for dynamic routes like `/restaurants/[id]`.
  - Returns params objects like `{ id: "1" }`, not full restaurant data.
  - Pre-building helps known stable pages load fast, but admin-created data needs
    revalidation/runtime strategy.
- Phase 1 Next.js Fundamentals is now complete conceptually.

## What's Next
- Return to the FoodRush system design/scope session before adding cart/order/auth models.
- After scope is clear, continue MenuItem API route practice.
- Continue using one-question-at-a-time quiz and "try first, then review" coding practice.
- Reuse Phase 1 Next.js concepts while building real FoodRush features.
