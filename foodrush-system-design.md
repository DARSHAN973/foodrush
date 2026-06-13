# FoodRush System Design

## Goal

Design FoodRush as a real food ordering app, not a recipe finder.

The system should support this core flow:

```txt
user browses restaurants
-> opens a restaurant
-> views menu items
-> adds menu items to cart
-> checks out cart from one or more restaurants
-> one payment creates restaurant-wise orders
-> admin manages restaurants, menu items, and orders
```

## How To Think About System Design

System design is the bridge between product idea and code.

For FoodRush, we will design in this order:

```txt
1. Product scope   -> what are we building now vs later?
2. User flows      -> what should each type of user be able to do?
3. Data entities   -> what must the app remember in the database?
4. Relationships   -> how are those entities connected?
5. API routes      -> how does UI talk to backend?
6. Edge cases      -> what can fail or change?
7. Future growth   -> what should be delayed but not forgotten?
```

Memory line:

```txt
UI shows what users see.
Database stores what the app must remember.
APIs connect user actions to database changes.
```

## Version Scope

### V1 Portfolio App

Goal: build a strong full-stack FoodRush app that proves the main ordering flow.

Included:

```txt
- Users can sign up and log in.
- Users can browse active restaurants.
- Users can open a restaurant and view available menu items.
- Users can add/remove menu items in a database-backed cart.
- V1 supports adding menu items from multiple restaurants in the same cart.
- Checkout creates one parent order for the full cart.
- The parent order is split into restaurant-wise orders.
- Each restaurant order has its own order items and order status.
- One payment can cover the full parent order.
- Users can view current and past orders in their profile/orders page.
- Admin can CRUD restaurants and menu items.
- Admin can upload restaurant/menu item images.
- Admin can view users, orders, payments, and dashboard stats.
- Admin can update restaurant-wise order statuses.
```

Not included yet:

```txt
- Live delivery map tracking.
- Separate restaurant/vendor dashboard.
- Separate delivery partner app.
- Coupons, offers, and wallet system.
- Reviews and ratings from users.
- Refund automation.
- Advanced search/filtering.
- Multiple saved addresses.
- Notifications by email/SMS/WhatsApp.
```

### V2 Real Product Features

Goal: make FoodRush feel closer to a real delivery platform.

```txt
- Restaurant/vendor dashboard.
- Delivery partner flow.
- Live delivery tracking.
- User reviews and ratings.
- Coupons and offers.
- Multiple saved addresses.
- Better restaurant search, filters, and sorting.
- Email/SMS notifications.
- Refund handling.
```

### V3 Advanced Features

Goal: advanced product, business, delivery, and AI features.

```txt
- Delivery partner assignment.
- Real-time map tracking.
- Vendor-side order acceptance/rejection.
- Recommendation system.
- AI-based menu/restaurant suggestions.
- Demand prediction and restaurant analytics.
- Advanced payment/refund workflows.
```

## Actors

Actors are the people or systems that use FoodRush.

```txt
Customer/User:
- Can sign up and log in.
- Can browse restaurants.
- Can view menu items inside a restaurant.
- Can add/remove menu items in the cart.
- Can place multi-restaurant checkout orders.
- Can make payments.
- Can view profile details.
- Can view current and past orders.
- Can track restaurant-wise order statuses.

Admin:
- Can create, read, update, and soft-delete restaurants.
- Can create, read, update, and soft-delete menu items.
- Can upload restaurant/menu item images.
- Can view users.
- Can view placed orders.
- Can update restaurant-wise order statuses.
- Can view payment details.
- Can view dashboard stats like total orders, pending orders, and total revenue.

Payment Provider:
- External service like Razorpay/Stripe that handles payment collection.
- Sends payment success/failure result back to FoodRush.
```

## User Flow

Normal customer flow:

```txt
open FoodRush
-> browse restaurants
-> open a restaurant
-> browse menu items
-> click add to cart
-> login/signup if not logged in
-> add/remove menu items in the database-backed cart
-> add items from one or more restaurants
-> go to cart
-> enter checkout details
-> make one payment for the full cart
-> FoodRush creates one parent order
-> FoodRush splits the parent order into restaurant-wise orders
-> view restaurant-wise order statuses in profile/orders page
-> receive orders
-> view completed orders in past orders
```

## Admin Flow

FoodRush admin flow:

```txt
admin logs in
-> opens dashboard
-> views stats like total orders, pending orders, and total revenue
-> manages restaurants
-> creates/updates menu items for each restaurant
-> uploads restaurant/menu item images
-> views all customer orders
-> opens one parent order detail
-> checks payment status and delivery details
-> sees restaurant-wise order groups inside the parent order
-> updates each restaurant order status
-> views users/customers
```

## Vendor Flow

Restaurant/vendor flow:

```txt
Postponed for V1.

In V1, FoodRush admin manages restaurant and menu data directly.
Later, restaurant/vendor users can get their own dashboard to manage menu items
and accept/reject restaurant orders.
```

## Core Entities

Entities are the main things the app stores in the database.

