# WebClient - Basic CRUD Operations

## Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

---

## 1. GET Requests

### 1.1 Simple GET - Non-Blocking

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Get single user
    public Mono<User> getUser(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    // Get all users
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("https://api.example.com/users")
            .retrieve()
            .bodyToFlux(User.class);
    }
}
```

### 1.2 GET - With Response Entity

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<ResponseEntity<User>> getUserWithEntity(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .toEntity(User.class);
    }
    
    // Access headers and status code
    public Mono<Void> processUserWithHeaders(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .toEntity(User.class)
            .doOnNext(response -> {
                User user = response.getBody();
                HttpStatus status = response.getStatusCode();
                HttpHeaders headers = response.getHeaders();
                System.out.println("User: " + user);
                System.out.println("Status: " + status);
            })
            .then();
    }
}
```

### 1.3 GET with Query Parameters

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Approach 1: Using URI template
    public Flux<User> searchUsers(String name, int age) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/users")
                .queryParam("name", name)
                .queryParam("age", age)
                .build())
            .retrieve()
            .bodyToFlux(User.class);
    }
    
    // Approach 2: Using string interpolation
    public Flux<User> searchUsersSimple(String name, int age) {
        return webClient.get()
            .uri("/users?name=" + name + "&age=" + age)
            .retrieve()
            .bodyToFlux(User.class);
    }
    
    // Approach 3: Dynamic parameters
    public Flux<User> searchUsersOptional(
            Optional<String> name,
            Optional<Integer> age) {
        
        return webClient.get()
            .uri(uriBuilder -> {
                var builder = uriBuilder.path("/users");
                
                name.ifPresent(n -> builder.queryParam("name", n));
                age.ifPresent(a -> builder.queryParam("age", a));
                
                return builder.build();
            })
            .retrieve()
            .bodyToFlux(User.class);
    }
}
```

### 1.4 GET with Custom Headers

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> getUserWithAuth(Long userId, String token) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .header("Authorization", "Bearer " + token)
            .header("X-Custom-Header", "custom-value")
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### 1.5 GET - Blocking Call

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Non-blocking (preferred)
    public Mono<User> getNonBlocking(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    // Blocking (use cautiously, defeats purpose of WebClient)
    public User getBlocking(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .block();  // ⚠️ Blocks until response, avoid in high-concurrency scenarios
    }
    
    // Blocking with timeout
    public User getBlockingWithTimeout(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .block(Duration.ofSeconds(10));  // Timeout after 10 seconds
    }
}
```

---

## 2. POST Requests

### 2.1 Simple POST

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> createUser(CreateUserRequest request) {
        return webClient.post()
            .uri("https://api.example.com/users")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### 2.2 POST with Response Entity

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<ResponseEntity<User>> createUserWithResponse(CreateUserRequest request) {
        return webClient.post()
            .uri("https://api.example.com/users")
            .bodyValue(request)
            .retrieve()
            .toEntity(User.class);
    }
}
```

### 2.3 POST with Custom Headers and Body

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> createUserWithHeaders(CreateUserRequest request, String token) {
        return webClient.post()
            .uri("https://api.example.com/users")
            .header("Authorization", "Bearer " + token)
            .header("X-Request-ID", UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### 2.4 POST - Form Data

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<String> uploadFormData(String name, String email) {
        return webClient.post()
            .uri("https://api.example.com/users/form")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(BodyInserters.fromFormData("name", name)
                .with("email", email))
            .retrieve()
            .bodyToMono(String.class);
    }
}
```

---

## 3. PUT Requests

