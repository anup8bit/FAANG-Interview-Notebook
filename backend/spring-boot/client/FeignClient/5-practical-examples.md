# FeignClient - Practical Examples & Real-World Scenarios

## 1. Complete Microservice Communication Example

### 1.1 User Service Client

```java
// UserServiceClient.java
@FeignClient(
    name = "user-service",
    url = "${user-service.url:http://localhost:8081}",
    configuration = UserServiceFeignConfig.class
)
public interface UserServiceClient {
    
    @GetMapping("/api/users/{id}")
    ResponseEntity<UserDTO> getUserById(@PathVariable Long id);
    
    @GetMapping("/api/users")
    ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    );
    
    @PostMapping("/api/users")
    ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request);
    
    @PutMapping("/api/users/{id}")
    ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    );
    
    @DeleteMapping("/api/users/{id}")
    ResponseEntity<Void> deleteUser(@PathVariable Long id);
    
    @GetMapping("/api/users/search")
    ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page
    );
}
```

### 1.2 Product Service Client

```java
@FeignClient(
    name = "product-service",
    url = "${product-service.url:http://localhost:8082}",
    configuration = ProductServiceFeignConfig.class
)
public interface ProductServiceClient {
    
    @GetMapping("/api/products/{id}")
    ResponseEntity<ProductDTO> getProductById(@PathVariable Long id);
    
    @PostMapping("/api/products/{productId}/inventory")
    ResponseEntity<InventoryDTO> decreaseInventory(
            @PathVariable Long productId,
            @RequestBody InventoryRequest request
    );
    
    @GetMapping("/api/products/{productId}/price")
    ResponseEntity<BigDecimal> getProductPrice(@PathVariable Long productId);
    
    @PostMapping("/api/products/batch")
    ResponseEntity<List<ProductDTO>> getProductsByIds(
            @RequestBody List<Long> productIds
    );
}
```

### 1.3 Feign Configuration

```java
@Configuration
public class UserServiceFeignConfig {
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new UserServiceErrorDecoder();
    }
    
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new UserServiceRequestInterceptor();
    }
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(100, 1000, 3);
    }
    
    @Bean
    public Client httpClient() {
        return new ApacheHttpClient(
            HttpClientBuilder.create()
                .setMaxConnTotal(100)
                .setMaxConnPerRoute(20)
                .build()
        );
    }
}

@Configuration
public class ProductServiceFeignConfig {
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new ProductServiceErrorDecoder();
    }
    
    @Bean
    public RequestInterceptor authInterceptor() {
        return new AuthInterceptor();
    }
}
```

### 1.4 Domain Models

```java
// DTOs
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUserRequest {
    @NotBlank
    private String name;
    @Email
    private String email;
    @NotBlank
    private String phone;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequest {
    private String name;
    private String email;
    private String phone;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String category;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryRequest {
    private Integer quantity;
    private String reason;
}
```

### 1.5 Service Layer Implementation

