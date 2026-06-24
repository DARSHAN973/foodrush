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
│   ├── cartActions.js
│   ├── adminRestaurantActions.js
│   └── adminMenuItemActions.js
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
│   └── restaurants/page.js, [id]/menu-items/page.js
├── api
│   └── restaurants/route.js, [id]/route.js
components
├── AddToCartButton.js, Button.js, EmptyState.js
├── AdminRestaurantsClient.js, AdminMenuItemsClient.js
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
├── menuItems.js
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
- [ ] 12b. Audit all pages for loading.js skeletons and proper empty states
      (cart, orders, restaurants, restaurant detail — make sure every page handles
      loading and empty gracefully before final UI polish pass)
- [x] 13. Improve homepage with server fetching
- [ ] 14. Improve filters/search using `searchParams`
- [ ] 15. Polish Next Image usage
- [ ] 16. Mobile responsive pass

### ⏳ Phase 3 — Web & Browser Fundamentals (Don't skip)

- [x] 17. How HTTP works (request, response, status codes)
- [x] 18. REST API design principles
- [x] 19. How browsers store data — localStorage, sessionStorage, cookies
- [x] 20. Cookies vs Sessions vs JWT — how auth actually works in browser
- [x] 21. httpOnly cookies — what they are and why they matter
- [x] 22. CORS — what it is and why it breaks things
- [x] 23. Fetch API deeply vs Axios

### 🔄 Phase 4 — MySQL + Prisma

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
- [x] 29. Transactions in Prisma
  - `prisma.$transaction(async (tx) => {})` — all-or-nothing atomicity.
  - External API calls (Razorpay) must stay OUTSIDE the transaction to avoid DB row locks during network calls.
  - ACID covered: Atomicity, Consistency, Isolation (row-level locking), Durability.
- [x] 30. Database sample data practice
- [x] 31. Replace dummyjson API with real database
  - `getRestaurants()` and `getRestaurant(id)` are Prisma-backed.
  - `GET /api/restaurants` and `GET /api/restaurants/[id]` work in Thunder Client.
  - Helpers use `select`, active/available filters, id validation, and Decimal-to-number conversion.
- [ ] 32. Build backend APIs
- [x] 32a. Return to real route handlers with database-backed CRUD
- [x] 32b. Revisit deeper MySQL topics after Prisma basics:
  - Indexes: B-Tree lookup vs full table scan, when to add `@@index` manually,
    read/write/storage tradeoff, added `@@index([userId])` to `ParentOrder`.
  - Normalization: one source of truth rule, snapshot field exception (OrderItem.price/itemName).
  - Many-to-many already covered via CartItem junction table.
  - Views, stored procedures, triggers — deferred, not needed for FoodRush.

### ⏳ Phase 5 — Authentication + Cart + Orders

- [x] 33. NextAuth.js setup
- [x] 34a. Simple email/password signup + login data flow
  - Signup creates `User` rows with bcrypt password hashes.
  - Login verifies email/password with bcrypt compare.
- [x] 34b. Real auth sessions with NextAuth/email-password flow
- [x] 35. Google OAuth
  - GoogleProvider added to NextAuth config.
  - jwt callback auto-creates or finds User row by email; stores DB integer id.
  - passwordHash made optional (String?) to support OAuth users with no local password.
  - "Continue with Google" button added to login page with real Google SVG icon.
- [x] 36. Protected routes
- [x] 37a. Database-backed cart basics
  - Add menu items to MySQL cart.
  - Increase/decrease/remove cart items.
  - Render cart page from server data.
  - Render navbar count from server data.
  - Add pending UI for cart actions.
- [x] 37b. Replace temporary user id with real logged-in user session
  - session.user.id now comes from the database (Int) for both credentials and Google login.
- [x] 38. Checkout flow
- [x] 39. Order placement
- [x] 40. Order history
  - `lib/orders.js` helper with nested Prisma include + Decimal conversion.
  - `app/(user)/orders/page.js` — Server Component, session-guarded, shows ParentOrder → RestaurantOrder → OrderItem breakdown with StatusBadge.

### ⏳ Phase 6 — Admin Dashboard

