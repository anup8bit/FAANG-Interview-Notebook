### Definition

A Web Worker runs a script operation in a background thread separate from the main execution thread of a web application.

The advantage of this is that heavy work can be performed in a separate thread, allowing the main (usually the UI) thread to run without being blocked/slowed down.

👉 Goal: Prevent UI jank

### Key characteristics
- Runs in a separate thread
- No access to DOM
- Communicates via postMessage
- Lifecycle is tied to the page
- Used for computation, not networking


***Types***
Dedicated Worker → one page
Shared Worker → multiple tabs (same origin)
Worklet → audio, paint, animation (advanced)

***Use cases***
- Large JSON parsing
- Image/video processing
- Encryption / hashing
- Complex calculations (charts, ML, etc.)


***Limitations***
❌ No DOM
❌ No window, document
❌ No direct access to cookies / localStorage

Web Worker
 ├── Data processing
 ├── Sorting
 └── Encryption



 Q3. When would you prefer requestIdleCallback over a Web Worker — and why?

Expected answer
- UI-adjacent, short tasks
- Layout-sensitive operations
- When data must stay on main thread
- Idle time is unpredictable

❌ Wrong: “idleCallback is async so it’s the same as worker”


3️⃣ Where Web Workers Are Actually Used (Real Examples)
✅ Meta / Facebook

Feed ranking calculations
Story/media metadata parsing
Encryption / compression
Large JSON normalization

✅ Google (Docs / Maps)
Document diffing
Map tile computation
Search indexing
Spell-checking (WASM + Worker)

✅ Netflix
Subtitle parsing
DRM license prep
Video metadata processing

✅ Microsoft (Office Web)
Spreadsheet formulas
Pivot table computation
Large document layout calculation


### 4️⃣ How Data Flows (Critical Design)
❌ Anti-pattern
UI → Worker → UI (big objects)

✅ Production pattern
UI → Worker (raw data via ArrayBuffer)
Worker → UI (small diff or index)


Workers return instructions, not full state.


### 6️⃣ Example: Search in Large App (End-to-End)
Problem

User types → search 50k items → UI freezes

Solution

```js
UI
 └─ debounce input
    └─ send query to worker

Worker
 ├─ tokenize
 ├─ score
 ├─ rank
 └─ return top 20 IDs

UI
 └─ render 20 items
```


UI
 └─ debounce input
    └─ send query to worker

Worker
 ├─ tokenize
 ├─ score
 ├─ rank
 └─ return top 20 IDs

UI
 └─ render 20 items

📌 Worker returns IDs only, not objects.


### 7️⃣ Cancellation Strategy (Very Important)

Large apps must cancel work.

Pattern
```js
const controller = new AbortController();

worker.postMessage({ job, signal: controller.signal });
```

Worker:
```js
if (signal.aborted) return;
```

User scrolls → cancel
Tab hidden → cancel
New request replaces old
❌ worker.terminate() is last resort


8️⃣ Scheduling Strategy
| Task Type    | Solution              |
| ------------ | --------------------- |
| UI-sensitive | `requestIdleCallback` |
| CPU-heavy    | Web Worker            |
| Network      | Service Worker        |
| Long-running | Chunked worker jobs   |


9️⃣ Memory & Performance Rules (Lead-Level)
Golden rules

Use Transferables

Avoid large structured cloning

Reuse buffers

Batch messages

Avoid chatty protocols

Red flags

🚫 Passing full Redux store
🚫 Posting large arrays repeatedly
🚫 Creating workers per event

🔟 Observability & Debugging

Large orgs track:

Worker task latency

Queue depth

Cancellation rate

Message size

GC pauses

Tools:

Chrome DevTools → Workers

Performance timeline

Custom telemetry

### 1️⃣1️⃣ When NOT to Use Web Workers

❌ DOM-related work
❌ Short tasks (<5ms)
❌ Chatty synchronous logic
❌ Layout-measure logic