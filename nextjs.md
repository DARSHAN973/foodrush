# FoodRush Next.js Notes

## Goal

Keep practical Next.js patterns that FoodRush will reuse.

Memory line:

```txt
Learn a Next.js concept when it unlocks a real FoodRush feature.
```

## Environment Variables

Environment variables store secret/config values outside normal source code.

FoodRush already uses:

```env
DATABASE_URL="mysql://user:password@localhost:3306/foodrush_db"
```

Server code reads it with:

```js
process.env.DATABASE_URL;
```

Why `DATABASE_URL` stays in `.env`:

```txt
It contains database credentials.
Local and production environments need different database URLs.
Secrets should not be hardcoded in normal source files.
```

Server-only variable:

```txt
DATABASE_URL
```

Browser-exposed variable:

```txt
NEXT_PUBLIC_APP_NAME
```

Important rule:

```txt
If the browser can see it, it is not secret.
Never use NEXT_PUBLIC_ for DATABASE_URL, JWT secrets, API secrets, or passwords.
```

After changing `.env`, restart the dev server because Next.js loads env values
when the server process starts.

## Cookies And Headers

Headers are metadata sent with HTTP requests/responses.

Parcel memory:

```txt
Body    = what is inside the parcel
Headers = labels on the parcel
```

Request example:

```txt
POST /api/restaurants
Content-Type: application/json
Cookie: session_id=abc123
User-Agent: Thunder Client
```

Body example:

```json
{
  "name": "Pizza Palace"
}
```

Common request headers:

```txt
Content-Type  -> tells server what body format is being sent
Cookie        -> browser sends stored cookies to the server
User-Agent    -> client/browser/tool identity
Authorization -> token-based auth in some systems
```

Common response headers:

```txt
Set-Cookie    -> server tells browser to store/update/delete a cookie
Content-Type  -> tells client what response format is being returned
Cache-Control -> caching instructions
Location      -> redirect target
```

Cookie flow:

```txt
Set-Cookie = server tells browser to store a cookie
Cookie     = browser sends stored cookie back to server
```

Learning demo:

```txt
GET /api/learning/set-cookie
-> response header: Set-Cookie: foodrush_demo=darshan; Path=/; HttpOnly
-> browser/client stores cookie

GET /api/learning/read-cookie
-> browser/client sends Cookie: foodrush_demo=darshan
-> server reads foodrush_demo with cookies()

GET /api/learning/read-headers
-> server reads raw request headers with headers()
```

`cookies()` reads parsed cookies by name:

```js
import { cookies } from "next/headers";

const cookieStore = await cookies();
const demoCookie = cookieStore.get("foodrush_demo");
```

`headers()` reads raw request headers:

```js
import { headers } from "next/headers";

const headerStore = await headers();
const cookieHeader = headerStore.get("cookie");
const userAgent = headerStore.get("user-agent");
```

Difference:

```txt
headers().get("cookie")       -> raw cookie header string
cookies().get("foodrush_demo") -> one parsed cookie by name
```

HttpOnly:

```txt
HttpOnly cookies can be seen in DevTools and sent to the server,
but browser JavaScript cannot read them with document.cookie.
```

Real auth memory:

```txt
Cookie carries the key.
Database tells what the key opens.
```

Database session pattern:

```txt
Browser cookie:
session_id=abc123

Database Session row:
abc123 -> userId 5 -> expiresAt
```

Never store these in cookies:

```txt
passwords
database credentials
payment/card details
large user/cart/order objects
```

## Proxy / Middleware Protected Routes

FoodRush uses Next.js 16, where newer docs call middleware-style interception
`proxy.js`. Older tutorials often call the same idea `middleware.js`.

Protected route idea:

```txt
Browser requests /admin
-> proxy runs before the page
-> proxy checks cookie/session
-> missing cookie redirects to /login
-> valid cookie allows request
```

Learning demo in `proxy.js`:

```js
import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("foodrush_demo");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

Why `new URL("/login", request.url)`:

```txt
new URL(path, base)
path = where to go
base = current full request URL
```

Example:

```txt
request.url = http://localhost:3000/admin/orders
new URL("/login", request.url) -> http://localhost:3000/login
```

Matcher:

```txt
/admin/:path* protects /admin and every nested admin route.
```

Examples:

```txt
/admin
/admin/orders
/admin/restaurants
/admin/dashboard/settings
```

To protect more routes later:

```js
export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/checkout/:path*"],
};
```

Security memory:

```txt
Hiding an Admin link in the UI is not security.
Users can type /admin directly, so the route itself must be protected.
```

## Server Components And Client Components

In the App Router, components are Server Components by default.

This line makes a file a Client Component:

```js
"use client";
```

It must be the first statement in the file.

Server Components can:

```txt
fetch data directly
import Prisma/server helpers
read env vars
use async/await at component level
render Client Components
keep secrets on the server
```

Server Components cannot:

```txt
useState
useEffect
onClick handlers
browser APIs like window/localStorage
```

Client Components can:

```txt
useState
useEffect
onClick
form typing state
localStorage/window
interactive UI
```

Client Components must not:

```txt
import Prisma directly
import server helpers that use Prisma
read DATABASE_URL or server-only secrets
use cookies() or headers() from next/headers
```

FoodRush pattern:

```txt
Server Component page
-> fetch restaurant/menu data
-> render UI
-> pass plain props to Client Components for interaction
```

Example:

```txt
Restaurant detail page -> Server Component
AddToCartButton        -> Client Component
```

Client data rule:

```txt
Server can call server helpers directly.
Client calls API routes or Server Actions.
```

Safe places for Prisma helpers like `getRestaurants()`:

```txt
Server Component
Route handler
Server Action
```

Unsafe place:

```txt
Client Component
```

Why Decimal conversion matters:

```txt
Prisma Decimal values are objects.
Before data crosses to Client Components or JSON responses,
convert them to plain JavaScript numbers.
```

## Server Actions

Server Actions are server functions that can be called from Next.js forms or
Client Components.

They are useful for internal app mutations:

```txt
validate form data
use Prisma/server helpers
set cookies
redirect
revalidate pages
```

API route style:

```txt
Client form -> fetch("/api/restaurants") -> route handler -> Prisma
```

Server Action style:

```txt
<form action={createRestaurantAction}>
-> createRestaurantAction runs on the server
-> Prisma/server helper
```

Read form fields with `FormData.get()`:

```js
export async function createRestaurantAction(formData) {
  "use server";

  const name = formData.get("name");
  const cuisine = formData.get("cuisine");
  const deliveryTime = formData.get("deliveryTime");
}
```

Server Action create flow:

```txt
1. Read fields with formData.get()
2. Validate required fields
3. Call Prisma/helper to create or update data
4. revalidatePath() affected pages
5. redirect() or return success/error state
```

`revalidatePath()`:

```js
import { revalidatePath } from "next/cache";