- [x] 41. Admin role setup
- [x] 42. Protected admin routes
- [x] 43. Dashboard stats
- [x] 44. Restaurant CRUD
- [x] 45. Menu item CRUD
- [x] 46. Image upload with Cloudinary
  - Installed Node.js `cloudinary` SDK and set credentials in `.env`.
  - Configured `lib/cloudinary.js` with helper methods (`uploadImageToCloudinary` using callback Promise wrapping and stream end piping, `deleteImageFromCloudinary`, and `getOptimizedImageUrl`).
  - Created `uploadImageAction` in `app/actions/uploadActions.js` to securely convert browser `File` objects to buffers.
  - Built reusable `<ImageUpload>` client component with immediate local URL previews and loading state.
  - Replaced restaurant text inputs with `<ImageUpload>` and hidden form inputs, saving to MySQL via existing server actions.
  - Updated `next.config.mjs` to whitelist `res.cloudinary.com` in `remotePatterns`.
- [x] 47. Order management + status updates
  - Added `getAdminOrders` in `lib/admin.js` with nested Prisma includes and Decimal-to-number mapping (including the nested restaurant rating).
  - Developed `updateRestaurantOrderStatusAction` in `app/actions/adminOrderActions.js` with status validation, sibling order checks, cascading parent status logic, and automatic revalidation.
  - Converted `app/admin/orders/page.js` to an async Server Component with `noStore()`.
  - Created card-based interactive `AdminOrdersClient` UI with tab filtering, customer details, and individual dropdown selectors powered by React `useTransition`.
- [ ] 48. Email notifications with Nodemailer

### ⏳ Phase 7 — Payments + Deployment

- [x] 49. Razorpay integration
- [x] 50. Payment success/failure handling
- [ ] 51. Deploy on Vercel
- [ ] 52. Connect production database
- [ ] 53. README + portfolio writeup

## Practice Projects (build between phases for independence)

- Mini routing app: home/list/detail/loading/error/not-found
- Product filter app: searchParams + client filters
- CRUD dashboard: Prisma + forms
- Auth notes app: protected routes
- Mini checkout app: cart + order flow

## Known Issues / Future Fixes

- **Orphaned PAYMENT_PENDING orders**: If a user opens the Razorpay popup and cancels
  without paying, the `ParentOrder`, `RestaurantOrder`, and `OrderItem` rows created
  in `placeOrder` stay stuck at `PAYMENT_PENDING` forever. The fix is to implement
  **Razorpay Webhooks** (`POST /api/webhooks/razorpay`) — Razorpay calls this endpoint
  server-to-server when a payment is cancelled, failed, or expired. We then update the
  order status to `CANCELLED` and the rows are cleaned up. A scheduled cleanup job
  (DELETE orders older than 2 hours with PAYMENT_PENDING) is an alternative but should
  only run at off-peak hours to avoid extra DB load during peak traffic.

## UI Polish — Future Tasks (post admin panel)

- **Navbar icons**: Add `lucide-react` icons for Home, Restaurants, Cart nav links
  for a cleaner, more modern navbar look.
- **Profile avatar with dropdown**: When logged in, replace plain text with a Gmail-style
  avatar circle showing the user's first letter (`session.user.name[0].toUpperCase()`).
  Clicking it opens a dropdown with: My Orders → `/orders`, Saved Addresses (future),
  Logout. When logged out, show a Login button instead.
- **Framer Motion animations**: Add page transitions, cart item animations, and
  micro-interactions. Framer Motion is the React-native choice (not GSAP which is
  DOM-level). Learn this after the admin panel phase is complete.
- **Mobile responsive pass**: Full mobile layout audit — navbar hamburger menu,
  card grids, cart page, orders page.

## What's Next

- ✅ Steps 46 and 47 complete — Admin Orders management and Cloudinary image upload successfully integrated!
- Next: Read and review the Cloudinary stream upload flow again to reinforce learning, and implement image deletion on Cloudinary when a restaurant/menu item is edited or removed (using the existing `deleteImageFromCloudinary` helper).
- Next: Add conceptual explanation comments to the newly created files (`lib/cloudinary.js`, `app/actions/uploadActions.js`, and `components/ImageUpload.js`) following our mentorship commenting strategy.
- Next: Add conceptual comments to the Admin Dashboard and Orders files (`lib/admin.js`, `app/actions/adminOrderActions.js`, and `components/AdminOrdersClient.js`) to complete the documentation for those features.