```java
@Service
@Slf4j
public class UserService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    @CircuitBreaker(
        name = "userServiceCircuitBreaker",
        fallbackMethod = "fallbackGetUser"
    )
    @Retry(
        name = "userServiceRetry",
        fallbackMethod = "fallbackGetUser"
    )
    public UserDTO getUser(Long id) {
        try {
            ResponseEntity<UserDTO> response = userServiceClient.getUserById(id);
            return response.getBody();
        } catch (FeignException e) {
            log.error("Error fetching user {}: {}", id, e.getMessage());
            throw new UserServiceException("Failed to fetch user: " + id, e);
        }
    }
    
    public UserDTO fallbackGetUser(Long id, Throwable throwable) {
        log.warn("Fallback triggered for user {}: {}", id, throwable.getMessage());
        return UserDTO.builder()
            .id(id)
            .name("Unknown User")
            .build();
    }
    
    public List<UserDTO> getAllUsers(int page, int size) {
        try {
            ResponseEntity<List<UserDTO>> response = 
                userServiceClient.getAllUsers(page, size);
            return response.getBody();
        } catch (FeignException.NotFound e) {
            log.error("Users not found");
            return Collections.emptyList();
        }
    }
    
    public UserDTO createUser(CreateUserRequest request) {
        // Validate input
        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidRequestException("User name cannot be blank");
        }
        
        try {
            ResponseEntity<UserDTO> response = 
                userServiceClient.createUser(request);
            return response.getBody();
        } catch (FeignException.BadRequest e) {
            log.error("Invalid user request: {}", e.contentUTF8());
            throw new InvalidRequestException("Failed to create user", e);
        }
    }
    
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        try {
            ResponseEntity<UserDTO> response = 
                userServiceClient.updateUser(id, request);
            return response.getBody();
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
    }
    
    public void deleteUser(Long id) {
        try {
            userServiceClient.deleteUser(id);
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
    }
    
    public List<UserDTO> searchUsers(String keyword, int page) {
        try {
            ResponseEntity<List<UserDTO>> response = 
                userServiceClient.searchUsers(keyword, page);
            return response.getBody();
        } catch (Exception e) {
            log.error("Error searching users: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}

@Service
@Slf4j
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    public OrderDTO createOrder(CreateOrderRequest request) {
        // Validate user exists
        UserDTO user = userServiceClient.getUserById(request.getUserId()).getBody();
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Validate and fetch products
        List<ProductDTO> products = productServiceClient
            .getProductsByIds(
                request.getOrderItems().stream()
                    .map(OrderItemRequest::getProductId)
                    .collect(Collectors.toList())
            ).getBody();
        
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("Products not found");
        }
        
        // Calculate total price
        BigDecimal totalPrice = request.getOrderItems().stream()
            .map(item -> item.getQuantity() 
                * products.stream()
                    .filter(p -> p.getId().equals(item.getProductId()))
                    .findFirst()
                    .map(ProductDTO::getPrice)
                    .orElse(BigDecimal.ZERO))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Decrease inventory
        for (OrderItemRequest item : request.getOrderItems()) {
            productServiceClient.decreaseInventory(
                item.getProductId(),
                new InventoryRequest(item.getQuantity(), "Order placed")
            );
        }
        
        return OrderDTO.builder()
            .userId(request.getUserId())
            .totalPrice(totalPrice)
            .items(request.getOrderItems())
            .status("CONFIRMED")
            .createdAt(LocalDateTime.now())
            .build();
    }
}
```

---

## 2. Error Handling with Custom Exceptions

```java
// Custom Exceptions
public class UserServiceException extends RuntimeException {
    public UserServiceException(String message) {
        super(message);
    }
    
    public UserServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
    
    public InvalidRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Custom Error Decoder
@Component
public class UserServiceErrorDecoder implements ErrorDecoder {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceErrorDecoder.class);
    
    @Override
    public Exception decode(String methodKey, Response response) {
        String body = "";
        try {
            if (response.body() != null) {
                body = Util.toString(response.body().asReader(StandardCharsets.UTF_8));
            }
        } catch (IOException e) {
            logger.error("Failed to read response body", e);
        }
        
        logger.error("Error from method {}: status {}, body: {}", methodKey, response.status(), body);
        
        switch (response.status()) {
            case 404:
                return new ResourceNotFoundException("Resource not found: " + body);
            case 400:
                return new InvalidRequestException("Invalid request: " + body);
            case 500:
            case 502:
            case 503:
                return new UserServiceException("Service unavailable: " + body);
            default:
                return new UserServiceException("Error calling " + methodKey + ": " + response.status());
        }
    }
}
```

---

## 3. Batch Operations

