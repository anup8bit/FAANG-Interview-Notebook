# PromQL Tutorial & Failure Scenarios (Production-Grade)

> **Audience**: Senior / Lead engineers
> **Focus**: PromQL mastery + real production failure scenarios
> **Context**: Microservices, JVM, SLO-driven monitoring

---

## 1. What is PromQL (Mental Model)

PromQL is **not SQL**.

PromQL answers:

> *What is happening to my system over time?*

Key ideas:

* Operates on **time series**
* Always returns a **vector** (instant or range)
* Labels define dimensions

---

## 2. PromQL Data Types

### Instant Vector

Single value per series at a point in time

```
http_requests_total
```

### Range Vector

Multiple samples over time

```
http_requests_total[5m]
```

### Scalar

Single numeric value

```
scalar(5)
```

---

## 3. Basic Metric Queries

```
jvm_memory_used_bytes
process_cpu_usage
http_server_requests_seconds_count
```

Filter using labels:

```
http_server_requests_seconds_count{method="GET",status="200"}
```

---

## 4. Label Matching (Critical)

### Exact Match

```
status="500"
```

### Regex Match

```
status=~"5.."
```

### Negative Match

```
method!="OPTIONS"
```

---

## 5. Range Functions (Time-Based)

### rate() – Counters only

```
rate(http_requests_total[1m])
```

### increase()

```
increase(http_requests_total[5m])
```

### irate() (spiky)

```
irate(http_requests_total[30s])
```

---

## 6. Aggregation Operators

```
sum(rate(http_requests_total[5m]))
avg(jvm_memory_used_bytes)
max(container_memory_usage_bytes)
```

Group by labels:

```
sum(rate(http_requests_total[5m])) by (service)
```

---

## 7. Binary Operators

### Arithmetic

```
A / B
A * 100
```

### Comparison

```
error_rate > 0.01
```

### Logical

```
A and B
A or B
```

---

## 8. Latency Analysis (Histogram Mastery)

### p95 Latency

```
histogram_quantile(
  0.95,
  sum(rate(http_server_requests_seconds_bucket[5m])) by (le, service)
)
```

**Rule**: Always aggregate **before** `histogram_quantile`.

---

## 9. Error Rate (Golden Signal)

```
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
/
sum(rate(http_server_requests_seconds_count[5m]))
```

Interpretation:

* < 0.1% → healthy
* > 1% → investigate

---

## 10. Throughput (Traffic)

```
sum(rate(http_server_requests_seconds_count[1m])) by (service)
```

Use case:

* Capacity planning
* Traffic spikes

---

## 11. JVM-Specific PromQL

### Heap Usage %

```
jvm_memory_used_bytes{area="heap"}
/
jvm_memory_max_bytes{area="heap"}
```

### GC Pause Time (p99)

```
histogram_quantile(
  0.99,
  sum(rate(jvm_gc_pause_seconds_bucket[5m])) by (le)
)
```

---

## 12. Saturation Detection

### Thread Pool Saturation

```
jvm_threads_live / jvm_threads_peak
```

### CPU Saturation

```
process_cpu_usage > 0.85
```

---

## 13. Recording Rules (Advanced)

Problem:

* Complex queries are slow

Solution:

```yaml
record: service:error_rate
expr: |
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
```

---

## 14. Failure Scenario #1 – Memory Leak

### Symptoms

* Heap steadily increasing
* GC pause increasing

### PromQL Signals

```
deriv(jvm_memory_used_bytes{area="heap"}[10m]) > 0
```

```
histogram_quantile(0.99, rate(jvm_gc_pause_seconds_bucket[5m]))
```

---

## 15. Failure Scenario #2 – Downstream Dependency Slow

### Symptoms

* Latency spike
* No CPU increase

### Detection

```
histogram_quantile(0.95,
 sum(rate(http_server_requests_seconds_bucket{uri="/api/order"}[5m])) by (le))
```

Correlation:

* Upstream service latency
* Downstream error rate

---

## 16. Failure Scenario #3 – Traffic Spike

### Detection

```
increase(http_requests_total[1m]) > 2 * increase(http_requests_total[5m])
```

Use case:

* Market open
* Flash sale

---

## 17. Failure Scenario #4 – Thread Pool Exhaustion

### Signals

```
rate(http_server_requests_seconds_count[1m])
```

```
jvm_threads_live > 0.9 * jvm_threads_peak
```

Impact:

* Increased latency
* Request timeouts

---

## 18. Failure Scenario #5 – Pod / Container Restart Loop

### Detection

```
increase(container_restart_count[5m]) > 3
```

Correlation:

* OOMKilled events
* Memory usage spikes

---

## 19. Failure Scenario #6 – Partial Outage (One Instance)

### Detection

```
stddev(rate(http_requests_total[1m])) by (instance) > 0
```

Interpretation:

* One instance behaving differently

---

## 20. SLO-Based Alert Example

```
(service:error_rate > 0.01)
for 5m
```

Why this matters:

