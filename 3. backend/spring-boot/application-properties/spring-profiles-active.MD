# Mastery Guide: `spring.profiles.active` in Spring Boot

The `spring.profiles.active` property in Spring Boot is used to activate specific profiles and load environment-specific configurations. This is a critical feature for managing configurations in different environments (e.g., dev, qa, prod) and is widely used in microservices architectures.

---

## **What Does "Loading Environment Base application-env.yml File" Mean?**

### **Purpose**
- Indicates that Spring Boot is loading an environment-specific YAML file (e.g., `application-dev.yml`, `application-prod.yml`) on top of the base `application.yml` file.
- This allows you to override or extend properties for specific environments.

### **Trigger**
- Activated via `spring.profiles.active=env` using:
  - Command-line arguments
  - Environment variables
  - JVM arguments
  - `application.yml` configuration

### **Load Order (High → Low Priority)**
1. Command-line arguments
2. OS environment variables
3. `application-{profile}.yml`
4. `application.yml`

> **Note**: Later sources override earlier ones.

### **Typical Use**
- Separate configurations for:
  - Database credentials
  - Kafka endpoints
  - Redis configurations
  - Logging levels
- Avoids code changes when switching environments.

### **Where It's Logged**
- Often logged during the bootstrap phase by:
  - Custom `EnvironmentPostProcessor`
  - `ApplicationListener`
  - Spring's default configuration logs

### **Best Practices**
- Store secrets in environment variables or a secrets manager (e.g., AWS Secrets Manager).
- Commit only non-sensitive defaults to version control.
- Validate configurations using `@ConfigurationProperties` and `@Validated`.

### **Debugging Tip**
- Run with `--debug` or set:
  ```properties
  logging.level.org.springframework.boot.context.config=DEBUG
  ```
  This will log the exact files and their precedence during startup.

---

## **How to Trigger and Load `application-env.yml`**

### **1. Via Active Profile (Most Common)**
#### **Options**:
- **Command-line**:
  ```bash
  java -jar app.jar --spring.profiles.active=env
  ```
- **Environment Variable**:
  ```bash
  export SPRING_PROFILES_ACTIVE=env
  ```
- **JVM Argument**:
  ```bash
  java -Dspring.profiles.active=env -jar app.jar
  ```
- **application.yml**:
  ```yaml
  spring:
    profiles:
      active: env
  ```

---

### **2. Auto-loaded by Naming Convention**
- Files: `application.yml` + `application-env.yml`
- When the `env` profile is active, Spring automatically loads `application-env.yml`.

---

### **3. Explicit Include (Merge Multiple Profiles)**
- Use `spring.profiles.include` to include additional profiles:
  ```yaml
  spring:
    profiles:
      include: env
  ```

---

### **4. Custom Config Location**
- Specify a non-standard path or name for the configuration file:
  - **Command-line**:
    ```bash
    --spring.config.location=classpath:/config/application-env.yml
    ```
  - **application.yml**:
    ```yaml
    spring:
      config:
        import: classpath:/config/application-env.yml
    ```

---

### **5. Programmatic Activation (Advanced)**
- Use `EnvironmentPostProcessor` to programmatically add a `PropertySource` before the context is refreshed.

---

### **6. Verify It's Loaded**
- Enable debug logs:
  ```properties
  logging.level.org.springframework.boot.context.config=DEBUG
  ```
- Inject and print a property:
  ```java
  @Component
  public class ProfileLogger {
      public ProfileLogger(Environment env) {
          System.out.println("Active profiles: " + Arrays.toString(env.getActiveProfiles()));
      }
  }
  ```

---

## **Spring Boot Microservices: Best Practices**

### **Per-Service Config Files**
- Each microservice should have:
  - `application.yml` (common configuration)
  - `application-{env}.yml` (environment-specific overrides)

#### **Example**:
```yaml
# application.yml
server:
  port: 0

# application-dev.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/user_db
```

---