```java
@Service
@Slf4j
public class BatchProductService {
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    public List<ProductDTO> fetchProductsBatch(List<Long> productIds, int batchSize) {
        List<ProductDTO> allProducts = new ArrayList<>();
        
        // Process in batches to avoid overwhelming the service
        for (int i = 0; i < productIds.size(); i += batchSize) {
            int end = Math.min(i + batchSize, productIds.size());
            List<Long> batch = productIds.subList(i, end);
            
            try {
                List<ProductDTO> batchProducts = productServiceClient
                    .getProductsByIds(batch)
                    .getBody();
                
                if (batchProducts != null) {
                    allProducts.addAll(batchProducts);
                }
            } catch (Exception e) {
                log.error("Error fetching batch {}-{}: {}", i, end, e.getMessage());
                // Continue with next batch
            }
        }
        
        return allProducts;
    }
    
    public List<ProductDTO> fetchProductsParallel(List<Long> productIds) {
        return productIds.parallelStream()
            .map(this::fetchSingleProduct)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
    }
    
    private Optional<ProductDTO> fetchSingleProduct(Long productId) {
        try {
            return Optional.ofNullable(
                productServiceClient.getProductById(productId).getBody()
            );
        } catch (Exception e) {
            log.error("Error fetching product {}: {}", productId, e.getMessage());
            return Optional.empty();
        }
    }
}
```

---

## 4. Retry with Exponential Backoff

```java
@Configuration
public class RetryConfig {
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
            100,    // initial delay (ms)
            1000,   // max delay (ms)
            3       // max attempts
        );
    }
    
    // Custom retryer with exponential backoff
    @Bean
    public Retryer customRetryer() {
        return new Retryer() {
            private int attemptNumber = 0;
            private long sleptForMillis = 0;
            
            @Override
            public void continueOrPropagate(RetryableException e) {
                attemptNumber++;
                long intervalMillis = (long) Math.pow(2, attemptNumber - 1) * 100;
                
                if (sleptForMillis > 5000) {
                    throw e;
                }
                
                try {
                    Thread.sleep(intervalMillis);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    throw e;
                }
                sleptForMillis += intervalMillis;
            }
            
            @Override
            public Retryer clone() {
                return new Retryer() {
                    @Override
                    public void continueOrPropagate(RetryableException e) {}
                    
                    @Override
                    public Retryer clone() {
                        return this;
                    }
                };
            }
        };
    }
}
```

---

## 5. Testing with WireMock

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserServiceClientWireMockTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    static WireMockServer wireMockServer = new WireMockServer(8081);
    
    @BeforeAll
    static void setupWireMock() {
        wireMockServer.start();
    }
    
    @AfterAll
    static void teardownWireMock() {
        wireMockServer.stop();
    }
    
    @BeforeEach
    void resetWireMock() {
        WireMock.reset();
    }
    
    @Test
    void testGetUserSuccess() {
        UserDTO expectedUser = UserDTO.builder()
            .id(1L)
            .name("John Doe")
            .email("john@example.com")
            .build();
        
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/api/users/1"))
            .willReturn(WireMock.aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(asJsonString(expectedUser))));
        
        ResponseEntity<UserDTO> response = userServiceClient.getUserById(1L);
        
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("John Doe", response.getBody().getName());
    }
    
    @Test
    void testGetUserNotFound() {
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/api/users/999"))
            .willReturn(WireMock.aResponse()
                .withStatus(404)
                .withBody("{\"message\": \"User not found\"}")));
        
        assertThrows(FeignException.NotFound.class, 
            () -> userServiceClient.getUserById(999L));
    }
    
    @Test
    void testCreateUserSuccess() {
        CreateUserRequest request = CreateUserRequest.builder()
            .name("Jane Doe")
            .email("jane@example.com")
            .phone("123-456-7890")
            .build();
        
        UserDTO createdUser = UserDTO.builder()
            .id(2L)
            .name("Jane Doe")
            .email("jane@example.com")
            .build();
        
        WireMock.stubFor(WireMock.post(WireMock.urlEqualTo("/api/users"))
            .withRequestBody(WireMock.matchingJsonPath("$.name", WireMock.equalTo("Jane Doe")))
            .willReturn(WireMock.aResponse()
                .withStatus(201)
                .withHeader("Content-Type", "application/json")
                .withBody(asJsonString(createdUser))));
        
        ResponseEntity<UserDTO> response = userServiceClient.createUser(request);
        
        assertEquals(201, response.getStatusCodeValue());
        assertEquals("Jane Doe", response.getBody().getName());
    }
    
    @Test
    void testRetryOnTransientError() {
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/api/users/1"))
            .inScenario("retry scenario")
            .whenScenarioStateIs(Scenario.STARTED)
            .willSetStateTo("attempt 2")
            .willReturn(WireMock.aResponse().withStatus(503)));
        
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/api/users/1"))
            .inScenario("retry scenario")
            .whenScenarioStateIs("attempt 2")
            .willSetStateTo("attempt 3")
            .willReturn(WireMock.aResponse().withStatus(503)));
        
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/api/users/1"))
            .inScenario("retry scenario")
            .whenScenarioStateIs("attempt 3")
            .willReturn(WireMock.aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(asJsonString(UserDTO.builder()
                    .id(1L)
                    .name("John")
                    .build()))));
        
        // Should retry and succeed
        ResponseEntity<UserDTO> response = userServiceClient.getUserById(1L);
        assertEquals(200, response.getStatusCodeValue());
    }
    
    private String asJsonString(Object obj) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(obj);
    }
}
```

---

## 6. Monitoring and Metrics

```java
@Configuration
public class FeignMetricsConfig {
    