revalidatePath("/restaurants");
revalidatePath("/admin/restaurants");
```

Why:

```txt
revalidate time handles freshness by clock.
revalidatePath handles freshness by event.
```

Example:

```txt
Restaurant list may revalidate every 60 seconds.
Admin creates a restaurant now.
revalidatePath("/restaurants") refreshes the path early so new data appears.
```

Server Actions do not replace all API routes.

Use API routes for:

```txt
Thunder Client testing
mobile apps
external clients
REST endpoints
public HTTP APIs
```

Use Server Actions for:

```txt
Next.js app forms
admin form mutations
internal UI -> server mutations
```

Possible FoodRush action locations:

```txt
app/admin/restaurants/actions.js -> route-specific admin actions
lib/actions/restaurants.js       -> shared restaurant actions
```

Do not put Server Actions in:

```txt
components/Button.js
app/api/restaurants/route.js
```

Memory:

```txt
API Route     = external HTTP endpoint
Server Action = server function connected to Next.js UI/form
```

## Streaming And Suspense

Suspense shows fallback UI for a slow section while the rest of the page can
render.

FoodRush example:

```txt
Restaurant info loads first.
Menu/reviews section shows a skeleton until its data is ready.
```

`loading.js` vs Suspense:

```txt
loading.js -> route/page segment loading UI
Suspense   -> component/section loading UI inside a page
```

Example shape:

```jsx
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <RestaurantInfo />

      <Suspense fallback={<MenuSkeleton />}>
        <MenuSection />
      </Suspense>
    </>
  );
}
```

Good Suspense usage:

```txt
Use it for naturally separate sections.
Use skeletons/placeholders shaped like the final UI.
Keep layout stable while data loads.
```

Bad Suspense usage:

```txt
Too many tiny spinners everywhere.
Fallbacks that cause layout jumps.
Important content hidden behind random loaders.
```

Streaming means the server can send ready HTML in chunks instead of waiting for
every slow section.

Without streaming:

```txt
Server waits for all data.
Then sends the full page.
```

With streaming:

```txt
Server sends ready sections first.
Slow Suspense sections stream later when ready.
```

Important:

```txt
Streaming improves perceived speed.
It does not make slow database queries faster.
```

FoodRush future usage:

```txt
Restaurant detail:
- restaurant hero/info first
- menu or reviews section with skeleton fallback

Admin dashboard:
- admin shell/sidebar first
- stats and recent orders stream in as separate sections
```

## generateStaticParams

`generateStaticParams` is used for dynamic routes.

FoodRush route:

```txt
/restaurants/[id]
```

Example:

```js
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}
```

Meaning:

```txt
Pre-build /restaurants/1, /restaurants/2, and /restaurants/3 at build time.
```

Important:

```txt
It returns params objects, not full restaurant data.
Param values should be strings because URL params are strings.
```

FoodRush helper shape:

```js
export async function generateStaticParams() {
  const restaurants = await getRestaurants();

  return restaurants.map((restaurant) => ({
    id: String(restaurant.id),
  }));
}
```

Tradeoff:

```txt
Benefit:
Known restaurant detail pages can load faster because they are pre-built.

Cost:
Build time can increase if there are many restaurants.
Admin-created or frequently updated restaurants may become stale without a
runtime rendering/revalidation strategy.
```

Memory:

```txt
generateStaticParams is best for known, stable dynamic pages.
Frequently changing admin data needs careful revalidation or runtime rendering.
```

FoodRush decision:

```txt
Practice generateStaticParams for learning.
Do not blindly pre-build every restaurant forever if admin data changes often.
```

## Phase 1 Status

FoodRush Phase 1 Next.js fundamentals are conceptually covered:

```txt
generateMetadata
SSR vs SSG vs CSR
fetch caching
route handlers
environment variables
proxy/middleware protected routes
cookies and headers
Server Actions
Client vs Server Components
Streaming and Suspense
generateStaticParams
```

Next step:

```txt
Use these concepts while building real FoodRush features:
system design -> schema -> APIs -> admin panel -> auth/cart/orders
```
