### 8. HAVING – filter aggregated results

```sql
-- Customers with more than 5 orders
SELECT customer_id, COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;

```