    @Bean
    public RequestInterceptor metricsInterceptor() {
        return new MetricsInterceptor();
    }
}

@Component
@Slf4j
public class MetricsInterceptor implements RequestInterceptor {
    
    private final MeterRegistry meterRegistry;
    
    public MetricsInterceptor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    @Override
    public void apply(RequestTemplate template) {
        // Add start time
        template.header("X-Request-Start", String.valueOf(System.currentTimeMillis()));
        template.header("X-Correlation-ID", UUID.randomUUID().toString());
    }
}

@Component
@Slf4j
public class MetricsResponseInterceptor implements ResponseInterceptor {
    
    private final MeterRegistry meterRegistry;
    
    public MetricsResponseInterceptor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    @Override
    public Object intercept(InvocationContext context) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = context.proceed();
            
            long duration = System.currentTimeMillis() - startTime;
            Timer.builder("feign.request.duration")
                .description("Feign request duration")
                .tag("method", context.getInvocation().toString())
                .tag("status", "success")
                .register(meterRegistry)
                .record(Duration.ofMillis(duration));
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            Timer.builder("feign.request.duration")
                .description("Feign request duration")
                .tag("method", context.getInvocation().toString())
                .tag("status", "error")
                .register(meterRegistry)
                .record(Duration.ofMillis(duration));
            
            throw e;
        }
    }
}
```

---

## 7. Circuit Breaker Pattern

```yaml
resilience4j:
  circuitbreaker:
    configs:
      default:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5000ms
        failureRateThreshold: 50
        recordExceptions:
          - java.net.ConnectException
          - feign.FeignException
    instances:
      userServiceCircuitBreaker:
        baseConfig: default
      productServiceCircuitBreaker:
        waitDurationInOpenState: 10000ms
  
  retry:
    configs:
      default:
        maxAttempts: 3
        waitDuration: 100ms
        retryExceptions:
          - java.net.ConnectException
          - java.net.SocketTimeoutException
    instances:
      userServiceRetry:
        baseConfig: default
```

---

## Summary

FeignClient provides a declarative, interface-based approach to HTTP communication that is:

- **Intuitive**: Write interfaces instead of imperative HTTP calls
- **Integrated**: Works seamlessly with Spring Cloud ecosystem
- **Resilient**: Built-in support for circuit breakers, retries, and fallbacks
- **Discoverable**: Integrates with service registries (Eureka, Consul)
- **Customizable**: Extensive hooks for interceptors, encoders, decoders

Use FeignClient when you need **simplified REST communication** with **service discovery** and **resilience patterns**.
