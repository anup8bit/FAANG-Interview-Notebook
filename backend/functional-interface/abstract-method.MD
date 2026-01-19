# Abstract Methods in Java

## What is an Abstract Method?

An **abstract method** is a method declaration without an implementation (no body). It only defines the method signature and must be implemented by concrete classes or interfaces.

## Key Characteristics:

- **Declared with `abstract` keyword**: Marks the method as abstract
- **No method body**: Ends with a semicolon, no curly braces
- **Must be implemented by subclasses**: Concrete subclasses must provide implementation
- **Can only exist in abstract classes or interfaces**: Cannot be in regular concrete classes
- **Defines a contract**: Specifies what methods must exist, not how they work

## Syntax:

```java
abstract returnType methodName(parameters);
```

## Example 1: Abstract Method in Abstract Class

```java
// Abstract class with abstract method
public abstract class Animal {
    // Abstract method - no implementation
    abstract void makeSound();
    
    // Another abstract method
    abstract String getSpecies();
    
    // Concrete method - has implementation
    public void sleep() {
        System.out.println("Zzzzz");
    }
}

// Concrete class must implement all abstract methods
public class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
    
    @Override
    String getSpecies() {
        return "Canine";
    }
}

// Another concrete class
public class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow!");
    }
    
    @Override
    String getSpecies() {
        return "Feline";
    }
}

// Usage
Animal dog = new Dog();
dog.makeSound();           // Output: Woof!
System.out.println(dog.getSpecies()); // Output: Canine
dog.sleep();               // Output: Zzzzz

Animal cat = new Cat();
cat.makeSound();           // Output: Meow!
System.out.println(cat.getSpecies()); // Output: Feline
```

## Example 2: Abstract Method in Interface

```java
// Interface (all methods are abstract by default)
public interface Vehicle {
    // Abstract method
    void start();
    
    // Another abstract method
    void stop();
    
    // Default method (has implementation)
    default void honk() {
        System.out.println("Beep beep!");
    }
}

// Concrete class implementing interface
public class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car engine started");
    }
    
    @Override
    public void stop() {
        System.out.println("Car stopped");
    }
}

// Usage
Vehicle car = new Car();
car.start();  // Output: Car engine started
car.stop();   // Output: Car stopped
car.honk();   // Output: Beep beep!
```

## Example 3: Abstract Class with Mixed Methods

```java
public abstract class Shape {
    // Abstract method - must be implemented
    abstract double getArea();
    
    // Abstract method - must be implemented
    abstract void draw();
    
    // Concrete method - default implementation
    public void printProperties() {
        System.out.println("Area: " + getArea());
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing a circle with radius " + radius);
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    double getArea() {
        return width * height;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing a rectangle " + width + " x " + height);
    }
}

// Usage
Shape circle = new Circle(5);
circle.draw();              // Output: Drawing a circle with radius 5
circle.printProperties();   // Output: Area: 78.53981633974483

Shape rectangle = new Rectangle(4, 6);
rectangle.draw();           // Output: Drawing a rectangle 4 x 6
rectangle.printProperties(); // Output: Area: 24.0
```

## Abstract Methods vs Concrete Methods

| Aspect | Abstract Method | Concrete Method |
|--------|-----------------|-----------------|
| **Body** | No body (ends with `;`) | Has implementation in `{}` |
| **Keyword** | `abstract` required | No `abstract` keyword |
| **Where** | Abstract classes, interfaces | Any class (abstract or concrete) |
| **Must Override** | Yes, in subclasses | No, inherited as-is |
| **Purpose** | Define contract | Provide default behavior |

## Abstract Methods in Functional Interfaces

**Functional interfaces must have exactly ONE abstract method:**

```java
@FunctionalInterface
public interface Calculator {
    // Abstract method - the only one allowed in a functional interface
    int calculate(int a, int b);
}

// Lambda expression implements the ONE abstract method
Calculator add = (a, b) -> a + b;
System.out.println(add.calculate(5, 3));  // Output: 8

Calculator multiply = (a, b) -> a * b;
System.out.println(multiply.calculate(5, 3));  // Output: 15
```

