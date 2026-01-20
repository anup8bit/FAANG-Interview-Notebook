# RestTemplate - Advanced Configuration

## 1. RestTemplate Bean Configuration

### 1.1 Basic Configuration

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### 1.2 Configuration with Connection Pool

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        return new RestTemplate(clientHttpRequestFactory);
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        
        // Set timeout
        factory.setConnectTimeout(5000);      // 5 seconds
        factory.setReadTimeout(10000);        // 10 seconds
        
        // Configure HttpClient with connection pool
        factory.setHttpClient(httpClient());
        
        return factory;
    }
    
    @Bean
    public HttpClient httpClient() {
        PoolingHttpClientConnectionManager connectionManager = 
            new PoolingHttpClientConnectionManager();
        
        // Max total connections
        connectionManager.setMaxTotal(100);
        
        // Max connections per route
        connectionManager.setDefaultMaxPerRoute(20);
        
        return HttpClientBuilder.create()
            .setConnectionManager(connectionManager)
            .build();
    }
}
```

### 1.3 Configuration with Timeouts

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // Connection timeout (time to establish connection)
        factory.setConnectTimeout(5000);    // 5 seconds
        
        // Read timeout (time to wait for response)
        factory.setReadTimeout(10000);      // 10 seconds
        
        return new RestTemplate(factory);
    }
}
```

---

## 2. Custom Interceptors

### 2.1 Request/Response Logging Interceptor

```java
@Component
public class LoggingInterceptor implements ClientHttpRequestInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution) throws IOException {
        
        // Log request
        logRequest(request, body);
        
        // Execute the request
        long startTime = System.currentTimeMillis();
        ClientHttpResponse response = execution.execute(request, body);
        long duration = System.currentTimeMillis() - startTime;
        
        // Log response
        logResponse(response, duration);
        
        return response;
    }
    
    private void logRequest(HttpRequest request, byte[] body) {
        logger.info("=== REST REQUEST ===");
        logger.info("URI: {}", request.getURI());
        logger.info("Method: {}", request.getMethod());
        logger.info("Headers: {}", request.getHeaders());
        if (body.length > 0) {
            logger.info("Body: {}", new String(body, StandardCharsets.UTF_8));
        }
    }
    
    private void logResponse(ClientHttpResponse response, long duration) throws IOException {
        logger.info("=== REST RESPONSE ===");
        logger.info("Status Code: {}", response.getStatusCode());
        logger.info("Headers: {}", response.getHeaders());
        logger.info("Duration: {}ms", duration);
        logger.info("Body: {}", new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8));
    }
}
```

### 2.2 Authorization Header Interceptor

```java
@Component
public class AuthorizationInterceptor implements ClientHttpRequestInterceptor {
    
    @Autowired
    private TokenService tokenService;
    
    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution) throws IOException {
        
        // Get current token
        String token = tokenService.getToken();
        
        // Add Authorization header
        request.getHeaders().set("Authorization", "Bearer " + token);
        request.getHeaders().set("X-Request-ID", UUID.randomUUID().toString());
        
        return execution.execute(request, body);
    }
}
```

### 2.3 Register Interceptors

```java
@Configuration
public class RestTemplateConfig {
    
    @Autowired
    private LoggingInterceptor loggingInterceptor;
    
    @Autowired
    private AuthorizationInterceptor authorizationInterceptor;
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
        
        // Register interceptors
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(authorizationInterceptor);
        interceptors.add(loggingInterceptor);
        
        restTemplate.setInterceptors(interceptors);
        
        return restTemplate;
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        return factory;
    }
}
```

---

## 3. Custom Error Handler

### 3.1 Implementing ResponseErrorHandler

```java
@Component
public class CustomResponseErrorHandler implements ResponseErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomResponseErrorHandler.class);
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() ||
               response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String errorBody = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
        
        if (response.getStatusCode().is4xxClientError()) {
            handleClientError(response, errorBody);
        } else if (response.getStatusCode().is5xxServerError()) {
            handleServerError(response, errorBody);
        }
    }
    
    private void handleClientError(ClientHttpResponse response, String errorBody) 
            throws IOException {
        logger.error("Client Error: {} - {}", response.getStatusCode(), errorBody);
        
        if (response.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            throw new UnauthorizedException("Unauthorized access");
        } else if (response.getStatusCode() == HttpStatus.FORBIDDEN) {
            throw new ForbiddenException("Access forbidden");
        } else if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
            throw new ResourceNotFoundException("Resource not found");
        } else {
            throw new ClientErrorException("Client error: " + response.getStatusCode());
        }
    }
    
    private void handleServerError(ClientHttpResponse response, String errorBody) 
            throws IOException {
        logger.error("Server Error: {} - {}", response.getStatusCode(), errorBody);
        throw new ServerErrorException("Server error: " + response.getStatusCode());
    }
}
```

