# RestTemplate - Best Practices & Advanced Patterns

## 1. Thread Safety

### 1.1 RestTemplate is Thread-Safe
RestTemplate is thread-safe when properly configured. However, follow these practices:

```java
// ✓ CORRECT: Single bean shared across threads
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;  // Thread-safe, shared across threads
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
}

// ✗ WRONG: Creating new instance per request
@Service
public class BadUserService {
    
    public User getUser(Long userId) {
        RestTemplate restTemplate = new RestTemplate();  // ✗ Inefficient
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
}
```

### 1.2 HttpHeaders are NOT Thread-Safe

```java
// ✗ WRONG: Shared mutable headers
@Service
public class BadHeaderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private HttpHeaders sharedHeaders = new HttpHeaders();  // ✗ NOT thread-safe
    
    public void makeRequest() {
        sharedHeaders.set("Authorization", getToken());
        restTemplate.getForObject("https://api.example.com/users", User.class);
    }
}

// ✓ CORRECT: Create headers per request
@Service
public class GoodHeaderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public void makeRequest() {
        HttpHeaders headers = new HttpHeaders();  // ✓ New instance per request
        headers.set("Authorization", getToken());
        
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        restTemplate.exchange("https://api.example.com/users", 
            HttpMethod.GET, entity, User.class);
    }
}
```

---

## 2. Resource Management

### 2.1 Connection Pooling

```java
@Configuration
public class OptimizedRestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        return new RestTemplate(clientHttpRequestFactory);
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        
        // Configure timeouts
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        
        // Configure connection manager
        PoolingHttpClientConnectionManager connectionManager = 
            new PoolingHttpClientConnectionManager();
        
        // Total connections across all routes
        connectionManager.setMaxTotal(100);
        
        // Connections per route (important!)
        connectionManager.setDefaultMaxPerRoute(20);
        
        factory.setHttpClient(HttpClientBuilder.create()
            .setConnectionManager(connectionManager)
            .build());
        
        return factory;
    }
}
```

### 2.2 Connection Timeout vs Read Timeout

```java
@Configuration
public class TimeoutConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // Time to establish connection
        factory.setConnectTimeout(5000);      // 5 seconds
        
        // Time to wait for response data
        factory.setReadTimeout(10000);        // 10 seconds
        
        return new RestTemplate(factory);
    }
}

// Example:
// getUser() call with timeout:
// - Connection timeout (5s): How long to wait to establish TCP connection
// - Read timeout (10s): How long to wait for response data after connection established
```

---

## 3. Testing RestTemplate

