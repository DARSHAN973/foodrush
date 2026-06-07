# FoodRush MySQL Revision Notes

## Current Learning Goal

Use raw MySQL in phpMyAdmin first, then translate the same database ideas into Prisma schema and Prisma queries.

FoodRush is a food ordering app:

```txt
User browses restaurants
-> opens a restaurant
-> sees menu items
-> adds menu items to cart
-> places an order
```

## Core MySQL Concepts

```txt
database = whole project storage
table    = one type of thing
row      = one record inside a table
column   = one field/property inside a table
```

FoodRush example:

```txt
foodrush_db
  restaurants
  menu_items
  orders
  order_items
```

## CREATE TABLE

Creates a new table structure.

```sql
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cuisine VARCHAR(50) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  delivery_time INT NOT NULL,
  image_url VARCHAR(255)
);
```

Important parts:

```txt
id                 = unique id for each row
AUTO_INCREMENT     = MySQL creates the next id automatically
PRIMARY KEY        = main identifier for each row
VARCHAR(100)       = text up to 100 characters
NOT NULL           = value is required
DECIMAL(2,1)       = number with 2 total digits and 1 digit after decimal, like 4.5
DEFAULT 0.0        = fallback value if no value is provided
INT                = whole number
```

## INSERT INTO

Adds rows into a table.

```sql
INSERT INTO restaurants (name, cuisine, rating, delivery_time, image_url)
VALUES
('Pizza Palace', 'Italian', 4.5, 25, 'https://example.com/pizza.jpg'),
('Spice Hub', 'Indian', 4.7, 30, 'https://example.com/spice.jpg'),
('Burger Town', 'American', 4.2, 20, 'https://example.com/burger.jpg');
```

We do not insert `id` because it is `AUTO_INCREMENT`.

## SELECT

Reads rows from a table.

```sql
SELECT *
FROM restaurants;
```

`*` means all columns.

Read only selected columns:

```sql
SELECT name, cuisine, rating
FROM restaurants;
```

## WHERE

Filters rows.

```sql
SELECT *
FROM restaurants
WHERE cuisine = 'Italian';
```

```sql
SELECT *
FROM restaurants
WHERE id = 2;
```

```sql
SELECT *
FROM restaurants
WHERE rating >= 4.5;
```

Common operators:

```txt
=   exact match
>=  greater than or equal
<=  less than or equal
!=  not equal
```

Important safety habit:

```txt
Before UPDATE or DELETE, run SELECT with the same WHERE.
```

## ORDER BY

Sorts rows.

```sql
SELECT *
FROM restaurants
ORDER BY rating DESC;
```

```sql
SELECT *
FROM restaurants
ORDER BY delivery_time ASC;
```

```txt
ASC  = low to high
DESC = high to low
```

## LIMIT

Limits how many rows come back.

```sql
SELECT *
FROM restaurants
LIMIT 2;
```

Top 2 restaurants by rating:

```sql
SELECT *
FROM restaurants
ORDER BY rating DESC
LIMIT 2;
```

## UPDATE

Changes existing rows.

```sql
UPDATE restaurants
SET delivery_time = 22
WHERE id = 1;
```

Update multiple columns:

```sql
UPDATE restaurants
SET rating = 4.9,
    delivery_time = 18
WHERE id = 2;
```

Check after update:

```sql
SELECT *
FROM restaurants
WHERE id = 2;
```

Never run `UPDATE` without `WHERE` unless you intentionally want to update every row.

## DELETE

Removes rows.

Practice insert:

```sql
INSERT INTO restaurants (name, cuisine, rating, delivery_time, image_url)
VALUES ('Test Cafe', 'Test', 1.0, 99, 'https://example.com/test.jpg');
```

Check before deleting:

```sql
SELECT *
FROM restaurants
WHERE name = 'Test Cafe';
```

Delete:

```sql
DELETE FROM restaurants
WHERE name = 'Test Cafe';
```

Never run `DELETE` without `WHERE` unless you intentionally want to delete every row.

## Data Types

```txt
INT              whole number
VARCHAR(length)  short text
TEXT             long text
DECIMAL(10,2)    accurate decimal number, good for prices
BOOLEAN          true/false, stored like TINYINT(1) in MySQL
DATETIME         date and time
```

Price example:

```sql
price DECIMAL(10,2)
```

`DECIMAL(10,2)` means 10 total digits, with 2 digits after the decimal.

## Constraints

```txt
NOT NULL      value is required
DEFAULT       fallback value
UNIQUE        no duplicate values
PRIMARY KEY   main unique id
FOREIGN KEY   connects one table to another
```

## Foreign Key Relationship

FoodRush relationship:

```txt
one restaurant has many menu items
one menu item belongs to one restaurant
```

Create `menu_items`:

