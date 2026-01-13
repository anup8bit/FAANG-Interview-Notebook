### 7. GROUP BY – aggregation per category

```sql
-- Orders per customer
SELECT customer_id, COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id;

-- Total sales per product
SELECT product_id, SUM(price) AS total_sales
FROM order_items
GROUP BY product_id;

```