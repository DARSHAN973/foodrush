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