```sql
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_veg BOOLEAN DEFAULT true,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

Meaning:

```txt
restaurants.id is the parent id
menu_items.restaurant_id is the child link
```

Insert menu items:

```sql
INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg)
VALUES
(1, 'Margherita Pizza', 'Classic cheese pizza with tomato sauce', 249.00, 'Pizza', true),
(1, 'Farmhouse Pizza', 'Loaded veggie pizza with capsicum and onion', 349.00, 'Pizza', true),
(2, 'Paneer Tikka', 'Spiced paneer starter', 199.00, 'Starter', true),
(3, 'Classic Burger', 'Burger with cheese and house sauce', 179.00, 'Burger', false);
```

Here, `restaurant_id = 1` means the menu item belongs to restaurant id `1`.

## JOIN

Reads connected data from multiple tables.

```sql
SELECT
  menu_items.name AS menu_item,
  menu_items.price,
  restaurants.name AS restaurant
FROM menu_items
JOIN restaurants
ON menu_items.restaurant_id = restaurants.id;
```

Filter joined data:

```sql
SELECT
  menu_items.name AS menu_item,
  menu_items.price,
  restaurants.name AS restaurant
FROM menu_items
JOIN restaurants
ON menu_items.restaurant_id = restaurants.id
WHERE restaurants.id = 1;
```

## Aliases

Aliases shorten table names and clean output labels.

```sql
SELECT
  m.name AS menu_item,
  m.price,
  r.name AS restaurant
FROM menu_items AS m
JOIN restaurants AS r
ON m.restaurant_id = r.id
WHERE r.id = 1;
```

Meaning:

```txt
m = menu_items
r = restaurants
AS menu_item = output column label
AS restaurant = output column label
```

`AS` does not rename the real database column. It only changes the label for this query result.

## Aggregate Functions

Aggregate functions calculate summary values.

```txt
COUNT()  count rows
SUM()    add values
AVG()    average value
MIN()    lowest value
MAX()    highest value
```

Count all menu items:

```sql
SELECT COUNT(*) AS total_menu_items
FROM menu_items;
```

Average menu item price:

```sql
SELECT AVG(price) AS average_price
FROM menu_items;
```

Highest menu item price:

```sql
SELECT MAX(price) AS highest_price
FROM menu_items;
```

## GROUP BY

`GROUP BY` makes smaller groups first, then aggregate functions calculate inside each group.

Count menu items per restaurant id:

```sql
SELECT
  restaurant_id,
  COUNT(*) AS total_items
FROM menu_items
GROUP BY restaurant_id;
```

Readable version with restaurant names:

```sql
SELECT
  r.name AS restaurant,
  COUNT(m.id) AS total_items
FROM restaurants AS r
JOIN menu_items AS m
ON m.restaurant_id = r.id
GROUP BY r.id, r.name;
```

## LEFT JOIN

Normal `JOIN` only shows rows that have a match in both tables.

`LEFT JOIN` keeps every row from the left table, even if the right table has no match.

Example: show every restaurant, including restaurants with zero menu items.

```sql
SELECT
  r.name AS restaurant,
  COUNT(m.id) AS total_items
FROM restaurants AS r
LEFT JOIN menu_items AS m
ON m.restaurant_id = r.id
GROUP BY r.id, r.name;
```

Memory:

```txt
JOIN      = only matching rows
LEFT JOIN = all left-table rows, plus matching right-table rows when available
```

## COALESCE

`COALESCE(value, fallback)` returns the fallback when the value is `NULL`.

Example: average menu item price per restaurant. Restaurants with no menu items get `0` instead of `NULL`.

```sql
SELECT
  r.name AS restaurant,
  COALESCE(AVG(m.price), 0) AS average_price
FROM restaurants AS r
LEFT JOIN menu_items AS m
ON m.restaurant_id = r.id
GROUP BY r.id, r.name;
```

## HAVING

`WHERE` filters normal rows before grouping.

`HAVING` filters grouped results after aggregate functions like `COUNT`, `SUM`, and `AVG`.

Show only restaurants that have 2 or more menu items:

```sql
SELECT
  r.name AS restaurant,
  COUNT(m.id) AS total_items
FROM restaurants AS r
LEFT JOIN menu_items AS m
ON m.restaurant_id = r.id
GROUP BY r.id, r.name
HAVING COUNT(m.id) >= 2;
```

Show restaurants with zero menu items:

```sql
SELECT
  r.name AS restaurant,
  COUNT(m.id) AS total_items
