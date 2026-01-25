# Prometheus Tutorial – Basics to Advanced (Microservices)

> **Audience**: Senior / Lead engineers
> **Context**: Spring Boot microservices, Docker, production-grade monitoring

---

## 1. What is Prometheus (Why it Exists)

Prometheus is an **open-source metrics monitoring and alerting system** designed for **cloud-native, distributed systems**.

Key problems it solves:

* Monitoring hundreds of microservices
* Understanding system behavior over time
* Detecting issues *before* users complain

Prometheus is **not** a log system and **not** a tracing system.

---

## 2. Prometheus Core Architecture

```
[ Microservices / Exporters ]
            ↓ (HTTP pull)
        [ Prometheus ]
            ↓
      [ TSDB + PromQL ]
            ↓
 [ Alertmanager / Grafana ]
```

### Design Principles

* Pull-based scraping
* Time-series database
* Dimensional metrics (labels)
* Single-binary, no dependencies

---

## 3. Prometheus Data Model

Each data point:

```
metric_name{label="value"} value timestamp
```

### Metric Types

* **Counter** – only increases
* **Gauge** – up/down values
* **Histogram** – latency distribution (recommended)
* **Summary** – client-side quantiles

---

## 4. Prometheus vs Traditional Monitoring

| Traditional | Prometheus       |
| ----------- | ---------------- |
| Push        | Pull             |
| Host-based  | Service-based    |
| Static      | Dynamic          |
| Few metrics | High dimensional |

---

## 5. Setting Up Prometheus (Docker)

### Directory Structure

```
observability/
├── prometheus/
│   ├── prometheus.yml
├── docker-compose.yml
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

Start:

```
docker-compose up -d
```

---

## 6. Prometheus Configuration Explained

### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Key Concepts

* `scrape_interval` → how often metrics are pulled
* `job_name` → logical group
* `targets` → endpoints exposing `/metrics`

---

## 7. Microservices Instrumentation (Spring Boot)

### Dependencies

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### application.yml

```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus
```

Metrics endpoint:

```
http://localhost:8080/actuator/prometheus
```

---

## 8. Scraping Spring Boot Microservices

### prometheus.yml

```yaml
scrape_configs:
  - job_name: 'user-service'
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ['user-service:8080']
```

Prometheus pulls metrics every interval.

---

## 9. Common JVM Metrics You Get

* JVM memory usage
* GC pause time
* Thread count
* HTTP request latency

Example metric:

```
jvm_memory_used_bytes{area="heap"}
```

---

## 10. Custom Business Metrics (Very Important)

### Example: Order Count

```java
Counter.builder("orders_created_total")
  .tag("service", "order-service")
  .register(meterRegistry)
  .increment();
```

Business metrics > infrastructure metrics.

---

## 11. PromQL Basics

### Query Metrics

```
http_server_requests_seconds_count
```

### Rate (per second)

```
rate(http_server_requests_seconds_count[1m])
```

---

## 12. Aggregation & Grouping

```
sum(rate(http_server_requests_seconds_count[5m])) by (service)
```

---

## 13. Latency Calculation (p95)

```
histogram_quantile(
  0.95,
  sum(rate(http_server_requests_seconds_bucket[5m])) by (le)
)
```

---

## 14. Error Rate (Golden Signal)

```
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
/
sum(rate(http_server_requests_seconds_count[5m]))
```

---

## 15. Golden Signals (MUST)

* Latency
* Traffic
* Errors
* Saturation

All dashboards should map to these.

---

## 16. Recording Rules (Performance)

```yaml
rule_files:
  - rules/*.yml
```

```yaml
record: service:http_request_rate
expr: sum(rate(http_server_requests_seconds_count[1m])) by (service)
```

---

## 17. Alerting Basics

### Bad Alert

```
CPU > 80%
```

### Good Alert

```
Error rate > 1% for 5 minutes
```

---

## 18. Alertmanager Overview

Responsibilities:

* Group alerts
* Deduplicate
* Route notifications

Flow:

```
Prometheus → Alertmanager → Slack / PagerDuty
```

---

## 19. Prometheus in Docker Microservices

Important:

* All services must be on same Docker network
* Use container names as targets

---

## 20. High Cardinality Pitfalls

Avoid labels like:

* userId
* orderId
* requestId

They can crash Prometheus.

---

## 21. Scaling Prometheus (Advanced)

Options:

* Federation
* Thanos / Cortex / Mimir
* Remote storage (S3)

---

## 22. Production Checklist

* ✅ Golden signals covered
* ✅ Business metrics added
* ✅ Cardinality controlled
* ✅ Alerts symptom-based
* ✅ Dashboards owned

---

## 23. Interview-Ready Questions

* Why pull model?
* Histogram vs Summary?
* How to detect memory leak?
* How would you alert on latency?

---

## 24. Final Takeaway

Prometheus is **not about collecting metrics**.
It is about **understanding system behavior over time**.

---

**End of Document**
