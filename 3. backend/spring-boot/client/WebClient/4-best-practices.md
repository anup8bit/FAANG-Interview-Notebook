# WebClient - Best Practices & Advanced Patterns

## 1. When to Block and When to Subscribe

### 1.1 Blocking (Use Cautiously)

```java
// ✗ AVOID: Blocks thread, defeats purpose of WebClient
@RestController
@RequestMapping("/users")
public class BadUserController {
    
    @Autowired
    private WebClient webClient;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        // Blocks thread waiting for response
        User user = webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class)
            .block();  // ✗ Blocks!
        
        return ResponseEntity.ok(user);
    }
}

// ✓ GOOD: Blocks only when necessary
@Component
@CommandLineRunner
public class DataInitializer {
    
    @Autowired
    private WebClient webClient;
    
    @Override
    public void run(String... args) throws Exception {
        // Blocking is OK in initialization context
        User user = webClient.get()
            .uri("/users/1")
            .retrieve()
            .bodyToMono(User.class)
            .block();  // ✓ OK for one-time init
        
        System.out.println("Initialized with: " + user);
    }
}
```

### 1.2 Non-Blocking with Reactive Responses

```java
// ✓ CORRECT: Return Mono/Flux from controller
@RestController
@RequestMapping("/users")
public class GoodUserController {
    
    @Autowired
    private WebClient webClient;
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class)
            .map(ResponseEntity::ok)
            .onErrorReturn(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);
    }
}
```

---

## 2. Thread Safety

### 2.1 WebClient is Thread-Safe

```java
// ✓ CORRECT: Single bean shared across threads
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .build();
    }
}

@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;  // Thread-safe, shared across threads
    
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
}

// ✗ WRONG: Creating new instance per request
@Service
public class BadUserService {
    
    public Mono<User> getUser(Long userId) {
        WebClient webClient = WebClient.create();  // ✗ New instance!
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

---

## 3. Resource Management

### 3.1 Connection Pooling

```java
@Configuration
public class OptimizedWebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create(
                    ConnectionProvider.builder("custom")
                        .maxConnections(100)
                        .maxIdleTime(Duration.ofSeconds(60))
                        .build()
                )))
            .build();
    }
}
```

### 3.2 Proper Cleanup

```java
// ✓ CORRECT: Disposable is managed by Spring
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient() {
        return WebClient.create();
    }
    
    // Spring automatically manages lifecycle
}

// For manual management
@Component
public class WebClientManager implements DisposableBean {
    
    private ReactorResourceFactory resourceFactory;
    
    @Override
    public void destroy() throws Exception {
        resourceFactory.dispose();
    }
}
```

---

## 4. Performance Optimization

### 4.1 Connection Reuse

```java
@Configuration
public class PerformanceWebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create(
                    ConnectionProvider.builder("custom")
                        .maxConnections(200)
                        .maxIdleTime(Duration.ofSeconds(120))
                        .build()
                )
                .keepAlive(true)))
            .build();
    }
}
```

### 4.2 Streaming Large Responses

```java
@Service
public class LargeDataService {
    
    @Autowired
    private WebClient webClient;
    
    // Stream data instead of loading all at once
    public Flux<DataChunk> streamLargeData() {
        return webClient.get()
            .uri("/large-data")
            .retrieve()
            .bodyToFlux(DataChunk.class)
            .buffer(100)  // Process in batches of 100
            .flatMap(this::processBatch);
    }
    
    private Flux<DataChunk> processBatch(List<DataChunk> batch) {
        return Flux.fromIterable(batch)
            .doOnNext(chunk -> System.out.println("Processing: " + chunk));
    }
}
```

### 4.3 Caching

```java
@Service
public class CachedUserService {
    
    @Autowired
    private WebClient webClient;
    
    private final ConcurrentHashMap<Long, User> cache = new ConcurrentHashMap<>();
    
    public Mono<User> getUser(Long userId) {
        return Mono.justOrEmpty(cache.get(userId))
            .switchIfEmpty(
                webClient.get()
                    .uri("/users/{id}", userId)
                    .retrieve()
                    .bodyToMono(User.class)
                    .doOnNext(user -> cache.put(userId, user))
                    .cacheResult()  // Cache the result
            );
    }
}
```

---

## 5. Testing with WebTestClient

### 5.1 Unit Testing

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private WebTestClient webTestClient;
    
    @MockBean
    private WebClient webClient;
    
    @Test
    void testGetUser() {
        User expectedUser = User.builder()
            .id(1L)
            .name("John Doe")
            .email("john@example.com")
            .build();
        
        when(webClient.get()
            .uri("/users/1")
            .retrieve()
            .bodyToMono(User.class))
            .thenReturn(Mono.just(expectedUser));
        
        webTestClient.get()
            .uri("/users/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(User.class)
            .isEqualTo(expectedUser);
    }
}
```

