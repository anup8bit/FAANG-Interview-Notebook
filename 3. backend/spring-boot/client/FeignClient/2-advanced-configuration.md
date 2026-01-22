# FeignClient - Advanced Configuration

## 1. FeignClient Configuration

### 1.1 Basic Configuration with URL

```java
@FeignClient(name = "user-service", url = "https://api.example.com")
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}
```

### 1.2 Configuration with Service Discovery

```java
// Eureka Service Discovery
@FeignClient(name = "user-service")  // service name registered in Eureka
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}

// Kubernetes Service Discovery
@FeignClient(name = "user-service", url = "http://user-service.default.svc.cluster.local")
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}
```

### 1.3 Global Configuration

### application.yml

```yaml
feign:
  client:
    config:
      default:
        # Connection timeout (milliseconds)
        connectTimeout: 5000
        
        # Response timeout (milliseconds)
        readTimeout: 10000
        
        # Log level: NONE, BASIC, HEADERS, FULL
        loggerLevel: full
        
        # Encoder class
        encoderClass: org.springframework.web.client.RestTemplate
        
        # Decoder class
        decoderClass: org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
  
  # Per-client configuration
  client:
    config:
      user-service:
        connectTimeout: 3000
        readTimeout: 8000
        loggerLevel: headers
      
      order-service:
        connectTimeout: 4000
        readTimeout: 9000
        loggerLevel: full
  
  # HTTP client configuration
  httpclient:
    enabled: true
    max-connections: 100
    max-connections-per-route: 20
  
  # OkHttp client configuration
  okhttp:
    enabled: false
  
  # Enable/disable compression
  compression:
    request:
      enabled: true
      min-request-size: 2048
    response:
      enabled: true
  
  # Circuit breaker
  circuitbreaker:
    enabled: true
  
  # Retry configuration
  retry:
    enabled: true
    maxAttempts: 3
    period: 100
```

---

## 2. Custom FeignClient Configuration

### 2.1 Configuration Class

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;  // NONE, BASIC, HEADERS, FULL
    }
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }
    
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new CustomRequestInterceptor();
    }
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(100, 1000, 3);  // initialInterval, maxInterval, maxAttempts
    }
}
```

### 2.2 Client-Specific Configuration

```java
@Configuration
public class UserServiceFeignConfig {
    
    @Bean
    public Logger.Level userServiceLogLevel() {
        return Logger.Level.FULL;
    }
    
    @Bean
    public ErrorDecoder userServiceErrorDecoder() {
        return new UserServiceErrorDecoder();
    }
    
    @Bean
    public RequestInterceptor userServiceInterceptor() {
        return new UserServiceRequestInterceptor();
    }
}

@FeignClient(
    name = "user-service",
    url = "https://api.example.com",
    configuration = UserServiceFeignConfig.class
)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}
```

---

## 3. Custom Request Interceptor

### 3.1 Adding Custom Headers

```java
@Component
public class CustomRequestInterceptor implements RequestInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomRequestInterceptor.class);
    
    @Override
    public void apply(RequestTemplate template) {
        // Add custom headers
        template.header("User-Agent", "MyApp/1.0");
        template.header("X-Request-ID", UUID.randomUUID().toString());
        template.header("X-Timestamp", String.valueOf(System.currentTimeMillis()));
        
        logger.info("Request to: {}", template.url());
    }
}
```

### 3.2 Adding Authorization Header

```java
@Component
public class AuthorizationInterceptor implements RequestInterceptor {
    
    @Autowired
    private TokenProvider tokenProvider;
    
    @Override
    public void apply(RequestTemplate template) {
        String token = tokenProvider.getToken();
        template.header("Authorization", "Bearer " + token);
    }
}
```

### 3.3 Multiple Interceptors

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public RequestInterceptor authorizationInterceptor() {
        return new AuthorizationInterceptor();
    }
    
    @Bean
    public RequestInterceptor customHeaderInterceptor() {
        return new CustomRequestInterceptor();
    }
    
    @Bean
    public RequestInterceptor loggingInterceptor() {
        return new LoggingInterceptor();
    }
}

public class LoggingInterceptor implements RequestInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public void apply(RequestTemplate template) {
        logger.info("Feign Request: {} {}", template.method(), template.url());
        logger.info("Headers: {}", template.headers());
    }
}
```

---

## 4. Custom Encoder/Decoder

