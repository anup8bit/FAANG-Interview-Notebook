# WebClient - Error Handling & Resilience

## 1. Handling Errors in Reactive Chains

### 1.1 onErrorMap - Transform Exceptions

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Transform HttpClientErrorException to custom exception
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .onErrorMap(WebClientResponseException.class, 
                ex -> {
                    if (ex.getStatusCode().value() == 404) {
                        return new ResourceNotFoundException("User not found");
                    } else if (ex.getStatusCode().value() == 401) {
                        return new UnauthorizedException("Unauthorized");
                    }
                    return new ApiException("API Error: " + ex.getMessage());
                });
    }
}
```

### 1.2 onErrorReturn - Fallback Value

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Return default value on error
    public Mono<User> getUserWithDefault(Long userId) {
        User defaultUser = User.builder()
            .id(userId)
            .name("Unknown")
            .email("unknown@example.com")
            .build();
        
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .onErrorReturn(defaultUser);  // Return on any error
    }
    
    // Return default value only on specific error
    public Mono<User> getUserWithSpecificFallback(Long userId) {
        User defaultUser = User.builder()
            .id(userId)
            .name("Unknown")
            .email("unknown@example.com")
            .build();
        
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .onErrorReturn(WebClientResponseException.class, defaultUser);
    }
}
```

### 1.3 onErrorResume - Alternative Stream

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    @Autowired
    private UserCache userCache;
    
    // Fallback to cached value on error
    public Mono<User> getUserWithCache(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .onErrorResume(ex -> 
                Mono.justOrEmpty(userCache.getUser(userId))
                    .switchIfEmpty(Mono.error(new ResourceNotFoundException("User not found")))
            );
    }
    
    // Try multiple sources
    public Mono<User> getUserMultipleAttempts(Long userId) {
        return webClient.get()
            .uri("https://api1.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .onErrorResume(ex -> webClient.get()
                .uri("https://api2.example.com/users/{id}", userId)
                .retrieve()
                .bodyToMono(User.class)
            )
            .onErrorResume(ex -> Mono.justOrEmpty(userCache.getUser(userId))
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("User not found")))
            );
    }
}
```

---

## 2. Retry Mechanisms

### 2.1 Simple Retry

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Retry up to 3 times
    public Mono<User> getUserWithRetry(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .retry(3);  // Retry 3 times on any error
    }
    
    // Retry only on specific exception
    public Mono<User> getUserWithSelectiveRetry(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .retryWhen(Retry.max(3)
                .filter(throwable -> !(throwable instanceof ResourceNotFoundException)));
    }
}
```

### 2.2 Retry with Exponential Backoff

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Retry with exponential backoff (1s, 2s, 4s)
    public Mono<User> getUserWithBackoff(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                .maxBackoff(Duration.ofSeconds(10)));
    }
    
    // Retry with custom predicate
    public Mono<User> getUserWithCustomRetry(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(100))
                .filter(throwable -> 
                    throwable instanceof ConnectTimeoutException ||
                    throwable instanceof IOException)
                .maxBackoff(Duration.ofSeconds(5))
                .jitter(Jitter.random()));
    }
}
```

### 2.3 Retry as Filter

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(retryFilter())
            .build();
    }
    
    @Bean
    public ExchangeFilterFunction retryFilter() {
        return (request, next) -> next.exchange(request)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(100))
                .maxBackoff(Duration.ofSeconds(5))
                .filter(throwable -> 
                    throwable instanceof IOException ||
                    throwable instanceof TimeoutException));
    }
}
```

---

## 3. Timeout Handling

### 3.1 Response Timeout

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create()
                    .responseTimeout(Duration.ofSeconds(10))))
            .build();
    }
}
```

### 3.2 Timeout with Error Handling

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> getUserWithTimeout(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .timeout(Duration.ofSeconds(5))
            .onErrorMap(TimeoutException.class, 
                ex -> new ApiException("Request timeout"));
    }
}
```

