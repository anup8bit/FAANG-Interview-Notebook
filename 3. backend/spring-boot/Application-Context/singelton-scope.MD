# Spring Singleton Scope — Deep Dive with Examples

This document explains **Singleton in Spring** from **high‑level concept** to **low‑level internals**, with clear examples and mental models.

---

## 1️⃣ What Does Singleton Mean in Spring?

In Spring:

> **Singleton means ONE bean instance per ApplicationContext**

⚠️ This is **NOT** the same as the classic Java Singleton pattern.

### Key idea

* Spring creates **one object instance**
* Stores it in the **ApplicationContext**
* Returns the **same instance every time** it is requested

---

## 2️⃣ Simple Example

```java
@Service
public class PaymentService {
    public void pay() {
        System.out.println("Payment done");
    }
}
```

Injected in two places:

```java
@RestController
public class OrderController {
    @Autowired
    private PaymentService paymentService;
}
```

```java
@Service
public class RefundService {
    @Autowired
    private PaymentService paymentService;
}
```

### Reality in memory

```
OrderController.paymentService  ─┐
                                 ├──▶ PaymentServiceProxy@0xA12
RefundService.paymentService ────┘
```

✅ Same instance

---

## 3️⃣ What Actually Gets Stored?

Spring stores the singleton in the **Singleton Bean Cache**.

```
Singleton Objects Map
---------------------
"paymentService" → PaymentServiceProxy@0xA12
```

Whenever Spring needs this bean, it **returns the cached instance**.

---

## 4️⃣ Singleton Lifecycle (Step‑by‑Step)

1. Class is discovered during component scanning
2. `BeanDefinition` is created
3. During **context refresh**:

   * Object is instantiated
   * Dependencies injected
   * BeanPostProcessors applied
   * Proxy created (if needed)
4. Bean is stored in singleton cache
5. Same instance is reused forever

---

## 5️⃣ Spring Singleton vs Java Singleton

| Java Singleton       | Spring Singleton                    |
| -------------------- | ----------------------------------- |
| One instance per JVM | One instance per ApplicationContext |
| Static access        | Managed by Spring                   |
| Hard to test         | Easy to mock                        |
| Tight coupling       | Loose coupling                      |

Example Java Singleton:

```java
public class ClassicSingleton {
    private static final ClassicSingleton INSTANCE = new ClassicSingleton();
    private ClassicSingleton() {}
    public static ClassicSingleton getInstance() {
        return INSTANCE;
    }
}
```

Spring does **not** require this pattern.

---

## 6️⃣ Why Singleton Is Default in Spring

Spring beans are singleton by default because:

* Services are usually **stateless**
* Creating objects is expensive
* Memory usage is lower
* Centralized lifecycle management

---

## 7️⃣ Stateless vs Stateful (VERY IMPORTANT)

### ❌ Bad (stateful singleton)

```java
@Service
public class PaymentService {
    private int totalPayments; // ❌ shared state
}
```

This value is shared across **all users and threads**.

### ✅ Good (stateless singleton)

```java
@Service
public class PaymentService {
    public void process(PaymentRequest request) {
        // uses only method-local data
    }
}
```

Rule:

> **Singleton beans should be stateless**

---

## 8️⃣ Singleton and Multithreading

Because a singleton bean:

* Is shared across threads
* Handles concurrent requests

You must ensure:

* No mutable shared fields
* Or proper synchronization (rarely recommended)

---

## 9️⃣ When Is Singleton Created?

By default:

* Singleton beans are created **at application startup**
* During `ApplicationContext.refresh()`

Unless:

```java
@Lazy
@Service
public class PaymentService { }
```

Then it is created **only when first used**.

---

## 🔟 One‑Line Mental Models

* **Spring Singleton = One object per ApplicationContext**
* **Shared instance, not shared state**
* **Stateless services scale, stateful ones break**

---

## 1️⃣1️⃣ Common Interview Traps

❓ Is Spring singleton thread‑safe?

> ❌ No. It is shared, not synchronized.

❓ Is singleton per request?

> ❌ No. Same instance for all requests.

❓ Can Spring create multiple singletons of same class?

> ✅ Yes, if bean names or configurations differ.

---

## 1️⃣2️⃣ Summary

* Singleton is the **default scope**
* One instance per ApplicationContext
* Stored in singleton cache
* Reused everywhere
* Must be stateless

---

*End of document*
