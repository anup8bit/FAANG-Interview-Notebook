```sql
-- Customers from a specific state
SELECT * FROM customers
WHERE customer_state = 'SP';

-- Orders placed after a date
SELECT * FROM orders
WHERE order_purchase_timestamp > '2025-01-01';
```