### 3.1 Simple PUT

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> updateUser(Long userId, UpdateUserRequest request) {
        return webClient.put()
            .uri("https://api.example.com/users/{id}", userId)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(User.class);
    }
    
    // Return void (no content)
    public Mono<Void> updateUserNoContent(Long userId, UpdateUserRequest request) {
        return webClient.put()
            .uri("https://api.example.com/users/{id}", userId)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
```

---

## 4. PATCH Requests

### 4.1 Partial Update

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public Mono<User> patchUser(Long userId, Map<String, Object> updates) {
        return webClient.patch()
            .uri("https://api.example.com/users/{id}", userId)
            .bodyValue(updates)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

---

## 5. DELETE Requests

### 5.1 Simple DELETE

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Return void
    public Mono<Void> deleteUser(Long userId) {
        return webClient.delete()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(Void.class);
    }
    
    // Return response entity
    public Mono<ResponseEntity<Void>> deleteUserWithResponse(Long userId) {
        return webClient.delete()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .toEntity(Void.class);
    }
}
```

---

## 6. Transformation and Mapping

### 6.1 Map Response

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Single element transformation
    public Mono<String> getUserName(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .map(user -> user.getName());  // Transform User to String
    }
    
    // Flat mapping (chaining async calls)
    public Mono<Posts> getUserPosts(Long userId) {
        return webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .flatMap(user -> webClient.get()
                .uri("https://api.example.com/posts?userId={userId}", user.getId())
                .retrieve()
                .bodyToMono(Posts.class));
    }
    
    // Multiple element transformation
    public Flux<String> getAllUserNames() {
        return webClient.get()
            .uri("https://api.example.com/users")
            .retrieve()
            .bodyToFlux(User.class)
            .map(User::getName);  // Method reference
    }
}
```

---

## 7. Combining Multiple Requests

### 7.1 Zip - Wait for All

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Combine 2 requests
    public Mono<UserWithPosts> getUserWithPosts(Long userId) {
        Mono<User> userMono = webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
        
        Mono<Posts> postsMono = webClient.get()
            .uri("https://api.example.com/posts?userId={userId}", userId)
            .retrieve()
            .bodyToMono(Posts.class);
        
        return Mono.zip(userMono, postsMono)
            .map(tuple -> new UserWithPosts(tuple.getT1(), tuple.getT2()));
    }
    
    // Combine 3+ requests
    public Mono<UserProfile> getUserProfile(Long userId) {
        Mono<User> userMono = getUser(userId);
        Mono<Posts> postsMono = getPosts(userId);
        Mono<Comments> commentsMono = getComments(userId);
        
        return Mono.zip(userMono, postsMono, commentsMono)
            .map(tuple -> new UserProfile(
                tuple.getT1(),
                tuple.getT2(),
                tuple.getT3()
            ));
    }
}
```

### 7.2 CombineLatest

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    // Emit whenever any source emits
    public Flux<UserUpdate> trackUserUpdates(Long userId) {
        Flux<User> userUpdates = webClient.get()
            .uri("https://api.example.com/users/{id}/updates", userId)
            .retrieve()
            .bodyToFlux(User.class);
        
        Flux<Activity> activityUpdates = webClient.get()
            .uri("https://api.example.com/users/{id}/activity", userId)
            .retrieve()
            .bodyToFlux(Activity.class);
        
        return Flux.combineLatest(userUpdates, activityUpdates,
            (user, activity) -> new UserUpdate(user, activity));
    }
}
```

---

## 8. Subscribing and Consuming

### 8.1 Subscribe to Mono

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public void consumeUser(Long userId) {
        webClient.get()
            .uri("https://api.example.com/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class)
            .subscribe(
                user -> System.out.println("Success: " + user),
                error -> System.err.println("Error: " + error),
                () -> System.out.println("Complete")
            );
    }
}
```

### 8.2 Subscribe to Flux

```java
@Service
public class UserService {
    
    @Autowired
    private WebClient webClient;
    
    public void consumeAllUsers() {
        webClient.get()
            .uri("https://api.example.com/users")
            .retrieve()
            .bodyToFlux(User.class)
            .subscribe(
                user -> System.out.println("User: " + user),
                error -> System.err.println("Error: " + error),
                () -> System.out.println("All users processed")
            );
    }
}
```

---

## 9. Model Classes

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
    private int age;
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

@Data
@AllArgsConstructor
public class UserWithPosts {
    private User user;
    private Posts posts;
}
```

---

## 10. Configuration

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
}
```

---

## Key Points

✓ **Mono** - For single value (0 or 1 element)
✓ **Flux** - For multiple values (0 or many elements)
✓ **retrieve()** - Extract response body (simpler, for success cases)
✓ **exchange()** - Full response control (status, headers, body)
✓ **block()** - Convert Mono/Flux to blocking (use cautiously)
✓ **subscribe()** - Trigger execution in non-blocking manner
✓ **map()** - Transform single element
✓ **flatMap()** - Chain async operations
✓ **zip()** - Combine multiple Monos/Fluxes
✓ **Non-blocking** - Thread doesn't wait for response, better performance
