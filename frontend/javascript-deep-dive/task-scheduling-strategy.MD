8️⃣ Scheduling Strategy
| Task Type    | Solution              |
| ------------ | --------------------- |
| UI-sensitive | `requestIdleCallback` |
| CPU-heavy    | Web Worker            |
| Network      | Service Worker        |
| Long-running | Chunked worker jobs   |
