# Functional Interfaces in Java

## What is a Functional Interface?

A **functional interface** is an interface that contains exactly **one abstract method**. It can have multiple default methods and static methods, but only one abstract method.

### Key Characteristics:
- **Single Abstract Method (SAM)**: Only one abstract method declaration
- **Multiple Default Methods**: Can have any number of default methods
- **Multiple Static Methods**: Can have any number of static methods
- **@FunctionalInterface Annotation**: Optional but recommended for compile-time checking

## Why Functional Interfaces Matter?

Functional interfaces are the foundation of **lambda expressions** and **method references** in Java (introduced in Java 8). They enable functional programming paradigms in Java.

## Example 1: Simple Functional Interface

```java
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);
}
```

Using with lambda expression:
```java
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

System.out.println(add.calculate(5, 3));        // Output: 8
System.out.println(multiply.calculate(5, 3));   // Output: 15
```

## Example 2: Functional Interface with Default Method

```java
@FunctionalInterface
public interface Processor {
    String process(String input);
    
    // Default method - not abstract
    default String processWithPrefix(String input) {
        return "PREFIX_" + process(input);
    }
}
```

Using:
```java
Processor toUpperCase = s -> s.toUpperCase();
System.out.println(toUpperCase.process("hello"));           // OUTPUT: HELLO
System.out.println(toUpperCase.processWithPrefix("hello")); // OUTPUT: PREFIX_HELLO
```

## Example 3: Functional Interface with Generic Types

```java
@FunctionalInterface
public interface Transformer<T, R> {
    R transform(T input);
}
```

Using:
```java
// String to Integer
Transformer<String, Integer> stringToLength = s -> s.length();
System.out.println(stringToLength.transform("hello")); // Output: 5

// Integer to String
Transformer<Integer, String> intToString = num -> "Number: " + num;
System.out.println(intToString.transform(42)); // Output: Number: 42
```

## Built-in Functional Interfaces (java.util.function)

Java provides common functional interfaces in the `java.util.function` package:

### 1. **Supplier<T>** - Supplies a value
```java
Supplier<String> supplier = () -> "Hello";
String result = supplier.get();
System.out.println(result); // Output: Hello
```

### 2. **Consumer<T>** - Consumes a value
```java
Consumer<String> consumer = s -> System.out.println("Received: " + s);
consumer.accept("Hello"); // Output: Received: Hello
```

### 3. **Function<T, R>** - Transforms input to output
```java
Function<Integer, String> intToString = num -> "Number: " + num;
System.out.println(intToString.apply(42)); // Output: Number: 42
```

### 4. **Predicate<T>** - Tests a condition
```java
Predicate<Integer> isEven = num -> num % 2 == 0;
System.out.println(isEven.test(4));  // Output: true
System.out.println(isEven.test(5));  // Output: false
```

### 5. **BiFunction<T, U, R>** - Takes two inputs
```java
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
System.out.println(add.apply(5, 3)); // Output: 8
```

## Lambda Expression Syntax

### Basic Syntax:
```
(parameters) -> expression
```

### Different Forms:

#### Single Parameter (parentheses optional):
```java
Function<Integer, Integer> square = x -> x * x;
Function<Integer, Integer> square2 = (x) -> x * x;
```

#### Multiple Parameters:
```java
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
```

#### No Parameters:
```java
Supplier<String> greeting = () -> "Hello";
```

#### Multiple Statements (with braces):
```java
Function<Integer, Integer> complex = (x) -> {
    int result = x * 2;
    result += 10;
    return result;
};
```

## Method References

Method references provide another way to use functional interfaces:

```java
// Constructor Reference
Supplier<ArrayList> listSupplier = ArrayList::new;

// Static Method Reference
Function<String, Integer> toInteger = Integer::parseInt;

// Instance Method Reference
String text = "hello";
Supplier<String> upperCase = text::toUpperCase;

// Arbitrary Instance Method Reference
Consumer<String> print = System.out::println;
```

## Validation: @FunctionalInterface Annotation

```java
// ✓ Valid - Single abstract method
@FunctionalInterface
public interface Valid1 {
    void doSomething();
}

// ✓ Valid - Single abstract method + default methods
@FunctionalInterface
public interface Valid2 {
    void doSomething();
    default void defaultMethod() {}
}

// ✓ Valid - Single abstract method + static methods
@FunctionalInterface
public interface Valid3 {
    void doSomething();
    static void staticMethod() {}
}

// ✗ Invalid - Two abstract methods
@FunctionalInterface
public interface Invalid1 {
    void doSomething();
    void doAnother();  // Compilation error
}

// ✗ Invalid - No abstract methods
@FunctionalInterface
public interface Invalid2 {
    default void defaultMethod() {}  // Compilation error
}
```

## Best Practices

1. **Always use @FunctionalInterface annotation** for compile-time checking
2. **Use built-in functional interfaces** from `java.util.function` when possible
3. **Prefer functional interfaces for callbacks** instead of anonymous inner classes
4. **Keep functional interface contracts simple** - single responsibility
5. **Use descriptive names** for custom functional interfaces
6. **Leverage method references** for cleaner, more readable code

## Advantages

- **Cleaner Code**: Replaces verbose anonymous inner classes
- **Functional Programming**: Enables functional paradigm in Java
- **Better Readability**: Lambda expressions are concise and expressive
- **Stream API Integration**: Essential for Stream operations
- **Higher-Order Functions**: Enables passing behavior as data
