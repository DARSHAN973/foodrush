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
- Build my muscle memory — I should be able to write code myself eventually
- No unnecessary theory — keep it practical and real
- For revision/comment sessions: ask me the WHY first, then give me the clean
  comment to paste/type myself. Do not directly edit comments into files unless
  I explicitly ask.
- dont change any code without my permission.
## FoodRush As My Reference Project — IMPORTANT
- FoodRush is not just a learning project — it is my personal reference bible
- Every concept I learn gets commented properly in the actual file where it first appears
- Future projects I will read FoodRush code instead of docs or AI for patterns
- So code quality must always be clean, production-grade, and well structured
- Always help me write code I can be proud of and reuse

## Commenting Strategy — ALWAYS FOLLOW THIS
- Comment the WHY and the concept name, not the obvious what
- First time a concept appears → full explanation comment
- Same concept in another file → one line + reference like:
  // See app/(user)/restaurants/page.js → generateStaticParams
- Never comment obvious things like "this is a useState" or "this adds 1"
- Comment complex logic always
- Comment after each session — not at the end of the whole project
- Tailwind/styling → NO comments needed, AI handles that anyway
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
- Stack: Next.js App Router, Tailwind CSS, React
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
public
└── videos/hero-video.mp4
```

## ✅ Already Covered
- React basics
- Tailwind basics
- Built FoodRush in React
- Migrated FoodRush to Next.js App Router
- Client vs Server components (basics)
- `useRouter`, `usePathname`, `useSearchParams` hooks
- `generateMetadata` basics and dynamic metadata
- SSR vs SSG vs CSR final revision
- Next.js fetch caching basics and deeper practice (`revalidate`, `no-store`, shared server cache)
- Route handler GET basics: `GET /api/restaurants`, `GET /api/restaurants/[id]`,
  `Response.json()`, dynamic `params`, and `200`/`404`/`500` responses

## Full Learning Roadmap

### 🔄 Phase 1 — Next.js Fundamentals (In Progress)
- [x] 1. generateMetadata properly (SEO titles/descriptions)
- [x] 2. SSR vs SSG vs CSR final revision
- [x] 3. fetch caching deeper practice
- [x] 4. Route handlers / API routes GET basics (`GET /api/restaurants`, `GET /api/restaurants/[id]`)
- [ ] 5. Environment variables basics
- [ ] 6. Middleware + protected route basics
- [ ] 7. Cookies & headers in Next.js (`cookies()`, `headers()`)
- [ ] 8. Server Actions (forms without API routes)
- [ ] 9. Client vs Server components (deep dive)
- [ ] 10. Streaming & Suspense
- [ ] 11. generateStaticParams for dynamic restaurant pages

### 🔄 Temporary Learning Order Update
- Start Phase 4 now before finishing all remaining Phase 1 backend topics.
- Reason: MySQL + Prisma will make route handlers, orders, admin CRUD, and auth
  more real instead of practicing fake POST routes without persistence.
- Learn environment variables naturally during Prisma setup because Prisma needs
  `DATABASE_URL`.
- Current database learning order:
  1. Finish Prisma setup files/packages in the FoodRush project.
  2. Revise MySQL basics using FoodRush examples: database, table, row, column,
     primary key, foreign key, and one-to-many relations.
  3. Write Prisma schema only after the MySQL meaning is clear.
  4. Run the first migration and inspect the created MySQL tables.
- Park serious `POST /api/orders`, CRUD APIs, middleware, cookies, and auth until
  after the database foundation is in place.

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

### ⏳ Phase 3 — Web & Browser Fundamentals (Don't skip)
- [ ] 17. How HTTP works (request, response, status codes)
- [ ] 18. REST API design principles
- [ ] 19. How browsers store data — localStorage, sessionStorage, cookies
- [ ] 20. Cookies vs Sessions vs JWT — how auth actually works in browser
- [ ] 21. httpOnly cookies — what they are and why they matter
- [ ] 22. CORS — what it is and why it breaks things
- [ ] 23. Fetch API deeply vs Axios

### ⏳ Phase 4 — MySQL + Prisma
- [ ] 24. MySQL basics
- [ ] 25. Prisma setup + connect to MySQL
- [ ] 26. Schema design (User, Restaurant, MenuItem, Order, OrderItem, Cart)
- [ ] 27. Prisma CRUD operations
- [ ] 28. Relations & joins properly
- [ ] 29. Transactions in Prisma
- [ ] 30. Seed database with dummy data
- [ ] 31. Replace dummyjson API with real database
- [ ] 32. Build backend APIs
- [ ] 32a. Return to real route handlers with database-backed CRUD

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

## Last Session Covered
- Finished React revision cleanup:
  `switchMode`, Remember me decision, behavior-only `ScrollToTop`, active route
  styling with `usePathname`, Toast `return null`, and reusable component quality pass.
- Finalized comments for already-learned Next.js concepts:
  root/nested layouts, route groups, `page.js`, server/client split, route-level
  loading/error/not-found, `notFound()`, Next Image remote config, dynamic params,
  `generateMetadata`, `generateStaticParams`, and fetch cache comments.
- Covered `generateMetadata` properly:
  dynamic metadata uses `params`, page UI and metadata have different jobs, and
  identical server fetches can be memoized by Next.js.
- Completed SSR vs SSG vs CSR final revision:
  server render, static generation, client render after hydration, route-level
  loading/error vs client loading/error, and why initial page data should be
  fetched on the server when possible.
- Completed fetch caching deeper practice:
  `revalidate: 60`, stale vs realtime data, `cache: "no-store"` for future
  admin/user/payment data, and same URL + same options server fetch cache reuse.
- Started FoodRush Next.js upgrade:
  converted `app/(user)/page.js` homepage to server fetching for initial trending
  restaurant data and removed the old CSR loading/error pattern from that page.
- Completed shared restaurant helper refactor:
  moved reusable restaurant fetching into `lib/restaurants.js`, updated homepage,
  restaurants page, restaurant detail page, and `generateMetadata` to use helpers.
- Completed route handler GET basics:
  built `GET /api/restaurants` and `GET /api/restaurants/[id]`, practiced
  `Response.json()`, dynamic route params, Thunder Client testing, `404` for
  missing detail data, and `500` for unexpected fetch/server failures.
- Updated client-side `useRestaurants()` reference hook to fetch from
  `/api/restaurants` instead of calling DummyJSON directly.

## What's Next
- Start MySQL + Prisma foundation now:
  finish Prisma setup, revise MySQL basics, create `DATABASE_URL`, design the
  first real FoodRush ordering schema, run the first migration, and open Prisma Studio.
- Return to `POST /api/orders` and real CRUD route handlers after Prisma/database
  basics are understood.
- Future practical tasks:
  practice URL filters with `searchParams`.
