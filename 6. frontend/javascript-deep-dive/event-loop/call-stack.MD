🧠 Call Stack — Deep, Correct Mental Model (Meta E5/E6)

**1️⃣ What the Call Stack actually is ?**

The call stack is simply a LIFO (Last In, First Out) data structure maintained by the JavaScript engine (V8) to track:

- Which function is currently executing
- Each function’s execution context
- Where to return after it finishes

Each entry = Execution Context


**2️⃣ What is inside a Stack Frame (Execution Context)?**

For each function call, JS creates a stack frame containing:

✅ 1. Lexical Environment
- Local variables
- Parameters
- Function declarations

✅ 2. Scope chain reference
Link to outer lexical environment

✅ 3. this binding
Determined at call time

✅ 4. Instruction pointer
“Which line am I executing now?”

**3️⃣ Step-by-step example (very important)**
```js
function foo() {
  bar();
}

function bar() {
  baz();
}

function baz() {
  console.log("Hello");
}

foo();
```

Call stack evolution:

|----------------|
| Global Context |
|----------------|

foo() called
|----------------|
| foo            |
| Global         |
|----------------|

bar() called
|----------------|
| bar            |
| foo            |
| Global         |
|----------------|

baz() called
|----------------|
| baz            |
| bar            |
| foo            |
| Global         |
|----------------|

console.log
|----------------|
| console.log    |
| baz            |
| bar            |
| foo            |
| Global         |
|----------------|


**4️⃣ Why JS is single-threaded (key interview point)**

JavaScript:
- Has one call stack
- Executes one frame at a time
- Cannot preempt a running function

➡️ This guarantees no race conditions on JS memory
➡️ But introduces blocking risk

**5️⃣ Call stack vs Event Loop (important distinction)**
| Call Stack       | Event Loop                 |
| ---------------- | -------------------------- |
| Executes code    | Schedules code             |
| Inside JS engine | Outside JS engine          |
| Synchronous      | Asynchronous orchestration |
| Blocks rendering | Does not execute code      |


💡 Event loop only runs when call stack is empty


**6️⃣ Why long call stack blocks rendering**
while (true) {}


What happens?

1. Call stack never clears
2. Event loop never runs
3. No microtasks
4. No rendering

Page freezes

## 📌 Rendering requires an empty call stack


**7️⃣ Stack overflow — not just recursion**

```js
function recurse() {
  recurse();
}
recurse();
```

❌ Too many stack frames → RangeError: Maximum call stack size exceeded

But also:

Large sync loops

Heavy JSON parsing

Big synchronous DOM work

**8️⃣ Stack vs Heap (must be precise)**

| Stack              | Heap              |
| ------------------ | ----------------- |
| Function execution | Objects, closures |
| Fast               | Slower            |
| Auto cleanup       | GC managed        |
| Limited size       | Large             |

⚠️ Closures live in heap, not stack


**9️⃣ Call stack + async example (tie back to Q1)**
```js
setTimeout(() => {
  console.log("Async");
}, 0);

console.log("Sync");
```

Execution:

Global frame pushed

setTimeout registers callback

console.log("Sync") runs

Global frame pops

Event loop pushes timeout callback as a new stack frame