### 3.1 Using MockRestServiceServer

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserService userService;
    
    private MockRestServiceServer mockServer;
    
    @BeforeEach
    void setup() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }
    
    @Test
    void testGetUser() {
        Long userId = 1L;
        User expectedUser = User.builder()
            .id(userId)
            .name("John Doe")
            .email("john@example.com")
            .build();
        
        mockServer.expect(requestTo("https://api.example.com/users/1"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(asJsonString(expectedUser), MediaType.APPLICATION_JSON));
        
        User result = userService.getUser(userId);
        
        assertEquals(expectedUser.getName(), result.getName());
        mockServer.verify();
    }
    
    @Test
    void testCreateUser() {
        CreateUserRequest request = CreateUserRequest.builder()
            .name("Jane Doe")
            .email("jane@example.com")
            .build();
        
        User expectedUser = User.builder()
            .id(1L)
            .name("Jane Doe")
            .email("jane@example.com")
            .build();
        
        mockServer.expect(requestTo("https://api.example.com/users"))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess(asJsonString(expectedUser), MediaType.APPLICATION_JSON));
        
        User result = userService.createUser(request);
        
        assertEquals(expectedUser.getId(), result.getId());
        mockServer.verify();
    }
    
    @Test
    void testGetUserNotFound() {
        mockServer.expect(requestTo("https://api.example.com/users/999"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withStatus(HttpStatus.NOT_FOUND));
        
        assertThrows(ResourceNotFoundException.class, () -> userService.getUser(999L));
        mockServer.verify();
    }
    
    private String asJsonString(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

### 3.2 Using WireMock

```xml
<dependency>
    <groupId>com.github.tomakehurst</groupId>
    <artifactId>wiremock-jre8</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest
class UserServiceWireMockTest {
    
    @Autowired
    private UserService userService;
    
    @BeforeEach
    void setup() {
        WireMock.reset();
    }
    
    @Test
    void testGetUserWithWireMock() {
        long userId = 1L;
        
        WireMock.stubFor(WireMock.get(WireMock.urlEqualTo("/users/1"))
            .willReturn(WireMock.aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{\n" +
                    "  \"id\": 1,\n" +
                    "  \"name\": \"John Doe\",\n" +
                    "  \"email\": \"john@example.com\"\n" +
                    "}")
            ));
        
        User result = userService.getUser(userId);
        
        assertEquals("John Doe", result.getName());
        WireMock.verify(WireMock.getRequestedFor(WireMock.urlEqualTo("/users/1")));
    }
}
```

---

## 4. Performance Optimization

### 4.1 Connection Reuse

```java
@Configuration
public class PerformanceOptimizedConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        
        PoolingHttpClientConnectionManager cm = 
            new PoolingHttpClientConnectionManager();
        
        // Important: Reuse connections
        cm.setMaxTotal(200);              // More connections
        cm.setDefaultMaxPerRoute(50);     // More per-route
        
        factory.setHttpClient(HttpClientBuilder.create()
            .setConnectionManager(cm)
            .setKeepAliveStrategy((response, context) -> 60000)  // 60 seconds
            .build());
        
        return new RestTemplate(factory);
    }
}
```

### 4.2 Avoid Blocking in High-Load Scenarios

```java
// ✗ WRONG: RestTemplate is blocking
@RestController
@RequestMapping("/users")
public class BlockingUserController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = restTemplate.getForObject(  // ✗ Blocking call
            "https://api.example.com/users/{id}", User.class, id);
        return ResponseEntity.ok(user);
    }
}

// ✓ CORRECT: Use WebClient for non-blocking
@RestController
@RequestMapping("/users")
public class NonBlockingUserController {
    
    @Autowired
    private WebClient webClient;
    
    @GetMapping("/{id}")
    public Mono<User> getUser(@PathVariable Long id) {
        return webClient.get()  // ✓ Non-blocking
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

---

## 5. Migration Path: RestTemplate → WebClient

### 5.1 Comparison

| Aspect | RestTemplate | WebClient |
|--------|-------------|-----------|
| Blocking | Yes | No |
| Async | No | Yes (Mono/Flux) |
| Dependencies | spring-web | spring-webflux |
| Learning Curve | Lower | Higher |
| Performance | Good | Better |
| Modern | Legacy | Recommended |

### 5.2 Migration Example

```java
// RestTemplate Version
@Service
public class UserServiceOld {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
    
    public void deleteUser(Long userId) {
        restTemplate.delete("https://api.example.com/users/{id}", userId);
    }
}

// WebClient Version (Recommended)
@Service
public class UserServiceNew {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    public Mono<Void> deleteUser(Long userId) {
        return webClient.delete()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
```

---

## 6. Common Pitfalls

### 6.1 Not Setting Timeout

```java
// ✗ WRONG: No timeout set, requests can hang indefinitely
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();  // Default timeout is very long
}

// ✓ CORRECT: Always set timeout
@Bean
public RestTemplate restTemplate() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(5000);
    factory.setReadTimeout(10000);
    return new RestTemplate(factory);
}
```

### 6.2 Not Handling Null Response

```java
// ✗ WRONG: May cause NullPointerException
public User getUser(Long userId) {
    User user = restTemplate.getForObject(url, User.class);
    return user.getName();  // NPE if response is null
}

// ✓ CORRECT: Handle null
public Optional<User> getUser(Long userId) {
    User user = restTemplate.getForObject(url, User.class);
    return Optional.ofNullable(user);
}
```

### 6.3 Not Closing Response Stream

```java
// ✗ WRONG: Response not properly handled
public void downloadFile() {
    InputStream stream = restTemplate.getForObject(url, InputStream.class);
    // Stream not closed, resource leak
}

// ✓ CORRECT: Properly close resources
public byte[] downloadFile() {
    ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);
    return response.getBody();  // Automatically handled
}
```

### 6.4 Creating RestTemplate Per Request

```java
// ✗ WRONG: Creates new instance each time
@Service
public class BadService {
    public User getUser(Long userId) {
        RestTemplate rt = new RestTemplate();  // New instance!
        return rt.getForObject(url, User.class);
    }
}

// ✓ CORRECT: Inject and reuse
@Service
public class GoodService {
    @Autowired
    private RestTemplate restTemplate;  // Single shared instance
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(url, User.class);
    }
}
```

---

## 7. Debugging Tips

### 7.1 Enable HTTP Logging

```yaml
logging:
  level:
    org.springframework.web.client.RestTemplate: DEBUG
    org.apache.http.wire: DEBUG
    org.apache.http.headers: DEBUG
```

### 7.2 Using RestTemplate Event Listener

```java
@Component
public class RestTemplateEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(RestTemplateEventListener.class);
    
    // Use custom interceptor for detailed logging
}
```

---

## Key Points Summary

✓ **RestTemplate is thread-safe** when configured as a singleton bean
✓ **Always configure timeouts** to prevent hanging requests
✓ **Use connection pooling** for better performance
✓ **Create HttpHeaders per request** to avoid concurrency issues
✓ **Test with MockRestServiceServer or WireMock**
✓ **Handle exceptions and null responses gracefully**
✓ **Implement retry logic** for transient failures
✓ **Use circuit breakers** to prevent cascading failures
✓ **Migrate to WebClient** for new projects or high-performance needs
✓ **Monitor and log** API interactions for debugging

---

## Recommended Reading

- Spring Documentation: [RestTemplate](https://spring.io/blog/2009/03/27/rest-in-spring-3-resttemplate)
- HttpClient Documentation: [Connection Management](https://hc.apache.org/httpcomponents-client-4.5.x/tutorial.html)
- Resilience4j: [Circuit Breaker](https://resilience4j.readme.io/docs/circuitbreaker)
