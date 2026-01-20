# FeignClient - Spring Boot

FeignClient is a declarative REST client that simplifies HTTP client development. It uses annotations to define API endpoints and Spring automatically implements the interface.

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Basic CRUD Operations](#basic-crud-operations)
3. [Advanced Configuration](#advanced-configuration)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)

---

## Core Concepts

### What is FeignClient?
- Declarative HTTP client for Spring Cloud
- Reduces boilerplate code significantly
- Annotation-based approach
- Integrates with service discovery (Eureka, Consul, etc.)
- Built-in load balancing with Ribbon/Spring Cloud LoadBalancer
- Easy testing with Wiremock or MockMvc
- Thread-safe by default
- Auto-implements interface methods

### Key Features:
✓ Declarative API definition
✓ Built-in load balancing
✓ Service discovery integration
✓ Automatic JSON/XML serialization
✓ Pluggable error handling
✓ Interceptor support
✓ Request/response logging
✓ Timeout configuration
✓ Retry mechanisms
✓ Circuit breaker support (with Hystrix/Resilience4j)

### When to Use FeignClient:
- Microservices communication
- Clean, readable client code
- Built-in load balancing needed
- Service discovery integration
- Simple API clients
- Minimal configuration

### FeignClient vs RestTemplate vs WebClient

| Feature | FeignClient | RestTemplate | WebClient |
|---------|------------|-------------|-----------|
| Type | Declarative | Imperative | Reactive |
| Blocking | Yes | Yes | No |
| Load Balancing | Built-in | No | No |
| Service Discovery | Yes | No | No |
| Code Size | Smallest | Medium | Medium |
| Learning Curve | Low | Low | High |
| Performance | Good | Good | Better |
| Spring Cloud | Yes | No | No |
| Non-blocking | No | No | Yes |

### Key Annotations:
```
@FeignClient        - Marks interface as Feign client
@RequestMapping     - HTTP method and path
@GetMapping         - GET request
@PostMapping        - POST request
@PutMapping         - PUT request
@DeleteMapping      - DELETE request
@RequestParam       - Query parameters
@RequestBody        - Request body
@PathVariable       - URI path variables
@RequestHeader      - Custom headers
@CookieValue        - Cookie parameters
```

---

## Dependencies

```xml
<!-- Spring Cloud OpenFeign -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!-- Optional: Circuit Breaker Support -->
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
</dependency>
```

---

## Basic CRUD Operations

See **1-basic-operations.md** for:
- Simple GET requests
- Creating resources with POST
- Updating with PUT
- Deleting resources
- Query and path parameters
- Request/response handling
- Custom headers

---

## Advanced Configuration

See **2-advanced-configuration.md** for:
- FeignClient configuration
- Custom client configuration
- Connection pooling
- Timeout settings
- Encoder/Decoder customization
- Interceptors
- Request/response logging
- Service discovery integration

---

## Error Handling

See **3-error-handling.md** for:
- Error decoder implementation
- Custom exception handling
- Feign exception mapping
- Retry mechanisms
- Circuit breaker patterns
- Fallback strategies
- Global error handling

---

## Best Practices

See **4-best-practices.md** for:
- Interface design patterns
- Configuration best practices
- Testing strategies
- Common pitfalls
- Performance optimization
- Service discovery patterns
- Load balancing strategies

---

## Quick Start Example

### Enable FeignClient

```java
@SpringBootApplication
@EnableFeignClients
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Define Feign Client

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @GetMapping("/users")
    List<User> getAllUsers();
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
    
    @PutMapping("/users/{id}")
    User updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request);
    
    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id);
}
```

### Use in Service

```java
@Service
public class UserService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }
    
    public List<User> getAllUsers() {
        return userServiceClient.getAllUsers();
    }
}
```

---

## Configuration Options

### application.yml

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
        loggerLevel: full
      user-service:
        connectTimeout: 3000
        readTimeout: 8000
  
  # Enable request/response logging
  logging:
    level:
      com.example.client: DEBUG
  
  # Circuitbreaker configuration
  circuitbreaker:
    enabled: true
  
  # Retry configuration
  retry:
    enabled: true
    maxAttempts: 3
    period: 100
```

---

## Architecture Pattern

```
┌─────────────────────┐
│   Your Service      │
└──────────┬──────────┘
           │
           ├─→ UserServiceClient (Feign Interface)
           │   ├─ @GetMapping
           │   ├─ @PostMapping
           │   └─ @PutMapping
           │
           ├─→ FeignClient Framework
           │   ├─ Encoder (Serialize)
           │   ├─ Decoder (Deserialize)
           │   ├─ Logger
           │   └─ ErrorDecoder
           │
           ├─→ Service Discovery (Optional)
           │   └─ Eureka/Consul/K8s
           │
           ├─→ Load Balancer
           │   └─ Round Robin, Random, etc.
           │
           └─→ HTTP Client
               └─ Apache HttpClient, OkHttp, etc.

           ↓

    ┌──────────────────┐
    │  Remote Service  │
    └──────────────────┘
```

---

## Key Concepts You Must Know

1. **Declarative**: Define what to do, not how to do it
2. **Synchronous**: Blocks while waiting for response
3. **Client-side Load Balancing**: Built-in with LoadBalancer
4. **Service Discovery**: Automatically discovers service instances
5. **Hystrix/CircuitBreaker**: Prevent cascade failures
6. **Fallback**: Graceful degradation on failures
7. **Interceptor**: Add common headers/auth across requests
8. **ErrorDecoder**: Map HTTP errors to custom exceptions

---

## Common Use Cases

### Microservice A calls Microservice B
```
User Service ──Feign──→ Order Service
Payment Service ──Feign──→ Bank API
Notification Service ──Feign──→ Email API
```

### API Gateway Pattern
```
API Gateway ──Feign──→ Multiple Services
         ├─→ User Service
         ├─→ Order Service
         └─→ Product Service
```

---

## Recommended Reading

- Spring Cloud OpenFeign: [Documentation](https://spring.io/projects/spring-cloud-openfeign)
- Netflix Feign: [GitHub](https://github.com/OpenFeign/feign)
- Service Discovery: [Eureka](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-eureka-server.html)
- Load Balancing: [Spring Cloud LoadBalancer](https://spring.io/projects/spring-cloud-commons)
- Circuit Breaker: [Resilience4j](https://resilience4j.readme.io/)