### 5.2 Integration Testing with WireMock

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserServiceIntegrationTest {
    
    @Autowired
    private WebTestClient webTestClient;
    
    @BeforeEach
    void setup() {
        WireMock.reset();
    }
    
    @Test
    void testGetUserIntegration() {
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/users/1"))
            .willReturn(WireMock.aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{\"id\": 1, \"name\": \"John\", \"email\": \"john@example.com\"}")));
        
        webTestClient.get()
            .uri("/users/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.name").isEqualTo("John");
    }
}
```

---

## 6. Common Pitfalls

### 6.1 Not Subscribing

```java
// ✗ WRONG: Nothing happens without subscription
@Service
public class BadService {
    
    @Autowired
    private WebClient webClient;
    
    public void fetchUser(Long userId) {
        webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
        // No subscribe! Nothing happens
    }
}

// ✓ CORRECT: Subscribe or return Mono
@Service
public class GoodService {
    
    @Autowired
    private WebClient webClient;
    
    // Approach 1: Return Mono
    public Mono<User> fetchUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    // Approach 2: Subscribe explicitly
    public void fetchUserAsync(Long userId) {
        webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .subscribe(user -> System.out.println(user));
    }
}
```

### 6.2 Blocking When Not Needed

```java
// ✗ WRONG: Blocks all threads
@RestController
public class BadController {
    
    @Autowired
    private WebClient webClient;
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class)
            .block();  // ✗ Blocks thread pool!
        
        return ResponseEntity.ok(user);
    }
}

// ✓ CORRECT: Return reactive type
@RestController
public class GoodController {
    
    @Autowired
    private WebClient webClient;
    
    @GetMapping("/users/{id}")
    public Mono<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class)
            .map(ResponseEntity::ok);  // ✓ Non-blocking
    }
}
```

### 6.3 Memory Leaks with Large Responses

```java
// ✗ WRONG: Loads all data into memory
@Service
public class BadService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<List<User>> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class)
            .collectList();  // ✗ Loads all at once!
    }
}

// ✓ CORRECT: Stream data
@Service
public class GoodService {
    
    @Autowired
    private WebClient webClient;
    
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);  // ✓ Streams data
    }
}
```

---

## 7. Migration from RestTemplate to WebClient

### 7.1 RestTemplate vs WebClient

```java
// RestTemplate Version
@Service
public class UserServiceRest {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
}

// WebClient Version
@Service
public class UserServiceWeb {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### 7.2 Migration Strategy

```
1. Keep RestTemplate for existing code
2. Use WebClient for new endpoints
3. Gradually migrate endpoint by endpoint
4. Use Mono.defer() for legacy synchronous code if needed
5. Update tests to use WebTestClient
```

---

## 8. Reactive Best Practices

### 8.1 Composition Over Imperative

```java
// ✗ IMPERATIVE (Avoid)
@Service
public class ImperativeService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<UserProfile> getUserProfile(Long userId) {
        User user = webClient.get().uri("/users/{id}", userId)
            .retrieve().bodyToMono(User.class).block();
        
        Posts posts = webClient.get().uri("/posts?userId={id}", userId)
            .retrieve().bodyToMono(Posts.class).block();
        
        return Mono.just(new UserProfile(user, posts));
    }
}

// ✓ REACTIVE (Preferred)
@Service
public class ReactiveService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<UserProfile> getUserProfile(Long userId) {
        return Mono.zip(
            webClient.get().uri("/users/{id}", userId)
                .retrieve().bodyToMono(User.class),
            webClient.get().uri("/posts?userId={id}", userId)
                .retrieve().bodyToMono(Posts.class)
        ).map(tuple -> new UserProfile(tuple.getT1(), tuple.getT2()));
    }
}
```

### 8.2 Backpressure Handling

```java
@Service
public class BackpressureService {
    
    @Autowired
    private WebClient webClient;
    
    public Flux<User> streamUsersWithBackpressure() {
        return webClient.get()
            .uri("/users/stream")
            .retrieve()
            .bodyToFlux(User.class)
            .onBackpressureBuffer(100)  // Buffer up to 100 items
            .delayElement(Duration.ofMillis(100));  // Delay processing
    }
}
```

---

## Key Differences: RestTemplate vs WebClient

| Feature | RestTemplate | WebClient |
|---------|-------------|-----------|
| Blocking | Yes | No |
| Returns | Object | Mono/Flux |
| Thread Model | Sync | Async |
| Thread Pool | Large | Small |
| Memory | Higher | Lower |
| Performance | Good | Better |
| Testing | RestTestClient | WebTestClient |
| Deprecated | Spring 6.0+ | No |

---

## Key Points Summary

✓ **Return Mono/Flux** from controller methods
✓ **Avoid blocking** in production code
✓ **Use WebClient.Builder** for configuration
✓ **Share WebClient instance** across application
✓ **Stream large responses** instead of loading all at once
✓ **Handle errors** properly with onErrorMap/onErrorResume
✓ **Use filters** for cross-cutting concerns
✓ **Test with WebTestClient** for integration tests
✓ **Implement caching** where appropriate
✓ **Monitor backpressure** for streaming scenarios
