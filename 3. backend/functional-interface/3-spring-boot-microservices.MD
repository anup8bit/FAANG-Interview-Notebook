# Functional Programming in Spring Boot Microservices

## Table of Contents
1. [Basics to Advanced Concepts](#basics-to-advanced-concepts)
2. [Spring Boot Integration](#spring-boot-integration)
3. [Microservices Use Cases](#microservices-use-cases)
4. [Real-World Examples](#real-world-examples)

---

## Basics to Advanced Concepts

### Level 1: Fundamentals

**Functional Interface**: An interface with a single abstract method
```java
@FunctionalInterface
public interface UserProcessor {
    User process(User user);
}

// Lambda implementation
UserProcessor toUpperCaseEmail = user -> {
    user.setEmail(user.getEmail().toUpperCase());
    return user;
};
```

### Level 2: Intermediate - Stream Operations

Functional interfaces power Java Streams (a core feature in microservices):

```java
List<User> users = userRepository.findAll();

// Filter (Predicate - functional interface)
List<User> activeUsers = users.stream()
    .filter(user -> user.isActive())
    .collect(Collectors.toList());

// Map (Function - functional interface)
List<String> emails = users.stream()
    .map(user -> user.getEmail())
    .collect(Collectors.toList());

// Reduce (functional approach)
int totalAge = users.stream()
    .mapToInt(User::getAge)
    .reduce(0, Integer::sum);
```

### Level 3: Advanced - Functional Composition

Combining multiple functional interfaces:

```java
@FunctionalInterface
public interface DataTransformer<T, R> {
    R transform(T input);
}

public class TransformationPipeline<T, R> {
    private List<DataTransformer<?, ?>> transformers = new ArrayList<>();
    
    public <U> TransformationPipeline<T, U> addStep(DataTransformer<R, U> transformer) {
        transformers.add(transformer);
        return (TransformationPipeline<T, U>) this;
    }
    
    public R execute(T input) {
        Object result = input;
        for (DataTransformer<?, ?> transformer : transformers) {
            result = ((DataTransformer<Object, Object>) transformer).transform(result);
        }
        return (R) result;
    }
}
```

### Level 4: Expert - Functional Spring Features

Spring Framework provides functional programming support:

```java
// Spring provides Function<Request, Response> pattern
public class FunctionalEndpoint {
    private Function<ServerRequest, Mono<ServerResponse>> handler = 
        request -> {
            String id = request.pathVariable("id");
            return userService.getUserById(id)
                .flatMap(user -> ServerResponse.ok().bodyValue(user))
                .switchIfEmpty(ServerResponse.notFound().build());
        };
}
```

---

## Spring Boot Integration

### 1. Spring Data with Functional Interfaces

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods return Optional, which supports functional operations
    Optional<User> findByEmail(String email);
}

// Usage in Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    // Functional approach
    public UserDTO getUserDTO(String email) {
        return userRepository.findByEmail(email)
            .map(this::convertToDTO)           // Function
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }
}
```

### 2. Spring MVC Controllers with Functional Approach

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Traditional approach
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Functional approach (using Supplier & Function)
    @GetMapping("/{id}/functional")
    public ResponseEntity<UserDTO> getUserFunctional(@PathVariable Long id) {
        return userService.getUserByIdFunctional(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
```

### 3. Spring WebFlux with Functional Routing

```java
@Configuration
public class FunctionalRoutes {
    
    @Bean
    public RouterFunction<ServerResponse> userRoutes(UserHandler handler) {
        return route(GET("/users/{id}"), handler::getUser)
            .andRoute(POST("/users"), handler::createUser)
            .andRoute(PUT("/users/{id}"), handler::updateUser)
            .andRoute(DELETE("/users/{id}"), handler::deleteUser);
    }
}

@Component
public class UserHandler {
    @Autowired
    private UserService userService;
    
    public Mono<ServerResponse> getUser(ServerRequest request) {
        Long id = Long.valueOf(request.pathVariable("id"));
        return userService.getUserByIdReactive(id)
            .flatMap(user -> ServerResponse.ok().bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    public Mono<ServerResponse> createUser(ServerRequest request) {
        return request.bodyToMono(UserDTO.class)
            .flatMap(userDTO -> userService.createUserReactive(userDTO))
            .flatMap(user -> ServerResponse.status(HttpStatus.CREATED).bodyValue(user));
    }
}
```

---

## Microservices Use Cases

### Use Case 1: Data Validation Pipeline

```java
@FunctionalInterface
public interface ValidationRule<T> {
    boolean validate(T input);
}

@FunctionalInterface
public interface ValidationErrorHandler {
    void handle(String errorMessage);
}

@Service
public class UserValidationService {
    
    private List<ValidationRule<UserDTO>> rules = Arrays.asList(
        user -> user.getEmail() != null && user.getEmail().contains("@"),
        user -> user.getName() != null && !user.getName().isEmpty(),
        user -> user.getAge() >= 18
    );
    
    public boolean validateUser(UserDTO user, ValidationErrorHandler errorHandler) {
        return rules.stream()
            .allMatch(rule -> {
                boolean isValid = rule.validate(user);
                if (!isValid) {
                    errorHandler.handle("Validation failed for: " + user);
                }
                return isValid;
            });
    }
}
```

### Use Case 2: Service Chaining with Functional Composition

```java
@Service
public class OrderProcessingService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private NotificationService notificationService;
    
    // Function composition for microservice workflow
    public OrderResponse processOrder(OrderRequest request) {
        // Chain operations using Function<T, R>
        return createOrderFunction()
            .andThen(validateInventoryFunction())
            .andThen(processPaymentFunction())
            .andThen(sendNotificationFunction())
            .apply(request);
    }
    
    private Function<OrderRequest, OrderRequest> createOrderFunction() {
        return request -> {
            Order order = new Order();
            order.setUser(userService.getUserById(request.getUserId()));
            order.setItems(request.getItems());
            return request;
        };
    }
    
    private Function<OrderRequest, OrderRequest> validateInventoryFunction() {
        return request -> {
            boolean hasInventory = request.getItems().stream()
                .allMatch(item -> checkInventory(item));
            if (!hasInventory) {
                throw new InventoryException("Items out of stock");
            }
            return request;
        };
    }
    
    private Function<OrderRequest, OrderRequest> processPaymentFunction() {
        return request -> {
            PaymentResponse payment = paymentService.processPayment(
                request.getPaymentInfo()
            );
            if (!payment.isSuccess()) {
                throw new PaymentException("Payment failed");
            }
            return request;
        };
    }
    
    private Function<OrderRequest, OrderRequest> sendNotificationFunction() {
        return request -> {
            notificationService.sendConfirmation(request.getUserId());
            return request;
        };
    }
}
```

### Use Case 3: Asynchronous Processing with Callbacks

```java
@FunctionalInterface
public interface AsyncCallback<T> {
    void onSuccess(T result);
    
    default void onError(Exception e) {
        System.err.println("Error: " + e.getMessage());
    }
}

@Service
public class AsyncUserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    @Qualifier("asyncExecutor")
    private Executor executor;
    
    public void getUserAsync(Long id, AsyncCallback<UserDTO> callback) {
        executor.execute(() -> {
            try {
                UserDTO user = userRepository.findById(id)
                    .map(this::convertToDTO)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
                callback.onSuccess(user);
            } catch (Exception e) {
                callback.onError(e);
            }
        });
    }
    
    // Usage
    public void processUserAsync(Long userId) {
        getUserAsync(userId, new AsyncCallback<UserDTO>() {
            @Override
            public void onSuccess(UserDTO user) {
                System.out.println("User processed: " + user.getName());
            }
            
            @Override
            public void onError(Exception e) {
                System.err.println("Failed to process user: " + e.getMessage());
            }
        });
    }
}
```

### Use Case 4: Stream Processing for Analytics

```java
@Service
public class AnalyticsService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Complex stream operations for analytics
    public Analytics generateUserAnalytics() {
        return userRepository.findAll().stream()
            // Filter active users
            .filter(User::isActive)
            // Group by role
            .collect(Collectors.groupingBy(
                User::getRole,
                // Count by role
                Collectors.counting()
            ))
            .entrySet().stream()
            // Map to DTO
            .map(entry -> new RoleStatistics(entry.getKey(), entry.getValue()))
            .collect(Collectors.collectingAndThen(
                Collectors.toList(),
                roles -> new Analytics(roles)
            ));
    }
    
    // Advanced: Custom collector
    public Map<String, List<User>> groupUsersByDepartment() {
        return userRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                user -> user.getDepartment().getName(),
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    users -> users.stream()
                        .sorted(Comparator.comparing(User::getName))
                        .collect(Collectors.toList())
                )
            ));
    }
}
```

---

## Real-World Examples

### Example 1: Complete User Microservice with Functional Programming

```java
// Entity
@Entity
@Data
public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String email;
    private boolean active;
}

// DTO
@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
}

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByActive(boolean active);
}

// Service with Functional Approach
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Transformation function
    private final Function<User, UserDTO> toDTO = user -> 
        new UserDTO(user.getId(), user.getName(), user.getEmail());
    
    // Validation function
    private final Predicate<UserDTO> isValid = user -> 
        user.getEmail() != null && user.getName() != null;
    
    // Consumer for logging
    private final Consumer<User> logUserCreation = user -> 
        System.out.println("User created: " + user.getEmail());
    
    // Main service methods
    public UserDTO createUser(UserDTO userDTO) {
        if (!isValid.test(userDTO)) {
            throw new IllegalArgumentException("Invalid user data");
        }
        
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        logUserCreation.accept(savedUser);
        notificationService.sendWelcomeEmail(savedUser.getEmail());
        
        return toDTO.apply(savedUser);
    }
    
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
            .map(toDTO);
    }
    
    public List<UserDTO> getAllActiveUsers() {
        return userRepository.findByActive(true).stream()
            .map(toDTO)
            .collect(Collectors.toList());
    }
    
    public List<UserDTO> searchUsers(String query) {
        return userRepository.findAll().stream()
            .filter(user -> user.getName().toLowerCase().contains(query.toLowerCase()) ||
                           user.getEmail().toLowerCase().contains(query.toLowerCase()))
            .map(toDTO)
            .collect(Collectors.toList());
    }
}

// Controller with Functional Response Handling
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        return Optional.of(userDTO)
            .map(userService::createUser)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.badRequest().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllActiveUsers() {
        return ResponseEntity.ok(userService.getAllActiveUsers());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
}
```

### Example 2: Inter-Microservice Communication

```java
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    // Functional approach to service calls
    private final Function<Long, User> getUserFromDB = userId -> 
        userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    
    private final Function<User, OrderData> validateAndCreateOrder = user -> {
        if (!user.isActive()) {
            throw new IllegalStateException("User is not active");
        }
        return new OrderData(user.getId(), new ArrayList<>());
    };
    
    public OrderResponse processOrder(OrderRequest request) {
        return Optional.of(request.getUserId())
            .map(getUserFromDB)
            .map(validateAndCreateOrder)
            .map(this::calculateTotal)
            .map(this::persistOrder)
            .map(OrderResponse::fromOrder)
            .orElseThrow(() -> new RuntimeException("Order processing failed"));
    }
    
    private OrderData calculateTotal(OrderData order) {
        double total = order.getItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        order.setTotal(total);
        return order;
    }
    
    private Order persistOrder(OrderData order) {
        Order savedOrder = new Order();
        savedOrder.setUserId(order.getUserId());
        savedOrder.setTotal(order.getTotal());
        return savedOrder;
    }
}
```

---

## Key Benefits in Microservices

| Aspect | Benefit |
|--------|---------|
| **Code Readability** | Lambda expressions are concise and clear |
| **Stream Processing** | Handle collections efficiently |
| **Async Operations** | Callbacks and functional composition enable async patterns |
| **Testability** | Pure functions are easier to unit test |
| **Composability** | Chain operations naturally |
| **Error Handling** | Optional and functional patterns reduce null checks |
| **Performance** | Lazy evaluation with streams |

---

## Best Practices

1. **Use Optional** instead of null checks
2. **Prefer immutability** in functional chains
3. **Keep functions pure** - no side effects
4. **Use method references** for clarity
5. **Leverage Stream API** for bulk operations
6. **Combine with Spring beans** for dependency injection
7. **Handle exceptions** in functional chains appropriately
8. **Use @FunctionalInterface** for custom functional interfaces
