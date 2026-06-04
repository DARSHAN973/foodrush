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
- SSR vs SSG vs CSR (intro)
- Next.js fetch caching basics (default, no-store, revalidate)

## 🔄 Current Revision Strategy
- Pause deeper Next.js topics for now.
- Finish React fundamentals first using FoodRush files as the reference.
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
  - Repeated usage: `app/(user)/page.js`
  - Important idea: extract reusable stateful logic, not reusable UI.
- Custom hook consumer states
  - `app/(user)/page.js` now reads `restaurants`, `loading`, and `error`.
  - This avoids silently showing an empty trending section when fetch fails.
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

## ⏭️ Next React Revision Topics
- Finish `app/(user)/login/page.js`
  - `switchMode` logic: why switching login/signup clears errors, and whether it should reset form values.
  - `Remember me` checkbox: decide whether to keep it UI-only or make it controlled state.
- Cover behavior-only component pattern
  - Reference: `components/ScrollToTop.js`
  - Concepts: route-change side effect, `usePathname`, `useSearchParams`, and `return null`.
- Reusable component quality pass
  - Files: `Navbar`, `Footer`, `Toast`, `ScrollToTop`.
  - Keep comments minimal; add only concept/reference comments where useful.
- Final React cleanup pass
  - Check comments are concept/WHY comments, not obvious/junk comments.
  - Prefer one full original-reference comment and short repeated-reference comments.

## Full Learning Roadmap

### 🔄 Phase 1 — Next.js Fundamentals (In Progress)
- [ ] 1. generateMetadata properly (SEO titles/descriptions)
- [ ] 2. SSR vs SSG vs CSR final revision
- [ ] 3. fetch caching deeper practice
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
- [ ] 13. Improve homepage with server fetching
- [ ] 14. Improve filters/search using searchParams or client state
- [ ] 15. Polish Next Image usage
- [ ] 16. Mobile responsive pass

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
- Continued React-first revision using FoodRush files as the reference.
- Covered cart state and actions in `context/CartContext.js`:
  `.find()`, `useState`, immutable updates, `.reduce()`, `useEffect`,
  lazy initializer, `localStorage`, serialization, and timeout cleanup.
- Covered Context:
  `CartContext.Provider`, `useContext`, shared cart state, and cart consumers in
  `AddToCartButton`, `RestaurantCard`, `Navbar`, `Toast`, and `cart/page.js`.
- Covered custom hook:
  `hooks/useRestaurants.js` as reusable fetch-state logic, and homepage usage with
  `restaurants`, `loading`, and `error`.
- Covered form fundamentals in `app/(user)/login/page.js`:
  `formData` object, dynamic `[name]: value`, `preventDefault`, validation
  errors object, signup-only validation, and submit gate.
- Corrected the revision workflow:
  work concept-by-concept, ask Darshan the WHY first, then polish explanation and
  provide clean comments. Avoid drifting line-by-line through a file.

## What's Next
- Finish remaining React cleanup:
  `switchMode`, `Remember me` checkbox decision, `ScrollToTop`, reusable component
  quality pass, and final comment cleanup.
- Then resume Next.js fundamentals:
  start with `generateMetadata`, then SSR vs SSG vs CSR final revision, fetch
  caching deeper practice, and route handlers/API routes.
