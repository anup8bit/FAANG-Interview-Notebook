Prometheus operates fundamentally differently from traditional monitoring by shifting the responsibility of data collection, dynamic discovery, and analysis to a centralized, metrics-focused server. 
1. Data Collection (Pull vs. Push)
Active Scraping (Pull): Prometheus is a pull-based system. It reaches out to configured endpoints (targets) at regular intervals (scrape intervals) via HTTP to fetch metrics. This provides centralized control over the frequency of data collection and makes it easier to verify if a target is down.
Pushgateway: For short-lived batch jobs that may finish before a scrape occurs, Prometheus uses a Pushgateway as an intermediary. Jobs push their metrics here, and Prometheus pulls them later.
Traditional Contrast: Older systems like Nagios often rely on agents installed on every server to push data to a central manager, which can lead to "metric storms" if many agents push simultaneously. 

2. Dynamic Environments
Service Discovery: Prometheus natively integrates with Kubernetes, AWS, and other cloud providers to automatically discover new pods, nodes, or services as they are created. It queries the Kubernetes API to find targets with specific annotations (e.g., prometheus.io/scrape: "true").
Ephemeral Workloads: Because it uses service discovery, Prometheus does not need manual IP updates when containers restart with new addresses. 

3. Query Capabilities (PromQL)
Functional Language: PromQL allows users to aggregate, filter, and perform arithmetic on time-series data in real-time.
Multi-dimensional Selection: You can select data based on labels (e.g., http_requests_total{status="200", method="GET"}) and apply functions like rate() to calculate per-second averages over specific time windows.
Traditional Contrast: Traditional tools often use basic SQL or fixed threshold checks (e.g., "CPU > 90%"), whereas PromQL can identify complex trends like "Is the 99th percentile latency increasing by 10% compared to last week?". 

4. Data Model
Labeled Time-Series: Every data point is stored as a time-series: a combination of a metric name and key-value pairs called labels.
High Granularity: Labels allow you to categorize metrics across many dimensions (e.g., region, service, environment) without changing the underlying metric name.
Format: A sample consists of a float64 value and a millisecond-precision timestamp. 

5. Architecture & Use Cases
Autonomous Servers: Prometheus servers are independent and store data locally in a custom TSDB (Time Series Database).
Visualization: While Prometheus has a basic web UI, it is almost always paired with Grafana for advanced dashboards and visual analysis.
Best Fit: It is the industry standard for cloud-native and microservices environments (Kubernetes, Docker).
Traditional Fit: Tools like Zabbix remain better for static legacy infrastructure where long-term storage and broad physical device support (SNMP) are more critical than dynamic discovery. 

6. Alerting
Alertmanager: Prometheus evaluates "alerting rules" against its data. When a rule is met, the alert is sent to Alertmanager, which handles:
Deduplication: Prevents notification flooding if multiple alerts trigger for the same issue.
Grouping: Combines related alerts into a single notification.
Routing: Sends alerts to specific teams via Slack, PagerDuty, or Email based on labels. 








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

# Prometheus – Working Principle

Prometheus works on a **centralized, pull-based monitoring model** designed for modern, dynamic systems. Its core principle is that a single Prometheus server is responsible for discovering targets, collecting metrics, storing them, querying them, and triggering alerts.

---

## 1️⃣ Pull-Based Metrics Collection

* Prometheus **actively scrapes** metrics from applications over HTTP.
* Applications expose metrics at an endpoint (usually `/metrics`).
* Prometheus polls these endpoints at fixed **scrape intervals**.
* Centralized control ensures consistent collection frequency and easy failure detection.

> If a target cannot be scraped, Prometheus immediately knows the service is unreachable.

---

## 2️⃣ Target Discovery

* Prometheus dynamically discovers targets instead of relying on static IPs.
* In cloud-native environments (e.g., Kubernetes), it queries the platform API.
* Targets are selected using metadata and labels (such as Kubernetes annotations).

> This makes Prometheus ideal for containers and services that frequently restart or scale.

---

## 3️⃣ Metric Exposure by Applications

* Applications expose metrics in a **Prometheus text format**.
* Each metric represents a measurable system or application behavior.
* Metrics are **stateless** from the application’s perspective.

Example metric:

```
http_requests_total{method="GET",status="200"} 10234
```

---

## 4️⃣ Time-Series Data Storage

* Every scraped metric is stored as a **time-series**.
* A time-series is defined by:

  * Metric name
  * Set of labels (key-value pairs)
* Each data point consists of a value and a timestamp.

> Prometheus stores data locally in its own optimized **Time Series Database (TSDB)**.

---

## 5️⃣ Query & Evaluation Engine

* Prometheus uses **PromQL** to query time-series data.
* Queries can aggregate, filter, and calculate rates over time windows.
* The same query engine is used for dashboards and alert evaluation.

---

## 6️⃣ Alert Evaluation

* Prometheus continuously evaluates **alerting rules**.
* When a rule condition is met, an alert is triggered.
* Alerts are sent to **Alertmanager** for notification handling.

---

## 7️⃣ Pushgateway (Exception Case)

* Designed only for **short-lived batch jobs**.
* Jobs push metrics to Pushgateway.
* Prometheus still pulls metrics from the Pushgateway.

> This does not change Prometheus’ pull-based architecture.

---

### ✅ Core Principle Summary

* Pull-based metric scraping
* Dynamic service discovery
* Label-based time-series data model
* Local TSDB storage
* PromQL-driven querying and alerting
* Alertmanager for notifications

Prometheus focuses on **observability through metrics**, optimized for scalable, cloud-native systems.
