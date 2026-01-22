# FeignClient - Basic CRUD Operations

## 1. Setup and Enable FeignClient

### Enable FeignClient in Application

```java
@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.client")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Multiple Base Packages

```java
@SpringBootApplication
@EnableFeignClients(basePackages = {
    "com.example.user.client",
    "com.example.order.client",
    "com.example.payment.client"
})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

---

## 2. GET Requests

### 2.1 Simple GET

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // Get single user
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    // Get all users
    @GetMapping("/users")
    List<User> getAllUsers();
}
```

### 2.2 GET with Query Parameters

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // Single query parameter
    @GetMapping("/users/search")
    List<User> searchByName(@RequestParam String name);
    
    // Multiple query parameters
    @GetMapping("/users/filter")
    List<User> filterUsers(
            @RequestParam String name,
            @RequestParam int age,
            @RequestParam String email);
    
    // Optional parameters
    @GetMapping("/users")
    List<User> getUsersWithOptional(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer minAge);
    
    // Map of parameters
    @GetMapping("/users/search")
    List<User> searchUsers(@RequestParam Map<String, String> params);
}
```

### 2.3 GET with Path Variables

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // Single path variable
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    // Multiple path variables
    @GetMapping("/users/{userId}/posts/{postId}")
    Post getUserPost(@PathVariable Long userId, @PathVariable Long postId);
    
    // Named path variables
    @GetMapping("/users/{userId}/posts/{postId}")
    Post getUserPostNamed(
            @PathVariable("userId") Long uid,
            @PathVariable("postId") Long pid);
}
```

### 2.4 GET with Custom Headers

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // Single custom header
    @GetMapping("/users/{id}")
    User getUser(
            @PathVariable Long id,
            @RequestHeader String Authorization);
    
    // Multiple headers
    @GetMapping("/users/{id}")
    User getUserWithHeaders(
            @PathVariable Long id,
            @RequestHeader("Authorization") String auth,
            @RequestHeader("X-API-Key") String apiKey,
            @RequestHeader("X-Request-ID") String requestId);
    
    // Optional headers
    @GetMapping("/users/{id}")
    User getUserOptionalHeaders(
            @PathVariable Long id,
            @RequestHeader(required = false) String Authorization);
}
```

### 2.5 GET - Returning ResponseEntity

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // Get with ResponseEntity (access headers and status)
    @GetMapping("/users/{id}")
    ResponseEntity<User> getUserWithEntity(@PathVariable Long id);
    
    // Get collection as ResponseEntity
    @GetMapping("/users")
    ResponseEntity<List<User>> getAllUsersWithEntity();
}
```

---

## 3. POST Requests

### 3.1 Simple POST

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
}
```

### 3.2 POST with Response Entity

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PostMapping("/users")
    ResponseEntity<User> createUserWithResponse(@RequestBody CreateUserRequest request);
}
```

### 3.3 POST with Custom Headers

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PostMapping("/users")
    User createUserWithAuth(
            @RequestBody CreateUserRequest request,
            @RequestHeader("Authorization") String token);
    
    // Multiple headers
    @PostMapping("/users")
    User createUserWithHeaders(
            @RequestBody CreateUserRequest request,
            @RequestHeader("Authorization") String auth,
            @RequestHeader("Content-Type") String contentType,
            @RequestHeader("X-Request-ID") String requestId);
}
```

### 3.4 POST - Form Data

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PostMapping(value = "/users/form", consumes = "application/x-www-form-urlencoded")
    User createUserFromForm(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam int age);
    
    // Form object
    @PostMapping("/users/form")
    User createUserFormData(@RequestBody FormUserData formData);
}
```

---

## 4. PUT Requests

### 4.1 Simple PUT

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PutMapping("/users/{id}")
    User updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request);
}
```

### 4.2 PUT with Response Entity

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PutMapping("/users/{id}")
    ResponseEntity<User> updateUserWithResponse(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request);
}
```

---

## 5. PATCH Requests

### 5.1 Partial Update

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @PatchMapping("/users/{id}")
    User patchUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates);
}
```

---

## 6. DELETE Requests

### 6.1 Simple DELETE

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id);
}
```

### 6.2 DELETE with Response

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @DeleteMapping("/users/{id}")
    ResponseEntity<Void> deleteUserWithResponse(@PathVariable Long id);
}
```

---

## 7. Model Classes

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
```

---

## 8. Complete Feign Client Example

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    // ==================== GET ====================
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @GetMapping("/users")
    List<User> getAllUsers();
    
    @GetMapping("/users/search")
    List<User> searchUsers(@RequestParam String name);
    
    @GetMapping("/users/filter")
    List<User> filterUsers(
            @RequestParam String name,
            @RequestParam int age);
    
    @GetMapping("/users/{id}")
    ResponseEntity<User> getUserWithHeaders(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token);
    
    // ==================== POST ====================
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
    
    @PostMapping("/users")
    ResponseEntity<User> createUserWithResponse(
            @RequestBody CreateUserRequest request);
    
    @PostMapping("/users")
    User createUserWithAuth(
            @RequestBody CreateUserRequest request,
            @RequestHeader("Authorization") String token);
    
    // ==================== PUT ====================
    
    @PutMapping("/users/{id}")
    User updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request);
    
    // ==================== DELETE ====================
    
    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id);
    
    @DeleteMapping("/users/{id}")
    ResponseEntity<Void> deleteUserWithResponse(@PathVariable Long id);
}
```

---

## 9. Service Layer Usage

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
    
    public List<User> searchUsers(String name) {
        return userServiceClient.searchUsers(name);
    }
    
    public List<User> filterUsers(String name, int age) {
        return userServiceClient.filterUsers(name, age);
    }
    
    public User createUser(CreateUserRequest request) {
        return userServiceClient.createUser(request);
    }
    
    public User updateUser(Long userId, UpdateUserRequest request) {
        return userServiceClient.updateUser(userId, request);
    }
    
    public void deleteUser(Long userId) {
        userServiceClient.deleteUser(userId);
    }
}
```

---

## 10. REST Controller Usage

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        List<User> users = userService.searchUsers(name);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Key Points

✓ **@PathVariable** - Dynamic path segments
✓ **@RequestParam** - Query string parameters
✓ **@RequestBody** - JSON/XML request body
✓ **@RequestHeader** - Custom HTTP headers
✓ **@FeignClient** - Define interface
✓ **@EnableFeignClients** - Enable scanning
✓ **ResponseEntity** - Get status code and headers
✓ **Interface-based** - No need to implement
✓ **Synchronous** - Blocks while waiting for response
✓ **Thread-safe** - Safe for concurrent use
