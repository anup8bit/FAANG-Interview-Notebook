```sql
-- Insert if not exists, otherwise update
INSERT INTO customers (customer_id, customer_unique_id, customer_city, customer_state)
VALUES ('C004','U004','Chennai','TN')
ON CONFLICT (customer_id)
DO UPDATE SET customer_city = EXCLUDED.customer_city;
```