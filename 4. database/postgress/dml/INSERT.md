```sql
-- Single row
INSERT INTO customers (customer_id, customer_unique_id, customer_city, customer_state)
VALUES ('C001', 'U001', 'Mumbai', 'MH');

-- Multiple rows
INSERT INTO customers (customer_id, customer_unique_id, customer_city, customer_state)
VALUES 
('C002', 'U002', 'Delhi', 'DL'),
('C003', 'U003', 'Bangalore', 'KA');
```