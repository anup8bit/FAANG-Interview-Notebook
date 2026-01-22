# Deep Dive: @Configuration and @ConfigurationProperties in Spring Boot

This guide provides enterprise-level knowledge on `@Configuration` and `@ConfigurationProperties` annotations, critical for FAANG-level interviews and production microservices.

---

## **Part 1: @Configuration Annotation**

### **What is @Configuration?**

`@Configuration` is a Spring annotation that marks a class as a source of bean definitions. It's a replacement for XML-based Spring configuration and allows you to define beans programmatically using Java code.

### **Key Characteristics**

1. **Bean Definition Source**:
   - Declares one or more `@Bean` methods that return beans managed by Spring.
   - Acts as a blueprint for Spring's `ApplicationContext` to create and manage beans.

2. **CGLIB Proxy Enhancement**:
   - Spring uses **CGLIB** (Code Generation Library) to create a proxy of the `@Configuration` class.
   - This proxy ensures **singleton behavior** even if `@Bean` methods are called multiple times.

3. **Scope and Lifecycle**:
   - Singleton by default (only one instance per `ApplicationContext`).
   - Beans defined in a `@Configuration` class are also singletons by default.

---

### **How @Configuration Works Internally**

#### **Without @Configuration (Using @Component)**
```java
@Component
public class AppConfigComponent {
    @Bean
    public ServiceA serviceA() {
        return new ServiceA();
    }

    @Bean
    public ServiceB serviceB() {
        // Each call creates a NEW instance
        return new ServiceB(serviceA()); // Creates a new ServiceA!
    }
}
```

**Problem**: Multiple instances of `ServiceA` are created, breaking the singleton pattern.

---

#### **With @Configuration**
```java
@Configuration
public class AppConfig {
    @Bean
    public ServiceA serviceA() {
        return new ServiceA();
    }

    @Bean
    public ServiceB serviceB() {
        // serviceA() returns the SAME singleton instance
        return new ServiceB(serviceA());
    }
}
```

**Solution**: CGLIB proxy ensures `serviceA()` always returns the same singleton bean.

---

### **CGLIB Proxy Mechanism**

When Spring encounters `@Configuration`:

1. **Class Loading**: Spring creates a CGLIB-enhanced subclass of your `@Configuration` class.
2. **Method Interception**: Every `@Bean` method call is intercepted.
3. **Singleton Cache Check**: 
   - If the bean already exists in the `BeanFactory`, return it.
   - If not, create it once and cache it.

#### **Internal Proxy Implementation**
```java
// Original class
@Configuration
public class AppConfig {
    @Bean
    public ServiceA serviceA() {
        return new ServiceA();
    }
}

// What Spring creates (simplified)
public class AppConfig$$EnhancedBySpringCGLIB extends AppConfig {
    @Override
    public ServiceA serviceA() {
        // Check if bean exists in factory
        if (beanFactory.containsBean("serviceA")) {
            return beanFactory.getBean("serviceA");
        }
        // Create and cache
        ServiceA bean = super.serviceA();
        beanFactory.registerSingleton("serviceA", bean);
        return bean;
    }
}
```

---

### **@Configuration Use Cases**

#### **1. Third-Party Library Integration**
```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/mydb");
        config.setUsername("user");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        return new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

---

#### **2. Complex Bean Initialization**
```java
@Configuration
public class KafkaConfig {
    
    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate(
            ProducerFactory<String, String> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
}
```

---

#### **3. Conditional Bean Registration**
```java
@Configuration
public class FeatureToggleConfig {
    
    @Bean
    @ConditionalOnProperty(name = "feature.new-service.enabled", havingValue = "true")
    public NewService newService() {
        return new NewService();
    }

    @Bean
    @ConditionalOnProperty(name = "feature.new-service.enabled", havingValue = "false")
    public LegacyService legacyService() {
        return new LegacyService();
    }
}
```

---

#### **4. Profile-Specific Configuration**
```java
@Configuration
public class DatabaseConfig {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .addScript("classpath:schema.sql")
                .build();
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(System.getenv("DB_URL"));
        config.setUsername(System.getenv("DB_USER"));
        config.setPassword(System.getenv("DB_PASSWORD"));
        return new HikariDataSource(config);
    }
}
```

---

### **@Configuration vs @Component**

| Feature | @Configuration | @Component |
|---------|----------------|-----------|
| **Purpose** | Define beans via `@Bean` methods | Auto-scanned component |
| **CGLIB Proxy** | Yes (ensures singleton) | No |
| **@Bean Methods** | Supported | Not used |
| **Singleton Guarantee** | Guaranteed for bean methods | Default singleton |
| **Use Case** | Complex bean setup, 3rd-party libs | Simple business logic |

---

### **Common Pitfalls**

#### **Pitfall 1: Using @Component with @Bean Methods**
```java
@Component  // ❌ Wrong
public class MyConfig {
    @Bean
    public ServiceA serviceA() {
        return new ServiceA();
    }

