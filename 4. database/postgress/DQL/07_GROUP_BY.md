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


### Q. Problem Statement:
Write an SQL query to generate a summary report that shows the total number of orders for each order status from the orders table by grouping records on order_status.

```bash
select order_status, count(*) as total_orders from orders group by order_status;
 order_status | total_orders 
--------------+--------------
 shipped      |         1107
 unavailable  |          609
 invoiced     |          314
 created      |            5
 approved     |            2
 processing   |          301
 delivered    |        96478
 canceled     |          625
(8 rows)

```