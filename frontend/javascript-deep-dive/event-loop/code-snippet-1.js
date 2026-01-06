/**
 * Q. Explain step-by-step what happens from the moment this script starts executing until the first paint happens.
 *
 */


/**
 * Expectation, You must cover:
    1. Call stack
    2. Task (macrotask) queue
    3. Microtask queue
    4. Rendering phases
    5. Why/when rendering can be blocked
 */


console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

requestAnimationFrame(() => {
  console.log("E");
});

console.log("F");
