# FeignClient - Best Practices & Advanced Patterns

## 1. Interface Design Patterns

### 1.1 Single Responsibility

```java
// ✓ CORRECT: Separate interfaces for different resources
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
}

@FeignClient(name = "order-service", url = "https://api.example.com")
public interface OrderServiceClient {
    @GetMapping("/orders/{id}")
    Order getOrder(@PathVariable Long id);
    
    @PostMapping("/orders")
    Order createOrder(@RequestBody CreateOrderRequest request);
}

// ✗ WRONG: Mixed responsibilities
@FeignClient(name = "service", url = "https://api.example.com")
public interface AllServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @GetMapping("/orders/{id}")
    Order getOrder(@PathVariable Long id);
}
```

### 1.2 Reusable Clients

```java
// Base interface for common operations
public interface BaseClient<T> {
    @GetMapping("/{id}")
    T getById(@PathVariable Long id);
    
    @GetMapping
    List<T> getAll();
    
    @PostMapping
    T create(@RequestBody T entity);
}

// Specific client extending base
@FeignClient(name = "user-service", url = "https://api.example.com/users")
public interface UserServiceClient extends BaseClient<User> {
    
    @GetMapping("/search")
    List<User> search(@RequestParam String name);
}
```

---

## 2. Parameterized Clients

### 2.1 Dynamic Base URL

```java
@FeignClient(name = "dynamic-service")
public interface DynamicServiceClient {
    
    @GetMapping("/{basePath}/{id}")
    Object getResource(
            @PathVariable String basePath,
            @PathVariable Long id);
}
```

### 2.2 Configuration-Based URLs

```yaml
services:
  user-service:
    url: https://user-api.example.com
  order-service:
    url: https://order-api.example.com
```

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public UserServiceClient userServiceClient(
            @Value("${services.user-service.url}") String url) {
        return Feign.builder()
            .decoder(new JacksonDecoder())
            .encoder(new JacksonEncoder())
            .target(UserServiceClient.class, url);
    }
}
```

---

## 3. Testing FeignClient

### 3.1 Mocking with MockMvc

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserServiceClientTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserServiceClient userServiceClient;
    
    @Test
    void testGetUser() throws Exception {
        User expectedUser = User.builder()
            .id(1L)
            .name("John")
            .email("john@example.com")
            .build();
        
        when(userServiceClient.getUser(1L))
            .thenReturn(expectedUser);
        
        mockMvc.perform(get("/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"));
    }
}
```

### 3.2 Testing with WireMock

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserServiceClientWireMockTest {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @BeforeEach
    void setup() {
        WireMock.reset();
    }
    
    @Test
    void testGetUser() {
        User expectedUser = User.builder()
            .id(1L)
            .name("John")
            .email("john@example.com")
            .build();
        
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/users/1"))
            .willReturn(WireMock.aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(asJsonString(expectedUser))));
        
        User result = userServiceClient.getUser(1L);
        
        assertEquals("John", result.getName());
    }
    
    private String asJsonString(Object obj) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(obj);
    }
}
```

---

## 4. Common Pitfalls

### 4.1 Not Enabling FeignClient Scanning

```java
// ✗ WRONG: Missing @EnableFeignClients
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// ✓ CORRECT: Enable FeignClient scanning
@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.client")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 4.2 Missing Error Handling

```java
// ✗ WRONG: No error handling
@Service
public class BadUserService {
    
    @Autowired
    private UserServiceClient client;
    
    public User getUser(Long id) {
        return client.getUser(id);  // Throws FeignException on error
    }
}

// ✓ CORRECT: Implement error handling
@Service
public class GoodUserService {
    
    @Autowired
    private UserServiceClient client;
    
    public Optional<User> getUser(Long id) {
        try {
            return Optional.of(client.getUser(id));
        } catch (FeignException e) {
            logger.error("Failed to get user {}", id, e);
            return Optional.empty();
        }
    }
}
```

### 4.3 Blocking in High-Load Scenarios

```java
// Note: FeignClient is synchronous and blocking
// For high-load scenarios, consider WebClient

@Service
public class UserService {
    
    @Autowired
    private UserServiceClient client;
    
    // This blocks the thread
    public User getUser(Long id) {
        return client.getUser(id);  // Synchronous, blocking
    }
}
```

### 4.4 Not Configuring Timeouts

```java
// ✗ WRONG: Default timeout is very long
feign:
  client:
    config:
      default:
        # No timeout configured!

// ✓ CORRECT: Set reasonable timeouts
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
```

### 4.5 Not Using Custom ErrorDecoder

```java
// ✗ WRONG: All errors become FeignException
try {
    User user = client.getUser(999);
} catch (FeignException e) {
    // Can't distinguish between 404, 500, etc.
}

// ✓ CORRECT: Use custom ErrorDecoder
try {
    User user = client.getUser(999);
} catch (ResourceNotFoundException e) {
    // Handle 404 specifically
} catch (ServerErrorException e) {
    // Handle 5xx specifically
}
```

---

## 5. Performance Optimization

### 5.1 Connection Pooling