### 4.1 JSON Encoder/Decoder

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Encoder encoder() {
        return new JacksonEncoder(objectMapper());
    }
    
    @Bean
    public Decoder decoder() {
        return new JacksonDecoder(objectMapper());
    }
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
}
```

### 4.2 Custom Decoder

```java
@Component
public class CustomDecoder implements Decoder {
    
    private final ObjectMapper objectMapper;
    
    public CustomDecoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    @Override
    public Object decode(Response response, Type type) throws IOException {
        String bodyText = Util.toString(response.body().asReader(StandardCharsets.UTF_8));
        
        if (response.status() == 404) {
            return null;
        }
        
        return objectMapper.readValue(bodyText, (JavaType) type);
    }
}
```

---

## 5. HTTP Client Configuration

### 5.1 Apache HttpClient

```xml
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Client httpClient() {
        return new ApacheHttpClient(
            HttpClientBuilder.create()
                .setMaxConnTotal(100)
                .setMaxConnPerRoute(20)
                .setConnectionTimeToLive(60, TimeUnit.SECONDS)
                .build()
        );
    }
}
```

### 5.2 OkHttp Client

```xml
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>
```

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Client okHttpClient() {
        OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .connectionPool(new ConnectionPool(20, 5, TimeUnit.MINUTES))
            .build();
        
        return new OkHttpClient(okHttpClient);
    }
}
```

---

## 6. Timeout Configuration

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(
            5,           // connectTimeoutMillis
            TimeUnit.SECONDS,
            10,          // readTimeoutMillis
            TimeUnit.SECONDS,
            true         // followRedirects
        );
    }
}
```

---

## 7. Logging Configuration

### 7.1 Logger Configuration

```java
@Configuration
public class FeignClientConfig {
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}

// application.yml
logging:
  level:
    feign.Logger: DEBUG
    com.example.client: DEBUG
```

### 7.2 Logger Levels
```
NONE        - No logging
BASIC       - Only the request method and URL and response status
HEADERS     - The basic information plus request and response headers
FULL        - The headers and body for both requests and responses
```

---

## 8. Complete Advanced Configuration

```java
@Configuration
public class AdvancedFeignConfig {
    
    @Bean
    public Encoder encoder() {
        return new JacksonEncoder(objectMapper());
    }
    
    @Bean
    public Decoder decoder() {
        return new JacksonDecoder(objectMapper());
    }
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
    
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
    
    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }
    
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new CustomRequestInterceptor();
    }
    
    @Bean
    public Retryer retryer() {
        return new Retryer.Default(100, 1000, 3);
    }
    
    @Bean
    public Client httpClient() {
        return new ApacheHttpClient(
            HttpClientBuilder.create()
                .setMaxConnTotal(100)
                .setMaxConnPerRoute(20)
                .build()
        );
    }
    
    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(5, TimeUnit.SECONDS, 10, TimeUnit.SECONDS, true);
    }
}
```

---

## 9. Service Discovery Configuration

### 9.1 Eureka Configuration

```yaml
spring:
  application:
    name: my-service
  cloud:
    service-registry:
      auto-registration:
        enabled: true

eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka-server:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
```

### 9.2 Consul Configuration

```yaml
spring:
  application:
    name: my-service
  cloud:
    consul:
      host: consul-server
      port: 8500
      discovery:
        register: true
        deregister: true
```

---

## 10. Configuration Inheritance

```yaml
feign:
  client:
    config:
      # Default for all clients
      default:
        connectTimeout: 5000
        readTimeout: 10000
        loggerLevel: basic
        errorDecoder: com.example.CustomErrorDecoder
      
      # Specific client override
      user-service:
        connectTimeout: 3000    # Override
        readTimeout: 8000       # Override
        loggerLevel: full       # Override
      
      # Another specific client
      order-service:
        connectTimeout: 4000
        readTimeout: 9000
```

---

## Key Points

✓ **Use @EnableFeignClients** to enable scanning
✓ **Configure timeouts** to prevent hanging requests
✓ **Use RequestInterceptor** for cross-cutting concerns
✓ **Set loggerLevel** for debugging
✓ **Choose appropriate HTTP client** (Apache or OkHttp)
✓ **Implement custom ErrorDecoder** for error handling
✓ **Use service discovery** for dynamic endpoints
✓ **Configure connection pooling** for performance
✓ **Set retryer** for transient failures
✓ **Override per-client** as needed
