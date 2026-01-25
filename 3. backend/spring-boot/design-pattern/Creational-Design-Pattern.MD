# Creational Design Patterns – Examples (Basic → Enterprise Level)

This document contains **practical, real-world examples** of all GoF Creational Design Patterns,
written in **Java / Spring Boot style**.

---

## 1. Singleton Pattern

### Problem
You want **only one instance** of a class shared across the application.

### Example: Configuration Service

```java
public class AppConfig {

    private static volatile AppConfig instance;

    private AppConfig() {}

    public static AppConfig getInstance() {
        if (instance == null) {
            synchronized (AppConfig.class) {
                if (instance == null) {
                    instance = new AppConfig();
                }
            }
        }
        return instance;
    }
}

Spring Boot Reality
@Service   // Singleton by default
public class FeatureFlagService {
}

Use Cases

Logger

Cache

Configuration

Connection pool manager

2. Factory Method Pattern
Problem

Object creation depends on input type, and client should not know concrete classes.

Example: Payment Factory
public interface PaymentService {
    void pay();
}

public class UpiPaymentService implements PaymentService {
    public void pay() {
        System.out.println("Paying via UPI");
    }
}

public class CardPaymentService implements PaymentService {
    public void pay() {
        System.out.println("Paying via Card");
    }
}

public class PaymentFactory {

    public static PaymentService getPayment(String type) {
        return switch (type) {
            case "UPI" -> new UpiPaymentService();
            case "CARD" -> new CardPaymentService();
            default -> throw new IllegalArgumentException("Invalid type");
        };
    }
}

Usage
PaymentService service = PaymentFactory.getPayment("UPI");
service.pay();

Use Cases

Payment gateways

Notification channels (Email/SMS/Push)

File parsers (CSV/JSON/XML)

3. Abstract Factory Pattern
Problem

You must create related objects together, ensuring compatibility.

Example: Cloud Infrastructure Factory
Common Interfaces
interface StorageService {
    void store();
}

interface QueueService {
    void publish();
}

AWS Implementations
class S3StorageService implements StorageService {
    public void store() {
        System.out.println("Storing in S3");
    }
}

class SqsQueueService implements QueueService {
    public void publish() {
        System.out.println("Publishing to SQS");
    }
}

Abstract Factory
interface CloudFactory {
    StorageService createStorage();
    QueueService createQueue();
}

class AwsCloudFactory implements CloudFactory {
    public StorageService createStorage() {
        return new S3StorageService();
    }

    public QueueService createQueue() {
        return new SqsQueueService();
    }
}

Usage
CloudFactory factory = new AwsCloudFactory();
factory.createStorage().store();
factory.createQueue().publish();

Use Cases

Multi-cloud systems

Environment-based beans (AWS/GCP)

UI theme systems

4. Builder Pattern
Problem

Object has many optional fields, constructors become unreadable.

Example: Order Object
public class Order {

    private final String userId;
    private final String productId;
    private final String coupon;
    private final boolean giftWrap;

    private Order(Builder builder) {
        this.userId = builder.userId;
        this.productId = builder.productId;
        this.coupon = builder.coupon;
        this.giftWrap = builder.giftWrap;
    }

    public static class Builder {
        private String userId;
        private String productId;
        private String coupon;
        private boolean giftWrap;

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder productId(String productId) {
            this.productId = productId;
            return this;
        }

        public Builder coupon(String coupon) {
            this.coupon = coupon;
            return this;
        }

        public Builder giftWrap(boolean giftWrap) {
            this.giftWrap = giftWrap;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}

Usage
Order order = new Order.Builder()
        .userId("U1")
        .productId("P1")
        .coupon("NEW10")
        .giftWrap(true)
        .build();

Use Cases

DTOs

Immutable domain objects

JWT claims

API request objects

5. Prototype Pattern
Problem

Object creation is expensive and you need copies of existing objects.

Example: Discount Rule Template
public class DiscountRule implements Cloneable {

    private String type;
    private int percentage;

    public DiscountRule(String type, int percentage) {
        this.type = type;
        this.percentage = percentage;
    }

    @Override
    public DiscountRule clone() {
        try {
            return (DiscountRule) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}

Usage
DiscountRule baseRule = new DiscountRule("FESTIVE", 20);
DiscountRule tenantRule = baseRule.clone();

Spring Boot Variant
@Component
@Scope("prototype")
public class RequestContext {
}

Use Cases

Template-based objects

Tenant-specific configs

Performance-critical object creation

6. Pattern Comparison (Quick Interview View)
Pattern	Purpose	Key Example
Singleton	One instance	Config, Cache
Factory	Choose implementation	PaymentService
Abstract Factory	Related objects	Cloud providers
Builder	Complex construction	Order, DTO
Prototype	Clone objects	Templates
7. Real System Mapping (Microservices)

Singleton → ConfigService, Cache

Factory → Payment / Notification selector

Abstract Factory → AWS vs GCP infra

Builder → Order, Invoice, JWT

Prototype → Discount rules, configs

Final Takeaway

Creational patterns exist to control object creation so systems remain extensible, testable, and production-safe as complexity grows.


---

If you want next:
- **Same examples rewritten using Spring annotations**
- **Anti-patterns & common mistakes**
- **One Spring Boot demo project implementing all 5 patterns together**

I want in single .md file
# Creational Design Patterns – Complete Examples (Single File)

This document contains **clear, real-world Java / Spring Boot–style examples**
for **all GoF Creational Design Patterns**, from basic to enterprise level.

---

## 1. Singleton Pattern

### Intent
Ensure **only one instance** of a class exists across the application.

### Example: Configuration Service

```java
public class AppConfig {

