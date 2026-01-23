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