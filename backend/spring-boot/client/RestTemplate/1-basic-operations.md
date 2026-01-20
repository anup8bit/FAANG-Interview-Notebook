# RestTemplate - Basic CRUD Operations

## 1. GET Requests

### 1.1 Simple GET - getForObject()
Returns only the response body as an object.

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    // GET: Fetch a single user
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
    }
    
    // GET: Fetch all users
    public User[] getAllUsers() {
        return restTemplate.getForObject(
            "https://api.example.com/users",
            User[].class
        );
    }
    
    // GET: With Map parameters
    public User getUserWithMap(Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", userId);
        
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            User.class,
            params
        );
    }
}
```

### 1.2 GET - getForEntity()
Returns ResponseEntity with headers, status code, and body.

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public void fetchUserWithHeaders(Long userId) {
        ResponseEntity<User> response = restTemplate.getForEntity(
            "https://api.example.com/users/{id}",
            User.class,
            userId
        );
        
        // Access response details
        HttpStatus status = response.getStatusCode();
        User body = response.getBody();
        HttpHeaders headers = response.getHeaders();
        
        System.out.println("Status: " + status);
        System.out.println("User: " + body);
        System.out.println("Content-Type: " + headers.getContentType());
    }
}
```

### 1.3 GET with Query Parameters

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    // Approach 1: Using URI Template
    public List<User> searchUsers(String name, int age) {
        String url = "https://api.example.com/users?name={name}&age={age}";
        Map<String, Object> params = new HashMap<>();
        params.put("name", name);
        params.put("age", age);
        
        ResponseEntity<User[]> response = restTemplate.getForEntity(
            url,
            User[].class,
            params
        );
        
        return Arrays.asList(response.getBody());
    }
    
    // Approach 2: Build URL manually
    public List<User> searchUsersManual(String name, int age) {
        String url = "https://api.example.com/users?name=" + name + "&age=" + age;
        User[] users = restTemplate.getForObject(url, User[].class);
        return Arrays.asList(users);
    }
    
    // Approach 3: Using UriComponentsBuilder (Recommended)
    public List<User> searchUsersBuilder(String name, int age) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.example.com/users")
            .queryParam("name", name)
            .queryParam("age", age)
            .toUriString();
        
        User[] users = restTemplate.getForObject(url, User[].class);
        return Arrays.asList(users);
    }
}
```

---

## 2. POST Requests

### 2.1 Simple POST - postForObject()
Creates a resource and returns the response body.

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public User createUser(CreateUserRequest request) {
        return restTemplate.postForObject(
            "https://api.example.com/users",
            request,
            User.class
        );
    }
}
```

### 2.2 POST - postForEntity()
Creates a resource and returns ResponseEntity with status and headers.

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public ResponseEntity<User> createUserWithResponse(CreateUserRequest request) {
        return restTemplate.postForEntity(
            "https://api.example.com/users",
            request,
            User.class
        );
    }
    
    public void handleCreateUserResponse(CreateUserRequest request) {
        ResponseEntity<User> response = restTemplate.postForEntity(
            "https://api.example.com/users",
            request,
            User.class
        );
        
        if (response.getStatusCode() == HttpStatus.CREATED) {
            System.out.println("User created: " + response.getBody());
            System.out.println("Location: " + response.getHeaders().getLocation());
        }
    }
}
```

### 2.3 POST with Custom Headers

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public User createUserWithHeaders(CreateUserRequest request) {
        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + getAuthToken());
        headers.set("X-Custom-Header", "custom-value");
        
        // Create HttpEntity with body and headers
        HttpEntity<CreateUserRequest> entity = new HttpEntity<>(request, headers);
        
        // Make request
        ResponseEntity<User> response = restTemplate.postForEntity(
            "https://api.example.com/users",
            entity,
            User.class
        );
        
        return response.getBody();
    }
}
```

### 2.4 POST - postForLocation()
Returns the Location header (useful for getting created resource URI).

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public URI createUserAndGetLocation(CreateUserRequest request) {
        return restTemplate.postForLocation(
            "https://api.example.com/users",
            request
        );
        // Returns: https://api.example.com/users/123
    }
}
```

---

## 3. PUT Requests

### 3.1 Update Entire Resource

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public void updateUser(Long userId, UpdateUserRequest request) {
        restTemplate.put(
            "https://api.example.com/users/{id}",
            request,
            userId
        );
    }
    
    // With response
    public ResponseEntity<Void> updateUserWithResponse(Long userId, UpdateUserRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UpdateUserRequest> entity = new HttpEntity<>(request, headers);
        
        return restTemplate.exchange(
            "https://api.example.com/users/{id}",
            HttpMethod.PUT,
            entity,
            Void.class,
            userId
        );
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
    private RestTemplate restTemplate;
    
    public void partialUpdateUser(Long userId, Map<String, Object> updates) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(updates, headers);
        
        restTemplate.exchange(
            "https://api.example.com/users/{id}",
            HttpMethod.PATCH,
            entity,
            Void.class,
            userId
        );
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
    private RestTemplate restTemplate;
    
    public void deleteUser(Long userId) {
        restTemplate.delete(
            "https://api.example.com/users/{id}",
            userId
        );
    }
    
    // With Map parameters
    public void deleteUserWithMap(Long userId) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", userId);
        
        restTemplate.delete(
            "https://api.example.com/users/{id}",
            params
        );
    }
}
```

### 5.2 DELETE with Response

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public ResponseEntity<Void> deleteUserWithResponse(Long userId) {
        return restTemplate.exchange(
            "https://api.example.com/users/{id}",
            HttpMethod.DELETE,
            null,
            Void.class,
            userId
        );
    }
}
```

---

## 6. Generic exchange() Method

### 6.1 For Any HTTP Method

```java
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public ResponseEntity<User> genericRequest(Long userId, HttpMethod method) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        
        return restTemplate.exchange(
            "https://api.example.com/users/{id}",
            method,
            entity,
            User.class,
            userId
        );
    }
}
```

---

## Model Classes

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
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
```

---

## Configuration

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

---

## Key Points

✓ **getForObject()** - Use when you only need the response body
✓ **getForEntity()** - Use when you need status code, headers, or body
✓ **postForObject()** - POST and get response body
✓ **postForEntity()** - POST and get full response
✓ **postForLocation()** - POST and get Location header (useful for created resource)
✓ **put()** - Update entire resource
✓ **exchange()** - Generic method for any HTTP verb with full control
✓ **Always use UriComponentsBuilder** for building URLs with query parameters
✓ **Always set proper Content-Type headers** when sending data