    private static volatile AppConfig instance;

    private AppConfig() {}

    public static AppConfig getInstance() {
        if (instance == null) {
            synchronized (AppConfig.class) {
                if (instance == null) {
                    instance = new AppConfig();
                }
            }
        }
        return instance;
    }
}

Spring Boot Reality
@Service   // Singleton by default
public class FeatureFlagService {
}

Use Cases

Logger

Cache

Configuration manager

Connection pool

2. Factory Method Pattern
Intent

Create objects without exposing instantiation logic to the client.

Example: Payment Factory
public interface PaymentService {
    void pay();
}

public class UpiPaymentService implements PaymentService {
    public void pay() {
        System.out.println("Paying via UPI");
    }
}

public class CardPaymentService implements PaymentService {
    public void pay() {
        System.out.println("Paying via Card");
    }
}

public class PaymentFactory {

    public static PaymentService getPayment(String type) {
        return switch (type) {
            case "UPI" -> new UpiPaymentService();
            case "CARD" -> new CardPaymentService();
            default -> throw new IllegalArgumentException("Invalid payment type");
        };
    }
}

Usage
PaymentService service = PaymentFactory.getPayment("UPI");
service.pay();

Use Cases

Payment gateways

Notification services (Email/SMS/Push)

File parsers (CSV/JSON/XML)

3. Abstract Factory Pattern
Intent

Create families of related objects ensuring compatibility.

Example: Cloud Infrastructure Factory
Common Interfaces
interface StorageService {
    void store();
}

interface QueueService {
    void publish();
}

AWS Implementations
class S3StorageService implements StorageService {
    public void store() {
        System.out.println("Storing data in S3");
    }
}

class SqsQueueService implements QueueService {
    public void publish() {
        System.out.println("Publishing message to SQS");
    }
}

Abstract Factory
interface CloudFactory {
    StorageService createStorage();
    QueueService createQueue();
}

class AwsCloudFactory implements CloudFactory {

    public StorageService createStorage() {
        return new S3StorageService();
    }

    public QueueService createQueue() {
        return new SqsQueueService();
    }
}

Usage
CloudFactory factory = new AwsCloudFactory();
factory.createStorage().store();
factory.createQueue().publish();

Use Cases

Multi-cloud systems (AWS / GCP)

Environment-specific beans

UI component families

4. Builder Pattern
Intent

Construct complex objects step-by-step with clarity.

Example: Order Creation
public class Order {

    private final String userId;
    private final String productId;
    private final String coupon;
    private final boolean giftWrap;

    private Order(Builder builder) {
        this.userId = builder.userId;
        this.productId = builder.productId;
        this.coupon = builder.coupon;
        this.giftWrap = builder.giftWrap;
    }

    public static class Builder {
        private String userId;
        private String productId;
        private String coupon;
        private boolean giftWrap;

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder productId(String productId) {
            this.productId = productId;
            return this;
        }

        public Builder coupon(String coupon) {
            this.coupon = coupon;
            return this;
        }

        public Builder giftWrap(boolean giftWrap) {
            this.giftWrap = giftWrap;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}

Usage
Order order = new Order.Builder()
        .userId("U101")
        .productId("P202")
        .coupon("NEW10")
        .giftWrap(true)
        .build();

Use Cases

DTOs

Immutable domain objects

JWT claims

API request objects

5. Prototype Pattern
Intent

Create new objects by cloning existing ones.

Example: Discount Rule Template
public class DiscountRule implements Cloneable {

    private String type;
    private int percentage;

    public DiscountRule(String type, int percentage) {
        this.type = type;
        this.percentage = percentage;
    }

    @Override
    public DiscountRule clone() {
        try {
            return (DiscountRule) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}

Usage
DiscountRule baseRule = new DiscountRule("FESTIVE", 20);
DiscountRule tenantRule = baseRule.clone();

Spring Boot Variant
@Component
@Scope("prototype")
public class RequestContext {
}

Use Cases

Template-based configurations

Tenant-specific objects

Performance-critical object creation

6. Quick Comparison Table
Pattern	Purpose	Example
Singleton	One instance	Config, Cache
Factory	Choose implementation	PaymentService
Abstract Factory	Related objects	Cloud providers
Builder	Complex construction	Order
Prototype	Clone objects	Discount rules
7. Real-World Mapping (Microservices)

Singleton → ConfigService, Cache

Factory → Payment / Notification selection

Abstract Factory → AWS vs GCP infrastructure

Builder → Order, Invoice, JWT

Prototype → Discount rules, default configs

Final Summary

Creational Design Patterns control object creation to keep enterprise systems
scalable, flexible, testable, and maintainable as complexity grows.