FROM restaurants AS r
LEFT JOIN menu_items AS m
ON m.restaurant_id = r.id
GROUP BY r.id, r.name
HAVING COUNT(m.id) = 0;
```

Memory:

```txt
WHERE  = filter rows before GROUP BY
HAVING = filter groups after GROUP BY
```

## UNIQUE Constraint

`UNIQUE` prevents duplicate values.

Example for future auth:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

Meaning:

```txt
email is required
email cannot repeat
```

## ON DELETE Behavior

A foreign key does not automatically delete child rows.

This foreign key protects data:

```sql
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
```

If menu items still reference a restaurant, MySQL blocks deleting that restaurant.

Example error:

```txt
Cannot delete or update a parent row: a foreign key constraint fails
```

To automatically delete child rows, the relationship must use `ON DELETE CASCADE`:

```sql
FOREIGN KEY (restaurant_id)
REFERENCES restaurants(id)
ON DELETE CASCADE
```

Meaning:

```txt
If restaurant is deleted, delete its menu items too.
```

For order history, be more careful. Old orders should usually survive even if menu items change or get deleted.

Better order-item design stores snapshots:

```txt
menu_item_id nullable
item_name snapshot
price_at_order_time snapshot
quantity
```

Then `menu_item_id` can use `ON DELETE SET NULL`, while old order details stay readable.

## Transactions

A transaction keeps multiple database changes together.

Memory:

```txt
START TRANSACTION = open temporary work area
COMMIT            = save all changes permanently
ROLLBACK          = undo all pending changes
```

Safe rollback practice:

```sql
START TRANSACTION;

INSERT INTO restaurants (name, cuisine, rating, delivery_time, image_url)
VALUES ('Rollback Cafe', 'Cafe', 4.1, 20, 'https://example.com/rollback.jpg');

SELECT *
FROM restaurants
WHERE name = 'Rollback Cafe';

ROLLBACK;
```

After rollback, this should return no rows:

```sql
SELECT *
FROM restaurants
WHERE name = 'Rollback Cafe';
```

Simple order relationship:

```txt
orders table      = one row per order
order_items table = food items inside that order

orders.id
  -> order_items.order_id
```

Transactions matter for order placement because one order usually needs multiple inserts. If one insert fails, the whole order should be rolled back so there is no half-created order.

## Index Basics

An index is a separate lookup helper that helps MySQL find rows faster.

It does not rearrange the real table rows.

Memory:

```txt
Table = real data
Index = separate lookup map
```

Example:

```sql
CREATE INDEX idx_restaurants_cuisine
ON restaurants (cuisine);
```

This helps queries like:

```sql
SELECT *
FROM restaurants
WHERE cuisine = 'Italian';
```

See indexes on a table:

```sql
SHOW INDEXES FROM restaurants;
```

Delete an index:

```sql
DROP INDEX idx_restaurants_cuisine
ON restaurants;
```

Useful index targets:

```txt
columns used often in WHERE
columns used often in JOIN
columns used often in ORDER BY
```

Tradeoff:

```txt
Indexes make reads faster.
Indexes make writes slightly slower.
Indexes take extra storage.
```

## Many-to-Many Relationships

Many-to-many means:

```txt
one record can connect to many records
and each of those records can connect back to many records
```

FoodRush example:

```txt
one menu item can have many tags
one tag can belong to many menu items
```

So we need a middle table:

```txt
menu_items
tags
menu_item_tags
```

Create tags:

```sql
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

Create middle table:

```sql
CREATE TABLE menu_item_tags (
  menu_item_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (menu_item_id, tag_id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

`PRIMARY KEY (menu_item_id, tag_id)` prevents the same pair from repeating.

Insert tags:

```sql
INSERT INTO tags (name)
VALUES
('Veg'),
('Spicy'),
('Bestseller'),
('Pizza');
```

Connect menu item `1` with tags `1`, `3`, and `4`:

```sql
INSERT INTO menu_item_tags (menu_item_id, tag_id)
VALUES
(1, 1),
(1, 3),
(1, 4);
```

Read tags for menu item `1`:

```sql
SELECT
  m.name AS menu_item,
  t.name AS tag
FROM menu_items AS m
JOIN menu_item_tags AS mt
ON mt.menu_item_id = m.id
JOIN tags AS t
ON mt.tag_id = t.id
WHERE m.id = 1;
```

## NULL vs NOT NULL

Use `NOT NULL` when the app cannot work without that value.

Use nullable columns when the value is genuinely optional.

Examples:

```sql
name VARCHAR(100) NOT NULL
price DECIMAL(10,2) NOT NULL
restaurant_id INT NOT NULL
```

These are required because a menu item needs a name, price, and restaurant.

Nullable examples:

```sql
description TEXT
image_url VARCHAR(255)
delivery_note TEXT
```

These are optional because the app can still work without them.

Order history example:

```txt
order_items.menu_item_id can be nullable if item_name and price_at_order_time are stored as snapshots.
```

## Schema Design Basics

Basic rules:

```txt
1. One table per real thing.
2. Avoid comma-separated data in one column.
3. Use foreign keys for relationships.
4. Store snapshots for historical data like orders.
5. Use NOT NULL for required app data.
6. Use UNIQUE for values that must not repeat.
7. Prefer soft delete for business data when history matters.
```

FoodRush starter schema:

```txt
restaurants
menu_items
orders
order_items
```

Later:

```txt
users
cart_items
payments
admin roles
```

## MySQL to Prisma Mapping Preview

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

## Learn Later

These topics are important, but should be revisited after Prisma/schema design makes them more concrete:

```txt
transactions deeply
normalization
database performance
locks/concurrency
views
stored procedures
triggers
```
