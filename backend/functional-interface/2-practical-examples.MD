# Functional Interface - Practical Examples

## Real-World Use Cases

### 1. Custom Sorting with Functional Interface

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T a, T b);
}

// Usage
Comparator<Integer> ascending = (a, b) -> a - b;
Comparator<Integer> descending = (a, b) -> b - a;

List<Integer> numbers = Arrays.asList(5, 2, 8, 1, 9);
// Sort using functional interface
numbers.sort(ascending);
System.out.println(numbers); // [1, 2, 5, 8, 9]
```

### 2. Event Listeners

```java
@FunctionalInterface
public interface EventListener {
    void onEvent(String eventData);
}

public class EventPublisher {
    private EventListener listener;
    
    public void subscribe(EventListener listener) {
        this.listener = listener;
    }
    
    public void publishEvent(String data) {
        if (listener != null) {
            listener.onEvent(data);
        }
    }
}

// Usage
EventPublisher publisher = new EventPublisher();
publisher.subscribe(event -> System.out.println("Event received: " + event));
publisher.publishEvent("Button clicked");  // Output: Event received: Button clicked
```

### 3. Validation Logic

```java
@FunctionalInterface
public interface Validator<T> {
    boolean validate(T value);
}

public class User {
    private String email;
    private int age;
    
    public User(String email, int age) {
        this.email = email;
        this.age = age;
    }
    
    public boolean validate(Validator<User> validator) {
        return validator.validate(this);
    }
}

// Usage
Validator<User> emailValidator = user -> user.email.contains("@");
Validator<User> ageValidator = user -> user.age >= 18;

User user = new User("john@example.com", 25);
System.out.println(user.validate(emailValidator));  // true
System.out.println(user.validate(ageValidator));    // true
```

### 4. Callback with Functional Interface

```java
@FunctionalInterface
public interface ResponseCallback {
    void onResponse(String response);
}

public class APIClient {
    public void fetchData(String url, ResponseCallback callback) {
        // Simulate API call
        try {
            Thread.sleep(1000);
            callback.onResponse("Data from " + url);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

// Usage
APIClient client = new APIClient();
client.fetchData("https://api.example.com", response -> {
    System.out.println("Received: " + response);
});
```

### 5. Transformation Pipeline

```java
@FunctionalInterface
public interface Transform<T> {
    T apply(T input);
}

public class Pipeline<T> {
    private List<Transform<T>> transforms = new ArrayList<>();
    
    public Pipeline<T> addTransform(Transform<T> transform) {
        transforms.add(transform);
        return this;
    }
    
    public T execute(T input) {
        T result = input;
        for (Transform<T> transform : transforms) {
            result = transform.apply(result);
        }
        return result;
    }
}

// Usage
Pipeline<Integer> pipeline = new Pipeline<>();
pipeline
    .addTransform(x -> x * 2)      // Double
    .addTransform(x -> x + 10)     // Add 10
    .addTransform(x -> x / 2);     // Divide by 2

System.out.println(pipeline.execute(5)); // ((5 * 2) + 10) / 2 = 10
```

### 6. Conditional Execution

```java
@FunctionalInterface
public interface ConditionalTask {
    void execute();
}

public class TaskExecutor {
    public void executeIf(Predicate<Boolean> condition, ConditionalTask task) {
        if (condition.test(true)) {
            task.execute();
        }
    }
}

// Usage
TaskExecutor executor = new TaskExecutor();
executor.executeIf(
    condition -> true,
    () -> System.out.println("Task executed!")
);
```

### 7. Filter and Map Operations

```java
@FunctionalInterface
public interface Filter<T> {
    boolean test(T value);
}

@FunctionalInterface
public interface Mapper<T, R> {
    R map(T value);
}

public class DataProcessor<T, R> {
    public List<R> process(List<T> data, Filter<T> filter, Mapper<T, R> mapper) {
        List<R> result = new ArrayList<>();
        for (T item : data) {
            if (filter.test(item)) {
                result.add(mapper.map(item));
            }
        }
        return result;
    }
}

// Usage
DataProcessor<Integer, String> processor = new DataProcessor<>();
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

List<String> result = processor.process(
    numbers,
    num -> num > 2,                    // Filter
    num -> "Number: " + num            // Map
);

System.out.println(result); 
// Output: [Number: 3, Number: 4, Number: 5]
```

### 8. Strategy Pattern with Functional Interface

```java
@FunctionalInterface
public interface PaymentStrategy {
    boolean pay(double amount);
}

public class PaymentProcessor {
    public boolean processPayment(double amount, PaymentStrategy strategy) {
        return strategy.pay(amount);
    }
}

// Usage
PaymentProcessor processor = new PaymentProcessor();

PaymentStrategy creditCard = amount -> {
    System.out.println("Processing credit card payment: $" + amount);
    return true;
};

PaymentStrategy paypal = amount -> {
    System.out.println("Processing PayPal payment: $" + amount);
    return true;
};

processor.processPayment(100, creditCard);  // Credit card
processor.processPayment(50, paypal);       // PayPal
```

### 9. Retry Logic

```java
@FunctionalInterface
public interface Operation<T> {
    T execute() throws Exception;
}

public class RetryExecutor {
    public <T> T executeWithRetry(Operation<T> operation, int maxRetries) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                return operation.execute();
            } catch (Exception e) {
                if (i == maxRetries - 1) {
                    throw new RuntimeException("Operation failed after " + maxRetries + " attempts");
                }
            }
        }
        return null;
    }
}

// Usage
RetryExecutor executor = new RetryExecutor();
int result = executor.executeWithRetry(
    () -> {
        // Simulating an operation that might fail
        if (Math.random() < 0.7) {
            throw new Exception("Failed");
        }
        return 42;
    },
    3
);
```

### 10. Thread Pool with Functional Interface

```java
@FunctionalInterface
public interface Task {
    void run();
}

public class SimpleThreadPool {
    private ExecutorService executor;
    
    public SimpleThreadPool(int threadCount) {
        executor = Executors.newFixedThreadPool(threadCount);
    }
    
    public void submit(Task task) {
        executor.submit(() -> task.run());
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}

// Usage
SimpleThreadPool pool = new SimpleThreadPool(2);
for (int i = 0; i < 5; i++) {
    final int taskId = i;
    pool.submit(() -> {
        System.out.println("Task " + taskId + " executed by " + 
                         Thread.currentThread().getName());
    });
}
pool.shutdown();
```

## Comparison: Anonymous Class vs Lambda Expression

### Using Anonymous Class
```java
Comparator<Integer> comp = new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return a - b;
    }
};
```

### Using Lambda Expression
```java
Comparator<Integer> comp = (a, b) -> a - b;
```

The lambda expression is much more concise and readable!
