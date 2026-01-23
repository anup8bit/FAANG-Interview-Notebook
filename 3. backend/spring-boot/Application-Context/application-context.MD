# Deep Dive: Spring ApplicationContext - Lead Role Knowledge

The `ApplicationContext` is the heart of the Spring Framework. It's the central interface for providing configuration information to a Spring application and manages the entire lifecycle of beans and their dependencies.

---

## **What is ApplicationContext?**

`ApplicationContext` is a Spring interface that represents the IoC (Inversion of Control) container. It's responsible for:
- Creating and managing bean instances
- Resolving dependencies between beans
- Managing bean lifecycles
- Providing access to application resources
- Publishing application events

### **Hierarchy of ApplicationContext**

```
BeanFactory (interface)
    ↓
ApplicationContext (interface extends BeanFactory)
    ↓
ConfigurableApplicationContext (interface extends ApplicationContext)
    ↓
AbstractApplicationContext (abstract class)
    ↓
├─ ClassPathXmlApplicationContext
├─ FileSystemXmlApplicationContext
├─ AnnotationConfigApplicationContext
└─ WebApplicationContext
    ├─ DispatcherServlet ApplicationContext
    └─ Root ApplicationContext
```

---

## **Key Concepts**

### **1. IoC Container (Inversion of Control)**

The ApplicationContext implements the IoC pattern, meaning objects don't create their dependencies; the container injects them.

#### **Traditional Approach (Tight Coupling)**:
```java
public class UserService {
    // Hard dependency on concrete class
    private UserRepository userRepository = new UserRepository();
}
```

#### **Spring IoC Approach (Loose Coupling)**:
```java
@Service
public class UserService {
    // Dependency injected by Spring
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

---

### **2. Bean Lifecycle Management**

The ApplicationContext manages beans from creation to destruction.

#### **Bean Lifecycle Phases**:

```
1. Instantiation
        ↓
2. Populate Properties (Dependency Injection)
        ↓
3. Call setBeanName (BeanNameAware)
        ↓
4. Call setBeanFactory (BeanFactoryAware)
        ↓
5. Call setApplicationContext (ApplicationContextAware)
        ↓
6. Pre-initialization (BeanPostProcessor.postProcessBeforeInitialization)
        ↓
7. @PostConstruct / afterPropertiesSet()
        ↓
8. Post-initialization (BeanPostProcessor.postProcessAfterInitialization)
        ↓
9. Bean Ready for Use
        ↓
10. @PreDestroy / destroy() on application shutdown
```

#### **Example with Lifecycle Hooks**:
```java
@Component
public class UserBean implements InitializingBean, DisposableBean {
    
    private String name;

    // Injection happens here
    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        System.out.println("1. @PostConstruct: Bean is initializing");
        // Initialize resources
    }

    @Override
    public void afterPropertiesSet() {
        System.out.println("2. afterPropertiesSet: Dependencies are set");
        // Custom initialization logic
    }

    public void businessMethod() {
        System.out.println("3. Bean is in use");
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("4. @PreDestroy: Cleaning up resources");
        // Close connections, etc.
    }

    @Override
    public void destroy() {
        System.out.println("5. destroy: Bean is being destroyed");
    }
}
```

---

### **3. Dependency Resolution**

The ApplicationContext resolves dependencies between beans at startup.

#### **Example - Circular Dependency Resolution**:
```java
@Component
public class ServiceA {
    private final ServiceB serviceB;

    @Autowired
    public ServiceA(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}

@Component
public class ServiceB {
    private final ServiceA serviceA;

    @Autowired
    public ServiceB(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}
```

**Problem**: Circular dependency causes `BeanCurrentlyInCreationException`.

**Solution**: Use `@Lazy` to defer initialization.
```java
@Component
public class ServiceB {
    private final ServiceA serviceA;

