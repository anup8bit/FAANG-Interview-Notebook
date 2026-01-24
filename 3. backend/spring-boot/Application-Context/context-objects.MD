# Important Context Objects in Spring Boot

Here are the **most important Spring Boot context objects**, explained crisply and in a **structured list** (keeping it practical 👇):

## Core Application Context

* **`ApplicationContext`** – Central Spring container; manages beans, dependency injection, lifecycle, events, and resource loading (superset of `BeanFactory`).
* **`ConfigurableApplicationContext`** – Mutable version of `ApplicationContext`; used internally to refresh/close the context.
* **`WebApplicationContext`** – Web-specific context; integrates with Servlet container and holds web-related beans.

## Bean & Lifecycle Context

* **`BeanFactory`** – Lowest-level container; lazy bean creation (rarely used directly in Boot).
* **`BeanDefinition`** – Metadata describing how a bean is created (class, scope, dependencies).
* **`BeanPostProcessor`** – Hook to modify beans before/after initialization (e.g., `@Autowired`, `@Slf4j`).
* **`ApplicationContextAware`** – Lets a bean access the `ApplicationContext` directly.

## Configuration & Environment

* **`Environment`** – Access to profiles, properties, and environment variables.
* **`PropertySources`** – Ordered collection of property sources (YAML, env vars, command-line args).
* **`@ConfigurationProperties` context** – Binds external config to POJOs (very common in Boot).

## Web / Request Context

* **`ServletContext`** – Servlet container–level context (Tomcat/Jetty).
* **`HttpServletRequest` / `HttpServletResponse`** – Request-scoped web context objects.
* **`RequestContextHolder`** – Access request attributes outside controllers (careful with async).

## Security Context

* **`SecurityContext`** – Holds authentication details for the current thread.
* **`SecurityContextHolder`** – Stores `SecurityContext` using ThreadLocal (critical for JWT/auth flows).

## Transaction & Persistence Context

* **`PersistenceContext` (JPA)** – Manages entity lifecycle via `EntityManager`.
* **`TransactionSynchronizationManager`** – Binds transactions to threads.
* **`EntityManager`** – JPA context for database operations.

## Events & Observability

* **`ApplicationEvent`** – Spring lifecycle and custom events.
* **`ApplicationListener`** – Listens to context events (startup, refresh, shutdown).
* **`ApplicationStartup`** – Tracks startup steps (performance analysis).

## Boot-Specific Contexts

* **`SpringApplication`** – Bootstraps the application.
* **`ApplicationArguments`** – Command-line arguments abstraction.
* **`BootstrapContext`** – Early context used during startup (introduced for config data loading).

---

## Interview-ready takeaway

> **ApplicationContext** is the brain, **Environment** is configuration, **SecurityContext** is identity, **PersistenceContext** is data, and **WebApplicationContext** bridges Spring with the servlet world.


---------------------------With Examples------------------


# Important Context Objects in Spring Boot (Detailed with Examples)

This document explains the **most important Spring Boot context objects** in depth, with **real-world explanations and code examples**. Think of this as both a **learning guide** and an **interview reference**.

---

## 1. Core Application Context

### 1.1 `ApplicationContext`

**What it is**
The heart of Spring. It is the **IoC container** that:

* Creates and manages beans
* Injects dependencies
* Handles bean lifecycle
* Publishes events
* Loads resources and properties

**Why it matters**
Every Spring Boot app runs inside an `ApplicationContext`.

**Example**

```java
@Component
public class MyBean {
    public String hello() {
        return "Hello from bean";
    }
}

@Autowired
ApplicationContext context;

MyBean bean = context.getBean(MyBean.class);
System.out.println(bean.hello());
```

**Real-world usage**

* Dynamic bean lookup
* Publishing application events
* Accessing environment or resources

---

### 1.2 `ConfigurableApplicationContext`

**What it is**
A mutable version of `ApplicationContext` used by Spring Boot internally.

**What it allows**

* Refresh context
* Close context
* Register shutdown hooks

**Example**

```java
ConfigurableApplicationContext ctx = SpringApplication.run(App.class, args);
ctx.close();
```

**Used when**

* Graceful shutdown
* Programmatic lifecycle control

---

### 1.3 `WebApplicationContext`

**What it is**
A web-aware application context that integrates Spring with the Servlet container.

**Extra features**

* Access to `ServletContext`
* Web-scoped beans (request, session)

**Example**

```java
@Autowired
WebApplicationContext webContext;
```

**Used in**

* Spring MVC
* Filters, listeners, controllers

---

## 2. Bean & Lifecycle Context

### 2.1 `BeanFactory`

**What it is**
The lowest-level container in Spring.

