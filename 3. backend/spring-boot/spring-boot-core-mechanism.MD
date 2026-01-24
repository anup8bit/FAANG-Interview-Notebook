# Spring Boot ApplicationContext & Dependency Injection – E‑Commerce Deep Dive

This document explains **how Spring Boot works internally**, focusing on **ApplicationContext**, **bean lifecycle**, **dependency injection**, and **runtime method calls**, using a **Place Order → Payment** flow from an **E‑commerce system**.

---

## 1. What is ApplicationContext?

> **ApplicationContext** is Spring’s central container that:

* Holds **bean metadata** (definitions)
* Holds **live bean instances** (mostly singletons)
* Manages **dependency injection**
* Controls **bean lifecycle**
* Publishes **events**
* Applies **AOP proxies**

Think of it as:

> **“A factory + registry + lifecycle manager for all application objects.”**

---

## 2. High-Level Startup Flow

```
JVM starts
→ SpringApplication.run()
→ ApplicationContext created
→ Environment loaded
→ BeanDefinitions registered
→ Beans instantiated & injected
→ @PostConstruct executed
→ Web server started
→ Application READY
```

---

## 3. Environment & Configuration Phase

Spring loads configuration **before any bean is created**.

### Sources (priority order)

* application.yml / application.properties
* application-{profile}.yml
* Environment variables (SPRING_PROFILES_ACTIVE)
* Command-line arguments

### Stored inside ApplicationContext

```
Environment
├── PropertySources
├── ActiveProfiles
└── Resolved placeholders
```

**E‑commerce example**

* DB URL
* Payment gateway credentials
* Kafka brokers

---

## 4. Component Scan & BeanDefinition Registration

Spring scans packages from `@SpringBootApplication`.

### Finds

* @Controller → OrderController
* @Service → OrderService, PaymentService
* @Repository → OrderRepository
* @Configuration → AsyncConfig
* @Bean → aggregationExecutor

### Important

👉 **No objects are created yet**

### Stored as metadata

```
BeanDefinitionRegistry
├── orderController
├── orderService
├── paymentService
├── orderRepository
├── aggregationExecutor
```

Each **BeanDefinition** contains:

* Class name
* Scope (singleton by default)
* Dependencies
* Init / destroy methods

**E‑commerce analogy**: Shops registered but not opened

---

## 5. BeanFactory Post-Processing

Spring modifies **BeanDefinitions** before object creation.

### Happens here

* @Configuration classes enhanced (CGLIB)
* @Value placeholders resolved
* Conditional beans evaluated

**Still no objects created**

---

## 6. Bean Instantiation & Dependency Injection (IMPORTANT)

This is where **dependency injection actually happens**.

### Order of operations

```
new Bean()
→ constructor injection
→ field/setter injection
→ AOP proxy wrapping
→ @PostConstruct
→ bean ready
```

### Injection rule

> **Injection ALWAYS happens from ApplicationContext, during startup, not during HTTP requests.**

---

## 7. Controller → Service → Repository Injection Example

### OrderController

```java
@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
}
```

Injected at startup:

```
OrderController
└── orderService → OrderService@singleton
```

---

### OrderService

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
}
```

Injected once:

```
OrderService
├── paymentService → PaymentServiceProxy
└── orderRepository → JPA Proxy
```

---

### OrderRepository

```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {}
```

Spring creates a **runtime proxy**, not a concrete class.

---

## 8. Configuration & @Bean Injection (Async Example)

### AsyncConfig

```java
@Configuration
public class AsyncConfig {

    @Bean("aggregationExecutor")
    public Executor taskExecutor() {
        return new ThreadPoolTaskExecutor();
    }
}
```

### PaymentService

```java
@Service
public class PaymentService {

    @Async("aggregationExecutor")
    public void charge(...) {}
}
```

### What Spring does

* Registers aggregationExecutor
* Wraps PaymentService with async proxy
* Method calls go through proxy

Runtime flow:

```
OrderService → PaymentServiceProxy → Executor Thread
```

---

## 9. What Happens on HTTP Request (/orders)

### Important clarification

> **Dependency injection does NOT happen here.**

### Runtime flow

```
HTTP POST /orders
→ DispatcherServlet
→ OrderController.placeOrder()
→ OrderService.placeOrder()
→ PaymentServiceProxy.charge()
→ Executor thread
```

All objects were **already injected at startup**.

---

## 10. @PostConstruct Explained

### Definition

> Runs **once**, after dependency injection, before bean is used.

### Lifecycle position

```
Constructor
→ Dependency Injection
→ @PostConstruct   👈
→ Bean ready
```

### E‑commerce example

```java
@Service
public class PaymentService {

    @PostConstruct
    void init() {
        validateGatewayConnection();
    }
}
```

Used for:

* Validation
* Cache warm-up
* Fail-fast startup checks

❌ Not per request
❌ Not async-safe

---

## 11. ApplicationContext During Runtime

### What it holds

```
ApplicationContext
├── Singleton Beans
├── BeanDefinitions
├── Environment
├── AOP Proxies
├── ThreadPools
├── EventMulticaster
```

All controllers and services are **shared singletons**.

---

## 12. Shutdown Phase

Triggered by:

* SIGTERM
* context.close()

Order:

```
@PreDestroy
→ Executor shutdown
→ DB pool close
→ Web server stop
```

Ensures graceful shutdown (Docker / K8s safe).

---

## 13. Key Mental Models

### Injection

> **Injection happens once at startup, always from ApplicationContext.**

### Runtime

> **HTTP requests only call methods, never create or inject beans.**

### Proxies

> **You usually interact with proxies, not real classes.**

---

## 14. One-Line Summary

> **Spring Boot wires everything at startup using ApplicationContext, then simply routes runtime calls through already-injected, proxy-wrapped beans.**

---

*End of document*
