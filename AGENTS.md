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
  adds menu items to cart → checks out cart → pays → receives restaurant-wise orders.
- Future database/schema should model real ordering concepts:
  `User`, `Restaurant`, `MenuItem`, `Cart`, `CartItem`, `ParentOrder`,
  `RestaurantOrder`, `OrderItem`, and `Payment`.
- FoodRush V1 should support multi-restaurant checkout:
  one cart can contain menu items from multiple restaurants, one payment covers
  the full checkout, and the app splits that checkout into restaurant-wise
  orders with separate statuses.
- Do not design Prisma schema around DummyJSON recipe-only fields like
  `ingredients` and `instructions`; those can disappear when real FoodRush data
  replaces the placeholder API.

### Project Structure
```txt
app
├── layout.js
├── globals.css
├── actions
│   ├── authActions.js
│   └── cartActions.js
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
├── CartItemControls.js, ErrorMessage.js, Footer.js
├── Input.js, Loading.js, MenuAddButton.js
├── MenuClient.js, Navbar.js, NavbarClient.js
├── RestaurantCard.js, ScrollToTop.js, Toast.js
context
└── CartContext.js
hooks
└── useRestaurants.js
lib
├── cart.js
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
- Current Prisma models: `User`, `Restaurant`, `MenuItem`, `Cart`, `CartItem`,
  `ParentOrder`, `RestaurantOrder`, `OrderItem`, and `Payment`.
- Current schema has:
  - `Restaurant` → `MenuItem[]`
  - `MenuItem.restaurantId` → `Restaurant.id`
  - native decimal types: `rating @db.Decimal(2, 1)`, `price @db.Decimal(10, 2)`
  - `imageUrl String?`
  - `isActive` and `isAvailable`
  - `createdAt` and `updatedAt`
  - `User.role` uses `UserRole` enum: `USER`, `ADMIN`
  - `Cart.userId @unique` so one user has one active cart
  - `CartItem` connects to `MenuItem`, not directly to `Restaurant`
  - `CartItem` uses `@@unique([cartId, menuItemId])` to prevent duplicate
    same-item rows in one cart
  - `ParentOrder` stores full checkout totals, delivery address, and phone
  - `RestaurantOrder` stores each restaurant's split order and status
  - `OrderItem` stores `itemName` and `price` snapshots for old order history
  - `Payment` belongs to `ParentOrder` and stores provider/payment status fields
- Latest schema migration for the V1 auth/cart/order/payment models has been
  applied successfully.
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
- `app/actions/authActions.js` handles simple email/password signup and login:
  - Uses Server Actions with `"use server"`.
  - Reads submitted form values with `FormData`.
  - Normalizes email to lowercase.
  - Hashes passwords with bcrypt before storing.
  - Uses generic login errors so the UI does not reveal whether an email exists.
- Cart is now database-backed for the temporary user id `1` until real sessions are added:
  - `app/actions/cartActions.js` has `addToCart(menuItemId)`,
    `increaseCartItem(cartItemId)`, `decreaseCartItem(cartItemId)`, and
    `removeCartItem(cartItemId)`.
  - `addToCart()` stores `MenuItem` selections in `CartItem`, not restaurants.
  - It uses the `@@unique([cartId, menuItemId])` compound key to update quantity
    instead of creating duplicate same-item cart rows.
  - Cart mutations call `revalidatePath("/cart")` so the server-rendered cart
    page refreshes after database changes.
- `lib/cart.js` is the reusable cart query helper:
  - `getCart()` reads the current user's cart with `items -> menuItem -> restaurant`.
  - It returns an empty cart shape when no cart exists.
  - It converts Prisma Decimal prices to numbers before calculating totals.
  - `getCartCount()` reads only quantities for the navbar badge.
- `/cart` now renders from server data instead of localStorage context:
  - The cart page is a Server Component using `getCart()`.
  - `CartItemControls.js` is a small Client Component for quantity/remove clicks.
  - Cart action buttons show pending UI while Server Actions are running.
- Navbar cart count now comes from the database:
  - `Navbar.js` is a Server Component that calls `getCartCount()`.
  - `NavbarClient.js` keeps `usePathname()` active-link styling on the client.
- Menu add buttons now call the cart Server Action:
  - `MenuAddButton.js` owns the Add button pending state.
  - `MenuClient.js` renders menu item data and passes `item.id` as `menuItemId`.
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
- Server Action button calls from Client Components, including pending UI for add-to-cart and cart quantity actions.
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
  timestamps, active flags, image URL strategy, `deleteMany`,
  `findMany`, `findUnique`, `create`, `update`, `delete`, `createMany`,
  `updateMany`, `where`, `orderBy`, `include`, `select`, `findFirst`,
  `connect`, `connectOrCreate`, stale client fix with `npx prisma generate`,
  nested create basics, soft delete basics, reusable Prisma Client helper,
  PATCH-style partial update objects, route handler request body debugging,
  compound unique lookup names like `cartId_menuItemId`, cart quantity updates,
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
  - Menu items now render from `restaurant.menuItems`.
  - Restaurant detail page now treats restaurants as storefronts and menu
    items as the orderable products.
  - `MenuClient.js` owns the menu item card UI and client-side Add button
    behavior so the restaurant detail page can stay a Server Component.
  - Restaurant cards should point users toward viewing the menu, not ordering
    the whole restaurant.

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
- [x] 26. Schema design (User, Restaurant, MenuItem, Cart, CartItem, ParentOrder, RestaurantOrder, OrderItem, Payment)
  - Current schema has the V1 multi-restaurant checkout models.
  - V1 design decision: support multi-restaurant checkout by grouping one
    checkout/payment under `ParentOrder`, then splitting it into
    restaurant-wise `RestaurantOrder` records.
  - Schema migration for these models has been applied.
- [x] 27. Prisma CRUD operations
  - Covered: `findMany`, `findUnique`, `findFirst`, `create`, `update`,
    `updateMany`, `delete`, `deleteMany`, `createMany`, `where`, `orderBy`,
    `include`, `select`, and Decimal conversion before UI/API responses.
- [x] 28. Relations & joins properly
  - MySQL joins covered.
  - Prisma relation queries covered with nested create, `include`, `select`,
    `connect`, and `connectOrCreate` basics.
- [ ] 29. Transactions in Prisma
- [x] 30. Database sample data practice
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
- [x] 34a. Simple email/password signup + login data flow
  - Signup creates `User` rows with bcrypt password hashes.
  - Login verifies email/password with bcrypt compare.
  - Real auth sessions are still pending.
- [ ] 34b. Real auth sessions with NextAuth/email-password flow
- [ ] 35. Google OAuth
- [ ] 36. Protected routes
- [x] 37a. Database-backed cart basics
  - Add menu items to MySQL cart.
  - Increase/decrease/remove cart items.
  - Render cart page from server data.
  - Render navbar count from server data.
  - Add pending UI for cart actions.
- [ ] 37b. Replace temporary user id with real logged-in user session
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
1. FoodRush System Design V1 is drafted in foodrush-system-design.md.
2. Important V1 design decision:
   support multi-restaurant cart/checkout.
   Use ParentOrder for the full checkout/payment.
   Use RestaurantOrder for each restaurant's split order/status.
3. Prisma schema for User, Cart, CartItem, ParentOrder, RestaurantOrder,
   OrderItem, and Payment has been written and migrated.
4. Restaurant browsing flow is now closer to real FoodRush:
   restaurants -> restaurant detail -> menu items -> Add button.
5. Simple login/signup database flow is done, but real auth sessions are not.
   Current auth still does not create a browser session or protect routes.
6. Database-backed cart basics are done using temporary user id 1:
   add item, update quantity, remove item, server-render cart page, navbar count,
   and pending UI for cart actions.
7. Next step: start Admin CRUD operations.
   Begin with admin restaurant CRUD UI backed by existing `lib/restaurants.js`
   helpers, then move to menu item CRUD.
8. After admin CRUD, continue:
   real auth/protected admin routes, checkout/order flow, and replacing the
   temporary cart user id with the logged-in user.
9. Keep FoodRush product flow in mind:
   restaurants -> menu items -> cart -> checkout/payment -> restaurant-wise orders.
```

