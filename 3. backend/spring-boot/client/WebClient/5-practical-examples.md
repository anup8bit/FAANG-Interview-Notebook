# WebClient - Practical Implementation Examples

## 1. Complete User Service Implementation

```java
// Model Classes
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
    private int age;
    private LocalDateTime createdAt;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {
    private String name;
    private String email;
    private int age;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String name;
    private String email;
    private int age;
}

// Exception Classes
public class ApiException extends RuntimeException {
    private int statusCode;
    
    public ApiException(String message) {
        super(message);
    }
    
    public ApiException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    
    public int getStatusCode() { return statusCode; }
}

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message) {
        super(message, 404);
    }
}

// Configuration
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(new ReactorClientHttpConnector(httpClient()))
            .filter(authorizationFilter())
            .filter(loggingFilter())
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
    
    @Bean
    public HttpClient httpClient() {
        return HttpClient.create(
            ConnectionProvider.builder("custom")
                .maxConnections(100)
                .maxIdleTime(Duration.ofSeconds(60))
                .build()
        )
        .responseTimeout(Duration.ofSeconds(10))
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000);
    }
    
    @Bean
    public ExchangeFilterFunction authorizationFilter() {
        return (request, next) -> next.exchange(ClientRequest
            .from(request.getRequest())
            .header("Authorization", "Bearer YOUR_TOKEN")
            .build());
    }
    
    @Bean
    public ExchangeFilterFunction loggingFilter() {
        return ExchangeFilterFunction.ofRequestAndResponseProcessor(
            clientRequest -> {
                System.out.println("Request: " + clientRequest.getURL());
                return Mono.just(clientRequest);
            },
            clientResponse -> {
                System.out.println("Response: " + clientResponse.getStatusCode());
                return Mono.just(clientResponse);
            }
        );
    }
}

// Service Implementation
@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private WebClient webClient;
    
    // 1. GET - Fetch single user
    public Mono<User> getUserById(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .onStatus(
                status -> status.value() == 404,
                response -> Mono.error(new ResourceNotFoundException("User not found"))
            )
            .bodyToMono(User.class)
            .doOnError(error -> logger.error("Failed to get user {}", userId, error));
    }
    
    // 2. GET - Fetch all users
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class)
            .doOnError(error -> logger.error("Failed to get all users", error));
    }
    
    // 3. GET - Fetch with query parameters
    public Flux<User> searchUsers(String name, int age) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/users")
                .queryParam("name", name)
                .queryParam("age", age)
                .build())
            .retrieve()
            .bodyToFlux(User.class)
            .doOnError(error -> logger.error("Failed to search users", error));
    }
    
    // 4. GET - With ResponseEntity (to get headers)
    public Mono<ResponseEntity<User>> getUserWithHeaders(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .toEntity(User.class)
            .doOnError(error -> logger.error("Failed to get user {}", userId, error));
    }
    
    // 5. POST - Create user
    public Mono<User> createUser(CreateUserRequest request) {
        return webClient.post()
            .uri("/users")
            .bodyValue(request)
            .retrieve()
            .onStatus(
                status -> status.value() == 400,
                response -> Mono.error(new ApiException("Invalid request", 400))
            )
            .bodyToMono(User.class)
            .doOnError(error -> logger.error("Failed to create user", error));
    }
    
    // 6. POST - With custom headers
    public Mono<User> createUserWithAuth(CreateUserRequest request, String token) {
        return webClient.post()
            .uri("/users")
            .header("Authorization", "Bearer " + token)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(User.class)
            .doOnError(error -> logger.error("Failed to create user", error));
    }
    
    // 7. PUT - Update user
    public Mono<User> updateUser(Long userId, UpdateUserRequest request) {
        return webClient.put()
            .uri("/users/{id}", userId)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(User.class)
            .doOnError(error -> logger.error("Failed to update user {}", userId, error));
    }
    
    // 8. PATCH - Partial update
    public Mono<User> patchUser(Long userId, Map<String, Object> updates) {
        return webClient.patch()
            .uri("/users/{id}", userId)
            .bodyValue(updates)
            .retrieve()
            .bodyToMono(User.class)
            .doOnError(error -> logger.error("Failed to patch user {}", userId, error));
    }
    
    // 9. DELETE - Delete user
    public Mono<Void> deleteUser(Long userId) {
        return webClient.delete()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(Void.class)
            .doOnError(error -> logger.error("Failed to delete user {}", userId, error));
    }
    
    // 10. Retry logic
    public Mono<User> getUserWithRetry(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(100))
                .maxBackoff(Duration.ofSeconds(5)))
            .doOnError(error -> logger.error("Failed to get user {} after retries", userId, error));
    }
    
    // 11. Timeout handling
    public Mono<User> getUserWithTimeout(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .timeout(Duration.ofSeconds(5))
            .onErrorMap(TimeoutException.class, 
                ex -> new ApiException("Request timeout", 504));
    }
    
    // 12. Combine multiple requests
    public Mono<Map<String, Object>> getUserWithPosts(Long userId) {
        Mono<User> userMono = getUserById(userId);
        Mono<List<String>> postsMono = webClient.get()
            .uri("/users/{id}/posts", userId)
            .retrieve()
            .bodyToFlux(String.class)
            .collectList();
        
        return Mono.zip(userMono, postsMono)
            .map(tuple -> Map.of(
                "user", tuple.getT1(),
                "posts", tuple.getT2()
            ));
    }
    
    // 13. Stream large collection
    public Flux<User> streamAllUsers() {
        return webClient.get()
            .uri("/users/stream")
            .retrieve()
            .bodyToFlux(User.class)
            .buffer(100)
            .flatMap(batch -> Flux.fromIterable(batch)
                .doOnNext(user -> logger.info("Processing user: {}", user.getId())));
    }
    
    // 14. Error handling with fallback
    public Mono<User> getUserWithFallback(Long userId, User fallback) {
        return getUserById(userId)
            .onErrorReturn(fallback);
    }
}

// REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .onErrorReturn(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/search")
    public Flux<User> searchUsers(
            @RequestParam String name,
            @RequestParam int age) {
        return userService.searchUsers(name, age);
    }
    
    @PostMapping
    public Mono<ResponseEntity<User>> createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request)
            .map(user -> ResponseEntity.status(HttpStatus.CREATED).body(user));
    }
    
    @PutMapping("/{id}")
    public Mono<ResponseEntity<User>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request)
            .map(ResponseEntity::ok);
    }
    
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id)
            .map(_ -> ResponseEntity.noContent().<Void>build());
    }
}
```

