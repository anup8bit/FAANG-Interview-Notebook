# RestTemplate Client - Spring Boot

RestTemplate is a Spring Boot class used to consume REST APIs. It provides a simple synchronous client for making HTTP requests.

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Basic CRUD Operations](#basic-crud-operations)
3. [Advanced Configuration](#advanced-configuration)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)

---

## Core Concepts

### What is RestTemplate?
- Synchronous HTTP client for Spring applications
- Simplifies communication with RESTful web services
- Provides methods for all HTTP verbs (GET, POST, PUT, DELETE, PATCH, etc.)
- Thread-safe when properly configured
- Deprecated in Spring 6.0 in favor of WebClient (async/non-blocking)

### Key Methods:
```
getForObject()     - GET request returning object
getForEntity()     - GET request returning ResponseEntity
postForObject()    - POST request returning object
postForEntity()    - POST request returning ResponseEntity
put()              - PUT request
delete()           - DELETE request
exchange()         - Generic method for all HTTP methods
```

### Why RestTemplate?
✓ Synchronous processing (easier to understand)
✓ Built-in error handling mechanisms
✓ Template method pattern
✓ Automatic JSON/XML serialization (with proper converters)
✓ Support for custom interceptors and error handlers

---

## Basic CRUD Operations

See **1-basic-operations.md** for:
- Simple GET requests
- Creating resources with POST
- Updating with PUT/PATCH
- Deleting resources
- Working with response bodies and headers

---

## Advanced Configuration

See **2-advanced-configuration.md** for:
- RestTemplate bean configuration
- Connection pooling with HttpClientBuilder
- Custom interceptors
- Request/response logging
- Timeout configuration
- SSL/HTTPS setup

---

## Error Handling

See **3-error-handling.md** for:
- ResponseErrorHandler implementation
- Custom exception handling
- Retry mechanisms
- Circuit breaker patterns
- Fallback strategies

---

## Best Practices

See **4-best-practices.md** for:
- Thread safety considerations
- Resource management
- Performance optimization
- Testing strategies
- Migration to WebClient
- Common pitfalls and how to avoid them

---

## Quick Start Example

```java
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
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
}
```

---

## When to Use RestTemplate vs WebClient

| Feature | RestTemplate | WebClient |
|---------|-------------|-----------|
| Blocking | Yes | No |
| Sync/Async | Sync | Async/Reactive |
| Performance | Good | Better |
| Complexity | Lower | Higher |
| Spring 6.0+ | Deprecated | Recommended |
| Testing | Easier | More complex |

**Use RestTemplate for**: Legacy projects, simple synchronous calls, easier testing
**Use WebClient for**: New projects, high-performance async needs, reactive apps