* Alerts on user pain
* Avoids alert fatigue

---

## 21. PromQL Anti-Patterns

❌ Alerting on raw CPU
❌ Using `irate` for dashboards
❌ High-cardinality labels
❌ No aggregation before quantiles

---

## 22. Interview-Ready PromQL Questions

* Why `rate` vs `increase`?
* How to detect memory leaks?
* How to find one bad pod?
* How to design latency SLOs?

---

## 23. Final Lead Takeaway

> PromQL is a **diagnostic language**, not a query language.

Senior engineers:

* Think symptoms first
* Use PromQL to prove hypotheses
* Alert on **user impact**, not infrastructure

---

**End of Document**


# Prometheus & PromQL – Important Commands and Queries (Quick Reference)

> **Purpose**: Day‑to‑day operations, debugging, interviews, and on‑call usage
> **Context**: Microservices + JVM + production incidents

---

## 1. Prometheus UI / Operational Commands

* Open Prometheus UI

  * `http://<host>:9090`

* Check targets (very important)

  * `/targets`

* Check active alerts

  * `/alerts`

* Check loaded config

  * `/config`

* Check rules (recording + alert rules)

  * `/rules`

* Reload Prometheus config (without restart)

  * `POST /-/reload`

---

## 2. Basic PromQL Queries (Must Know)

* List a metric

```
http_requests_total
```

* Filter by label

```
http_requests_total{method="GET"}
```

* Regex match

```
http_requests_total{status=~"5.."}
```

* Exclude label

```
http_requests_total{method!="OPTIONS"}
```

---

## 3. Rate & Counter Queries

* Per‑second request rate

```
rate(http_requests_total[1m])
```

* Requests in last 5 minutes

```
increase(http_requests_total[5m])
```

* Instant spike detection

```
irate(http_requests_total[30s])
```

---

## 4. Aggregation Queries

* Total traffic

```
sum(rate(http_requests_total[1m]))
```

* Traffic per service

```
sum(rate(http_requests_total[1m])) by (service)
```

* Max memory usage

```
max(jvm_memory_used_bytes)
```

---

## 5. Latency Queries (Histogram)

* p95 latency

```
histogram_quantile(
  0.95,
  sum(rate(http_server_requests_seconds_bucket[5m])) by (le, service)
)
```

* p99 latency

```
histogram_quantile(
  0.99,
  sum(rate(http_server_requests_seconds_bucket[5m])) by (le)
)
```

---

## 6. Error Rate Queries (Golden Signal)

* Error rate percentage

```
100 * (
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
)
```

* Errors per service

```
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
```

---

## 7. JVM Health Queries (Very Common)

* Heap usage %

```
jvm_memory_used_bytes{area="heap"}
/
jvm_memory_max_bytes{area="heap"}
```

* GC pause p99

```
histogram_quantile(
  0.99,
  sum(rate(jvm_gc_pause_seconds_bucket[5m])) by (le)
)
```

* Thread count

```
jvm_threads_live
```

---

## 8. Saturation & Capacity Queries

* CPU saturation

```
process_cpu_usage > 0.85
```

* Thread pool saturation

```
jvm_threads_live / jvm_threads_peak
```

* Memory pressure

```
jvm_memory_used_bytes / jvm_memory_max_bytes > 0.8
```

---

## 9. Instance / Pod Level Debugging

* Traffic per instance

```
sum(rate(http_requests_total[1m])) by (instance)
```

* Find bad instance (variance)

```
stddev(rate(http_requests_total[1m])) by (instance) > 0
```

---

## 10. Container / Pod Failure Queries

* Restart count

```
increase(container_restart_count[5m])
```

* OOM kill detection

```
container_last_terminated_reason{reason="OOMKilled"}
```

---

## 11. Traffic Spike Detection

```
increase(http_requests_total[1m])
>
2 * increase(http_requests_total[5m])
```

---

## 12. Memory Leak Detection

* Heap growth trend

```
deriv(jvm_memory_used_bytes{area="heap"}[10m]) > 0
```

---

## 13. Recording Rule Validation

* Use recorded metric

```
service:error_rate
```

* Compare raw vs recorded

```
service:error_rate - (
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
)
```

---

## 14. SLO / Alert Queries

* Error budget burn

```
service:error_rate > 0.01
```

* Latency SLO breach

```
histogram_quantile(0.95,
  sum(rate(http_server_requests_seconds_bucket[5m])) by (le)
) > 500
```

---

## 15. On‑Call Debugging Order (Checklist)

1. Error rate
2. Latency (p95 / p99)
3. Traffic spikes
4. Instance imbalance
5. JVM GC & memory
6. Restarts / OOM

---

## 16. Interview‑Critical Queries (GS Level)

* Error rate per service
* p95 latency via histogram
* One bad pod detection
* Memory leak detection
* SLO‑based alert

---

## Final Note

> These queries cover **90% of real production incidents**.
> Mastery is knowing **which query to run first under pressure**.

---

**End of Document**

