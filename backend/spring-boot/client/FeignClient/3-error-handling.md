# FeignClient - Error Handling & Resilience

## 1. Custom Exception Classes

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
    public ServerErrorException(String message, int statusCode) {
        super(message, statusCode, "SERVER_ERROR");
    }
}
```

---

## 2. Custom ErrorDecoder

### 2.1 Basic ErrorDecoder

```java
@Component
public class CustomErrorDecoder implements ErrorDecoder {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomErrorDecoder.class);
    
    @Override
    public Exception decode(String methodKey, Response response) {
        String errorBody = extractErrorBody(response);
        
        logger.error("Feign Error - Method: {}, Status: {}, Body: {}",
            methodKey, response.status(), errorBody);
        
        return switch (response.status()) {
            case 400 -> new BadRequestException("Invalid request: " + errorBody);
            case 401 -> new UnauthorizedException("Unauthorized");
            case 403 -> new ForbiddenException("Forbidden");
            case 404 -> new ResourceNotFoundException("Resource not found");
            case 500 -> new ServerErrorException("Internal server error", 500);
            case 502 -> new ServerErrorException("Bad gateway", 502);
            case 503 -> new ServerErrorException("Service unavailable", 503);
            default -> new ApiException("API Error: " + errorBody, response.status(), "UNKNOWN");
        };
    }
    
    private String extractErrorBody(Response response) {
        try {
            return Util.toString(response.body().asReader(StandardCharsets.UTF_8));
        } catch (IOException e) {
            logger.error("Failed to read error response body", e);
            return "Unable to read error response";
        }
    }
}

public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(message, 400, "BAD_REQUEST");
    }
}
```

### 2.2 Advanced ErrorDecoder with Error DTO

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> details;
}

@Component
public class AdvancedErrorDecoder implements ErrorDecoder {
    
    private final ObjectMapper objectMapper;
    
    public AdvancedErrorDecoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    @Override
    public Exception decode(String methodKey, Response response) {
        ErrorResponse errorResponse = parseErrorResponse(response);
        
        return switch (response.status()) {
            case 401 -> new UnauthorizedException(errorResponse.getMessage());
            case 403 -> new ForbiddenException(errorResponse.getMessage());
            case 404 -> new ResourceNotFoundException(errorResponse.getMessage());
            case 500, 502, 503 -> new ServerErrorException(
                errorResponse.getMessage(), response.status());
            default -> new ApiException(
                errorResponse.getMessage(),
                response.status(),
                errorResponse.getCode()
            );
        };
    }
    
    private ErrorResponse parseErrorResponse(Response response) {
        try {
            String body = Util.toString(response.body().asReader(StandardCharsets.UTF_8));
            return objectMapper.readValue(body, ErrorResponse.class);
        } catch (Exception e) {
            return new ErrorResponse("UNKNOWN", "Unknown error", LocalDateTime.now(), new HashMap<>());
        }
    }
}
```

---

## 3. Fallback Methods

### 3.1 Simple Fallback

```java
@FeignClient(name = "user-service", url = "https://api.example.com", fallback = UserServiceFallback.class)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @GetMapping("/users")
    List<User> getAllUsers();
}

@Component
public class UserServiceFallback implements UserServiceClient {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceFallback.class);
    
    @Override
    public User getUser(Long id) {
        logger.warn("Fallback: getUser called for id: {}", id);
        return User.builder()
            .id(id)
            .name("Fallback User")
            .email("fallback@example.com")
            .build();
    }
    
    @Override
    public List<User> getAllUsers() {
        logger.warn("Fallback: getAllUsers called");
        return Collections.emptyList();
    }
}
```

### 3.2 Fallback Factory (with exception details)

```java
@FeignClient(
    name = "user-service",
    url = "https://api.example.com",
    fallbackFactory = UserServiceFallbackFactory.class
)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @GetMapping("/users")
    List<User> getAllUsers();
}

@Component
public class UserServiceFallbackFactory implements FallbackFactory<UserServiceClient> {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceFallbackFactory.class);
    
    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClientFallback(cause);
    }
    
    private static class UserServiceClientFallback implements UserServiceClient {
        
        private final Throwable cause;
        
        public UserServiceClientFallback(Throwable cause) {
            this.cause = cause;
        }
        
        @Override
        public User getUser(Long id) {
            logger.warn("Fallback: getUser failed due to: {}", cause.getMessage());
            return User.builder()
                .id(id)
                .name("Fallback User")
                .build();
        }
        
        @Override
        public List<User> getAllUsers() {
            logger.warn("Fallback: getAllUsers failed due to: {}", cause.getMessage());
            return Collections.emptyList();
        }
    }
}
```

