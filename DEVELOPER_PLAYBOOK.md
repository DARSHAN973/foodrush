# 🚀 The Master Web Developer Playbook (Next.js, Prisma, & Tailwind)

This is your master reference guide and pre-flight checklist for building, optimizing, and launching production-grade web applications. Use this playbook side-by-side with every new project to ensure high performance, clean architecture, flawless SEO, and premium user experience.

---

## 📋 Section 1: The Pre-Flight Checklist
Before you commit code, push to Vercel, or declare a page "done," run down this checklist:

- [ ] **SEO & Metadata:** Does the page have a custom title and meta description? (No generic browser tabs).
- [ ] **Title Duplication:** Did you check that the page title doesn't duplicate the template name (e.g. `My Page | My Brand | My Brand`)?
- [ ] **Loading States:** Is there a `loading.js` next to the `page.js` to prevent white flashes during data fetching?
- [ ] **Layout Shifts (CLS):** Do your loading skeletons match the exact dimensions (height, width, grid layout) of the real page content?
- [ ] **Empty States:** Does every list page show a meaningful UI when the data array is empty?
- [ ] **Not-Found Pages:** Does every `[dynamic]` route have a `not-found.js`?
- [ ] **Param Validation:** Are URL params validated and cast to the correct type before querying the database?
- [ ] **Decimal Fields:** Are all Prisma `Decimal` returns explicitly cast to `Number()` before passing them across the network boundary to Client Components?
- [ ] **Hero Media:** If there is a hero image, does it have `priority`? If there is a background video, does it have `preload="auto"` and `muted`?
- [ ] **Remote Images:** Are all external image domains added to `next.config.mjs`?
- [ ] **Env Variables:** Are all required environment variables documented in `.env.example`?
- [ ] **Prisma Singleton:** Is the Prisma client using the `globalThis` caching pattern?
- [ ] **Database Performance:** Are all database queries inside loop maps avoided? (No N+1 queries). Are frequently searched columns indexed?
- [ ] **Error Boundaries:** Is there an `error.js` in the route folder to gracefully catch database or network crashes?
- [ ] **Interactive Elements:** Do input search fields have a **debounce delay** with `router.replace` to prevent spamming browser history and DB queries on every keypress?
- [ ] **Security:** Are server actions validating the user's session using `getServerSession`? Are sensitive routes protected on the server level?

---

## ⚙️ Section 2: Project Setup & Configuration

### 1. Prisma Client Singleton (`lib/prisma.js`)
Next.js hot-reloads modules in development on every file save. If you initialize the Prisma client normally, every save creates a new database connection pool, quickly exhausting your database limits. This pattern caches the client on the global object during development.

