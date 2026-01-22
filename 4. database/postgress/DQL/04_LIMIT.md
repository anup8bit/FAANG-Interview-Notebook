```sql
-- First 10 customers
SELECT * FROM customers
LIMIT 10;

-- Top 5 most expensive products
SELECT * FROM products
ORDER BY price DESC
LIMIT 5;

```