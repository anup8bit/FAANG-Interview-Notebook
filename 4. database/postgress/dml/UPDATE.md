```sql
-- Update a single column
UPDATE customers
SET customer_city = 'Pune'
WHERE customer_id = 'C001';

-- Update multiple columns
UPDATE customers
SET customer_city = 'Kolkata', customer_state = 'WB'
WHERE customer_id = 'C002';
```