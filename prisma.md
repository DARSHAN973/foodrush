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

## Pending Prisma Topics

Continue from here:

```txt
1. Finish nested create with multiple menu items
2. Seed multiple restaurants
3. createMany vs nested create
4. connect and connectOrCreate basics
5. findUnique with select/include for restaurant detail
6. Practical update queries
7. delete vs soft delete with isActive/isAvailable
8. Reusable Prisma Client helper for Next.js
9. Using Prisma in route handlers/server code
10. Prisma error handling
11. Build database-backed GET API routes
```

Learn later:

```txt
Prisma transactions deeply
pagination
advanced filtering
many-to-many in Prisma
indexes in Prisma
Order and OrderItem full schema
User/auth relations
```
