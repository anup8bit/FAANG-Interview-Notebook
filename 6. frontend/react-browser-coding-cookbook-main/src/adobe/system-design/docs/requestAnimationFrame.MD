### requestAnimationFram ###

requestAnimationFrame() is a JavaScript Web API method used for scheduling animations to run efficiently and smoothly in a web browser. It tells the browser that you want to perform an animation and requests that the browser call a specified callback function to update the animation before the next repain

It gives better performance vs setTimeout/setInterval.

It ensures:
- Your callback runs in sync with the browser’s rendering pipeline
- It avoids unnecessary work, because it pauses automatically when tab is inactive
- It prevents layout thrashing by batching DOM reads/writes correctly

***🎯 Why browsers created requestAnimationFrame***

Without rAF:
- Timers (setTimeout, setInterval) fire independently of the rendering cycle → janky frames
- You can do layout changes when browser is mid-calculation → layout thrashing
- When the tab is hidden, timers still run → wasted CPU & battery
- rAF solves ALL of these issues.


.

***🧠 How it works (Event Loop — animation frame pipeline)***

Each frame (~16.67ms at 60Hz) the browser does:

1️⃣ JS callbacks scheduled via requestAnimationFrame
2️⃣ Style recalculation
3️⃣ Layout
4️⃣ Paint
5️⃣ Composite

requestAnimationFrame puts your function exactly in step 1, just before the browser draws.
This is why animations become smooth.

***⚡ Classic interview-friendly example***

```ts
function animate(timestamp: number) {
  box.style.transform = `translateX(${timestamp / 10}px)`;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

🎬 Smooth height animation (like your accordion example)

This is the pattern you will actually use in UI components.

👉 Animation runs until current height → target height

```ts
function animateHeight(element: HTMLElement, target: number, duration = 300) {
  const startHeight = element.offsetHeight;
  const diff = target - startHeight;
  const start = performance.now();

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const current = startHeight + diff * progress;

    element.style.height = current + "px";

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
```

### persormance.now() ###

performance.now() returns a high-resolution timestamp — a number representing milliseconds elapsed from the time the page started loading.

✔️ What exactly does it return?

performance.now() returns a floating-point number like:

143.234567890123


This value means:

143.2345 milliseconds

since navigation start (performance.timeOrigin)

It does not return the Unix timestamp or Date.now() value.

🔍 How is it different from Date.now()?
API	What it returns	Resolution	Use case
Date.now()	Current time since Jan 1, 1970	~1 ms	Logging, timestamps
performance.now()	Time since page load	~0.01 ms (high precision)	Animations, measurements
💡 Why animations use performance.now()?

Because it's:

Monotonic (never goes backward, even if system clock changes)

High-resolution (~1 microsecond precision in some browsers)

Perfect for calculating animation progress.

📌 Example
const start = performance.now();

setTimeout(() => {
  const end = performance.now();
  console.log(end - start); // accurate duration in ms
}, 1000);



### 🎯 What does timestamp mean in the step method requestAnimationFrame's callback? ###

***The timestamp argument passed into:**

**const step = (timestamp: number) => { ... }**

**is provided by requestAnimationFrame, and it represents:**

**✅ A high-resolution timestamp (in milliseconds) of when this animation frame is about to paint.**
 
It is NOT the same as Date.now()

It is very similar to performance.now()

**It is monotonic (always increases, never jumps backward)**

It is measured relative to performance.timeOrigin

Example:
timestamp = 1234.567 ms


Meaning:

1234ms after the page started loading

This frame’s callback is running now

Browser is about to repaint after this callback

<strong>
🔍 Where does it come from?

Every time you do:

requestAnimationFrame(step);


The browser schedules your callback at the best moment just before the next paint and passes the timestamp:

requestAnimationFrame(step)
   ↓
step(timestamp) // browser provides it

🔥 Why do we use timestamp for animations?

Because you need to know:

❓ How much time has passed since animation started?

You store the start time:

const start = performance.now();


Then during each frame:

const progress = (timestamp - start) / duration;


This gives you a value from:

0 → animation start
1 → animation end


This is how you create time-based animations instead of frame-based animations.

Time-based = smoother & consistent for all devices
Frame-based = choppy on slow machines, too fast on fast machines
</strong>

🧠 Let’s walk through your code with meaning
1. Animation starts
const start = performance.now();

2. Browser calls step with timestamp
const step = (timestamp) => {


Example values:

timestamp = 1000.00 ms (frame 1)
timestamp = 1016.67 ms (frame 2)
timestamp = 1033.33 ms (frame 3)


These are ~16.67 ms apart → 60 FPS

📐 What does this line compute?
const progress = Math.min((timestamp - start) / duration, 1);


If 0ms passed → progress = 0

If 150ms passed in a 300ms animation → progress = 0.5

If 300ms passed → progress = 1 (complete)

📌 Summary (best for interview)

In a requestAnimationFrame callback, timestamp is a high-resolution time (in ms) automatically provided by the browser, indicating when that frame is about to render. It is used to calculate how much time has passed since the animation started, so animations run smoothly and consistently across devices.



***🔥 When React senior devs actually use requestAnimationFrame:***

Virtualized list smooth scrolling

Canvas/WebGL animations

Drag-and-drop smooth movement

Velocity-based animations (Friction, spring calculations)

Measuring DOM continuously during interaction (scroll/resize listeners)

Optimizing expensive work to run once per frame
(debouncing scroll events inside rAF)

⚡ Scroll/resize optimization pattern (super common)
```ts
let scheduled = false;

window.addEventListener("scroll", () => {
  if (!scheduled) {
    requestAnimationFrame(() => {
      scheduled = false;
      handleScroll(); // Runs max once per frame
    });
    scheduled = true;
  }
});
```
Interviewers LOVE this example.


***🎨 React version: rAF inside hooks***
```ts
import { useEffect, useRef } from "react";

export function useRafLoop(callback: (time: number) => void) {
  const frame = useRef<number>();

  function loop(time: number) {
    callback(time);
    frame.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    frame.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame.current!);
  }, []);
}
```

Usages:
```ts
useRafLoop(t => {
  setX(Math.sin(t / 200) * 50);
});
```


🧩 setTimeout vs requestAnimationFrame
Feature	setTimeout	requestAnimationFrame
Syncs with browser repaint	❌ No	✅ Yes
Max FPS	Depends	60fps
Pauses in inactive tab	❌ No	✅ Yes
Energy efficiency	❌ Poor	✅ Good
Layout thrashing risk	❌ High	✅ Low
Recommended for animations	❌ No	✅ Yes



***🔥 Very senior-level insights (good for Adobe)***
1. rAF batches DOM mutations → fewer layout recalculations

If you mutate style inside setTimeout, browser often forces multiple layouts.

2. rAF ≠ guarantees 60fps

If main thread is blocked (long JS), rAF callbacks will get delayed.

3. rAF can be combined with performance.now()

→ highly accurate timestamps for physics-based animations.

4. Use rAF for custom easing functions

React Spring / Framer Motion does this under the hood.