```javascript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 2. Environment Variables & `.env` Setup
Keep secrets safe and decouple configuration from code.

*   **Prefix Rule:** Variables referenced in Client Components *must* start with `NEXT_PUBLIC_`. If they don't, Next.js strips them from the bundle to prevent leaking secrets.
*   **`.env.example` Pattern:** Always commit a `.env.example` file listing the variable names (with empty or placeholder values) so developers onboarding know what to set up.

```txt
# .env.example
DATABASE_URL="mysql://username:password@localhost:3306/db_name"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Public client variables
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
```

### 3. Remote Image Allowlist (`next.config.mjs`)
Next.js optimizes remote images, but requires you to allowlist hostnames to prevent external domain spam attacks.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## 🗄️ Section 3: Data Layer & Database Best Practices

### 1. Indexing for Search and Filters
Any database column that is frequently searched, filtered, or sorted **must** have an index.

```prisma
model ParentOrder {
  id              Int               @id @default(autoincrement())
  userId          Int
  total           Decimal           @db.Decimal(10, 2)
  user            User              @relation(fields: [userId], references: [id])
  createdAt       DateTime          @default(now())

  // Creates a B-Tree index on userId column. 
  // Makes "WHERE userId = X" queries take 0.1ms instead of scanning the whole database.
  @@index([userId])
}
```

### 2. Preventing the N+1 Query Problem (Joins)
Never query inside a `.map()` loop. Use Prisma `include` to execute joins at the database engine level in one query.

```javascript
// lib/orders.js
export async function getUserOrders(userId) {
  return await prisma.parentOrder.findMany({
    where: { userId },
    include: {
      restaurantOrders: {
        include: {
          items: true, // Joins nested order item levels in 1 single database call
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
```

### 3. Prisma Decimal Serialization
Prisma returns SQL Decimal columns as objects (`Decimal.js` instances), which **cannot be sent over the network** from Server Components to Client Components. You must cast them to a JavaScript `Number`.

```javascript
export async function getRestaurant(id) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return null;

  // Convert decimal to number before passing across the network boundary
  return {
    ...restaurant,
    rating: Number(restaurant.rating),
  };
}
```

### 4. Route Param Validation & Casting
URL parameters are always parsed as strings. Before sending them to database queries, validate and cast them. This prevents server crashes and potential injections.

```javascript
// app/(user)/restaurants/[id]/page.js
export default async function RestaurantDetails({ params }) {
  const { id } = await params;
  
  // Safely parse string parameter to integer
  const restaurantId = Number(id);
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    notFound(); // Trigger 404 page instantly
  }

  const restaurant = await getRestaurant(restaurantId);
  // ...
}
```

### 5. Atomic Database Transactions
When running multiple queries where all must succeed together (e.g. placing an order and clearing a cart), wrap them in a transaction.

```javascript
export async function placeOrder(userId, items) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create order (uses transaction context 'tx')
      const order = await tx.parentOrder.create({ data: { userId, ... } });

      // 2. Clear cart
      await tx.cartItem.deleteMany({ where: { cart: { userId } } });

      return order;
    });
  } catch (error) {
    console.error("Order transaction failed, changes rolled back:", error);
    throw new Error("Could not place order.");
  }
}
```

---

## ⚡ Section 4: Server Patterns & Mutations

### 1. Server Actions & Cache Revalidation (`revalidatePath`)
Server Actions run mutations on the server. Because Next.js aggressively caches pages, you must call `revalidatePath` to refresh the cached HTML of target routes so updates show instantly in the UI.

```javascript
// app/actions/cartActions.js
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addToCart(menuItemId) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Please log in to add items." };

  await prisma.cartItem.create({
    data: { menuItemId, quantity: 1 }
  });

  // Revalidate the cart page so changes reflect immediately in the header/cart views
  revalidatePath("/cart");
  revalidatePath("/restaurants");
  return { success: true };
}
```

### 2. Static Site Generation (`generateStaticParams`)
Pre-build dynamic routes at compile-time instead of rendering them on-demand. This reduces server response time to 0ms.

```javascript
// app/(user)/restaurants/[id]/page.js
export async function generateStaticParams() {
  const topRestaurants = await prisma.restaurant.findMany({
    take: 10, // Pre-build top 10 pages, let the rest render on-demand
    select: { id: true },
  });

  return topRestaurants.map((restaurant) => ({
    id: String(restaurant.id), // Parameters must be strings
  }));
}
```

---

## ⏱️ Section 5: Client Patterns

### 1. React Context + Provider (State Management)
Use Context to share global state (like a shopping cart counter) across multiple components without prop-drilling.

```javascript
// context/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // SSR Safe: Initial loading from localStorage should run in useEffect
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  const addItem = (item) => {
    setItems((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
```

### 2. Client-Side Input Debouncing
Prevent spamming server requests by waiting for the user to pause typing before triggering a search reload. Use `router.replace` instead of `router.push` to prevent polluting the browser's back button history.

```javascript
// components/SearchInput.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [text, setText] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (text) {
        params.set("search", text);
      } else {
        params.delete("search");
      }
      
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [text, searchParams, pathname, router]);

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search..."
      className="rounded-xl border border-gray-200 p-2 text-sm focus:outline-orange-500"
    />
  );
}
```

---

## 🎨 Section 6: UI Patterns & Templates

### 1. Error Boundary Component (`error.js`)
Next.js wraps route segments in a React Error Boundary. If any Server or Client component in the segment throws an error, Next.js displays the closest nested `error.js` instead of crashing the app.

```javascript
// app/your-route/error.js
"use client"; // Error boundaries MUST be Client Components

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Route crash captured:", error);
  }, [error]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-8 text-center">
      <div className="bg-red-50 text-red-600 rounded-full h-12 w-12 flex items-center justify-center text-lg font-bold">
        ⚠️
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-900">Something went wrong!</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
      >
        Try Again
      </button>
    </main>
  );
}
```

### 2. Not Found Page (`not-found.js`)
Display a customized 404 message when database items do not exist.

```javascript
// app/your-route/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-8 text-center">
      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Resource Not Found</h2>
      <p className="mt-2 text-sm text-gray-500">We couldn't find the page or record you were looking for.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 active:scale-95 transition-all"
      >
        Go Home
      </Link>
    </main>
  );
}
```

### 3. Reusable Empty State (`components/EmptyState.js`)
When an array (like search results or cart items) returns empty, display a clean call-to-action instead of a blank screen.

```javascript
// components/EmptyState.js
export default function EmptyState({ title, message, icon = "🔍" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center sm:p-12">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  );
}
```

---

## ⚡ Section 7: Media & Cloudinary Integration

### 1. Responsive Image Sizes
Always set the `sizes` attribute on `<Image />` tags using layouts. This instructs the browser to download a smaller, resized version on mobile and a larger version on desktop.

```jsx
import Image from "next/image";

export default function Card({ item }) {
  return (
    <div className="relative aspect-video w-full">
      <Image
        src={item.imageUrl}
        alt={item.name}
        fill
        // Mobile screen gets 50% width, tablet gets 33%, desktop gets 25%
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover rounded-xl"
      />
    </div>
  );
}
```

### 2. Cloudinary File Upload Stream
Standard REST APIs cannot parse files directly inside JSON payloads. This helper converts a buffer to an upload stream to pipe files safely to Cloudinary.

```javascript
// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "your_uploads" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}
```

---

## 🛡️ Section 8: Security & Authentication

### 1. Route Protection Middleware (`middleware.js`)
Instead of manually writing authentication checks on every page/API route, NextAuth allows you to protect entire sub-folders using Next.js Middleware. Create this file at the root of your project (same level as `/app`).

```javascript
// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Return true if user is logged in
      return !!token;
    },
  },
});

