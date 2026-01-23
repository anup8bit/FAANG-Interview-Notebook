```java
CompletableFuture<Map<String, Long>> statusCount =
    CompletableFuture.supplyAsync(orderRepo::countByStatus, executor);

CompletableFuture<BigDecimal> totalRevenue =
    CompletableFuture.supplyAsync(orderRepo::totalRevenue, executor);

CompletableFuture<Double> avgDeliveryTime =
    CompletableFuture.supplyAsync(orderRepo::avgDeliveryDays, executor);

CompletableFuture.allOf(statusCount, totalRevenue, avgDeliveryTime).join();
```

### 🧠 Threading Strategy (Production)
Use custom ThreadPoolTaskExecutor
Keep DB connection pool ≥ max threads
Cache heavy aggregations (Redis)
Use read-replica DB if possible
