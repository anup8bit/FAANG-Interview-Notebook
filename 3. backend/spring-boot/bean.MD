# Spring Bean Definition – Deep Dive

This document focuses **only on Spring BeanDefinition** — what it is, why it exists, and how Spring uses it internally.

---

## 1. What is a BeanDefinition?

> **A BeanDefinition is Spring’s internal metadata representation of a bean — not the actual object.**

It describes **how a bean should be created**, not the bean itself.

Key idea:

> **BeanDefinition = blueprint**
> **Bean instance = real object**

---

## 2. When is BeanDefinition Created?

BeanDefinitions are created during:

* Component scanning (`@ComponentScan`)
* Configuration parsing (`@Configuration` + `@Bean`)
* Auto-configuration

⚠️ At this stage:

* ❌ No objects exist
* ❌ No dependency injection happens

Only metadata is registered.

---

## 3. What Triggers BeanDefinition Registration?

### Annotation-based beans

```java
@Service
public class PaymentService {}
```

### Configuration-based beans

```java
@Configuration
public class AsyncConfig {

    @Bean("aggregationExecutor")
    public Executor executor() {
        return new ThreadPoolTaskExecutor();
    }
}
```

Both result in **BeanDefinitions**, not objects.

---

## 4. What Does a BeanDefinition Contain?

Internally, Spring uses implementations like `RootBeanDefinition`.

```
BeanDefinition
├── beanName = paymentService
├── beanClass = PaymentService
├── scope = singleton
├── lazyInit = false
├── dependsOn = []
├── constructorArgs = []
├── propertyValues = []
├── initMethodName
├── destroyMethodName
├── role = application
```

This is **pure configuration metadata**.

---

## 5. Where Are BeanDefinitions Stored?

All BeanDefinitions live inside:

```
DefaultListableBeanFactory
└── Map<String, BeanDefinition> beanDefinitionMap
```

This map exists **inside ApplicationContext**.

---

## 6. BeanDefinition vs Bean Instance

| Aspect     | BeanDefinition    | Bean Instance    |
| ---------- | ----------------- | ---------------- |
| Purpose    | Metadata          | Real object      |
| Created at | Startup scan      | Context refresh  |
| Count      | One per bean      | Depends on scope |
| Stored in  | beanDefinitionMap | singletonObjects |

---

## 7. How BeanDefinition Is Used Later

During context refresh:

```
for each BeanDefinition:
  → instantiate bean
  → inject dependencies
  → apply post-processors
  → store instance
```

The BeanDefinition tells Spring:

* Which class to instantiate
* Which dependencies to resolve
* Which lifecycle methods to call

---

## 8. BeanFactoryPostProcessor & BeanDefinition

Before objects are created, Spring allows modification of BeanDefinitions.

Examples:

* Property placeholder resolution
* Conditional beans
* Profile-based activation

```
BeanFactoryPostProcessor
→ modifies BeanDefinition
→ no bean instance involved
```

This is a **design-time mutation phase**.

---

## 9. Important Characteristics

* BeanDefinitions are **immutable at runtime**
* They exist even if the bean is never instantiated
* They are independent of HTTP requests

---

## 10. Mental Model (One Line)

> **BeanDefinition is Spring’s internal contract that explains how a bean should be built — before the bean even exists.**

---

*End of document*
