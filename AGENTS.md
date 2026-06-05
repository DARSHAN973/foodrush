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

### Project Structure
```txt
app
├── layout.js
├── globals.css
├── (user)
│   ├── layout.js
│   ├── page.js
│   ├── restaurants/page.js, loading.js, error.js
│   ├── restaurant/[id]/page.js, loading.js, error.js, not-found.js
│   ├── cart/page.js
│   └── login/page.js
├── admin
│   ├── layout.js, page.js
│   ├── orders/page.js
│   └── restaurants/page.js
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

## 🔄 Current Revision Strategy
- Continue Next.js fundamentals using FoodRush files as the reference.
- Work concept-by-concept, not file-by-file.
- For each concept:
  1. Name the concept and file.
  2. Ask me why the pattern exists.
  3. Correct my explanation.
  4. Give a clean comment for me to paste/type.
  5. Check code quality in that same area.
- Skip React Router because FoodRush now uses Next.js routing and future projects will use Next.js.

## ✅ React Revision Covered So Far
- Reusable component + props + `children`
  - Original reference: `components/Button.js`
- Default props
  - Original reference: `components/Button.js`
  - Repeated reference: `components/Loading.js`
- Variant map pattern
  - Original reference: `components/Button.js`
- Controlled input component
  - Original reference: `components/Input.js`
  - Repeated reference: `components/RestaurantsClient.js`
- Reusable display/feedback components
  - `components/EmptyState.js`
  - `components/Loading.js`
  - `components/ErrorMessage.js`
- Conditional rendering
  - `message && (...)` in `components/EmptyState.js`
  - `return null` in `components/ErrorMessage.js`
- List rendering with `.map()` and stable `key`
  - Reference area: `components/RestaurantsClient.js`
- Filtering and sorting list data
  - `.filter()` in `components/RestaurantsClient.js`
  - copy before `.sort()` using `[...filteredRestaurants]`
- Derived data
  - `displayRestaurants` calculated from props + UI state
- `useMemo`
  - `cuisines` recalculates only when `restaurants` changes
  - `displayRestaurants` recalculates when restaurants/search/filter/sort inputs change
- Event handlers
  - `onChange={(e) => setSearchText(e.target.value)}`
  - Important idea: pass a function reference so React calls it later during the event.
- Array lookup with `.find()`
  - Original reference: `context/CartContext.js` → `addToCart`
  - Used to check whether the same restaurant already exists in cart before adding.
- `useState` for changing UI data
  - Original cart/toast reference: `context/CartContext.js`
  - Important idea: React must own changing UI data so updates re-render the UI.
- Immutable state updates
  - Original reference: `context/CartContext.js`
  - Covered `map`, `filter`, spread, and the mental model:
    copy state → change the copy → set the new value.
- Derived values with `.reduce()`
  - Original reference: `context/CartContext.js`
  - `cartCount` sums quantities; `totalCartPrice` sums `price * quantity`.
- `useEffect` for side effects
  - Original localStorage reference: `context/CartContext.js`
  - Covered syncing cart to `localStorage` after cart changes.
- Lazy `useState` initializer
  - Original reference: `context/CartContext.js`
  - Used to read `localStorage` only once when cart state starts.
- `JSON.stringify` / `JSON.parse`
  - Original reference: `context/CartContext.js`
  - Used because `localStorage` stores only strings.
- `useEffect` cleanup
  - Original toast timer reference: `context/CartContext.js`
  - Cleanup clears the previous timeout so old timers do not affect newer toast messages.
- Context Provider mental model
  - Original reference: `context/CartContext.js`
  - One provider owns shared cart state/actions so separate components stay in sync.
- `useContext` consumer
  - Original reference: `components/AddToCartButton.js`
  - Repeated references: `components/RestaurantCard.js`, `components/Navbar.js`,
    `components/Toast.js`, `app/(user)/cart/page.js`
- Shared cart state across separate components
  - `AddToCartButton` / `RestaurantCard` update cart.
  - `Navbar` reads `cartCount`.
  - `Toast` reads `toastMessage`.
  - `cart/page.js` reads cart data and calls cart actions.
- Custom hook
  - Original reference: `hooks/useRestaurants.js`
  - Historical usage: `app/(user)/page.js` before the homepage moved to server fetching.
  - Important idea: extract reusable stateful logic, not reusable UI.
- Custom hook consumer states
  - Historical reference: `app/(user)/page.js` used to read `restaurants`, `loading`, and `error`.
  - This remains useful as a React/CSR reference, but homepage initial data now prefers server fetching.
- Form state object
  - Original reference: `app/(user)/login/page.js`
  - Related login/signup fields live in one `formData` object.
- Dynamic form updates with computed property names
  - Original reference: `app/(user)/login/page.js` → `[name]: value`
  - One change handler updates any input whose `name` matches a `formData` key.
- Form submit control
  - Original reference: `app/(user)/login/page.js` → `e.preventDefault()`
  - Prevents browser reload so React can validate and handle the form in state.
- Validation errors object
  - Original reference: `app/(user)/login/page.js`
  - Collects all field errors first, then updates error state once.
- Mode-specific validation
  - Original reference: `app/(user)/login/page.js`
  - Signup-only fields are validated only when `isSignup` is true.
- Submit gate
  - Original reference: `app/(user)/login/page.js`
  - Continue only when `Object.keys(newError).length === 0`.
- Mode switch cleanup
  - Original reference: `app/(user)/login/page.js` → `switchMode`
  - Validation errors belong to the current form mode and should clear when switching login/signup.
- UI-only checkbox decision
  - Original reference: `app/(user)/login/page.js` → Remember me
  - Real remember-me behavior should be handled by auth/session logic, not by storing passwords.
- Behavior-only component pattern
  - Original reference: `components/ScrollToTop.js`
  - Route-change side effect uses `usePathname`/`useSearchParams`; component returns `null`.
- Active route styling
  - Original reference: `components/Navbar.js`
  - `usePathname()` reads the current URL so the matching nav link can receive active styles.
- React reusable component quality pass
  - Checked `Navbar`, `Footer`, `Toast`, and `ScrollToTop`.
  - Final React comment cleanup completed.

## Full Learning Roadmap

### 🔄 Phase 1 — Next.js Fundamentals (In Progress)
- [x] 1. generateMetadata properly (SEO titles/descriptions)
- [x] 2. SSR vs SSG vs CSR final revision
- [x] 3. fetch caching deeper practice
- [ ] 4. Route handlers / API routes (GET /api/restaurants, GET /api/restaurants/[id], POST /api/orders)
- [ ] 5. Environment variables basics
- [ ] 6. Middleware + protected route basics
- [ ] 7. Cookies & headers in Next.js (`cookies()`, `headers()`)
- [ ] 8. Server Actions (forms without API routes)
- [ ] 9. Client vs Server components (deep dive)
- [ ] 10. Streaming & Suspense
- [ ] 11. generateStaticParams for dynamic restaurant pages

### 🔄 Phase 2 — FoodRush UI Polish & Next.js Upgrade
- [ ] 12. Finish converting restaurant detail special files (loading, error, not-found)
- [x] 13. Improve homepage with server fetching
- [ ] 14. Improve filters/search using `searchParams`
- [ ] 15. Polish Next Image usage
- [ ] 16. Mobile responsive pass

### 🧹 Future FoodRush Refactor Tasks
- Extract shared server restaurant helpers into a reusable module, likely `lib/restaurants.js`.
  - Move repeated `getRestaurants()` logic there so homepage and restaurants page use the same URL, error handling, and `revalidate` option.
  - Consider moving `getRestaurant(id)` there too so restaurant detail page and `generateMetadata` share the same helper.
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

## What's Next
- Continue Next.js fundamentals with Route handlers / API routes:
  `GET /api/restaurants`, `GET /api/restaurants/[id]`, and later `POST /api/orders`.
- Future practical tasks:
  extract shared restaurant fetch helpers and practice URL filters with `searchParams`.
