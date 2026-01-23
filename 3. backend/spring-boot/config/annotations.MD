# Important Spring Boot Configuration Annotations

## 1. @Configuration
- **Explanation**: Indicates that the class declares one or more `@Bean` methods and is a source of bean definitions for the Spring container.
- **Example**:
    ```java
    @Configuration
    public class AppConfig {
        @Bean
        public MyService myService() {
            return new MyServiceImpl();
        }
    }
    ```

---

## 2. @Bean
- **Explanation**: Used to explicitly declare a Spring bean in a configuration class.
- **Example**:
    ```java
    @Configuration
    public class AppConfig {
        @Bean
        public MyService myService() {
            return new MyServiceImpl();
        }
    }
    ```

---

## 3. @ComponentScan
- **Explanation**: Configures component scanning to automatically detect and register beans annotated with `@Component`, `@Service`, `@Repository`, etc.
- **Example**:
    ```java
    @Configuration
    @ComponentScan(basePackages = "com.example.myapp")
    public class AppConfig {
    }
    ```

---

## 4. @PropertySource
- **Explanation**: Specifies the location of property files to load into the Spring Environment.
- **Example**:
    ```java
    @Configuration
    @PropertySource("classpath:application.properties")
    public class AppConfig {
    }
    ```

---

## 5. @EnableConfigurationProperties
- **Explanation**: Enables support for `@ConfigurationProperties`-annotated beans.
- **Example**:
    ```java
    @Configuration
    @EnableConfigurationProperties(AppProperties.class)
    public class AppConfig {
    }
    ```

---

## 6. @ConfigurationProperties
- **Explanation**: Binds externalized configuration properties (e.g., from `application.properties` or `application.yml`) to a Java class.
- **Example**:
    ```java
    @ConfigurationProperties(prefix = "app")
    public class AppProperties {
        private String name;
        private int timeout;

        // Getters and setters
    }
    ```

---

## 7. @Profile
- **Explanation**: Specifies the profile(s) under which a component or configuration will be activated.
- **Example**:
    ```java
    @Configuration
    @Profile("dev")
    public class DevConfig {
    }
    ```

---

## 8. @Import
- **Explanation**: Allows importing additional configuration classes.
- **Example**:
    ```java
    @Configuration
    @Import({AppConfig.class, SecurityConfig.class})
    public class MainConfig {
    }
    ```

---

## 9. @Conditional
- **Explanation**: Defines conditional beans or configurations based on specific conditions.
- **Example**:
    ```java
    @Configuration
    @Conditional(MyCondition.class)
    public class ConditionalConfig {
    }
    ```

---

## 10. @EnableAutoConfiguration
- **Explanation**: Enables Spring Boot's auto-configuration mechanism.
- **Example**:
    ```java
    @SpringBootApplication
    public class Application {
    }
    ```

---

## 11. @SpringBootApplication
- **Explanation**: A convenience annotation that combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`.
- **Example**:
    ```java
    @SpringBootApplication
    public class Application {
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    ```

---

## 12. @Value
- **Explanation**: Injects values from properties or environment variables directly into fields, methods, or constructor arguments.
- **Example**:
    ```java
    @Component
    public class MyComponent {
        @Value("${app.name}")
        private String appName;
    }
    ```

---

## 13. @Scope
- **Explanation**: Configures the scope of a bean (e.g., singleton, prototype).
- **Example**:
    ```java
    @Bean
    @Scope("prototype")
    public MyBean myBean() {
        return new MyBean();
    }
    ```

---

## 14. @Lazy
- **Explanation**: Marks a bean to be lazily initialized.
- **Example**:
    ```java
    @Bean
    @Lazy
    public MyBean myBean() {
        return new MyBean();
    }
    ```

---

## 15. @DependsOn
- **Explanation**: Specifies the order of bean initialization by declaring dependencies.
- **Example**:
    ```java
    @Component
    @DependsOn("anotherBean")
    public class MyBean {
    }
    ```

---

## 16. @Primary
- **Explanation**: Indicates that a bean should be given preference when multiple candidates are available.
- **Example**:
    ```java
    @Bean
    @Primary
    public MyService primaryService() {
        return new PrimaryServiceImpl();
    }
    ```

---

## 17. @Qualifier
- **Explanation**: Used to resolve ambiguity when multiple beans of the same type exist.
- **Example**:
    ```java
    @Component
    public class MyComponent {
        private final MyService myService;

        public MyComponent(@Qualifier("specificService") MyService myService) {
            this.myService = myService;
        }
    }
    ```

---

## 18. @EnableAspectJAutoProxy
- **Explanation**: Enables support for handling components marked with AspectJ's `@Aspect` annotation.
- **Example**:
    ```java
    @Configuration
    @EnableAspectJAutoProxy
    public class AppConfig {
    }
    ```

---

## 19. @EnableWebMvc
- **Explanation**: Enables default Spring MVC configuration for web applications.
- **Example**:
    ```java
    @Configuration
    @EnableWebMvc
    public class WebConfig {
    }
    ```

---

## 20. @RestController
- **Explanation**: A specialized version of `@Controller` that combines `@Controller` and `@ResponseBody`.
- **Example**:
    ```java
    @RestController
    public class MyController {
        @GetMapping("/hello")
        public String hello() {
            return "Hello, World!";
        }
    }
    ```

---

## 21. @EnableScheduling
- **Explanation**: Enables Spring's scheduled task execution capability.
- **Example**:
    ```java
    @Configuration
    @EnableScheduling
    public class SchedulingConfig {
    }
    ```

---

## 22. @EnableAsync
- **Explanation**: Enables Spring's asynchronous method execution capability.
- **Example**:
    ```java
    @Configuration
    @EnableAsync
    public class AsyncConfig {
    }
    ```

---

## 23. @EnableTransactionManagement
- **Explanation**: Enables annotation-driven transaction management.
- **Example**:
    ```java
    @Configuration
    @EnableTransactionManagement
    public class TransactionConfig {
    }
    ```

---

## 24. @EnableCaching
- **Explanation**: Enables Spring's annotation-driven cache management.
- **Example**:
    ```java
    @Configuration
    @EnableCaching
    public class CacheConfig {
    }
    ```

---

## 25. @EnableJpaRepositories
- **Explanation**: Enables JPA repository support in Spring Data.
- **Example**:
    ```java
    @Configuration
    @EnableJpaRepositories(basePackages = "com.example.repository")
    public class JpaConfig {
    }
    ```

---