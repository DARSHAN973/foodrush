# FoodRush Prisma Notes

## Goal

Prisma is the bridge between FoodRush code and MySQL.

```txt
Next.js / Node code -> Prisma Client -> MySQL foodrush_db
```

Prisma lets us write JavaScript-style database queries instead of raw SQL.

```js
await prisma.restaurant.findMany();
```

SQL idea:

```sql
SELECT * FROM Restaurant;
```

## Installed Packages

```txt
prisma
@prisma/client
@prisma/adapter-mariadb
```

Prisma version:

```txt
7.8.0
```

Important files:

```txt
prisma/schema.prisma
prisma.config.ts
.env
prisma/seed.js
```

Useful commands:

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name migration_name
npx prisma generate
node prisma/seed.js
```

Command meaning:

```txt
format    -> format schema.prisma
validate  -> check schema syntax/relations
migrate   -> create migration and change MySQL tables
generate  -> regenerate Prisma Client from schema
seed      -> insert starter data
```

## MySQL Connection

`.env`:

```env
DATABASE_URL="mysql://foodrush_user:foodrush_password@localhost:3306/foodrush_db"
```

Meaning:

```txt
mysql://          use MySQL
foodrush_user     database username
foodrush_password database password
localhost         database is on this machine
3306              default MySQL port
foodrush_db       database name
```

`prisma/schema.prisma` datasource:

```prisma
datasource db {
  provider = "mysql"
}
```

## Prisma 7 Adapter Setup

Prisma 7 requires a driver adapter or Prisma Accelerate.

For local MySQL, FoodRush uses the MariaDB adapter:

```js
require("dotenv/config");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });
```

Why:

```txt
PrismaClient uses the adapter to connect to MySQL at runtime.
Without the adapter, Prisma 7 throws a PrismaClientInitializationError.
```

## Schema Mapping

Same database idea, different syntax.

```txt
CREATE TABLE restaurants -> model Restaurant
id INT PRIMARY KEY      -> id Int @id
AUTO_INCREMENT          -> @default(autoincrement())
VARCHAR/TEXT            -> String
INT                     -> Int
DECIMAL                 -> Decimal
NULL allowed            -> ?
NOT NULL                -> no ?
FOREIGN KEY             -> @relation(...)
```

Example:

```prisma
model Restaurant {
  id           Int        @id @default(autoincrement())
  name         String
  cuisine      String
  rating       Decimal    @default(0.0) @db.Decimal(2, 1)
  deliveryTime Int
  imageUrl     String?
  isActive     Boolean    @default(true)
  menuItems    MenuItem[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @default(now()) @updatedAt
}
```

## Current FoodRush Models

```prisma
model Restaurant {
  id           Int        @id @default(autoincrement())
  name         String
  cuisine      String
  rating       Decimal    @default(0.0) @db.Decimal(2, 1)
  deliveryTime Int
  imageUrl     String?
  isActive     Boolean    @default(true)
  menuItems    MenuItem[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @default(now()) @updatedAt
}

model MenuItem {
  id           Int        @id @default(autoincrement())
  restaurantId Int
  name         String
  description  String?
  imageUrl     String?
  price        Decimal    @db.Decimal(10, 2)
  category     String
  isVeg        Boolean    @default(true)
  isAvailable  Boolean    @default(true)
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @default(now()) @updatedAt
}
```

## Relation Mapping

MySQL foreign key:

```sql
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
```

Prisma relation:

```prisma
restaurantId Int
restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
```

Parent side:

```prisma
menuItems MenuItem[]
```

Meaning:

```txt
Restaurant has many MenuItems.
MenuItem belongs to one Restaurant.
```

The `[]` means many:

```prisma
menuItems MenuItem[]
```

## Native Database Types

Native database types tell Prisma the exact MySQL column type.

Decimal examples:

```prisma
rating Decimal @default(0.0) @db.Decimal(2, 1)
price  Decimal @db.Decimal(10, 2)
```

Why:

```txt
Without native decimal types, Prisma created DECIMAL(65,30), which showed too many zeros in phpMyAdmin.
```

Meaning:

```txt
@db.Decimal(2, 1)  -> rating like 4.5
@db.Decimal(10, 2) -> price like 249.00
```

Native types are not only for decimals. Later examples:

```prisma
name        String  @db.VarChar(100)
description String? @db.Text
imageUrl    String? @db.VarChar(500)
```

## Timestamps

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @default(now()) @updatedAt
```

Meaning:

```txt
createdAt       -> set current time when row is created
updatedAt       -> set initial time on create and update automatically on Prisma updates
@default(now()) -> needed so existing/new rows get an initial value
@updatedAt      -> Prisma updates this field when the row changes
```

## Nested Create For Relational Seed Data

FoodRush seed data is relational:

```txt
Restaurant -> MenuItem[]
```

When creating one restaurant with its menu items, use nested create:

```js
await prisma.restaurant.create({
  data: {
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: 25,
    menuItems: {
      create: [
        {
          name: "Margherita Pizza",
          price: 249,
          category: "Pizza",
          isVeg: true,
        },
      ],
    },
  },
});
```

Meaning:

```txt
Create the Restaurant row first.
Then create MenuItem rows connected to that restaurant.
```

For multiple restaurants with their own menu items, use an array plus a loop:

```js
for (const restaurant of restaurants) {
  await prisma.restaurant.create({
    data: {
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      imageUrl: restaurant.imageUrl,
      menuItems: {
        create: restaurant.menuItems,
      },
    },
  });
}
```

Memory line:

```txt
Loop creates each parent Restaurant.
Nested create creates each restaurant's child MenuItems.
```

## createMany vs Nested Create

`createMany` is for bulk inserting many rows into one table:

```js
await prisma.restaurant.createMany({
  data: [
    {
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.5,
      deliveryTime: 25,
    },
    {
      name: "Burger Barn",
      cuisine: "American",
      rating: 4.3,
      deliveryTime: 30,
    },
  ],
});
```

`createMany` does not allow nested relation writes like:

```js
menuItems: {
  create: [...]
}
```

Why:

```txt
createMany = many rows, one table
nested create = related rows, multiple tables
```

FoodRush seed data needs relations, so the cleaner choice is:

```txt
loop + restaurant.create() + nested menuItems.create
```

## connect and connectOrCreate

`connect` creates a row and connects it to an existing related row.

FoodRush example:

```js
await prisma.menuItem.create({
  data: {
    name: "Cheese Burst Pizza",
    price: 399,
    category: "Pizza",
    isVeg: true,
    restaurant: {
      connect: {
        id: 1,
      },
    },
  },
});
```

Meaning:

```txt
Create this MenuItem and attach it to the Restaurant where id = 1.
```

`connect` requires the related row to already exist.

`connectOrCreate` needs two parts:

```js
restaurant: {
  connectOrCreate: {
    where: {
      id: 1,
    },
    create: {
      name: "Pizza Palace",
      cuisine: "Italian",
      deliveryTime: 25,
    },
  },
}
```

Meaning:

```txt
where  -> how Prisma checks if the related row exists
create -> backup data Prisma uses if the row does not exist
```

In real apps, `connectOrCreate` is usually better with stable unique fields
like `email` or `slug`, not hardcoded auto-increment ids.

## findUnique, findFirst, include, and select

`findUnique` searches using a unique field:

```js
await prisma.restaurant.findUnique({
  where: {
    id: 1,
  },
});
```

Use `findFirst` when normal filters are needed:

```js
await prisma.restaurant.findFirst({
  where: {
    id: 1,
    isActive: true,
  },
});
```

Why FoodRush uses `findFirst` for active restaurant detail:

```txt
id is unique, but isActive is a normal filter.
findFirst can combine both.
```

`include` adds related data:

```js
await prisma.restaurant.findFirst({
  where: {
    id: 1,
    isActive: true,
  },
  include: {
    menuItems: {
      where: {
        isAvailable: true,
      },
    },
  },
});
```

`select` chooses exact fields:

```js
await prisma.restaurant.findMany({
  where: {
    isActive: true,
  },
  select: {
    id: true,
    name: true,
    cuisine: true,
    rating: true,
    deliveryTime: true,
    imageUrl: true,
  },
});
```

Memory line:

```txt
include = add related data
select = choose exact fields
nested select = choose exact fields from related data
```

## Update, updateMany, and Soft Delete

`update` edits one unique row and throws if it does not exist:

```js
await prisma.restaurant.update({
  where: {
    id: 2,
  },
  data: {
    deliveryTime: 28,
  },
});
```

`updateMany` edits every row matching the filter and returns a count:

```js
await prisma.menuItem.updateMany({
  where: {
    restaurantId: 1,
  },
  data: {
    isAvailable: true,
  },
});
```

Hard delete removes the row:

```js
await prisma.restaurant.delete({
  where: {
    id: 2,
  },
});
```

Soft delete keeps the row but hides/disables it:

```js
await prisma.restaurant.update({
  where: {
    id: 2,
  },
  data: {
    isActive: false,
  },
});
```

Why soft delete matters in FoodRush:

```txt
Restaurants may reopen later.
Old orders and admin history should not lose their restaurant reference.
```

## Reusable Prisma Client Helper

FoodRush uses `lib/prisma.js` so server code can import one shared Prisma
Client instead of repeating adapter setup everywhere.

```js
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Meaning:

```txt
adapter      -> knows how to connect Prisma 7 to MySQL/MariaDB
PrismaClient -> gives query methods like findMany/create/update
globalThis   -> stores one reusable client during development hot reload
```

This cache is not query/data caching. It stores the Prisma Client instance,
not old restaurant data.

FoodRush server usage:

```js
import { prisma } from "@/lib/prisma";

const restaurants = await prisma.restaurant.findMany();
```

Do not import Prisma directly in Client Components. Prisma belongs in server
code such as route handlers, Server Components, server actions, and server
helpers because it uses database connection secrets and talks to MySQL.

## Database-Backed Restaurant Helpers

`lib/restaurants.js` replaced DummyJSON restaurant reads with Prisma.

List helper:

```js
export async function getRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
    },
    orderBy: {
      rating: "desc",
    },
  });

  return restaurants.map((restaurant) => ({
    ...restaurant,
    rating: Number(restaurant.rating),
  }));
}
```

Detail helper pattern:

```js
export async function getRestaurant(id) {
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
      menuItems: {
        where: {
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
        },
      },
    },
  });

  if (restaurant === null) {
    return null;
  }

  return {
    ...restaurant,
    rating: Number(restaurant.rating),
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}
```

Why `select`:

```txt
The restaurant list/card only needs a few fields.
Do not send createdAt, updatedAt, isActive, or unused data to UI/API code.
```

Why `Number(restaurant.rating)`:

```txt
Prisma returns Decimal fields as Decimal objects.
UI/API data should use plain serializable values.
```

`findMany` returns an array, so use `.map()` on the result.
`findFirst`/`findUnique` return one object or `null`, so do not use `.map()`
directly on that result.

For a restaurant detail query, `menuItems` is an array inside one restaurant
object, so mapping `restaurant.menuItems.map(...)` is correct.

## Prisma Error Handling In Route Handlers

Keep real database errors on the server:

```js
try {
  const restaurants = await getRestaurants();
  return Response.json(restaurants);
} catch (error) {
  console.error("GET /api/restaurants failed:", error);

  return Response.json(
    { message: "Failed to fetch restaurants" },
    { status: 500 }
  );
}
```

Why:

```txt
catch real Prisma/database errors in the route handler
log the real error in the terminal for debugging
return a safe generic 500 message to the frontend
do not expose DATABASE_URL, SQL details, stack traces, or internal Prisma errors
```

404 vs 500:

```txt
404 -> expected missing data, like restaurant id not found
500 -> unexpected server/database failure
```

## POST Route With Prisma Create

`POST /api/restaurants` creates a new restaurant row.

Route handler responsibilities:

```txt
read request body with await request.json()
validate required fields
return 400 for missing/invalid client data
call Prisma helper to create the row
return created restaurant with 201 Created
catch unexpected errors and return safe 500 JSON
```

Why `await request.json()`:

```txt
POST data lives in the request body.
request.json() parses that body into a JavaScript object.
Reading/parsing the body is async, so it needs await.
```

Current flow:

```txt
Thunder Client JSON body
-> POST /api/restaurants
-> request.json()
-> createRestaurant(data)
-> prisma.restaurant.create()
-> 201 response with created restaurant
```

Later admin flow:

```txt
Admin form state
-> fetch("/api/restaurants", { method: "POST", body: JSON.stringify(data) })
-> same POST route
```

Status codes:

```txt
201 -> row was created
400 -> client sent missing/invalid fields
500 -> unexpected server/database error
```

Important:

```txt
Do not hardcode test restaurant data inside the route.
For testing, send JSON from Thunder Client.
Later, send JSON from the admin form.
```

## PATCH Route With Prisma Update

`PATCH /api/restaurants/[id]` updates one existing restaurant.

Route handler responsibilities:

```txt
read id from params
read changed fields with await request.json()
validate that at least one editable field exists
call updateRestaurant(id, data)
return 404 if the helper returns null
return updated restaurant with 200 OK
catch unexpected errors and return safe 500 JSON
```

Why PATCH validation uses `&&`:

```js
if (!data.name && !data.cuisine && !data.deliveryTime) {
  return Response.json(
    { message: "At least one field is required to update" },
    { status: 400 },
  );
}
```

Meaning:

```txt
Reject only when name, cuisine, and deliveryTime are all missing.
PATCH can update one selected field, so it should not require every field.
```

Helper pattern:

```js
const updateData = {};

