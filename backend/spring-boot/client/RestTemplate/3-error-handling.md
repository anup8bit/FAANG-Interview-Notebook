# RestTemplate - Error Handling & Resilience

## 1. Custom Exception Classes

```java
// Base exception
public class ApiException extends RuntimeException {
    private int statusCode;
    private String errorMessage;
    
    public ApiException(String message, int statusCode, String errorMessage) {
        super(message);
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
    }
    
    public int getStatusCode() { return statusCode; }
    public String getErrorMessage() { return errorMessage; }
}

// 4xx Client Errors
public class ClientErrorException extends ApiException {
    public ClientErrorException(String message, int statusCode, String errorMessage) {
        super(message, statusCode, errorMessage);
    }
}

public class UnauthorizedException extends ClientErrorException {
    public UnauthorizedException(String message) {
        super(message, 401, "Unauthorized");
    }
}

public class ForbiddenException extends ClientErrorException {
    public ForbiddenException(String message) {
        super(message, 403, "Forbidden");
    }
}

public class ResourceNotFoundException extends ClientErrorException {
    public ResourceNotFoundException(String message) {
        super(message, 404, "Not Found");
    }
}

public class BadRequestException extends ClientErrorException {
    public BadRequestException(String message) {
        super(message, 400, "Bad Request");
    }
}

// 5xx Server Errors
public class ServerErrorException extends ApiException {
    public ServerErrorException(String message, int statusCode) {
        super(message, statusCode, "Server Error");
    }
}

public class ServiceUnavailableException extends ServerErrorException {
    public ServiceUnavailableException(String message) {
        super(message, 503);
    }
}
```

---

## 2. ResponseErrorHandler Implementation

### 2.1 Comprehensive Error Handler

```java
@Component
public class RestTemplateErrorHandler implements ResponseErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(RestTemplateErrorHandler.class);
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || 
               response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String errorBody = extractErrorBody(response);
        HttpStatusCode statusCode = response.getStatusCode();
        
        logger.error("HTTP Error - Status: {}, Body: {}", statusCode, errorBody);
        
        if (statusCode.is4xxClientError()) {
            handle4xxError(statusCode, errorBody);
        } else if (statusCode.is5xxServerError()) {
            handle5xxError(statusCode, errorBody);
        }
    }
    
    private void handle4xxError(HttpStatusCode statusCode, String errorBody) {
        switch ((HttpStatus) statusCode) {
            case BAD_REQUEST:
                throw new BadRequestException("Invalid request: " + errorBody);
            case UNAUTHORIZED:
                throw new UnauthorizedException("Authentication required");
            case FORBIDDEN:
                throw new ForbiddenException("Access denied");
            case NOT_FOUND:
                throw new ResourceNotFoundException("Resource not found: " + errorBody);
            default:
                throw new ClientErrorException(
                    "Client error: " + errorBody,
                    statusCode.value(),
                    statusCode.toString()
                );
        }
    }
    
    private void handle5xxError(HttpStatusCode statusCode, String errorBody) {
        switch ((HttpStatus) statusCode) {
            case SERVICE_UNAVAILABLE:
                throw new ServiceUnavailableException("Service temporarily unavailable");
            case INTERNAL_SERVER_ERROR:
                throw new ServerErrorException("Server error: " + errorBody, 500);
            case BAD_GATEWAY:
                throw new ServerErrorException("Bad gateway", 502);
            case GATEWAY_TIMEOUT:
                throw new ServerErrorException("Gateway timeout", 504);
            default:
                throw new ServerErrorException(
                    "Server error: " + errorBody,
                    statusCode.value()
                );
        }
    }
    
    private String extractErrorBody(ClientHttpResponse response) {
        try {
            return new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            logger.error("Failed to extract error body", e);
            return "Unable to read error response";
        }
    }
}
```

---

## 3. Retry Mechanism

### 3.1 Retry with Exponential Backoff

```java
@Service
public class RetryableRestClient {
    
    private static final Logger logger = LoggerFactory.getLogger(RetryableRestClient.class);
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_DELAY = 1000;  // 1 second
    
    @Autowired
    private RestTemplate restTemplate;
    
    public <T> T getWithRetry(String url, Class<T> responseType) {
        return executeWithRetry(() -> 
            restTemplate.getForObject(url, responseType), 0);
    }
    
    public <T> ResponseEntity<T> getEntityWithRetry(String url, Class<T> responseType) {
        return executeWithRetry(() -> 
            restTemplate.getForEntity(url, responseType), 0);
    }
    
    public <T> T postWithRetry(String url, Object request, Class<T> responseType) {
        return executeWithRetry(() -> 
            restTemplate.postForObject(url, request, responseType), 0);
    }
    
    private <T> T executeWithRetry(Supplier<T> supplier, int attempt) {
        try {
            return supplier.get();
        } catch (ServiceUnavailableException | HttpServerErrorException e) {
            if (attempt < MAX_RETRIES) {
                long delayMillis = INITIAL_DELAY * (long) Math.pow(2, attempt);
                logger.warn("Request failed, retrying after {}ms (attempt {}/{})", 
                    delayMillis, attempt + 1, MAX_RETRIES);
                
                try {
                    Thread.sleep(delayMillis);
                    return executeWithRetry(supplier, attempt + 1);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted", ie);
                }
            } else {
                logger.error("Max retries exceeded");
                throw e;
            }
        }
    }
}
```

