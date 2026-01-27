Spring Boot Actuator is a sub-project that provides production-ready features to help you monitor and manage your application. It exposes operational information via HTTP endpoints or JMX (Java Management Extensions), giving insights into application health, metrics, and environment.

1. Enabling Actuator
To add Actuator to your project, include the starter dependency in your build configuration: 
Maven (pom.xml):
xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>


Use code with caution.

 
### 2. Common Endpoints

By default, most endpoints are mapped to the /actuator base path.

- /actuator/health: Shows application health status (e.g., "UP" or "DOWN").
- /actuator/metrics: Provides details on memory usage, CPU, and JVM stats.
- /actuator/env: Displays current environment properties.
- /actuator/beans: Lists all registered Spring beans in the context.
- /actuator/loggers: Allows you to view and dynamically change logging levels.
- /actuator/threaddump: Generates a thread dump for troubleshooting.

3. Exposure and Configuration
For security, Spring Boot (especially version 3.x) only exposes the /health endpoint over HTTP by default. You can customize exposure in application.properties:
Expose all endpoints: management.endpoints.web.exposure.include=*.
Expose specific endpoints: management.endpoints.web.exposure.include=health,info,metrics.
Change base path: management.endpoints.web.base-path=/manage.
Show detailed health: management.endpoint.health.show-details=always.

4. Custom Actuators
You can create your own endpoints by using the @Endpoint annotation:
@ReadOperation: Mapped to HTTP GET.
@WriteOperation: Mapped to HTTP POST.
@DeleteOperation: Mapped to HTTP DELETE.

5. Best Practices for 2026
Security: Always secure non-health endpoints using Spring Security if they are exposed publicly.
Observability: Modern versions (3.x and above) use Micrometer for enhanced metrics collection, supporting systems like Prometheus and Grafana.
Cloud Compatibility: Use Actuator's built-in support for Kubernetes Liveness and Readiness probes to manage container lifecycles effectively. 