**Why only one?** When you use a lambda expression, you're providing the implementation for the abstract method. If the interface had multiple abstract methods, Java wouldn't know which method your lambda is implementing!

```java
// ✗ INVALID - More than one abstract method
@FunctionalInterface
public interface InvalidInterface {
    int calculate(int a, int b);  // Abstract method 1
    String getName();              // Abstract method 2 - COMPILATION ERROR!
}

// ✓ VALID - Exactly one abstract method + default methods
@FunctionalInterface
public interface ValidInterface {
    int calculate(int a, int b);   // Abstract method
    
    default void printResult() {
        System.out.println("Calculation done");
    }
}
```

## Key Rules for Abstract Methods

1. **Cannot instantiate abstract classes directly**
   ```java
   // ✗ INVALID
   Animal animal = new Animal();  // Compilation error
   
   // ✓ VALID
   Animal dog = new Dog();  // OK, Dog is concrete
   ```

2. **Subclass must implement all abstract methods**
   ```java
   // ✗ INVALID - Doesn't implement all abstract methods
   public class Bird extends Animal {
       @Override
       void makeSound() {
           System.out.println("Tweet!");
       }
       // Missing getSpecies() implementation
   }
   
   // ✓ VALID - Implements all abstract methods
   public class Bird extends Animal {
       @Override
       void makeSound() {
           System.out.println("Tweet!");
       }
       
       @Override
       String getSpecies() {
           return "Avian";
       }
   }
   ```

3. **Can be chained through inheritance**
   ```java
   public abstract class Vehicle {
       abstract void start();
   }
   
   public abstract class Car extends Vehicle {
       abstract void openTrunk();
       // Still doesn't implement start() - must be implemented by concrete class
   }
   
   public class ElectricCar extends Car {
       @Override
       void start() {
           System.out.println("Silent electric start");
       }
       
       @Override
       void openTrunk() {
           System.out.println("Trunk opened");
       }
   }
   ```

## Real-World Use Case: Payment Processing

```java
// Abstract class defining payment contract
public abstract class PaymentProcessor {
    abstract boolean processPayment(double amount);
    
    abstract boolean validatePaymentMethod();
    
    // Concrete method
    public void logTransaction(double amount) {
        System.out.println("Transaction logged: $" + amount);
    }
}

// Credit card implementation
public class CreditCardProcessor extends PaymentProcessor {
    private String cardNumber;
    
    public CreditCardProcessor(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    @Override
    boolean processPayment(double amount) {
        if (validatePaymentMethod()) {
            System.out.println("Processing credit card payment: $" + amount);
            logTransaction(amount);
            return true;
        }
        return false;
    }
    
    @Override
    boolean validatePaymentMethod() {
        return cardNumber != null && cardNumber.length() == 16;
    }
}

// PayPal implementation
public class PayPalProcessor extends PaymentProcessor {
    private String email;
    
    public PayPalProcessor(String email) {
        this.email = email;
    }
    
    @Override
    boolean processPayment(double amount) {
        if (validatePaymentMethod()) {
            System.out.println("Processing PayPal payment: $" + amount);
            logTransaction(amount);
            return true;
        }
        return false;
    }
    
    @Override
    boolean validatePaymentMethod() {
        return email != null && email.contains("@");
    }
}

// Usage
PaymentProcessor creditCard = new CreditCardProcessor("1234567890123456");
creditCard.processPayment(100);  // Processes and logs

PaymentProcessor paypal = new PayPalProcessor("user@example.com");
paypal.processPayment(50);  // Processes and logs
```

## Benefits of Abstract Methods

1. **Enforce Implementation**: Subclasses must implement required methods
2. **Define Contract**: Clear interface that subclasses must follow
3. **Polymorphism**: Different implementations can be used interchangeably
4. **Code Organization**: Separates interface from implementation
5. **Flexibility**: Allows multiple implementations of same contract

## Summary

- **Abstract methods** define what subclasses must do, not how they do it
- **Cannot be instantiated** - must be implemented by concrete classes
- **Essential for polymorphism** and creating extensible designs
- **Functional interfaces** are a special case with exactly ONE abstract method
- **Use lambda expressions** to implement functional interface's abstract method
