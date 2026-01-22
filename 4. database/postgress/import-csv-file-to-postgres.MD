
```sql
-- Customers
\copy customers(customer_id, customer_unique_id, customer_zip_code_prefix, customer_city, customer_state)
FROM '/Users/saumy/Downloads/olist_customers_dataset.csv' CSV HEADER;

-- Products
\copy products(
    product_id, product_category_name, product_name_lenght, product_description_lenght,
    product_photos_qty, product_weight_g, product_length_cm, product_height_cm, product_width_cm
)
FROM '/Users/saumy/Downloads/olist_products_dataset.csv' CSV HEADER;

-- Sellers
\copy sellers(seller_id, seller_zip_code_prefix, seller_city, seller_state)
FROM '/Users/saumy/Downloads/olist_sellers_dataset.csv' CSV HEADER;

-- Orders
\copy orders(
    order_id, customer_id, order_status, order_purchase_timestamp, order_approved_at,
    order_delivered_carrier_date, order_delivered_customer_date, order_estimated_delivery_date
)
FROM '/Users/saumy/Downloads/olist_orders_dataset.csv' CSV HEADER;

-- Order Items
\copy order_items(order_id, product_id, seller_id, shipping_limit_date, price, freight_value)
FROM '/Users/saumy/Downloads/olist_order_items_dataset.csv' CSV HEADER;
```