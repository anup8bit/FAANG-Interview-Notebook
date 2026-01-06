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