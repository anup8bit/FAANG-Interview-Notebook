# WebClient - Advanced Configuration

## 1. WebClient Bean Configuration

### 1.1 Basic Configuration

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

### 1.2 Configuration with Timeouts

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(clientConnector())
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
    
    @Bean
    public ReactorResourceFactory reactorResourceFactory() {
        return new ReactorResourceFactory();
    }
    
    @Bean
    public HttpClient httpClient() {
        return HttpClient.create(ConnectionProvider.create("custom", 100))
            .responseTimeout(Duration.ofSeconds(10))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000);
    }
    
    @Bean
    public ClientHttpConnector clientConnector() {
        return new ReactorClientHttpConnector(httpClient());
    }
}
```

### 1.3 Configuration with Connection Pooling

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(clientConnector())
            .build();
    }
    
    @Bean
    public ClientHttpConnector clientConnector() {
        return new ReactorClientHttpConnector(httpClient());
    }
    
    @Bean
    public HttpClient httpClient() {
        // Create custom connection provider
        ConnectionProvider connectionProvider = ConnectionProvider.builder("custom")
            .maxConnections(100)              // Max total connections
            .maxIdleTime(Duration.ofSeconds(60))
            .build();
        
        return HttpClient.create(connectionProvider)
            .responseTimeout(Duration.ofSeconds(10))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
            .option(ChannelOption.SO_KEEPALIVE, true)
            .doOnConnected(connection ->
                connection.addHandlerLast(new ReadTimeoutHandler(10, TimeUnit.SECONDS))
                    .addHandlerLast(new WriteTimeoutHandler(10, TimeUnit.SECONDS)));
    }
}
```

---

## 2. Custom Filters (Interceptors)

### 2.1 Request/Response Logging Filter

```java
@Configuration
public class WebClientConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(WebClientConfig.class);
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(loggingFilter())
            .build();
    }
    
    @Bean
    public ExchangeFilterFunction loggingFilter() {
        return ExchangeFilterFunction.ofRequestAndResponseProcessor(
            clientRequest -> {
                logger.info("=== REQUEST ===");
                logger.info("URI: {}", clientRequest.getURL());
                logger.info("Method: {}", clientRequest.getMethod());
                logger.info("Headers: {}", clientRequest.getHeaders());
                return Mono.just(clientRequest);
            },
            clientResponse -> {
                logger.info("=== RESPONSE ===");
                logger.info("Status Code: {}", clientResponse.getStatusCode());
                logger.info("Headers: {}", clientResponse.getHeaders());
                return Mono.just(clientResponse);
            }
        );
    }
}
```

### 2.2 Authorization Header Filter

```java
@Configuration
public class WebClientConfig {
    
    @Autowired
    private TokenService tokenService;
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(authorizationFilter())
            .build();
    }
    
    @Bean
    public ExchangeFilterFunction authorizationFilter() {
        return (request, next) -> {
            String token = tokenService.getToken();
            return next.exchange(ClientRequest.from(request.getRequest())
                .header("Authorization", "Bearer " + token)
                .header("X-Request-ID", UUID.randomUUID().toString())
                .build());
        };
    }
}
```

### 2.3 Retry Filter

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(retryFilter())
            .build();
    }
    
    @Bean
    public ExchangeFilterFunction retryFilter() {
        return (request, next) -> next.exchange(request)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(100))
                .filter(throwable -> throwable instanceof IOException));
    }
}
```

### 2.4 Multiple Filters

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .filter(authorizationFilter())
            .filter(loggingFilter())
            .filter(retryFilter())
            .build();
    }
    
    private ExchangeFilterFunction authorizationFilter() {
        // Implementation...
    }
    
    private ExchangeFilterFunction loggingFilter() {
        // Implementation...
    }
    
    private ExchangeFilterFunction retryFilter() {
        // Implementation...
    }
}
```

---

## 3. Custom ExchangeStrategies

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .exchangeStrategies(exchangeStrategies())
            .build();
    }
    
    @Bean
    public ExchangeStrategies exchangeStrategies() {
        return ExchangeStrategies.builder()
            .codecs(configurer -> {
                configurer.defaultCodecs().maxInMemorySize(1024 * 1024);  // 1MB
                configurer.defaultCodecs().enableLoggingRequestDetails(true);
            })
            .build();
    }
}
```

---

## 4. Customizing ClientHttpConnector

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(new ReactorClientHttpConnector(httpClient()))
            .build();
    }
    
    @Bean
    public HttpClient httpClient() {
        return HttpClient.create()
            .responseTimeout(Duration.ofSeconds(10))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
            .option(ChannelOption.SO_KEEPALIVE, true)
            .compress(true);  // Enable compression
    }
}
```

---

## 5. Default Headers Configuration

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader("User-Agent", "MyApp/1.0")
            .defaultHeader("X-API-Version", "v1")
            .defaultUriVariable("scheme", "https")
            .defaultUriVariable("host", "api.example.com")
            .build();
    }
}
```

---

## 6. Configuration with Properties

### application.yml

```yaml
app:
  api:
    base-url: https://api.example.com
    timeout:
      connect: 5000      # milliseconds
      response: 10000    # milliseconds
    connection-pool:
      max-connections: 100
      max-idle-time: 60