```java
@Configuration
public class PerformanceFeignConfig {
    
    @Bean
    public Client httpClient() {
        return new ApacheHttpClient(
            HttpClientBuilder.create()
                .setMaxConnTotal(200)          // More connections
                .setMaxConnPerRoute(50)        // More per-route
                .setConnectionTimeToLive(60, TimeUnit.SECONDS)
                .build()
        );
    }
}
```

### 5.2 Request Compression

```yaml
feign:
  compression:
    request:
      enabled: true
      min-request-size: 1024  # Compress requests > 1KB
    response:
      enabled: true           # Decompress responses
```

### 5.3 Caching

```java
@Service
public class CachedUserService {
    
    @Autowired
    private UserServiceClient client;
    
    private final ConcurrentHashMap<Long, User> cache = new ConcurrentHashMap<>();
    
    @Cacheable(value = "users", key = "#id")
    public User getUser(Long id) {
        return cache.computeIfAbsent(id, key -> client.getUser(key));
    }
    
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        client.deleteUser(id);
    }
}
```

---

## 6. Service Discovery Integration

### 6.1 Eureka Integration

```java
// client application
@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}

@FeignClient(name = "user-service")  // Service name from Eureka
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}

// application.yml
spring:
  application:
    name: order-service

eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka-server:8761/eureka/
```

### 6.2 Load Balancing with Service Discovery

```
┌─────────────────┐
│ Order Service   │
│ (Feign Client)  │
└────────┬────────┘
         │
    Feign + Ribbon/LoadBalancer
         │
    ┌────┴────┬────────────┐
    │          │            │
    ▼          ▼            ▼
┌──────┐  ┌──────┐    ┌──────┐
│User  │  │User  │    │User  │
│Svc 1 │  │Svc 2 │    │Svc 3 │
└──────┘  └──────┘    └──────┘
    ▲          ▲            ▲
    └────┬─────┴────┬───────┘
         │          │
    Eureka Service Registry
```

---

## 7. Composing Multiple Requests

### 7.1 Sequential Calls

```java
@Service
public class UserOrderService {
    
    @Autowired
    private UserServiceClient userClient;
    
    @Autowired
    private OrderServiceClient orderClient;
    
    public UserWithOrders getUserWithOrders(Long userId) {
        User user = userClient.getUser(userId);
        List<Order> orders = orderClient.getOrdersByUserId(userId);
        
        return UserWithOrders.builder()
            .user(user)
            .orders(orders)
            .build();
    }
}
```

### 7.2 Parallel Calls with CompletableFuture

```java
@Service
public class ParallelCallService {
    
    @Autowired
    private UserServiceClient userClient;
    
    @Autowired
    private OrderServiceClient orderClient;
    
    public CompletableFuture<UserWithOrders> getUserWithOrdersAsync(Long userId) {
        CompletableFuture<User> userFuture = CompletableFuture
            .supplyAsync(() -> userClient.getUser(userId));
        
        CompletableFuture<List<Order>> ordersFuture = CompletableFuture
            .supplyAsync(() -> orderClient.getOrdersByUserId(userId));
        
        return CompletableFuture.allOf(userFuture, ordersFuture)
            .thenApply(_ -> UserWithOrders.builder()
                .user(userFuture.join())
                .orders(ordersFuture.join())
                .build());
    }
}
```

---

## 8. Configuration Best Practices

```yaml
feign:
  client:
    config:
      # Global defaults
      default:
        connectTimeout: 5000
        readTimeout: 10000
        loggerLevel: basic
        errorDecoder: com.example.CustomErrorDecoder
        requestInterceptors:
          - com.example.AuthInterceptor
      
      # Per-client overrides
      user-service:
        connectTimeout: 3000
        readTimeout: 8000
        loggerLevel: full
      
      order-service:
        connectTimeout: 4000
        readTimeout: 9000
  
  # HTTP client settings
  httpclient:
    enabled: true
    max-connections: 100
    max-connections-per-route: 20
  
  # Compression
  compression:
    request:
      enabled: true
      min-request-size: 2048
    response:
      enabled: true

# Logging
logging:
  level:
    feign.Logger: DEBUG
    com.example.client: DEBUG
```

---

## Key Patterns and Principles

| Pattern | Use Case |
|---------|----------|
| Single Interface | One resource type per interface |
| Base Interface | Common CRUD operations |
| Multiple Fallbacks | Different fallback logic |
| Circuit Breaker | Prevent cascade failures |
| Retry + Circuit Breaker | Combine for resilience |
| Service Discovery | Dynamic endpoint resolution |
| Request Interceptor | Common headers/auth |
| Custom ErrorDecoder | Specific exception handling |

---

## Key Points Summary

✓ **Use @EnableFeignClients** at application startup
✓ **Implement ErrorDecoder** for error handling
✓ **Set appropriate timeouts** to prevent hanging
✓ **Use Fallback or FallbackFactory** for graceful degradation
✓ **Implement Retryer** for transient failures
✓ **Use Circuit Breaker** to prevent cascade failures
✓ **Configure connection pooling** for performance
✓ **Implement RequestInterceptor** for cross-cutting concerns
✓ **Test with MockMvc or WireMock**
✓ **Use service discovery** for dynamic endpoints
✓ **Compose multiple clients** with CompletableFuture for parallel calls
✓ **Log appropriately** for debugging
