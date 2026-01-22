
### 1. Arithmetic Operators

| Operator | Meaning        | Example              |
| -------- | -------------- | -------------------- |
| `+`      | Addition       | `SELECT 5 + 3;` → 8  |
| `-`      | Subtraction    | `SELECT 10 - 4;` → 6 |
| `*`      | Multiplication | `SELECT 6 * 7;` → 42 |
| `/`      | Division       | `SELECT 10 / 2;` → 5 |
| `%`      | Modulus        | `SELECT 10 % 3;` → 1 |


### 2. Comparison Operators
| Operator     | Meaning               | Example                                                   |
| ------------ | --------------------- | --------------------------------------------------------- |
| `=`          | Equal                 | `SELECT * FROM customers WHERE customer_state = 'SP';`    |
| `<>` or `!=` | Not equal             | `SELECT * FROM orders WHERE order_status <> 'delivered';` |
| `>`          | Greater than          | `SELECT * FROM products WHERE price > 100;`               |
| `<`          | Less than             | `SELECT * FROM products WHERE price < 50;`                |
| `>=`         | Greater than or equal | `SELECT * FROM orders WHERE order_item_id >= 5;`          |
| `<=`         | Less than or equal    | `SELECT * FROM orders WHERE order_item_id <= 10;`         |


### 3. Logical Operators
| Operator | Meaning               | Example                                                                         |
| -------- | --------------------- | ------------------------------------------------------------------------------- |
| `AND`    | Both conditions true  | `SELECT * FROM customers WHERE customer_state='SP' AND customer_city='Franca';` |
| `OR`     | Either condition true | `SELECT * FROM customers WHERE customer_state='SP' OR customer_state='RJ';`     |
| `NOT`    | Negates condition     | `SELECT * FROM orders WHERE NOT order_status='delivered';`                      |


### 4. Pattern Matching
| Operator | Meaning                | Example                                                                           |
| -------- | ---------------------- | --------------------------------------------------------------------------------- |
| `LIKE`   | Matches pattern        | `SELECT * FROM customers WHERE customer_city LIKE 'F%';` (cities starting with F) |
| `ILIKE`  | Case-insensitive LIKE  | `SELECT * FROM customers WHERE customer_city ILIKE 'franca';`                     |
| `~`      | POSIX regex match      | `SELECT * FROM products WHERE product_category_name ~ 'beauty';`                  |
| `~*`     | Case-insensitive regex | `SELECT * FROM products WHERE product_category_name ~* 'Beauty';`                 |
| `!~`     | Regex does not match   | `SELECT * FROM products WHERE product_category_name !~ 'toy';`                    |


### 5. Null Checks
| Operator      | Meaning           | Example                                                                 |
| ------------- | ----------------- | ----------------------------------------------------------------------- |
| `IS NULL`     | Value is NULL     | `SELECT * FROM orders WHERE order_approved_at IS NULL;`                 |
| `IS NOT NULL` | Value is not NULL | `SELECT * FROM orders WHERE order_delivered_customer_date IS NOT NULL;` |



### 6. Range Operators
| Operator              | Meaning         | Example                                                      |
| --------------------- | --------------- | ------------------------------------------------------------ |
| `BETWEEN … AND …`     | Inclusive range | `SELECT * FROM products WHERE price BETWEEN 50 AND 200;`     |
| `NOT BETWEEN … AND …` | Outside range   | `SELECT * FROM products WHERE price NOT BETWEEN 50 AND 200;` |


### 7. Membership Operators
| Operator | Meaning           | Example                                                            |
| -------- | ----------------- | ------------------------------------------------------------------ |
| `IN`     | Value in list     | `SELECT * FROM customers WHERE customer_state IN ('SP','RJ');`     |
| `NOT IN` | Value not in list | `SELECT * FROM customers WHERE customer_state NOT IN ('SP','RJ');` |


### 8. Array Operators (PostgreSQL specific)
| Operator | Meaning         | Example                                   |
| -------- | --------------- | ----------------------------------------- |
| `@>`     | Contains        | `SELECT ARRAY[1,2,3] @> ARRAY[2];` → true |
| `<@`     | Is contained by | `SELECT ARRAY[2] <@ ARRAY[1,2,3];` → true |
| `&&`     | Overlaps        | `SELECT ARRAY[1,2] && ARRAY[2,3];` → true |
