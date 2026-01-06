let start = Date.now();
while (Date.now() - start < 100) {
  // Busy loop for 100ms
}
console.log("Loop finished after 100ms");