Planning note:

```txt
Phase 1 Next.js fundamentals are complete.
Ignore Phase 2 UI polish for now unless a UI issue blocks backend/product flow.
Do not jump into broad web/browser fundamentals yet; learn them when they unlock
real FoodRush needs like auth, payments, deployment, CORS, or production APIs.
```

## Last Session Covered
- Added explanation comments to `app/actions/authActions.js` and
  `app/(user)/login/page.js` for Server Actions, `FormData`, email normalization,
  bcrypt hashing/compare, generic auth errors, `useActionState`, redirect query
  params, controlled inputs, and Suspense with `useSearchParams`.
- Built database-backed cart write flow:
  `addToCart(menuItemId)` creates/finds the user's cart and creates or updates
  `CartItem` rows.
- Clarified why cart stores `menuItemId`, not restaurant data:
  `CartItem -> MenuItem -> Restaurant` gives restaurant context when needed.
- Learned Prisma compound unique lookup generated from
  `@@unique([cartId, menuItemId])` as `cartId_menuItemId`.
- Fixed add-to-cart bugs:
  `findUnique` camelCase typo and duplicate `CartItem` unique constraint error
  by updating quantity and returning instead of always creating.
- Added `lib/cart.js` with `getCart()` and `getCartCount()`.
- Converted `/cart` page to server-render from database data using `getCart()`.
- Added `CartItemControls.js` as the Client Component for increase/decrease/remove
  buttons that call cart Server Actions.