if (data.name) updateData.name = data.name;
if (data.cuisine) updateData.cuisine = data.cuisine;
if (data.deliveryTime) updateData.deliveryTime = data.deliveryTime;

const updatedRestaurant = await prisma.restaurant.update({
  where: {
    id: restaurantId,
  },
  data: updateData,
});
```

Why `updateData`:

```txt
PATCH is for partial updates.
Only fields sent by the client should be updated.
Missing fields should not be touched.
```

FoodRush active-row guard:

```js
const restaurant = await prisma.restaurant.findFirst({
  where: {
    id: restaurantId,
    isActive: true,
  },
});
```

Why:

```txt
Normal update routes should not edit soft-deleted restaurants.
Inactive restaurants behave like missing data to app/API callers.
```

Status codes:

```txt
200 -> existing row updated successfully
400 -> no editable fields were sent
404 -> invalid id, missing restaurant, or inactive restaurant
500 -> unexpected server/database error
```

## DELETE Route With Soft Delete

FoodRush uses soft delete for restaurants:

```js
await prisma.restaurant.update({
  where: {
    id: restaurantId,
  },
  data: {
    isActive: false,
  },
});
```

Why:

```txt
Restaurants can be hidden or reopened later.
Future order/history data may still need to reference the restaurant row.
Hard delete would permanently remove that row.
```

Route flow:

```txt
DELETE /api/restaurants/10
-> read id from params
-> deleteRestaurant(id)
-> set isActive: false
-> return 200 with success message
```

After soft delete:

```txt
The row still exists in MySQL.
GET /api/restaurants/10 returns 404 because getRestaurant filters isActive: true.
```

Common DELETE success choices:

```txt
200 OK         -> success with a response body/message
204 No Content -> success with no response body
```

FoodRush currently uses `200` because Thunder Client testing is clearer with a
JSON success message.

## Route Handler Body Debugging

When validation fails even though the request body looks correct, log what the
route actually received:

```js
console.log("body:", data);
console.log("type:", typeof data);
console.log("name:", data.name);
console.log("keys:", Object.keys(data));
```

Expected real JSON object:

```txt
type: object
name: Updated Test Restaurant
keys: [ 'name' ]
```

Problem found in Thunder Client:

```txt
type: string
name: undefined
keys: [ '0', '1', '2', ... ]
```

Meaning:

```txt
The request body was a string that looked like JSON, not a real JSON object.
```

Wrong shape:

```json
"{ \"name\": \"Updated Test Restaurant\" }"
```

Correct shape:

```json
{
  "name": "Updated Test Restaurant"
}
```

Memory line:

```txt
"{}" = string that looks like JSON
{}   = real JSON object
```

## Current Next Step

Prisma basics + database-backed restaurant CRUD APIs are complete enough for now.

Next learning order:

```txt
1. Start MenuItem API route practice.
2. Suggested next routes:
   GET /api/restaurants/[id]/menu-items
   POST /api/restaurants/[id]/menu-items
