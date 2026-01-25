# Observability – Core Terms (Spring Boot / Microservices)

## 🔍 Observability Core Pillars

* **Metrics** – Numeric time-series data (CPU %, memory, request count, latency); used for dashboards and alerts.
* **Logs** – Discrete, timestamped events (INFO, WARN, ERROR); useful for debugging and audits.
* **Traces** – End-to-end request flow across services; helps identify latency bottlenecks.

---

## 🧩 Tracing Concepts

* **Trace** – A complete lifecycle of a single request across multiple services.
* **Span** – A single unit of work within a trace (e.g., controller call, DB query).
* **Trace ID** – Unique identifier shared across all services handling the same request.
* **Span ID** – Unique identifier for an individual span inside a trace.
* **Context Propagation** – Passing trace/span context between services via headers (e.g., `traceparent`).

---

## 📊 Metrics & Monitoring

* **SLI (Service Level Indicator)** – Measured metric (latency, availability, error rate).
* **SLO (Service Level Objective)** – Target value for an SLI (e.g., 99.9% availability).
* **SLA (Service Level Agreement)** – Business contract based on SLOs.
* **Golden Signals** – Latency, Traffic, Errors, Saturation.

---

## 🚨 Alerting & Reliability

* **Alert** – Notification when a metric violates a rule.
* **Threshold Alert** – Alert triggered when a static limit is crossed (CPU > 80%).
* **Burn Rate** – Speed at which error budget is being consumed.
* **Error Budget** – Allowed amount of failure within an SLO period.

---

## ⚙️ Instrumentation & Telemetry

* **Instrumentation** – Code or agent added to emit telemetry data.
* **Auto-Instrumentation** – Telemetry generated automatically without manual code changes.
* **Telemetry** – Collected observability data: metrics, logs, and traces.

---

## 🧠 System Health Concepts

* **Health Check** – Endpoint reporting application health status.
* **Liveness Probe** – Checks if the application process is running.
* **Readiness Probe** – Checks if the application can accept traffic.
* **Resilience** – Ability to handle and recover from failures (retries, circuit breakers, timeouts).

---

## 🛠️ Common Observability Tools

* **Prometheus** – Metrics scraping and storage.
* **Grafana** – Dashboards and visualization.
* **ELK / OpenSearch** – Centralized logging stack.
* **Jaeger / Zipkin** – Distributed tracing systems.
* **OpenTelemetry** – Vendor-neutral standard for metrics, logs, and traces.

---

### ✅ In Practice (Spring Boot)

* Metrics: **Micrometer + Prometheus**
* Logs: **Logback + ELK/OpenSearch**
* Traces: **OpenTelemetry + Jaeger/Tempo**
* Dashboards: **Grafana**
