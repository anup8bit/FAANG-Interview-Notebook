```sql
-- Total number of orders
SELECT COUNT(*) FROM orders;

-- Average price of products
SELECT AVG(price) FROM order_items;

-- Maximum freight value
SELECT MAX(freight_value) FROM order_items;

```