### **Trigger Profile Per Service**
#### **Docker Compose**:
```yaml
services:
  user-service:
    image: user-service:latest
    environment:
      - SPRING_PROFILES_ACTIVE=dev
```

#### **Kubernetes**:
```yaml
env:
  - name: SPRING_PROFILES_ACTIVE
    value: dev
```

#### **Local Run**:
```bash
java -jar user-service.jar --spring.profiles.active=dev
```

---

### **Centralized Config (Enterprise-Grade)**
- Use **Spring Cloud Config Server** for centralized configuration management.
- Store configs in a Git-backed repository:
  - `user-service-dev.yml`
  - `order-service-prod.yml`
- Each service loads its environment-specific configuration at startup.

---

### **Secrets Handling**
- Never hardcode sensitive data in YAML files.
- Use environment variables or a secrets manager:
  ```yaml
  spring:
    datasource:
      password: ${DB_PASSWORD}
  ```

---

### **Debugging and Validation**
- Enable config logs:
  ```properties
  logging.level.org.springframework.boot.context.config=DEBUG
  ```
- Validate properties with `@ConfigurationProperties` and `@Validated`.

---

## **When Is a Profile Active?**

### **Activation Triggers**
A profile becomes active when any of the following is set (priority order: high → low):
1. **Command-line**:
   ```bash
   --spring.profiles.active=dev
   ```
2. **JVM Argument**:
   ```bash
   -Dspring.profiles.active=dev
   ```
3. **Environment Variable**:
   ```bash
   export SPRING_PROFILES_ACTIVE=dev
   ```
4. **application.yml**:
   ```yaml
   spring:
     profiles:
       active: dev
   ```

---

### **What Happens When a Profile is Active?**
1. Spring loads:
   - `application.yml` (base configuration)
   - `application-dev.yml` (profile-specific overrides)
2. Profile-specific properties override base properties.

---

### **Multiple Profiles**
- Activate multiple profiles:
  ```bash
  SPRING_PROFILES_ACTIVE=dev,aws
  ```
- Spring loads:
  - `application-dev.yml`
  - `application-aws.yml`
- Later profiles override earlier ones.

---

### **Default Behavior**
- If no profile is set, only `application.yml` is loaded.

---

### **Verify Active Profile**
- Logs at startup:
  ```
  The following profiles are active: dev
  ```
- Programmatically:
  ```java
  environment.getActiveProfiles();
  ```

---

## **Environment Variable: SPRING_PROFILES_ACTIVE**

### **Where to Set It**
1. **Docker / Docker Compose**:
   ```yaml
   services:
     user-service:
       environment:
         SPRING_PROFILES_ACTIVE: dev
   ```

2. **AWS ECS (Task Definition)**:
   ```json
   {
     "name": "SPRING_PROFILES_ACTIVE",
     "value": "dev"
   }
   ```

3. **Kubernetes**:
   ```yaml
   env:
     - name: SPRING_PROFILES_ACTIVE
       value: dev
   ```

4. **Local (Mac/Linux)**:
   ```bash
   export SPRING_PROFILES_ACTIVE=dev
   java -jar user-service.jar
   ```

---

### **When It Loads**
- **Phase**: Bootstrap / Config Data Loading phase
- **Timing**: Before the `ApplicationContext` is created

---

### **Code Proof**
#### **Active Profile**:
```java
@Component
public class SAe {
    public ProfileLogger(Environment env) {
        System.out.println("Active profiles: " + Arrays.toString(env.getActiveProfiles()));
    }
}
```

#### **Property Resolution**:
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/common_db

# application-dev.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/dev_db
```

```java
@Value("${spring.datasource.url}")
private String dbUrl; // Resolves to dev_db
```

---

### **Key Takeaway**
- `SPRING_PROFILES_ACTIVE` is read once at startup.
- Profile selection happens before any bean is created.
- This makes it ideal for Docker, ECS, and Kubernetes deployments.

---