---

## 4. Retry Mechanism

### 4.1 Default Retryer

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
            100,    // initialInterval (milliseconds)
            1000,   // maxInterval (milliseconds)
            3       // maxAttempts
        );
    }
}
```

### 4.2 Custom Retryer

```java
@Component
public class CustomRetryer implements Retryer {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomRetryer.class);
    private int attempt = 0;
    private final int maxAttempts = 3;
    
    @Override
    public void continueOrPropagate(RetryableException e) {
        attempt++;
        
        logger.warn("Retry attempt {}/{}: {}", attempt, maxAttempts, e.getMessage());
        
        if (attempt >= maxAttempts) {
            throw e;
        }
        
        try {
            long delay = (long) Math.pow(2, attempt) * 100;  // Exponential backoff
            Thread.sleep(delay);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(ie);
        }
    }
    
    @Override
    public Retryer clone() {
        return new CustomRetryer();
    }
}
```

---

## 5. Circuit Breaker with Resilience4j

### Dependencies

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
    <artifactId>resilience4j-timelimiter</artifactId>
</dependency>
```

### application.yml

```yaml
resilience4j:
  circuitbreaker:
    instances:
      user-service:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10000
        minimum-number-of-calls: 5
        record-exceptions:
          - java.io.IOException
          - com.example.exception.ApiException
```

### Service with Circuit Breaker

```java
@Service
public class UserService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }
    
    public User getUserFallback(Long userId, Exception e) {
        logger.error("Circuit breaker triggered for user {}: {}", userId, e.getMessage());
        return User.builder()
            .id(userId)
            .name("Fallback User")
            .email("fallback@example.com")
            .build();
    }
}
```

---

## 6. Retry with Circuit Breaker

```java
@Configuration
public class ResilienceFeignConfig {
    
    @Bean
    public Retry retry() {
        return Retry.of("user-service", RetryConfig.custom()
            .maxAttempts(3)
            .intervalFunction(IntervalFunction.ofExponentialBackoff(100, 2))
            .build());
    }
}

@Service
public class ResilientUserService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Retry(name = "user-service")
    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }
    
    public User getUserFallback(Long userId, Exception e) {
        return User.builder()
            .id(userId)
            .name("Fallback User")
            .build();
    }
}
```

---

## 7. Global Exception Handler

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
    
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException e) {
        logger.error("Feign error: {} - {}", e.status(), e.getMessage());
        return ResponseEntity.status(e.status())
            .body(ErrorResponse.builder()
                .code("FEIGN_ERROR")
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

## 8. Complete Error Handling Setup

```java
@Configuration
public class FeignErrorHandlingConfig {
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(100, 1000, 3);
    }
}

// Feign Client
@FeignClient(
    name = "user-service",
    url = "https://api.example.com",
    configuration = FeignErrorHandlingConfig.class,
    fallback = UserServiceFallback.class
)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}

// Fallback
@Component
public class UserServiceFallback implements UserServiceClient {
    
    @Override
    public User getUser(Long id) {
        return User.builder()
            .id(id)
            .name("Fallback User")
            .build();
    }
}

// Service with additional resilience
@Service
public class UserService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }
    
    public User getUserFallback(Long userId, Exception e) {
        return User.builder()
            .id(userId)
            .name("Fallback User")
            .build();
    }
}
```

---

## Key Points

✓ **ErrorDecoder** - Transform HTTP errors to custom exceptions
✓ **Fallback** - Graceful degradation on failures
✓ **FallbackFactory** - Access exception details in fallback
✓ **Retryer** - Automatic retry on transient failures
✓ **Circuit Breaker** - Prevent cascade failures
✓ **Retry + Circuit Breaker** - Combine for better resilience
✓ **Global Exception Handler** - Handle all exceptions centrally
✓ **Logging** - Log all errors for debugging
