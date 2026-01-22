# Beginner SQL Queries – E-Commerce Dataset

1. Fetch all users from the `users` table.  
2. List all products with their price.  
3. Find all orders placed by a specific user.  
4. Get all orders with status = `DELIVERED`.  
5. Count total number of users.  
6. Count total number of products.  
7. Find products with price greater than 1000.  
8. List products ordered by price (high to low).  
9. Fetch top 5 most recently created orders.  
10. Find total number of orders per user.  
11. Find total number of orders per order status.  
12. Get all order items for a given order ID.  
13. Find total quantity sold for each product.  
14. Calculate total order value for a given order.  
15. Find users who have not placed any orders.  
16. Get total number of payments with status `SUCCESS`.  
17. Find total revenue generated from all orders.  
18. Find orders placed within the last 30 days.  
19. Get products that are out of stock.  
20. Find average product price per category.


top 10 highest price product

```sql
-- Top 10 highest priced products (including NULL prices)
SELECT *
FROM products
ORDER BY price DESC
LIMIT 10;

-- Top 10 highest priced products (excluding NULL prices)
SELECT *
FROM products
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 10;

```
 ### note : Yes, the WITHOUT NULL query is correct 👍 and the WITH NULL one is misleading—in PostgreSQL, ORDER BY product_weight_g DESC already pushes NULL values to the end, so LIMIT 10 naturally returns non-NULL highest values; however, best practice is still your second query (WHERE product_weight_g IS NOT NULL) because it’s explicit, readable, and database-portable.


```sql


select * from orders where order_status = 'DELIVERED'  limit 10;
select * from orders where order_status ilike 'DELIVERED'  limit 10;
```