```txt
User:
- Stores customer/admin account data.
- Has a role field: USER or ADMIN.

Restaurant:
- Stores restaurant details like name, cuisine, rating, delivery time, image,
  and active status.

MenuItem:
- Stores food item details like name, description, price, image, availability,
  and restaurant connection.

Cart:
- Stores the active cart for one logged-in user.

CartItem:
- Stores each menu item and quantity inside a cart.

ParentOrder:
- Stores one checkout placed by the user.
- Represents the full cart/order from the user's point of view.
- Can contain items from multiple restaurants.

RestaurantOrder:
- Stores the restaurant-wise split of a parent order.
- Each restaurant order belongs to one restaurant and has its own status.

OrderItem:
- Stores each menu item, quantity, and price snapshot inside a restaurant order.

Payment:
- Stores payment provider, payment status, transaction id, and paid amount.
```

## Relationships

Relationships describe how database entities connect.

```txt
User -> Cart:
- One user has one active cart.
- One cart belongs to one user.

Cart -> CartItem:
- One cart has many cart items.
- One cart item belongs to one cart.

CartItem -> MenuItem:
- One cart item points to one menu item.
- One menu item can appear in many cart items.

Restaurant -> MenuItem:
- One restaurant has many menu items.
- One menu item belongs to one restaurant.

User -> ParentOrder:
- One user can place many parent orders.
- One parent order belongs to one user.

ParentOrder -> RestaurantOrder:
- One parent order can have many restaurant orders.
- One restaurant order belongs to one parent order.

Restaurant -> RestaurantOrder:
- One restaurant can receive many restaurant orders.
- One restaurant order belongs to one restaurant.

RestaurantOrder -> OrderItem:
- One restaurant order has many order items.
- One order item belongs to one restaurant order.

OrderItem -> MenuItem:
- One order item points to one menu item.
- One menu item can appear in many order items.

ParentOrder -> Payment:
- One parent order has one payment record in V1.
- One payment belongs to one parent order.
```

## Order Lifecycle

An order should move through clear statuses.

```txt
Parent order status:
- PAYMENT_PENDING
- PLACED
- PARTIALLY_COMPLETED
- COMPLETED
- CANCELLED

Restaurant order status:
- PLACED
- CONFIRMED
- PREPARING
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED

Payment status:
- PENDING
- PAID
- FAILED
- REFUNDED
```

## Pricing And Costing

FoodRush needs simple pricing in V1 and deeper business logic later.

```txt
V1 pricing:
- Menu item price is stored on MenuItem.
- OrderItem stores a price snapshot so old orders do not change when menu prices change.
- RestaurantOrder subtotal = sum of its order items.
- ParentOrder subtotal = sum of restaurant order subtotals.
- Delivery fee can be simple and fixed in V1.
- Platform fee can be simple and fixed in V1.
- ParentOrder total = subtotal + delivery fee + platform fee.
- Payment amount should match ParentOrder total.

Later pricing:
- Restaurant-wise delivery fee.
- Taxes/GST.
- Coupons.
- Refunds and partial refunds.
- Surge/distance-based delivery pricing.
```

## API Route Plan

APIs connect frontend actions to backend/database logic.

```txt
Restaurant/menu:
- GET /api/restaurants
- POST /api/restaurants
- GET /api/restaurants/[id]
- PATCH /api/restaurants/[id]
- DELETE /api/restaurants/[id]
- GET /api/restaurants/[id]/menu-items
- POST /api/restaurants/[id]/menu-items
- PATCH /api/menu-items/[id]
- DELETE /api/menu-items/[id]

Cart:
- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/[id]
- DELETE /api/cart/items/[id]
- DELETE /api/cart

Checkout/orders:
- POST /api/checkout
- GET /api/orders
- GET /api/orders/[id]

Admin:
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/orders
- GET /api/admin/orders/[id]
- PATCH /api/admin/restaurant-orders/[id]/status

Payments:
- POST /api/payments/create
- POST /api/payments/webhook
```

## Admin Panel Plan

Admin screens should match backend responsibilities.

```txt
- Dashboard stats: total orders, pending orders, total revenue.
- Restaurant CRUD screen.
- Menu item CRUD screen.
- Image upload for restaurants/menu items.
- Orders list screen.
- Parent order detail screen with restaurant-wise order groups.
- Restaurant order status update controls.
- Users list screen.
- Payments list/detail view.
```

## AI Ideas

AI features are future enhancements, not V1 blockers.

```txt
- AI restaurant/menu recommendations.
- AI search like "show spicy dinner under 300".
- AI admin analytics summaries.
- AI-generated menu descriptions.
- AI support chatbot.
```

## Open Questions

Questions we still need to answer before building deeper features:

```txt
- Should V1 use NextAuth/Auth.js or a custom learning auth first?
- Should checkout require saved addresses or simple one-time delivery details?
- Should delivery fee be one fixed fee for the parent order or per restaurant order?
- Should payments be mocked first, then replaced with Razorpay?
- Should cancelled restaurant orders trigger partial refund logic in V1 or be postponed?
```
