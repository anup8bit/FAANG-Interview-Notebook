# WebClient - Spring Boot

WebClient is a modern, non-blocking HTTP client in Spring Framework. It's the reactive alternative to RestTemplate and is recommended for new Spring Boot projects.

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Basic CRUD Operations](#basic-crud-operations)
3. [Advanced Configuration](#advanced-configuration)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)

---

## Core Concepts

### What is WebClient?
- Non-blocking, reactive HTTP client
- Built on Spring WebFlux
- Returns Mono (0 or 1 element) or Flux (0 or many elements)
- Supports both synchronous and asynchronous operations
- Thread-safe and resource-efficient
- Introduced in Spring 5.0, recommended for Spring 6.0+

### Key Advantages Over RestTemplate:
✓ Non-blocking I/O (better performance under load)
✓ Reactive streams support (Mono/Flux)
✓ Built-in connection pooling
✓ Easier timeout management
✓ Better for microservices architecture
✓ Supports HTTP/2
✓ More efficient resource usage

### Key Methods:
```
get()       - GET request
post()      - POST request
put()       - PUT request
patch()     - PATCH request
delete()    - DELETE request
retrieve()  - Extract response body and headers
exchange()  - Full control over response handling
block()     - Convert Mono to blocking call (use cautiously)
subscribe() - Subscribe to the stream
```

### Mono vs Flux:
```
Mono<T>   - 0 or 1 element (like Optional<T>)
          - Use for single resource responses
          
Flux<T>   - 0 or many elements (like List<T>)
          - Use for collection responses
          - Can stream data
```

### Blocking vs Non-Blocking:

```java
// RestTemplate (Blocking)
User user = restTemplate.getForObject(url, User.class);  // Thread waits
System.out.println(user.getName());

// WebClient (Non-Blocking)
Mono<User> userMono = webClient.get().uri(url).retrieve().bodyToMono(User.class);
userMono.subscribe(user -> System.out.println(user.getName()));  // Thread doesn't wait
```

---

## Basic CRUD Operations

See **1-basic-operations.md** for:
- Simple GET requests with Mono/Flux
- Creating resources with POST
- Updating with PUT/PATCH
- Deleting resources
- Handling reactive responses
- Converting Mono/Flux to blocking calls
- Error handling in reactive chains

---

## Advanced Configuration

See **2-advanced-configuration.md** for:
- WebClient bean configuration
- Connection pooling with Reactor Netty
- Custom interceptors and filters
- Request/response logging
- Timeout configuration
- SSL/HTTPS setup
- Baseurl and default headers
- Codec configuration

---

## Error Handling

See **3-error-handling.md** for:
- onErrorMap for exception transformation
- onErrorReturn for fallback values
- onErrorResume for alternative streams
- Retry with exponential backoff
- Timeout handling
- Circuit breaker patterns
- Custom exception handling

---

## Best Practices

See **4-best-practices.md** for:
- Thread safety considerations
- Resource management
- Performance optimization
- Testing strategies with WebTestClient
- Common pitfalls and how to avoid them
- Migration from RestTemplate
- When to block and when to subscribe
- Reactor backpressure handling

---

## Quick Start Example

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### Configuration

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
}
```

### Service Usage

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Non-blocking GET
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    // Blocking GET (use cautiously)
    public User getUserBlocking(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .block();
    }
    
    // Non-blocking collection
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);
    }
}
```

---

## When to Use WebClient vs RestTemplate

| Feature | RestTemplate | WebClient |
|---------|-------------|-----------|
| Blocking | Yes | No |
| Async/Reactive | No | Yes |
| Thread Pool | Larger | Smaller |
| Performance | Good | Better |
| Spring 6.0+ | Deprecated | Recommended |
| Learning Curve | Lower | Higher |
| Testing | Easier (MockRestServiceServer) | WebTestClient |
| Microservices | Works | Better |
| High Load | Works | Better |
| Streaming | No | Yes |

**Use RestTemplate for**: Legacy projects, synchronous operations, easier testing
**Use WebClient for**: New projects, high-performance needs, reactive apps, microservices

---

## Key Concepts You Must Know

1. **Non-Blocking**: WebClient doesn't block threads waiting for responses
2. **Lazy Evaluation**: Mono/Flux are lazy - nothing happens until subscribed
3. **Backpressure**: Subscriber can control data flow rate
4. **Composition**: Chain multiple operations with operators
5. **Threading**: Reactor handles threading automatically

---

## Common Patterns

### Pattern 1: Get and Transform
```java
webClient.get()
    .uri("/users/{id}", userId)
    .retrieve()
    .bodyToMono(User.class)
    .map(user -> user.getName().toUpperCase())
    .subscribe(System.out::println);
```

### Pattern 2: Get with Fallback
```java
webClient.get()
    .uri("/users/{id}", userId)
    .retrieve()
    .bodyToMono(User.class)
    .onErrorReturn(new User());  // Default user if error
```

### Pattern 3: Combine Multiple Requests
```java
Mono<User> userMono = webClient.get().uri("/users/{id}", userId)
    .retrieve().bodyToMono(User.class);
Mono<Posts> postsMono = webClient.get().uri("/posts/{userId}", userId)
    .retrieve().bodyToMono(Posts.class);

Mono.zip(userMono, postsMono)
    .subscribe(tuple -> {
        User user = tuple.getT1();
        Posts posts = tuple.getT2();
    });
```

---

## Recommended Reading

- Spring WebFlux Documentation: [WebClient](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client)
- Reactor Documentation: [Reactive Streams](https://projectreactor.io/docs/core/release/reference/)
- Project Reactor Pattern: [Patterns and Anti-patterns](https://projectreactor.io/docs/core/release/reference/#faq.wrap-blocking)