---

## 2. Test Cases

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    private WebTestClient webTestClient;
    
    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
            .baseUrl("https://api.example.com")
            .build();
    }
    
    @Test
    void testGetUserById() {
        userService.getUserById(1L)
            .as(StepVerifier::create)
            .expectNextMatches(user -> user.getName().equals("John"))
            .verifyComplete();
    }
    
    @Test
    void testGetAllUsers() {
        userService.getAllUsers()
            .as(StepVerifier::create)
            .expectNextCount(3)
            .verifyComplete();
    }
    
    @Test
    void testCreateUser() {
        CreateUserRequest request = new CreateUserRequest("Jane", "jane@example.com", 25);
        
        userService.createUser(request)
            .as(StepVerifier::create)
            .expectNextMatches(user -> user.getName().equals("Jane"))
            .verifyComplete();
    }
    
    @Test
    void testUserNotFound() {
        userService.getUserById(999L)
            .as(StepVerifier::create)
            .expectError(ResourceNotFoundException.class)
            .verify();
    }
    
    @Test
    void testGetUserWithRetry() {
        userService.getUserWithRetry(1L)
            .as(StepVerifier::create)
            .expectNextCount(1)
            .verifyComplete();
    }
    
    @Test
    void testGetUserWithTimeout() {
        userService.getUserWithTimeout(1L)
            .as(StepVerifier::create)
            .expectNextCount(1)
            .verifyComplete();
    }
}
```

---

## 3. Real-World Scenarios

### Scenario 1: Service-to-Service Communication

```java
@Service
public class OrderService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<OrderWithUserDetails> getOrderWithUserDetails(Long orderId) {
        return webClient.get()
            .uri("/orders/{id}", orderId)
            .retrieve()
            .bodyToMono(Order.class)
            .flatMap(order -> webClient.get()
                .uri("/users/{id}", order.getUserId())
                .retrieve()
                .bodyToMono(User.class)
                .map(user -> new OrderWithUserDetails(order, user))
            );
    }
}
```

### Scenario 2: Batch Processing

```java
@Service
public class BatchProcessingService {
    
    @Autowired
    private WebClient webClient;
    
    public Flux<ProcessedUser> processBatch(List<Long> userIds) {
        return Flux.fromIterable(userIds)
            .flatMap(userId -> webClient.get()
                .uri("/users/{id}", userId)
                .retrieve()
                .bodyToMono(User.class)
            )
            .map(this::processUser)
            .buffer(50)  // Buffer 50 items
            .flatMap(batch -> Flux.fromIterable(batch));
    }
    
    private ProcessedUser processUser(User user) {
        return new ProcessedUser(user.getId(), user.getName().toUpperCase());
    }
}
```

### Scenario 3: Circuit Breaker Protection

```java
@Service
@CircuitBreaker(name = "userService", fallbackMethod = "fallbackGetUser")
public class ResilientUserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    public Mono<User> fallbackGetUser(Long userId, Exception e) {
        return Mono.just(User.builder()
            .id(userId)
            .name("Fallback User")
            .email("fallback@example.com")
            .build());
    }
}
```

---

## Key Takeaways

✓ **Non-blocking**: WebClient doesn't block threads
✓ **Reactive**: Return Mono/Flux from service methods
✓ **Composable**: Chain operations with map, flatMap, etc.
✓ **Testable**: Use StepVerifier for testing reactive streams
✓ **Efficient**: Reuse single WebClient instance
✓ **Resilient**: Implement retry, circuit breaker, timeout
✓ **Streaming**: Process large datasets without loading all into memory