### 3.2 Using Spring Retry

```xml
<!-- Add dependency -->
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>
```

```java
@Service
@EnableRetry
public class UserServiceWithSpringRetry {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Retryable(
        value = { ServiceUnavailableException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2.0)
    )
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
    
    @Recover
    public User recoverGetUser(ServiceUnavailableException e, Long userId) {
        logger.error("Failed to get user {} after retries", userId);
        // Return cached value or fallback
        return getDefaultUser();
    }
}
```

---

## 4. Circuit Breaker Pattern

### 4.1 Using Resilience4j

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
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
        record-exceptions:
          - com.example.exceptions.ServiceUnavailableException
```

### UserServiceWithCircuitBreaker

```java
@Service
public class UserServiceWithCircuitBreaker {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceWithCircuitBreaker.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    @CircuitBreaker(name = "userServiceCB", fallbackMethod = "fallbackGetUser")
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
    
    @CircuitBreaker(name = "userServiceCB", fallbackMethod = "fallbackGetAllUsers")
    public List<User> getAllUsers() {
        User[] users = restTemplate.getForObject(
            "https://api.example.com/users",
            User[].class
        );
        return Arrays.asList(users);
    }
    
    public User fallbackGetUser(Long userId, Exception e) {
        logger.warn("Circuit breaker triggered for getUser. Returning fallback value.");
        // Return cached or default user
        return User.builder()
            .id(userId)
            .name("Unknown")
            .email("unknown@example.com")
            .build();
    }
    
    public List<User> fallbackGetAllUsers(Exception e) {
        logger.warn("Circuit breaker triggered for getAllUsers. Returning empty list.");
        return Collections.emptyList();
    }
}
```

---

## 5. Timeout Handling

### 5.1 Try-Catch Approach

```java
@Service
public class TimeoutHandlingService {
    
    private static final Logger logger = LoggerFactory.getLogger(TimeoutHandlingService.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Optional<User> getUserWithTimeoutHandling(Long userId) {
        try {
            User user = restTemplate.getForObject(
                "https://api.example.com/users/{id}",
                User.class,
                userId
            );
            return Optional.ofNullable(user);
        } catch (ResourceAccessException e) {
            if (e.getCause() instanceof SocketTimeoutException) {
                logger.error("Request timeout for user {}", userId);
                return Optional.empty();
            }
            throw e;
        }
    }
}
```

### 5.2 Timeout with Fallback

```java
@Service
public class TimeoutWithFallbackService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserCache userCache;
    
    public User getUserWithFallback(Long userId) {
        try {
            return restTemplate.getForObject(
                "https://api.example.com/users/{id}",
                User.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.warn("API call failed, checking cache for user {}", userId);
            return userCache.getUser(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
    }
}
```

---

## 6. Error Response Mapping

### 6.1 Error Response DTO

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> details;
}
```

### 6.2 Parsing Error Response

```java
@Component
public class AdvancedErrorHandler implements ResponseErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(AdvancedErrorHandler.class);
    private ObjectMapper objectMapper;
    
    public AdvancedErrorHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || 
               response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        ErrorResponse errorResponse = parseErrorResponse(response);
        throw new ApiException(errorResponse.getMessage(), 
            response.getStatusCode().value(), errorResponse.getCode());
    }
    
    private ErrorResponse parseErrorResponse(ClientHttpResponse response) 
            throws IOException {
        try {
            String body = new String(response.getBody().readAllBytes(), 
                StandardCharsets.UTF_8);
            return objectMapper.readValue(body, ErrorResponse.class);
        } catch (Exception e) {
            logger.warn("Failed to parse error response", e);
            return new ErrorResponse("UNKNOWN", "Unknown error", 
                LocalDateTime.now(), "", new HashMap<>());
        }
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
        logger.error("Unauthorized error: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse.builder()
                .code("UNAUTHORIZED")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        logger.error("Resource not found: {}", e.getMessage());
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
                .code(e.getErrorMessage())
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
    
    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(ServiceUnavailableException e) {
        logger.error("Service unavailable: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(ErrorResponse.builder()
                .code("SERVICE_UNAVAILABLE")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
    }
}
```

---

## Key Points

✓ **Always implement custom error handlers** for consistent error processing
✓ **Create domain-specific exceptions** for better error handling
✓ **Implement retry logic** for transient failures (timeouts, 5xx errors)
✓ **Use circuit breakers** to prevent cascade failures
✓ **Handle timeouts gracefully** with fallback strategies
✓ **Log errors with context** for debugging
✓ **Provide meaningful error messages** to clients
✓ **Use caching as fallback** when external service fails