    @Bean
    public ServiceB serviceB() {
        // Each call creates a NEW ServiceA!
        return new ServiceB(serviceA());
    }
}
```

**Fix**: Use `@Configuration` instead.

---

#### **Pitfall 2: Not Using Dependency Injection in @Bean Methods**
```java
@Configuration
public class AppConfig {
    @Bean
    public ServiceA serviceA() {
        return new ServiceA();
    }

    @Bean
    public ServiceB serviceB() {
        // ❌ Creates new instance, not injected
        return new ServiceB(new ServiceA());
    }
}
```

**Fix**: Inject via method parameter.
```java
@Bean
public ServiceB serviceB(ServiceA serviceA) {
    // ✅ Uses singleton ServiceA bean
    return new ServiceB(serviceA);
}
```

---

---

## **Part 2: @ConfigurationProperties Annotation**

### **What is @ConfigurationProperties?**

`@ConfigurationProperties` is a Spring annotation that binds externalized configuration properties (from `application.yml`, `application.properties`, or environment variables) to a Java POJO (Plain Old Java Object).

### **Key Characteristics**

1. **Type-Safe Configuration Binding**:
   - Properties are mapped to strongly-typed Java classes.
   - Provides compile-time safety and IDE autocomplete.

2. **Hierarchical Property Support**:
   - Supports nested properties with dot notation (e.g., `app.datasource.url`).

3. **Validation Support**:
   - Integrates with `@Validated` and `javax.validation.constraints` for property validation.

4. **Property Relaxed Binding**:
   - Supports multiple naming conventions: `app.myProperty`, `app.my-property`, `app.my_property`.

---

### **Basic Usage**

#### **Step 1: Create a Configuration Properties Class**
```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private String name;
    private int timeout;
    private List<String> allowedOrigins;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}
```

#### **Step 2: Enable Configuration Properties**
```java
@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
}
```

Or use `@ConfigurationPropertiesScan`:
```java
@SpringBootApplication
@ConfigurationPropertiesScan("com.example.config")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### **Step 3: Define Properties in application.yml**
```yaml
app:
  name: MyApplication
  timeout: 30
  allowedOrigins:
    - http://localhost:3000
    - http://localhost:8080
```

#### **Step 4: Inject and Use**
```java
@Service
public class MyService {
    
    private final AppProperties appProperties;

    public MyService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void printConfig() {
        System.out.println("App Name: " + appProperties.getName());
        System.out.println("Timeout: " + appProperties.getTimeout());
        System.out.println("Allowed Origins: " + appProperties.getAllowedOrigins());
    }
}
```

---

### **Advanced: Nested Configuration Properties**

#### **Nested POJO Example**
```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private String name;
    private Database database;
    private Cache cache;

    // Getters and Setters
    public static class Database {
        private String url;
        private String username;
        private String password;
        private int poolSize;

        // Getters and Setters
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public int getPoolSize() { return poolSize; }
        public void setPoolSize(int poolSize) { this.poolSize = poolSize; }
    }

    public static class Cache {
        private String type;
        private int ttl;

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public int getTtl() { return ttl; }
        public void setTtl(int ttl) { this.ttl = ttl; }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Database getDatabase() { return database; }
    public void setDatabase(Database database) { this.database = database; }

    public Cache getCache() { return cache; }
    public void setCache(Cache cache) { this.cache = cache; }
}
```

#### **YAML Configuration**
```yaml
app:
  name: MyApp
  database:
    url: jdbc:postgresql://localhost:5432/mydb
    username: user
    password: password
    poolSize: 10
  cache:
    type: redis
    ttl: 3600
```

---

### **Validation with @Validated**

#### **Add Validation Annotations**
```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    
    @NotBlank(message = "App name is required")
    private String name;

    @Min(value = 1, message = "Timeout must be at least 1 second")
    @Max(value = 300, message = "Timeout cannot exceed 300 seconds")
    private int timeout;

    @NotEmpty(message = "At least one allowed origin must be specified")
    private List<String> allowedOrigins;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }

    public List<String> getAllowedOrigins() { return allowedOrigins; }
    public void setAllowedOrigins(List<String> allowedOrigins) { 
        this.allowedOrigins = allowedOrigins; 
    }
}
```

#### **YAML Configuration**
```yaml
app:
  name: MyApplication
  timeout: 30
  allowedOrigins:
    - http://localhost:3000
    - http://localhost:8080
```

**If validation fails** (e.g., missing `name`), Spring throws a `BindException` with detailed error messages.

---

### **@ConfigurationProperties vs @Value**

| Feature | @ConfigurationProperties | @Value |
|---------|--------------------------|--------|
| **Binding** | Multiple properties to POJO | Single property |
| **Type Safety** | Strong typing | Basic typing |
| **Validation** | Supported via `@Validated` | Not supported |
| **Relaxed Binding** | Yes | No |
| **SpEL Support** | No | Yes |
| **Use Case** | Complex configs | Simple configs |

#### **Example Comparison**

**Using @Value**:
```java
@Component
public class MyComponent {
    @Value("${app.name}")
    private String appName;

    @Value("${app.timeout}")
    private int timeout;

    @Value("${app.allowedOrigins}")
    private List<String> origins;
}
```

