```sql
-- Join orders with customers
SELECT o.order_id, c.customer_city, o.order_purchase_timestamp
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;

-- Join order_items with products
SELECT oi.order_id, p.product_category_name, oi.price
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id;

```