### 3.3 Timeout with Fallback

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    @Autowired
    private UserCache userCache;
    
    public Mono<User> getUserWithTimeoutFallback(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .timeout(Duration.ofSeconds(5))
            .onErrorResume(TimeoutException.class, 
                ex -> Mono.justOrEmpty(userCache.getUser(userId))
                    .switchIfEmpty(Mono.error(new ApiException("Timeout and no cache")))
            );
    }
}
```

---

## 4. Custom Exception Classes

```java
// Base exception
public class ApiException extends RuntimeException {
    private int statusCode;
    private String errorCode;
    
    public ApiException(String message) {
        super(message);
    }
    
    public ApiException(String message, int statusCode, String errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
    
    public int getStatusCode() { return statusCode; }
    public String getErrorCode() { return errorCode; }
}

// 4xx Client Errors
public class ClientErrorException extends ApiException {
    public ClientErrorException(String message, int statusCode) {
        super(message, statusCode, "CLIENT_ERROR");
    }
}

public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(message, 401, "UNAUTHORIZED");
    }
}

public class ForbiddenException extends ApiException {
    public ForbiddenException(String message) {
        super(message, 403, "FORBIDDEN");
    }
}

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message) {
        super(message, 404, "NOT_FOUND");
    }
}

// 5xx Server Errors
public class ServerErrorException extends ApiException {
    public ServerErrorException(String message) {
        super(message, 500, "SERVER_ERROR");
    }
}
```

---

## 5. Comprehensive Error Handler Filter

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(errorHandlingFilter())
            .build();
    }
    
    @Bean
    public ExchangeFilterFunction errorHandlingFilter() {
        return (request, next) -> next.exchange(request)
            .onErrorMap(this::mapException)
            .flatMap(response -> {
                if (response.getStatusCode().isError()) {
                    return response.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(
                            new ApiException("Error: " + body)));
                }
                return Mono.just(response);
            });
    }
    
    private Throwable mapException(Throwable ex) {
        if (ex instanceof WebClientResponseException wex) {
            return switch (wex.getStatusCode().value()) {
                case 401 -> new UnauthorizedException("Unauthorized");
                case 403 -> new ForbiddenException("Forbidden");
                case 404 -> new ResourceNotFoundException("Not found");
                default -> new ServerErrorException("Server error");
            };
        } else if (ex instanceof TimeoutException) {
            return new ApiException("Request timeout");
        }
        return new ApiException("API error: " + ex.getMessage());
    }
}
```

---

## 6. Circuit Breaker with Resilience4j

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-reactor</artifactId>
</dependency>
```

### application.yml

```yaml
resilience4j:
  circuitbreaker:
    instances:
      userServiceCB:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10000
        minimum-number-of-calls: 5
```

### Service Implementation

```java
@Service
public class UserServiceWithCircuitBreaker {
    
    @Autowired
    private WebClient webClient;
    
    @CircuitBreaker(name = "userServiceCB", fallbackMethod = "fallbackGetUser")
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    public Mono<User> fallbackGetUser(Long userId, Exception e) {
        return Mono.just(User.builder()
            .id(userId)
            .name("Unknown")
            .email("unknown@example.com")
            .build());
    }
}
```

---

## 7. Bulkhead Pattern

```java
@Service
public class UserServiceWithBulkhead {
    
    @Autowired
    private WebClient webClient;
    
    @Bulkhead(name = "userServiceBH", type = Bulkhead.Type.THREADPOOL)
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

---

## 8. Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
        logger.error("Unauthorized: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse.builder()
                .code("UNAUTHORIZED")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        logger.error("Not found: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.builder()
                .code("NOT_FOUND")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException e) {
        logger.error("API error: {}", e.getMessage());
        return ResponseEntity.status(e.getStatusCode())
            .body(ErrorResponse.builder()
                .code(e.getErrorCode())
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
}
```

---

## Key Points

✓ **onErrorMap()** - Transform exceptions
✓ **onErrorReturn()** - Return fallback value
✓ **onErrorResume()** - Use alternative stream
✓ **retry()** - Simple retry mechanism
✓ **retryWhen()** - Retry with conditions and backoff
✓ **timeout()** - Set timeout on individual requests
✓ **Circuit Breaker** - Prevent cascade failures
✓ **Bulkhead** - Isolate resources
✓ **Always handle errors** in reactive chains
✓ **Log errors** for debugging