```

### Configuration Class

```java
@Configuration
@ConfigurationProperties(prefix = "app.api")
public class WebClientConfig {
    
    private String baseUrl;
    private Timeout timeout = new Timeout();
    private ConnectionPool connectionPool = new ConnectionPool();
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl(baseUrl)
            .clientConnector(clientConnector())
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
    
    @Bean
    public ClientHttpConnector clientConnector() {
        return new ReactorClientHttpConnector(httpClient());
    }
    
    @Bean
    public HttpClient httpClient() {
        ConnectionProvider provider = ConnectionProvider.builder("custom")
            .maxConnections(connectionPool.getMaxConnections())
            .maxIdleTime(Duration.ofSeconds(connectionPool.getMaxIdleTime()))
            .build();
        
        return HttpClient.create(provider)
            .responseTimeout(Duration.ofMillis(timeout.getResponse()))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeout.getConnect());
    }
    
    @Data
    public static class Timeout {
        private int connect = 5000;
        private int response = 10000;
    }
    
    @Data
    public static class ConnectionPool {
        private int maxConnections = 100;
        private int maxIdleTime = 60;
    }
    
    // Getters and setters...
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public Timeout getTimeout() { return timeout; }
    public void setTimeout(Timeout timeout) { this.timeout = timeout; }
    public ConnectionPool getConnectionPool() { return connectionPool; }
    public void setConnectionPool(ConnectionPool connectionPool) { 
        this.connectionPool = connectionPool; 
    }
}
```

---

## 7. SSL/HTTPS Configuration

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) throws Exception {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(clientConnector())
            .build();
    }
    
    @Bean
    public ClientHttpConnector clientConnector() throws Exception {
        return new ReactorClientHttpConnector(httpClientWithSSL());
    }
    
    @Bean
    public HttpClient httpClientWithSSL() throws Exception {
        SslContext sslContext = SslContextBuilder.forClient()
            .trustManager(InsecureTrustManagerFactory.INSTANCE)  // ⚠️ For testing only
            .build();
        
        return HttpClient.create()
            .secure(spec -> spec.sslContext(sslContext));
    }
}

// Secure SSL Configuration (for production)
@Configuration
public class SecureWebClientConfig {
    
    @Bean
    public HttpClient secureHttpClient(
            @Value("${app.ssl.keystore-path}") String keystorePath,
            @Value("${app.ssl.keystore-password}") String keystorePassword) 
            throws Exception {
        
        KeyStore keyStore = KeyStore.getInstance("JKS");
        try (InputStream is = new FileInputStream(keystorePath)) {
            keyStore.load(is, keystorePassword.toCharArray());
        }
        
        SslContext sslContext = SslContextBuilder.forClient()
            .trustManager(TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm()))
            .build();
        
        return HttpClient.create()
            .secure(spec -> spec.sslContext(sslContext));
    }
}
```

---

## 8. Complete Advanced Configuration

```java
@Configuration
public class AdvancedWebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .clientConnector(clientConnector())
            .filter(authorizationFilter())
            .filter(loggingFilter())
            .filter(retryFilter())
            .exchangeStrategies(exchangeStrategies())
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
    
    @Bean
    public ClientHttpConnector clientConnector() {
        return new ReactorClientHttpConnector(httpClient());
    }
    
    @Bean
    public HttpClient httpClient() {
        ConnectionProvider provider = ConnectionProvider.builder("custom")
            .maxConnections(100)
            .maxIdleTime(Duration.ofSeconds(60))
            .build();
        
        return HttpClient.create(provider)
            .responseTimeout(Duration.ofSeconds(10))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
            .option(ChannelOption.SO_KEEPALIVE, true)
            .compress(true);
    }
    
    @Bean
    public ExchangeFilterFunction authorizationFilter() {
        return (request, next) -> next.exchange(ClientRequest
            .from(request.getRequest())
            .header("Authorization", "Bearer " + getToken())
            .build());
    }
    
    @Bean
    public ExchangeFilterFunction loggingFilter() {
        return ExchangeFilterFunction.ofRequestAndResponseProcessor(
            clientRequest -> {
                System.out.println("Request: " + clientRequest.getURL());
                return Mono.just(clientRequest);
            },
            clientResponse -> {
                System.out.println("Response: " + clientResponse.getStatusCode());
                return Mono.just(clientResponse);
            }
        );
    }
    
    @Bean
    public ExchangeFilterFunction retryFilter() {
        return (request, next) -> next.exchange(request)
            .retryWhen(Retry.backoff(3, Duration.ofMillis(100)));
    }
    
    @Bean
    public ExchangeStrategies exchangeStrategies() {
        return ExchangeStrategies.builder()
            .codecs(configurer -> 
                configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
            .build();
    }
    
    private String getToken() {
        // Get token from service
        return "token";
    }
}
```

---

## Key Points

✓ **Use WebClient.Builder** for creating WebClient instances
✓ **Always configure timeouts** to prevent hanging requests
✓ **Use filters for cross-cutting concerns** (logging, auth, retry)
✓ **Configure connection pooling** for better performance
✓ **Use ExchangeStrategies** for codec customization
✓ **SSL/TLS** configuration for secure connections
✓ **Default headers** for consistency
✓ **Externalize configuration** using properties