3. Return to remaining Next.js fundamentals after API route practice.
```

Migration lesson:

```txt
Adding a required updatedAt column to a table with existing rows can fail if the column has no default.
```

## Active Flags

```prisma
isActive    Boolean @default(true)
isAvailable Boolean @default(true)
```

FoodRush meaning:

```txt
Restaurant.isActive    -> hide/deactivate restaurant without deleting it
MenuItem.isAvailable   -> mark item out of stock without deleting it
```

This is soft-delete/deactivation thinking.

## Image URL Strategy

Images are stored as URLs in MySQL, not as image files.

```prisma
imageUrl String?
```

Meaning:

```txt
String  -> URL is text
?       -> image is optional
```

Future flow:

```txt
Admin uploads image to Cloudinary
Cloudinary stores the actual file
FoodRush stores Cloudinary URL in imageUrl
Next Image renders the URL
```

## Prisma Client Queries

Assume this setup:

```js
const prisma = new PrismaClient({ adapter });
```

Model access:

```js
prisma.restaurant;
prisma.menuItem;
```

Meaning:

```txt
restaurant -> Restaurant model/table
menuItem   -> MenuItem model/table
```

## findMany

Read many rows.

```js
const restaurants = await prisma.restaurant.findMany();
```

With filter:

```js
const restaurants = await prisma.restaurant.findMany({
  where: {
    isActive: true,
  },
});
```

## findUnique

Read one row by unique field, usually `id`.

```js
const restaurant = await prisma.restaurant.findUnique({
  where: {
    id: 1,
  },
});
```

## create

Insert one row.

```js
const restaurant = await prisma.restaurant.create({
  data: {
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: 25,
    imageUrl: "https://example.com/pizza.jpg",
  },
});
```

In Prisma:

```txt
where = which row(s)?
data  = what values?
```

## update

Update one row.

```js
await prisma.restaurant.update({
  where: {
    id: 1,
  },
  data: {
    rating: 4.8,
  },
});
```

## delete

Delete one row.

```js
await prisma.restaurant.delete({
  where: {
    id: 1,
  },
});
```

## deleteMany

Delete multiple rows.

```js
await prisma.menuItem.deleteMany();
```

SQL idea:

```sql
DELETE FROM MenuItem;
```

With filter:

```js
await prisma.menuItem.deleteMany({
  where: {
    isAvailable: false,
  },
});
```

Seed cleanup uses child-first delete:

```js
await prisma.menuItem.deleteMany();
await prisma.restaurant.deleteMany();
```

Why:

```txt
MenuItem has restaurantId pointing to Restaurant.id, so child rows are deleted before parent rows.
```

## createMany

Insert multiple rows.

```js
await prisma.menuItem.createMany({
  data: [
    {
      restaurantId: 1,
      name: "Margherita Pizza",
      price: 249,
      category: "Pizza",
    },
    {
      restaurantId: 1,
      name: "Farmhouse Pizza",
      price: 349,
      category: "Pizza",
    },
  ],
});
```

## include

Bring related data.

```js
const restaurants = await prisma.restaurant.findMany({
  include: {
    menuItems: true,
  },
});
```

SQL idea:

```txt
JOIN related menu_items
```

Filter and sort included data:

```js
const restaurants = await prisma.restaurant.findMany({
  include: {
    menuItems: {
      where: {
        isAvailable: true,
      },
      orderBy: {
        price: "asc",
      },
    },
  },
});
```

## where and orderBy

```txt
where   -> filters rows
orderBy -> sorts rows
```

Example:

```js
const restaurants = await prisma.restaurant.findMany({
  where: {
    isActive: true,
  },
  orderBy: {
    rating: "desc",
  },
});
```

## select

Choose exact fields to return.

```js
const restaurants = await prisma.restaurant.findMany({
  select: {
    id: true,
    name: true,
    cuisine: true,
    rating: true,
    menuItems: {
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
      },
    },
  },
});
```

Important distinction:

```js
select: {
  isAvailable: true,
}
```

means:

```txt
return this field
```

```js
where: {
  isAvailable: true,
}
```

means:

```txt
only rows where this value is true
```

Real app habit:

```txt
include -> quick relation data / internal use
select  -> cleaner public API responses
```

Do not use `select` and `include` at the same level. Put relation fields inside `select` when you need exact fields.

## Decimal JSON Output

Prisma Decimal values may appear as strings in JSON:

```json
{
  "rating": "4.5",
  "price": "249"
}
```

This is normal. Prisma preserves decimal precision instead of risking JavaScript number precision problems.

## Stale Prisma Client

If schema has a field but Prisma query says:

```txt
Unknown field `fieldName`
```

the generated Prisma Client may be stale.

Fix:

```bash
npx prisma generate
```

Memory:

```txt
schema.prisma  = blueprint
Prisma Client  = generated JS API from the blueprint
```

## CommonJS Script Pattern

Because seed/test scripts use `require`, use an async wrapper instead of top-level `await`.

```js
async function main() {
  const restaurants = await prisma.restaurant.findMany();
  console.log(restaurants);
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
```

Why:

```txt
require = CommonJS
CommonJS does not support top-level await
finally disconnects Prisma from the database
```

Exit code:

```txt
0 = success
1 = error/failure
```

## Seed Basics

Current seed flow:

```txt
connect Prisma
delete MenuItem rows
delete Restaurant rows
create Pizza Palace
create nested menu item
disconnect Prisma
```

Current `seed.js` uses:

```js
await prisma.menuItem.deleteMany();
await prisma.restaurant.deleteMany();
```

This makes seed repeat-safe by clearing old seed rows before inserting fresh rows.

## Nested Create

Nested create creates parent and child records together.

Pattern:

```js
await prisma.restaurant.create({
  data: {
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: 25,
    imageUrl: "https://example.com/pizza.jpg",
    menuItems: {
      create: [
        {
          name: "Margherita Pizza",
          description: "Classic cheese pizza with tomato sauce",
          price: 249,
          category: "Pizza",
          isVeg: true,
        },
      ],
    },
  },
});
```

Why:

```txt
Prisma knows Restaurant has many MenuItems, so it automatically connects nested menu items to the new restaurant.
```

Important:

```txt
Inside nested create, do not pass restaurantId manually.
```

Wrong:

```js
restaurantId: restaurant.id,
```

Why wrong:

```txt
The restaurant variable does not exist until restaurant.create finishes.
Nested create handles the relationship automatically.
```

## Transactions

A transaction groups multiple Prisma operations so they all succeed together
or all fail together. If any step fails, every previous step is rolled back.

FoodRush example — placing an order:

```js
const order = await prisma.$transaction(async (tx) => {
  const parentOrder = await tx.parentOrder.create({ data: { ... } });

  for (const [restaurantId, items] of Object.entries(itemsByRestaurant)) {
    const restaurantOrder = await tx.restaurantOrder.create({
      data: { parentOrderId: parentOrder.id, restaurantId, subtotal },
    });

    for (const item of items) {
      await tx.orderItem.create({
        data: { restaurantOrderId: restaurantOrder.id, ... },
      });
    }
  }

  return parentOrder;
});
```

Why:

```txt
Without a transaction, if RestaurantOrder creation fails,
ParentOrder already exists — data is broken and inconsistent.
With a transaction, ALL rows are rolled back if any step fails.
```

The `tx` parameter inside the callback replaces `prisma` for every
operation inside the transaction. Use `tx.model.operation()` not `prisma.model.operation()`.

External API calls must stay OUTSIDE the transaction:

```js
// CORRECT — Razorpay API after the transaction
const order = await prisma.$transaction(async (tx) => { ... });
const razorpayOrder = await razorpay.orders.create({ amount: ... });

// WRONG — never do this
const order = await prisma.$transaction(async (tx) => {
  const parentOrder = await tx.parentOrder.create({ ... });
  const razorpayOrder = await razorpay.orders.create({ ... }); // ❌
});
```

Why external calls must be outside:

```txt
A Prisma transaction holds DB row locks for its entire duration.
External API calls over the network can take 3-10 seconds.
During those seconds, other users trying to write those rows are BLOCKED.
This kills performance in production at scale.
Also: Prisma transactions have a 5-second default timeout.
A slow external API call causes the transaction to self-destruct,
rolling back DB rows even if the external API already succeeded.
```

## ACID — The 4 Transaction Guarantees

Every database transaction provides 4 guarantees:

```txt
A — Atomicity   → All or nothing. Every step succeeds or every step is rolled back.
C — Consistency → The DB never enters a broken state. Constraints and foreign keys are enforced.
I — Isolation   → Concurrent transactions don't see each other's intermediate states.
                  MySQL uses row-level locking: first transaction locks rows,
                  second transaction waits. First come, first served.
D — Durability  → Once committed, data survives crashes. Written to disk, not just memory.
```

Memory line:

```txt
ACID = the 4 promises every transaction makes
A = all-or-nothing
C = no broken state
I = concurrent users don't interfere
D = committed data survives
```

## Indexes

An index is a separate sorted data structure (B-Tree) that MySQL maintains
alongside the table. It lets MySQL jump directly to matching rows instead
of scanning every row.

Without index — full table scan:

```txt
SELECT * FROM ParentOrder WHERE userId = 42;
→ MySQL checks every single row until it finds userId = 42
→ 1 million rows = 1 million checks = slow
```

With index — B-Tree lookup:

```txt
SELECT * FROM ParentOrder WHERE userId = 42;
→ MySQL looks in the B-Tree index, finds exact position instantly
→ 1 million rows = same speed as 1 row
```

### When indexes are created automatically

```txt
@id     → always creates a primary key index
@unique → always creates a unique index
@relation foreign key fields → MySQL auto-creates an index on the FK column
```

### When to add @@index manually

Add `@@index` on any column you frequently filter by that is NOT already `@unique`:

```prisma
model ParentOrder {
  userId Int
  // userId is not @unique (one user can have many orders)
  // but every order history query filters by userId
  @@index([userId])
}
```

### The real tradeoff — not just space vs speed

```txt
             Without Index    With Index
READ speed        Slow             Fast
WRITE speed       Fast         Slightly slower (index must be updated too)
Storage           Less             More
```

Index every column you read frequently. Do NOT index columns you rarely query.

Example of a table you would NOT index:

```txt
SearchLog table — only ever does INSERTs, never filtered by any column.
Adding an index slows every INSERT with no read benefit.
```

Space-speed tradeoff reality:

```txt
Storage is cheap (~$0.02 per GB per month on cloud).
Slow queries are expensive (lost users, wasted CPU, scalability failure).
For read-heavy apps like FoodRush, indexes are almost always worth it.
```

### Prisma index syntax

```prisma
// Single column index
@@index([userId])

// Composite index (two columns searched together)
@@index([restaurantId, status])
```

## Normalization

Normalization = Store each piece of data in exactly ONE place.
Never duplicate data across tables. Store the ID and use a relation.

```txt
CORRECT — store restaurantId, use a relation to get the name
WRONG   — store restaurantName in CartItem (what if the name changes?)
```

The only exception is SNAPSHOT fields — intentionally frozen data at
time of purchase that must not change later:

```prisma
model OrderItem {
  itemName String  // snapshot — frozen at purchase time
  price    Decimal // snapshot — frozen at purchase time
}
```

Why:

```txt
Menu prices change. Orders must always show the price the user actually paid,
not today's current price. So we copy the price into OrderItem at order time.
```