**Using @ConfigurationProperties** (preferred):
```java
@Component
public class MyComponent {
    private final AppProperties appProperties;

    public MyComponent(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void useConfig() {
        String name = appProperties.getName();
        int timeout = appProperties.getTimeout();
        List<String> origins = appProperties.getAllowedOrigins();
    }
}
```

---

### **Real-World Example: Microservices Database Configuration**

```java
@ConfigurationProperties(prefix = "spring.datasource")
@Validated
public class DataSourceProperties {
    
    @NotBlank(message = "URL is required")
    private String url;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @Min(5)
    @Max(100)
    private int poolSize = 10;

    @Min(10)
    private int connectionTimeout = 30000;

    // Getters and Setters
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getPoolSize() { return poolSize; }
    public void setPoolSize(int poolSize) { this.poolSize = poolSize; }

    public int getConnectionTimeout() { return connectionTimeout; }
    public void setConnectionTimeout(int connectionTimeout) { 
        this.connectionTimeout = connectionTimeout; 
    }
}
```

#### **Profile-Specific Configuration**

**application-dev.yml**:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: 
    poolSize: 5
```

**application-prod.yml**:
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    poolSize: 20
    connectionTimeout: 60000
```

---

### **Common Pitfalls**

#### **Pitfall 1: Not Enabling @ConfigurationProperties**
```java
// ❌ Won't work without @EnableConfigurationProperties or @ConfigurationPropertiesScan
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    // ...
}
```

**Fix**: Enable it explicitly.
```java
@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
}
```

---

#### **Pitfall 2: Using Mutable Properties (No Setter)**
```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name; // No setter!
}
```

**Fix**: Provide setters or use Lombok.
```java
@ConfigurationProperties(prefix = "app")
@Data  // Lombok generates getters and setters
public class AppProperties {
    private String name;
}
```

---

#### **Pitfall 3: Ignoring Property Name Relaxation**
```yaml
app:
  my-property: value  # Dash-separated
  # Also works: myProperty, my_property
```

Spring automatically converts these to camelCase in the POJO.

---

---

## **Combining @Configuration and @ConfigurationProperties**

### **Enterprise Pattern Example**

```java
// Step 1: Configuration Properties Class
@ConfigurationProperties(prefix = "app.cache")
@Data
@Validated
public class CacheProperties {
    
    @NotBlank
    private String type = "redis";

    @Min(60)
    private int ttl = 3600;

    @Min(1)
    private int maxSize = 1000;

    private Redis redis = new Redis();

    @Data
    public static class Redis {
        private String host = "localhost";
        private int port = 6379;
        private String password;
    }
}

// Step 2: Configuration Class
@Configuration
@EnableConfigurationProperties(CacheProperties.class)
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(CacheProperties cacheProperties) {
        if ("redis".equals(cacheProperties.getType())) {
            return redisCache(cacheProperties);
        } else {
            return localCache(cacheProperties);
        }
    }

    private CacheManager redisCache(CacheProperties props) {
        RedisConnectionFactory factory = new LettuceConnectionFactory(
            new RedisStandaloneConfiguration(
                props.getRedis().getHost(),
                props.getRedis().getPort()
            )
        );
        return new RedisCacheManager.create(factory);
    }

    private CacheManager localCache(CacheProperties props) {
        return new ConcurrentMapCacheManager("default");
    }
}

// Step 3: YAML Configuration
// application.yml
app:
  cache:
    type: redis
    ttl: 7200
    maxSize: 5000
    redis:
      host: cache.example.com
      port: 6379
      password: ${REDIS_PASSWORD}

// Step 4: Use in Service
@Service
public class UserService {
    
    private final CacheManager cacheManager;
    private final CacheProperties cacheProperties;

    public UserService(CacheManager cacheManager, CacheProperties cacheProperties) {
        this.cacheManager = cacheManager;
        this.cacheProperties = cacheProperties;
    }

    public void logCacheConfig() {
        System.out.println("Cache Type: " + cacheProperties.getType());
        System.out.println("Cache TTL: " + cacheProperties.getTtl());
    }
}
```

---

## **Interview Questions**

1. **What is CGLIB and why does Spring use it for @Configuration classes?**
2. **Why is @Configuration preferred over @Component when defining beans?**
3. **Explain the difference between @ConfigurationProperties and @Value.**
4. **How does property relaxed binding work in @ConfigurationProperties?**
5. **Can you use @ConfigurationProperties for validation? How?**
6. **What happens if you use @Component instead of @Configuration with @Bean methods?**
7. **How do you handle secrets in @ConfigurationProperties without hardcoding them?**
8. **Can @ConfigurationProperties support nested objects? Give an example.**
9. **How do you enable @ConfigurationProperties in a Spring Boot application?**
10. **Explain the load order of properties in Spring Boot.**

---

This guide provides comprehensive knowledge on `@Configuration` and `@ConfigurationProperties` at an enterprise/FAANG level.