### 3.2 Register Custom Error Handler

```java
@Configuration
public class RestTemplateConfig {
    
    @Autowired
    private CustomResponseErrorHandler errorHandler;
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
        restTemplate.setErrorHandler(errorHandler);
        return restTemplate;
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        return factory;
    }
}
```

---

## 4. Custom Message Converters

### 4.1 Register Additional Converters

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(ClientHttpRequestFactory clientHttpRequestFactory) {
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
        
        // Get list of message converters
        List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
        
        // Add custom converters
        messageConverters.add(new MappingJackson2HttpMessageConverter());
        messageConverters.add(new StringHttpMessageConverter());
        messageConverters.add(new FormHttpMessageConverter());
        
        return restTemplate;
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        return factory;
    }
}
```

---

## 5. Complete Advanced Configuration

```java
@Configuration
public class AdvancedRestTemplateConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(AdvancedRestTemplateConfig.class);
    
    @Bean
    public RestTemplate restTemplate(
            ClientHttpRequestFactory clientHttpRequestFactory,
            CustomResponseErrorHandler errorHandler,
            List<ClientHttpRequestInterceptor> interceptors) {
        
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);
        
        // Set error handler
        restTemplate.setErrorHandler(errorHandler);
        
        // Set interceptors
        restTemplate.setInterceptors(interceptors);
        
        // Set message converters
        List<HttpMessageConverter<?>> messageConverters = 
            restTemplate.getMessageConverters();
        messageConverters.add(0, new MappingJackson2HttpMessageConverter());
        
        return restTemplate;
    }
    
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        
        // Timeouts
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        
        // Connection pooling
        factory.setHttpClient(httpClient());
        
        return factory;
    }
    
    @Bean
    public HttpClient httpClient() {
        PoolingHttpClientConnectionManager connectionManager = 
            new PoolingHttpClientConnectionManager();
        
        connectionManager.setMaxTotal(100);
        connectionManager.setDefaultMaxPerRoute(20);
        
        RequestConfig requestConfig = RequestConfig.custom()
            .setConnectionRequestTimeout(Duration.ofSeconds(5))
            .setResponseTimeout(Duration.ofSeconds(10))
            .build();
        
        return HttpClientBuilder.create()
            .setConnectionManager(connectionManager)
            .setDefaultRequestConfig(requestConfig)
            .setRetryStrategy(new DefaultHttpRequestRetryStrategy())
            .build();
    }
    
    @Bean
    public CustomResponseErrorHandler errorHandler() {
        return new CustomResponseErrorHandler();
    }
}
```

---

## 6. Properties Configuration

### application.yml

```yaml
rest-client:
  timeout:
    connect: 5000      # milliseconds
    read: 10000        # milliseconds
  pool:
    max-total: 100
    max-per-route: 20
  base-url: https://api.example.com
```

### RestTemplateConfigWithProperties

```java
@Configuration
@ConfigurationProperties(prefix = "rest-client")
public class RestTemplateConfigWithProperties {
    
    private Timeout timeout = new Timeout();
    private Pool pool = new Pool();
    private String baseUrl;
    
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeout.getConnect());
        factory.setReadTimeout(timeout.getRead());
        
        return new RestTemplate(factory);
    }
    
    @Data
    public static class Timeout {
        private int connect = 5000;
        private int read = 10000;
    }
    
    @Data
    public static class Pool {
        private int maxTotal = 100;
        private int maxPerRoute = 20;
    }
    
    // Getters and setters
    public Timeout getTimeout() { return timeout; }
    public void setTimeout(Timeout timeout) { this.timeout = timeout; }
    public Pool getPool() { return pool; }
    public void setPool(Pool pool) { this.pool = pool; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
}
```

---

## Key Points

✓ **Always configure timeouts** to prevent hanging requests
✓ **Use connection pooling** for better performance
✓ **Implement custom error handlers** for consistent error handling
✓ **Use interceptors** for cross-cutting concerns (logging, auth, etc.)
✓ **Configure message converters** for proper serialization/deserialization
✓ **Make RestTemplate thread-safe** by configuring properly
✓ **Use externalized configuration** for timeouts and pool settings