- Split navbar into server/client pieces:
  `Navbar.js` reads DB cart count, `NavbarClient.js` keeps active link styling.
- Added pending/loading states for Add button and cart item controls.
- Important UI correction:
  track which cart action is pending so clicking one button does not show loading
  text on every button in that cart row.
- Built admin restaurant management UI:
  - `app/admin/restaurants/page.js` — Server Component that fetches all restaurants
    (including inactive) via `getAdminRestaurants()` and passes data to a Client Component.
  - `components/AdminRestaurantsClient.js` — Client Component with edit modal and
    status toggle buttons. Uses `useState` for modal state and `useRouter().refresh()`
    for list revalidation after mutations.
  - `app/actions/adminRestaurantActions.js` — Server Actions for `updateRestaurantAction`,
    `deactivateRestaurantAction`, and `activeRestaurantAction`. All use `revalidatePath`
    to refresh the admin list page after database changes.
  - `lib/restaurants.js` additions:
    - `getAdminRestaurants()` — reads all restaurants (active and inactive) with admin
      fields including `isActive`, ordered by `createdAt` desc.
    - `activeRestaurant(id)` — reactivates a deactivated restaurant by setting
      `isActive: true`.
  - Edit modal pattern: modal state stores the full restaurant object, form uses
    `defaultValue` for pre-filled inputs, hidden `id` input travels with FormData,
    and `handleUpdateRestaurant` closes modal + calls `router.refresh()` on success.
  - Status toggle pattern: single `handleToggleRestaurantStatus` handler checks
    `restaurant.isActive` to decide between activate/deactivate actions, with
    row-level pending state so only the clicked button shows loading text.

## What's Next
- Continue Admin CRUD operations:
  - Add Restaurant form/page (the "Add Restaurant" link already points to
    `/admin/restaurants/new` but the page doesn't exist yet).
  - Menu item CRUD for each restaurant (the "Menu Items" link already points to
    `/admin/restaurants/[id]/menu-items` but the page doesn't exist yet).
- Keep using Server Actions and shared server helpers first; API routes are still
  useful for external clients/Thunder Client practice, but admin dashboard forms
  can use Server Actions.
- Keep temporary cart `userId = 1` until real auth sessions are added.
- Continue using one-question-at-a-time quiz and "try first, then review" coding practice.
- Reuse Phase 1 Next.js concepts while building real FoodRush features.