**Key difference vs ApplicationContext**

* Lazy initialization
* No event support

**Example**

```java
BeanFactory factory = new ClassPathXmlApplicationContext("beans.xml");
MyBean bean = factory.getBean(MyBean.class);
```

**In Spring Boot**
You almost never use it directly.

---

### 2.2 `BeanDefinition`

**What it is**
Metadata that tells Spring **how to create a bean**.

**Contains**

* Bean class
* Scope (singleton/prototype)
* Constructor args
* Property values

**Example (conceptual)**

```java
RootBeanDefinition bd = new RootBeanDefinition(MyBean.class);
```

**Used by**
Spring internally during startup.

---

### 2.3 `BeanPostProcessor`

**What it is**
A hook to modify beans **before and after initialization**.

**Why it matters**
Many Spring features are built on this:

* `@Autowired`
* `@Slf4j`
* `@Transactional`

**Example**

```java
@Component
public class CustomBPP implements BeanPostProcessor {
    public Object postProcessBeforeInitialization(Object bean, String name) {
        return bean;
    }
}
```

---

### 2.4 `ApplicationContextAware`

**What it is**
Allows a bean to receive the `ApplicationContext`.

**Example**

```java
@Component
public class ContextAwareBean implements ApplicationContextAware {
    private ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext context) {
        this.context = context;
    }
}
```

**Use carefully**
This couples your code to Spring.

---

## 3. Configuration & Environment

### 3.1 `Environment`

**What it is**
Provides access to:

* Properties
* Active profiles
* Environment variables

**Example**

```java
@Autowired
Environment env;

String url = env.getProperty("spring.datasource.url");
```

---

### 3.2 `PropertySources`

**What it is**
An ordered list of property sources.

**Order matters**

1. Command-line args
2. Environment variables
3. application.yml
4. default values

---

### 3.3 `@ConfigurationProperties`

**What it is**
Type-safe configuration binding.

**Example**

```yaml
app:
  timeout: 5000
```

```java
@ConfigurationProperties(prefix = "app")
@Component
@Data
public class AppConfig {
    private int timeout;
}
```

---

## 4. Web / Request Context

### 4.1 `ServletContext`

**What it is**
Global context for the web application.

**Example**

```java
@Autowired
ServletContext servletContext;
```

---

### 4.2 `HttpServletRequest` / `HttpServletResponse`

**What they are**
Request-scoped objects representing HTTP request/response.

**Example**

```java
@GetMapping("/user")
public String user(HttpServletRequest request) {
    return request.getHeader("Authorization");
}
```

---

### 4.3 `RequestContextHolder`

**What it is**
Access request data outside controllers.

**Example**

```java
ServletRequestAttributes attrs =
    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
```

⚠️ **Danger** in async threads unless context is propagated.

---

## 5. Security Context

### 5.1 `SecurityContext`

**What it is**
Holds authentication info for the current user.

---

### 5.2 `SecurityContextHolder`

**What it is**
Stores `SecurityContext` using `ThreadLocal`.

**Example**

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
```

**Critical for**

* JWT
* Feign calls
* Async propagation

---

## 6. Transaction & Persistence Context

### 6.1 `PersistenceContext` (JPA)

**What it is**
Manages entity lifecycle and caching.

**Example**

```java
@PersistenceContext
EntityManager entityManager;
```

---

### 6.2 `TransactionSynchronizationManager`

**What it is**
Binds transactions to threads.

**Used internally by**
`@Transactional`

---

## 7. Events & Observability

### 7.1 `ApplicationEvent`

**What it is**
Base class for Spring events.

---

### 7.2 `ApplicationListener`

**Example**

```java
@Component
public class StartupListener
        implements ApplicationListener<ApplicationReadyEvent> {
    public void onApplicationEvent(ApplicationReadyEvent event) {
        System.out.println("App started");
    }
}
```

---

### 7.3 `ApplicationStartup`

**What it is**
Tracks startup performance.

Used by **Spring Boot Actuator**.

---

## 8. Boot-Specific Contexts

### 8.1 `SpringApplication`

**What it is**
Bootstraps the Spring Boot app.

---

### 8.2 `ApplicationArguments`

**Example**

```java
@Component
public class ArgsRunner implements ApplicationRunner {
    public void run(ApplicationArguments args) {
        System.out.println(args.getOptionNames());
    }
}
```

---

### 8.3 `BootstrapContext`

**What it is**
Early startup context for config loading.

Mostly **internal**, rarely used directly.

---

## Interview-ready takeaway

> **ApplicationContext** = brain
> **Environment** = configuration
> **SecurityContext** = identity
> **PersistenceContext** = data state
> **WebApplicationContext** = bridge to servlet world
