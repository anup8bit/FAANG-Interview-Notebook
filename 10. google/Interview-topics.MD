# Google Lead Backend Engineer (L5/L6) – Learning Plan & Teaching Style

You’re already senior-level (Spring Boot, microservices, Kafka, IaC). For a **Google Lead role**, the bar shifts from *implementation* → *architecture, correctness, scalability, and leadership*. I’ll teach you with that lens.

---

## 🎯 Target Role Expectations (Google L5/L6 – Backend)

### What Google Evaluates
- **System correctness at scale** (not frameworks)
- **Strong CS fundamentals applied pragmatically**
- **Distributed systems depth**
- **Clean API & data modeling**
- **Trade-off driven decision making**
- **Technical leadership & design clarity**

---

## 🧠 Core Skill Pillars (in priority order)

### 1️⃣ Distributed Systems (NON-NEGOTIABLE)
- CAP theorem (real trade-offs, not definitions)
- Consistency models (strong, eventual, causal)
- Idempotency, retries, deduplication
- Leader election, quorum, consensus (Raft intuition)
- Backpressure, load shedding, rate limiting
- Exactly-once vs at-least-once semantics (Kafka depth)

---

### 2️⃣ Backend System Design (Google-style)
- API-first design (clear contracts)
- Stateless vs stateful services
- Sync vs async boundaries
- Data partitioning & sharding
- Hot key & skew handling
- Multi-region active-active design
- Failure modes > happy paths

---

### 3️⃣ Java Internals (Interview Depth)
- JVM memory model (heap, metaspace, GC tuning intuition)
- Threading, locks, CAS, happens-before
- CompletableFuture vs reactive (when & why)
- Object lifecycle, immutability, escape analysis
- Performance profiling mindset

---

### 4️⃣ Spring Boot (Used as a Tool, Not the Focus)
- When **NOT** to use Spring abstractions
- Transaction boundaries in distributed systems
- Outbox pattern, Saga, CDC
- Resilience4j patterns (bulkhead, circuit breaker)
- Observability: tracing, metrics, logs

---

### 5️⃣ Data & Storage
- SQL vs NoSQL decision framework
- Indexing strategy & query plans
- Schema evolution without downtime
- Caching layers (Redis pitfalls)
- Read/write amplification

---

## 🧩 Teaching Format (How I’ll Train You)

Each topic will follow **Google Interview Style**:

### 1. Concept (Why it exists)
### 2. Failure Scenarios (What breaks first)
### 3. Design Trade-offs (What you lose)
### 4. Real-world Example (Microservices / Kafka / DB)
### 5. Interview Framing (How to explain at Google)

No hand-holding. No textbook answers.

---

## 📌 Example Topic (Preview)

### Backpressure in Microservices
- Why thread pools fail before CPU
- Queue depth vs latency curve
- Push vs pull-based systems
- Kafka consumer lag handling
- Google-style answer framing

---

## 🧭 Roadmap (8–10 Weeks)

- **Week 1–2:** Distributed Systems Core
- **Week 3–4:** System Design (Google problems)
- **Week 5:** Java Internals Deep Dive
- **Week 6:** Data & Storage
- **Week 7:** Reliability & Observability
- **Week 8:** Leadership + Design Interviews
- **Week 9–10:** Mock Interviews (Google bar)

---

## 🔥 Ground Rules
- I’ll challenge assumptions
- I’ll ask “why” repeatedly
- I’ll stop you if the answer isn’t Google-level
- No framework worship

---

### Next Step
Reply with **one topic** you want to start with:
- Distributed systems
- Backend system design
- Java internals
- Kafka & streaming
- Reliability engineering

I’ll begin at **Google L6 depth** immediately.
