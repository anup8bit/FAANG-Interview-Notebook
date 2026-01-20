# RestTemplate Client - Practical Implementation Examples

## 1. Complete User Service Implementation

```java
// Model Classes
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

// Exception Classes
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class ApiClientException extends RuntimeException {
    public ApiClientException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Configuration
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
        restTemplate.setErrorHandler(new CustomErrorHandler());
        return restTemplate;
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        factory.setHttpClient(httpClient());
        return factory;
    }
    
    @Bean
    public HttpClient httpClient() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setMaxTotal(100);
        cm.setDefaultMaxPerRoute(20);
        
        return HttpClientBuilder.create()
            .setConnectionManager(cm)
            .build();
    }
}

// Custom Error Handler
@Component
public class CustomErrorHandler implements ResponseErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomErrorHandler.class);
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || 
               response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String errorBody = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        
        if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
            throw new ResourceNotFoundException("Resource not found: " + errorBody);
        } else {
            logger.error("API Error: {} - {}", response.getStatusCode(), errorBody);
            throw new ApiClientException("API call failed", null);
        }
    }
}

// Service Implementation
@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final String BASE_URL = "https://api.example.com";
    
    @Autowired
    private RestTemplate restTemplate;
    
    // 1. GET - Fetch single user
    public User getUserById(Long userId) {
        try {
            return restTemplate.getForObject(
                BASE_URL + "/users/{id}",
                User.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to get user {}", userId, e);
            throw new ApiClientException("Failed to fetch user", e);
        }
    }
    
    // 2. GET - Fetch all users
    public List<User> getAllUsers() {
        try {
            User[] users = restTemplate.getForObject(
                BASE_URL + "/users",
                User[].class
            );
            return users != null ? Arrays.asList(users) : Collections.emptyList();
        } catch (ResourceAccessException e) {
            logger.error("Failed to get all users", e);
            throw new ApiClientException("Failed to fetch users", e);
        }
    }
    
    // 3. GET - Fetch with query parameters
    public List<User> searchUsers(String name, int age) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/users")
                .queryParam("name", name)
                .queryParam("age", age)
                .toUriString();
            
            User[] users = restTemplate.getForObject(url, User[].class);
            return users != null ? Arrays.asList(users) : Collections.emptyList();
        } catch (ResourceAccessException e) {
            logger.error("Failed to search users", e);
            throw new ApiClientException("Failed to search users", e);
        }
    }
    
    // 4. GET - With ResponseEntity (to get headers)
    public ResponseEntity<User> getUserWithHeaders(Long userId) {
        try {
            return restTemplate.getForEntity(
                BASE_URL + "/users/{id}",
                User.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to get user {}", userId, e);
            throw new ApiClientException("Failed to fetch user", e);
        }
    }
    
    // 5. POST - Create user
    public User createUser(CreateUserRequest request) {
        try {
            return restTemplate.postForObject(
                BASE_URL + "/users",
                request,
                User.class
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to create user", e);
            throw new ApiClientException("Failed to create user", e);
        }
    }
    
    // 6. POST - With response entity
    public ResponseEntity<User> createUserWithResponse(CreateUserRequest request) {
        try {
            return restTemplate.postForEntity(
                BASE_URL + "/users",
                request,
                User.class
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to create user", e);
            throw new ApiClientException("Failed to create user", e);
        }
    }
    
    // 7. POST - With custom headers
    public User createUserWithAuth(CreateUserRequest request, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);
            
            HttpEntity<CreateUserRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<User> response = restTemplate.postForEntity(
                BASE_URL + "/users",
                entity,
                User.class
            );
            
            return response.getBody();
        } catch (ResourceAccessException e) {
            logger.error("Failed to create user", e);
            throw new ApiClientException("Failed to create user", e);
        }
    }
    
    // 8. PUT - Update user
    public void updateUser(Long userId, UpdateUserRequest request) {
        try {
            restTemplate.put(
                BASE_URL + "/users/{id}",
                request,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to update user {}", userId, e);
            throw new ApiClientException("Failed to update user", e);
        }
    }
    
    // 9. PUT - With response
    public ResponseEntity<Void> updateUserWithResponse(Long userId, UpdateUserRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<UpdateUserRequest> entity = new HttpEntity<>(request, headers);
            
            return restTemplate.exchange(
                BASE_URL + "/users/{id}",
                HttpMethod.PUT,
                entity,
                Void.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to update user {}", userId, e);
            throw new ApiClientException("Failed to update user", e);
        }
    }
    
    // 10. PATCH - Partial update
    public void patchUser(Long userId, Map<String, Object> updates) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(updates, headers);
            
            restTemplate.exchange(
                BASE_URL + "/users/{id}",
                HttpMethod.PATCH,
                entity,
                Void.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to patch user {}", userId, e);
            throw new ApiClientException("Failed to patch user", e);
        }
    }
    
    // 11. DELETE - Delete user
    public void deleteUser(Long userId) {
        try {
            restTemplate.delete(
                BASE_URL + "/users/{id}",
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to delete user {}", userId, e);
            throw new ApiClientException("Failed to delete user", e);
        }
    }
    
    // 12. DELETE - With response
    public ResponseEntity<Void> deleteUserWithResponse(Long userId) {
        try {
            return restTemplate.exchange(
                BASE_URL + "/users/{id}",
                HttpMethod.DELETE,
                null,
                Void.class,
                userId
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to delete user {}", userId, e);
            throw new ApiClientException("Failed to delete user", e);
        }
    }
    
    // 13. Generic exchange method
    public <T> ResponseEntity<T> exchange(
            String path,
            HttpMethod method,
            Object request,
            Class<T> responseType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> entity = new HttpEntity<>(request, headers);
            
            return restTemplate.exchange(
                BASE_URL + path,
                method,
                entity,
                responseType
            );
        } catch (ResourceAccessException e) {
            logger.error("Failed to execute {} request to {}", method, path, e);
            throw new ApiClientException("API call failed", e);
        }
    }
}

// REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String name,
            @RequestParam int age) {
        List<User> users = userService.searchUsers(name, age);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        userService.updateUser(id, request);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 2. Test Cases

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserService userService;
    
    private MockRestServiceServer mockServer;
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @BeforeEach
    void setUp() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }
    
    @Test
    void testGetUserById() throws JsonProcessingException {
        User expectedUser = User.builder()
            .id(1L)
            .name("John Doe")
            .email("john@example.com")
            .age(30)
            .build();
        
        mockServer.expect(requestTo("https://api.example.com/users/1"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(objectMapper.writeValueAsString(expectedUser), 
                MediaType.APPLICATION_JSON));
        
        User result = userService.getUserById(1L);
        
        assertEquals(expectedUser.getName(), result.getName());
        assertEquals(expectedUser.getEmail(), result.getEmail());
        mockServer.verify();
    }
    
    @Test
    void testGetAllUsers() throws JsonProcessingException {
        User[] expectedUsers = {
            User.builder().id(1L).name("John").email("john@example.com").build(),
            User.builder().id(2L).name("Jane").email("jane@example.com").build()
        };
        
        mockServer.expect(requestTo("https://api.example.com/users"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(objectMapper.writeValueAsString(expectedUsers), 
                MediaType.APPLICATION_JSON));
        
        List<User> result = userService.getAllUsers();
        
        assertEquals(2, result.size());
        mockServer.verify();
    }
    
    @Test
    void testCreateUser() throws JsonProcessingException {
        CreateUserRequest request = new CreateUserRequest("John", "john@example.com", 30);
        User expectedUser = User.builder()
            .id(1L)
            .name("John")
            .email("john@example.com")
            .age(30)
            .build();
        
        mockServer.expect(requestTo("https://api.example.com/users"))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withStatus(HttpStatus.CREATED)
                .body(objectMapper.writeValueAsString(expectedUser))
                .contentType(MediaType.APPLICATION_JSON));
        
        User result = userService.createUser(request);
        
        assertEquals(expectedUser.getName(), result.getName());
        mockServer.verify();
    }
    
    @Test
    void testUpdateUser() {
        UpdateUserRequest request = new UpdateUserRequest("Jane", "jane@example.com", 25);
        
        mockServer.expect(requestTo("https://api.example.com/users/1"))
            .andExpect(method(HttpMethod.PUT))
            .andRespond(withStatus(HttpStatus.NO_CONTENT));
        
        assertDoesNotThrow(() -> userService.updateUser(1L, request));
        mockServer.verify();
    }
    
    @Test
    void testDeleteUser() {
        mockServer.expect(requestTo("https://api.example.com/users/1"))
            .andExpect(method(HttpMethod.DELETE))
            .andRespond(withStatus(HttpStatus.NO_CONTENT));
        
        assertDoesNotThrow(() -> userService.deleteUser(1L));
        mockServer.verify();
    }
    
    @Test
    void testUserNotFound() {
        mockServer.expect(requestTo("https://api.example.com/users/999"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withStatus(HttpStatus.NOT_FOUND));
        
        assertThrows(ResourceNotFoundException.class, 
            () -> userService.getUserById(999L));
        mockServer.verify();
    }
}
```

---

## 3. Usage Example in Business Logic

```java
@Service
public class UserRegistrationService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public void registerUser(CreateUserRequest request) {
        // 1. Call external API to create user
        User createdUser = userService.createUser(request);
        
        // 2. Send email notification
        emailService.sendWelcomeEmail(createdUser.getEmail());
        
        // 3. Save locally if needed
        // userRepository.save(createdUser);
    }
    
    public List<User> getActiveUsers() {
        List<User> allUsers = userService.getAllUsers();
        return allUsers.stream()
            .filter(user -> user.getAge() >= 18)
            .collect(Collectors.toList());
    }
}
```

---

## Key Takeaways

✓ **Service Layer Pattern** - Encapsulate API calls in service classes
✓ **Error Handling** - Implement custom error handlers and exceptions
✓ **Dependency Injection** - Use @Autowired for RestTemplate beans
✓ **Type Safety** - Use generics for flexible API calls
✓ **Logging** - Log all API interactions for debugging
✓ **Testing** - Use MockRestServiceServer for unit testing
✓ **Timeouts** - Always configure connection and read timeouts
✓ **Connection Pooling** - Configure for high-performance scenarios
