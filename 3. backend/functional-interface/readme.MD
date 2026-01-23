# Functional Interfaces in Java

## Quick Overview

A **functional interface** is an interface with exactly **one abstract method**. It's the foundation of functional programming in Java (Java 8+) and enables lambda expressions.

```java
@FunctionalInterface
public interface MyFunctionalInterface {
    void doSomething();  // Single abstract method
}

// Used with lambda
MyFunctionalInterface task = () -> System.out.println("Hello");
task.doSomething();
```

## Files in This Folder

1. **[1-core-concepts.MD](1-core-concepts.MD)** - Essential concepts and built-in functional interfaces
   - What is a functional interface
   - Single Abstract Method (SAM) principle
   - Lambda expression syntax
   - Built-in interfaces (Supplier, Consumer, Function, Predicate, etc.)
   - Method references

2. **[2-practical-examples.MD](2-practical-examples.MD)** - Real-world usage patterns
   - Custom sorting
   - Event listeners
   - Validation logic
   - Callbacks
   - Transformation pipelines
   - Strategy pattern
   - And more...

3. **[3-spring-boot-microservices.MD](3-spring-boot-microservices.MD)** - Functional programming in Spring Boot
   - Basics to advanced concepts progression
   - Spring Boot integration with functional interfaces
   - Stream operations for data processing
   - Spring WebFlux functional routing
   - Microservices use cases (validation, service chaining, async processing, analytics)
   - Complete real-world microservice examples

4. **[abstract-method.MD](abstract-method.MD)** - Understanding abstract methods
   - What is an abstract method and why it matters
   - Abstract methods in abstract classes and interfaces
   - Rules and constraints
   - Relationship with functional interfaces (single abstract method requirement)
   - Real-world payment processing example
   - Benefits and use cases

## Key Points to Remember

✓ **One abstract method only** - Multiple defaults/statics allowed  
✓ **@FunctionalInterface annotation** - Recommended for compile-time checking  
✓ **Lambda expressions** - Compact way to implement functional interfaces  
✓ **Method references** - Even more concise syntax  
✓ **java.util.function package** - Contains common functional interfaces  

## Common Functional Interfaces

| Interface | Method | Purpose |
|-----------|--------|---------|
| `Supplier<T>` | `T get()` | Supplies a value |
| `Consumer<T>` | `void accept(T)` | Consumes a value |
| `Function<T, R>` | `R apply(T)` | Transforms input to output |
| `Predicate<T>` | `boolean test(T)` | Tests a condition |
| `BiFunction<T, U, R>` | `R apply(T, U)` | Takes two inputs |

## Example Usage

```java
// Define
Predicate<Integer> isPositive = num -> num > 0;

// Use
System.out.println(isPositive.test(5));   // true
System.out.println(isPositive.test(-5));  // false
```

## Benefits

- **Cleaner Code** - Replaces verbose anonymous classes
- **Functional Programming** - Enables FP paradigm in Java
- **Stream API** - Essential for Stream operations
- **Readability** - Lambda expressions are concise
- **Flexibility** - Separate behavior from structure
