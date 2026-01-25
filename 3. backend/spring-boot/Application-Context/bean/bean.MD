# Spring Bean – High to Low Level Documentation

This document explains **what a Spring Bean is**, from **conceptual understanding** down to **Spring’s internal mechanics**, with practical e‑commerce examples.

---

## 1. What is a Spring Bean? (High Level)

> **A Spring Bean is an object whose complete lifecycle is managed by the Spring ApplicationContext.**

Spring is responsible for:

* Creating the object
* Injecting its dependencies
* Applying cross‑cutting concerns (AOP, transactions, async)
* Managing initialization and destruction

### E‑commerce examples

* `OrderController`
* `OrderService`
* `PaymentService`
* `OrderRepository`
* `aggregationExecutor`

All of the above are **beans** because Spring creates and controls them.

---

## 2. Bean at Developer Level (How We Use It)

A class becomes a bean when:

* Annotated with a stereotype annotation, OR
* Returned from a `@Bean` method

### Annotation‑based beans

```java
@Service
public class PaymentService { }
```

```java
@RestController
public class OrderController { }
```

### Configuration‑based beans

```java
@Configuration
public class AsyncConfig {

    @Bean("aggregationExecutor")
    public Executor taskExecutor() {
        return new ThreadPoolTaskExecutor();
    }
}
```

Once registered, Spring:

* Creates **one instance by default (singleton)**
* Injects it wherever required
* Wraps it with proxies if needed

---

## 3. Spring Bean vs Normal Java Object

| Aspect               | Spring Bean | Normal Object |
| -------------------- | ----------- | ------------- |
| Creation             | Spring      | `new` keyword |
| Dependency Injection | Automatic   | Manual        |
| Lifecycle            | Managed     | Not managed   |
| AOP / Tx / Async     | Supported   | Not supported |

👉 If an object is created using `new`, **Spring does not manage it**.

---

## 4. Low‑Level View: How Spring Represents a Bean

Internally, a Spring bean has **two representations**.

---

### 4.1 BeanDefinition (Metadata Phase)

Created during component scanning.

```
BeanDefinition
├── beanName = paymentService
├── className = PaymentService
├── scope = singleton
├── dependencies = Executor
├── initMethod
├── destroyMethod
```

This is **only metadata**, not the actual object.

---

### 4.2 Bean Instance (Runtime Object)

Created later during ApplicationContext refresh.

```
SingletonObjects
└── paymentService → PaymentServiceProxy@0xA12
```

This instance is stored inside the ApplicationContext cache.

---

## 5. Bean Creation Lifecycle (Step‑by‑Step)

```
1. Read BeanDefinition
2. Instantiate class (constructor)
3. Resolve dependencies
4. Inject dependencies
5. Apply BeanPostProcessors
6. Wrap with AOP proxy (if required)
7. Call @PostConstruct
8. Store in singleton cache
```

After step 8, the bean is **ready to be used**.

---

## 6. What Spring Actually Injects

Spring usually injects **a proxy**, not the raw class.

```
PaymentServiceProxy
└── target → PaymentService
```

The proxy enables:

* `@Transactional`
* `@Async`
* Security
* Metrics & logging

So when your code calls:

```java
paymentService.charge();
```

It goes through the proxy first.

---

## 7. Bean Scopes

| Scope               | Meaning                             |
| ------------------- | ----------------------------------- |
| singleton (default) | One instance per ApplicationContext |
| prototype           | New instance for every injection    |
| request             | One per HTTP request                |
| session             | One per HTTP session                |

Most backend services use **singleton scope**.

---

## 8. What Is NOT a Spring Bean

❌ DTOs (`OrderRequest`, `OrderResponse`)
❌ JPA entities (`@Entity`)
❌ Objects created using `new`
❌ Utility classes (unless annotated)

These objects are **not managed by Spring**.

---

## 9. Why Spring Beans Matter

Without beans, Spring cannot provide:

* Dependency Injection
* Transactions
* Async execution
* Lifecycle callbacks
* Graceful shutdown

Beans are the **foundation of Spring Boot**.

---

## 10. One‑Line Mental Model

> **A Spring Bean is an object whose creation, wiring, proxying, and lifecycle are fully controlled by the ApplicationContext.**

---

*End of document*



```java
@Service
public class PaymentService { }
```

# What Happens When `@Service` Is Used – PaymentService Bean Explained

This document explains **what Spring actually does** when it encounters the following code:

```java
@Service
public class PaymentService { }
```

---

## 1️⃣ Class Scanning Phase (NO Object Yet)

During application startup, Spring performs **component scanning**.

* Spring **finds the class** annotated with `@Service`
* It does **NOT** create an object at this stage
* Instead, it creates a **BeanDefinition** (metadata)

### What gets registered

```
BeanDefinition
├── beanName = paymentService
├── beanClass = PaymentService.class
├── scope = singleton
```

👉 **No instance exists yet**
👉 This is **metadata about the class**, not the object

---

## 2️⃣ Bean Creation Phase (OBJECT Is Created)

During **ApplicationContext refresh**, Spring creates the actual object.

### Spring does:

```java
new PaymentService();
```

Then Spring:

* Injects dependencies (if any)
* Applies `BeanPostProcessors`
* Wraps the bean with a proxy (if required)
* Stores the instance in the singleton cache

### What lives in memory

```
paymentService → PaymentServiceProxy@0xA12
```

This instance is what Spring manages and reuses.

---

## 3️⃣ So What Is the “Bean” Really?

A **bean is NOT the class itself**.

A **bean IS the managed object instance created from the class**.

### Key distinctions

| Concept        | What it is                         |
| -------------- | ---------------------------------- |
| Class          | Blueprint (`PaymentService.class`) |
| BeanDefinition | Metadata about the class           |
| Bean           | Managed object instance            |
| Injected value | Usually a proxy of that instance   |

---

## 4️⃣ What Actually Gets Injected

```java
@Autowired
private PaymentService paymentService;
```

Spring injects:

```
PaymentServiceProxy
└── target → PaymentService instance
```

### What Spring does NOT inject

❌ The class itself
❌ A new object per request

---

## 5️⃣ Why People Say “Bean for a Class”

This is **shorthand language** meaning:

> “Spring will create and manage an instance of that class.”

### Technically correct wording

> **Spring creates one managed instance (bean) whose type is `PaymentService`.**

---

## 6️⃣ One‑Line Mental Model

> **Class is the recipe. Bean is the cooked dish. Spring owns the kitchen. 🍳**

---

## 7️⃣ If You Want to Go Further

* Why multiple beans of the same class can exist
* How Spring chooses which bean to inject
* How proxies change the actual injected type

---

*End of document*