    @Autowired
    public ServiceB(@Lazy ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}
```

---

### **4. Bean Scope**

The ApplicationContext supports different bean scopes:

| Scope | Description | Use Case |
|-------|-------------|----------|
| **Singleton** | One instance per ApplicationContext | Stateless services, repositories |
| **Prototype** | New instance each time requested | Stateful objects |
| **Request** | One instance per HTTP request | Web applications |
| **Session** | One instance per HTTP session | Web applications with session state |
| **Application** | One instance per ServletContext | Shared across entire web app |

#### **Example**:
```java
@Component
@Scope("singleton")
public class SingletonService {
    // One instance per application
}

@Component
@Scope("prototype")
public class PrototypeService {
    // New instance each time
}

@Component
@Scope("request")
public class RequestService {
    // New instance per HTTP request
}
```

---

## **Types of ApplicationContext**

### **1. AnnotationConfigApplicationContext** (Most Common)

Used for standalone applications with Java-based configuration.

```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserService();
    }
}

public class Application {
    public static void main(String[] args) {
        // Create ApplicationContext with Java configuration
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        
        // Get bean from context
        UserService userService = context.getBean(UserService.class);
        userService.printUsers();
        
        // Close context
        ((AnnotationConfigApplicationContext) context).close();
    }
}
```

---

### **2. ClassPathXmlApplicationContext**

Used for XML-based configuration from classpath.

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean(UserService.class);
```

---

### **3. FileSystemXmlApplicationContext**

Used for XML-based configuration from file system.

```java
ApplicationContext context = new FileSystemXmlApplicationContext("/etc/spring/applicationContext.xml");
```

---

### **4. WebApplicationContext** (Spring Web MVC)

Specialized ApplicationContext for web applications.

```
Root ApplicationContext
├─ Shared beans (services, repositories)
└─ Dispatcher Servlet ApplicationContext
    ├─ Controllers
    ├─ View Resolvers
    └─ Interceptors
```

#### **Web Context Hierarchy**:
```java
@Configuration
public class RootConfig {
    // Services, repositories, utilities
    @Bean
    public UserRepository userRepository() {
        return new UserRepository();
    }
}

@Configuration
@EnableWebMvc
public class WebConfig {
    // Controllers, view resolvers
}
```

---

## **Useful ApplicationContext Methods**

### **Bean Access**
```java
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

// Get bean by class
UserService userService = context.getBean(UserService.class);

// Get bean by name
UserService userService = context.getBean("userService", UserService.class);

// Get all beans of type
Map<String, UserService> allUserServices = context.getBeansOfType(UserService.class);

// Check if bean exists
boolean exists = context.containsBean("userService");
```

---

### **Event Publishing**
```java
@Component
public class UserEventPublisher {
    
    @Autowired
    private ApplicationContext applicationContext;

    public void publishUserCreatedEvent(User user) {
        applicationContext.publishEvent(new UserCreatedEvent(user));
    }
}

// Event listener
@Component
public class UserEventListener implements ApplicationListener<UserCreatedEvent> {
    
    @Override
    public void onApplicationEvent(UserCreatedEvent event) {
        System.out.println("User created: " + event.getUser());
    }
}

// Or using @EventListener
@Component
public class UserEventHandler {
    
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        System.out.println("User created: " + event.getUser());
    }
}
```

---

### **Resource Access**
```java
@Component
public class ResourceLoader {
    
    @Autowired
    private ApplicationContext applicationContext;

    public void loadResource() {
        // Load resource from classpath
        Resource resource = applicationContext.getResource("classpath:data.txt");
        
        // Get file from file system
        Resource fileResource = applicationContext.getResource("file:/var/data/file.txt");
        
        // Get URL resource
        Resource urlResource = applicationContext.getResource("https://example.com/data.json");
    }
}
```

---

## **Real-World Scenario: Microservices Configuration**

### **Application Context Flow in Spring Boot Microservice**

```
┌─────────────────────────────────────────────────────┐
│          Spring Boot Application Startup             │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  1. Load application properties / environment vars   │
│     - application.yml                               │
│     - application-{profile}.yml                      │
│     - System properties                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  2. Create ApplicationContext                        │
│     - AnnotationConfigApplicationContext             │
│     - Scan for @Configuration, @Component           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  3. Register Bean Definitions                        │
│     - Discover @Configuration classes               │
│     - Scan for @Component, @Service, @Repository    │
│     - Parse @Bean methods                            │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  4. Instantiate and Inject Dependencies              │
│     - Create bean instances                          │
│     - Resolve constructor dependencies               │
│     - Inject @Autowired fields/setters               │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  5. Call Lifecycle Methods                           │
│     - @PostConstruct                                 │
│     - InitializingBean.afterPropertiesSet()          │
│     - Custom initialization logic                    │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  6. Application Ready for Requests                   │
│     - Actuators expose metrics                       │
│     - Servers start listening                        │
│     - Event listeners active                         │
└─────────────────────────────────────────────────────┘
```

---

## **Enterprise Example: Multi-Layer Microservice**

```java
// Step 1: Define DTOs and Entities
public class User {
    private Long id;
    private String name;
    private String email;
    // getters, setters
}

// Step 2: Repository Layer
@Repository
public class UserRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public User findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT * FROM users WHERE id = ?",
            new Object[]{id},
            new UserRowMapper()
        );
    }
}

// Step 3: Service Layer
@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final ApplicationContext applicationContext;

    @Autowired
    public UserService(UserRepository userRepository, ApplicationContext applicationContext) {
        this.userRepository = userRepository;
        this.applicationContext = applicationContext;
    }

    public User getUser(Long id) {
        User user = userRepository.findById(id);
        // Publish event
        applicationContext.publishEvent(new UserFetchedEvent(user));
        return user;
    }
}

// Step 4: Controller Layer
@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }
}

// Step 5: Configuration
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    
    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/mydb");
        config.setUsername("user");
        config.setPassword("password");
        return new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}

// Step 6: Event Publishing
@Component
public class UserEventListener {
    
    @EventListener
    public void onUserFetched(UserFetchedEvent event) {
        System.out.println("User fetched: " + event.getUser().getName());
        // Log, cache, metrics, etc.
    }
}

// Step 7: Application Startup
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        // Spring creates ApplicationContext automatically
        SpringApplication.run(Application.class, args);
        
        // ApplicationContext is now ready
        // All beans are instantiated and injected
        // Event listeners are active
        // Server is listening
    }
}
```

---

## **Advanced: Custom ApplicationContextAware**

```java
@Component
public class BeanLogger implements ApplicationContextAware {
    
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) 
            throws BeansException {
        this.applicationContext = applicationContext;
    }

    @PostConstruct
    public void logAllBeans() {
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        System.out.println("Total beans: " + beanNames.length);
        
        for (String beanName : beanNames) {
            Object bean = applicationContext.getBean(beanName);
            System.out.println("Bean: " + beanName + " -> " + bean.getClass().getSimpleName());
        }
    }
}
```

---

## **Interview Questions for Lead Role**

1. **What is the difference between BeanFactory and ApplicationContext?**
   - BeanFactory: Basic container, lazy loading
   - ApplicationContext: Extended interface, eager loading, event publishing, resource access

2. **Explain the bean lifecycle in Spring ApplicationContext.**

3. **How does Spring resolve circular dependencies?**

4. **What happens during ApplicationContext initialization?**

5. **How can you access ApplicationContext in a Spring bean?**

6. **What are the different types of ApplicationContext? When would you use each?**

7. **How does event publishing work in Spring ApplicationContext?**

8. **What is the difference between @Configuration and @Component in context of bean management?**

9. **How does Spring handle multiple implementations of the same interface?**

10. **Explain the difference between singleton and prototype scopes in ApplicationContext.**

11. **What is ApplicationContextAware and why would you implement it?**

12. **How does Spring Boot create and manage ApplicationContext?**

---

## **Key Takeaways for Google Interview**

✅ **ApplicationContext is the IoC container** - manages all beans and their dependencies

✅ **Bean lifecycle is critical** - understand all phases from creation to destruction

✅ **Dependency injection reduces coupling** - makes code testable and maintainable

✅ **Event-driven architecture** - ApplicationContext enables loosely coupled components

✅ **Scope management** - choose appropriate scopes for different use cases

✅ **Resource management** - ApplicationContext handles file, URL, and classpath resources

✅ **Profile-based configuration** - separate configs for dev, test, prod environments

✅ **Lazy vs Eager loading** - ApplicationContext eagerly loads singletons by default

---

This guide provides comprehensive, production-ready knowledge on Spring ApplicationContext suitable for lead-level roles at FAANG companies.