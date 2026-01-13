***In PostgreSQL, Data Definition Language (DDL) consists of SQL commands used to create, modify, and delete the structure (schema) of database objects such as tables, indexes, and views.***

### Key PostgreSQL DDL Commands
***CREATE:*** Used to create new objects (e.g., CREATE TABLE, CREATE INDEX, CREATE VIEW, CREATE SCHEMA).
***ALTER:*** Modifies the structure of an existing object (e.g., ALTER TABLE to add/rename columns or change data types).
***DROP:*** Deletes an object entirely from the database.
***TRUNCATE:*** Quickly removes all rows from a table while preserving its structure.
***RENAME:*** Used specifically to change the name of an existing object.
***COMMENT:*** Adds descriptive text to database objects for documentation. 


Unique PostgreSQL DDL Features

Unique PostgreSQL DDL Features
***Transactional DDL:*** Unlike many other databases (like MySQL or Oracle), PostgreSQL allows DDL statements to be executed within a transaction. You can wrap multiple changes in a BEGIN and COMMIT block; if an error occurs, you can use ROLLBACK to undo the entire schema change.
***Event Triggers:*** PostgreSQL supports "Event Triggers" that can capture DDL events globally across the database, allowing for automated tasks like logging or schema auditing.
***Case Sensitivity:*** Object names are folded to lowercase by default unless enclosed in double quotes (e.g., CREATE TABLE MyTable creates mytable). 
Example DDL Script

```sql
-- Create a new table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2)
);

-- Modify the table
ALTER TABLE employees ADD COLUMN hire_date DATE DEFAULT CURRENT_DATE;

-- Delete the table
DROP TABLE employees;
```



### verify imported data

```sql
SELECT COUNT(*) AS customers_count FROM customers;
SELECT COUNT(*) AS products_count FROM products;
SELECT COUNT(*) AS sellers_count FROM sellers;
SELECT COUNT(*) AS orders_count FROM orders;
SELECT COUNT(*) AS order_items_count FROM order_items;

-- List all tables
\dt
```