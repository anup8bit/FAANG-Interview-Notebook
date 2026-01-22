***In PostgreSQL, Data Manipulation Language (DML) commands are used to view, add, modify, or remove data within existing database structures.***


### Core DML Commands
***SELECT:*** Retrieves data from one or more tables. While often categorized separately as DQL (Data Query Language), it is functionally the primary tool for data access.
***INSERT:*** Adds new rows to a table. PostgreSQL supports the INSERT ... ON CONFLICT ("upsert") clause to handle duplicate entries by updating them instead of failing.
***UPDATE:*** Modifies existing records based on a WHERE condition.
***DELETE:*** Removes specific rows from a table.
***MERGE:*** Introduced in PostgreSQL 15, this command synchronizes data by conditionally performing INSERT, UPDATE, or DELETE actions in a single statement. 


```sql
-- Standard Update with Returning (PostgreSQL 18 style)
UPDATE employees 
SET salary = salary * 1.10 
WHERE department = 'Sales'
RETURNING OLD.salary AS old_pay, NEW.salary AS new_pay;
```