// Configure which route patterns this middleware runs on
export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/vendor/:path*",
  ],
};
```

### 2. Server Action Role Verification Pattern
Always verify the active user session and authorization level on the server level when executing writes/mutations.

```javascript
// app/actions/adminActions.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteRecord(recordId) {
  // 1. Verify session on server
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthenticated. Please log in." };
  }

  // 2. Verify authorization level (Role Check)
  if (session.user.role !== "ADMIN") {
    return { error: "Unauthorized. Admin rights required." };
  }

  // 3. Proceed with action
  await prisma.record.delete({ where: { id: recordId } });
  return { success: true };
}
```

---

## 🔍 Section 9: Advanced SEO & OpenGraph

### 1. Sitemap Generation (`app/sitemap.js`)
Next.js supports dynamic sitemap generation. Search engines use sitemaps to crawl and index pages efficiently.

```javascript
// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://your-domain.com";

  // Fetch dynamic items from database
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, updatedAt: true },
  });

  const restaurantUrls = restaurants.map((restaurant) => ({
    url: `${baseUrl}/restaurants/${restaurant.id}`,
    lastModified: restaurant.updatedAt,
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/restaurants`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
    ...restaurantUrls,
  ];
}
```

### 2. Robots.txt (`app/robots.js`)
Configure search engine crawler permissions.

```javascript
// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/", "/vendor/"], // Don't index private routes
    },
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}
```

### 3. OpenGraph Social Images (`og:image`)
Add a dynamic or static preview card image when your links are shared on social platforms.

```javascript
// app/layout.js OR app/page.js metadata
export const metadata = {
  openGraph: {
    title: "FoodRush - Super Fast Food Delivery",
    description: "Order fresh meals from your favorite local restaurants.",
    images: [
      {
        url: "https://your-domain.com/images/og-image.jpg", // Must be absolute URL
        width: 1200,
        height: 630,
        alt: "FoodRush App Banner",
      },
    ],
  },
};
```

---

## 🚀 Section 10: Deployment & Production Readiness

### 1. Build Verification Script
Before deploying to Vercel, run the production build script locally to capture TypeScript compile errors, linting errors, or compilation issues:

```bash
npm run build
```

### 2. Vercel Configuration & Environment Variables
*   **Database Connection:** Ensure you use a cloud-hosted MySQL/PostgreSQL instance (such as Aiven, PlanetScale, or Supabase). Local databases (`localhost:3306`) will not work on Vercel.
*   **NextAuth Production Variables:** On Vercel, you must set:
    *   `NEXTAUTH_URL` to your production domain (e.g. `https://foodrush.vercel.app`).
    *   `NEXTAUTH_SECRET` to a secure cryptographically generated random string.
*   **Preventing Build Cache Issues:** Add `prisma generate` to your Vercel postinstall command in `package.json` to ensure the Prisma engine client is generated correctly during deployments:
    ```json
    "scripts": {
      "postinstall": "prisma generate"
    }
    ```
