### Can async code ever be on the call stack?


Yes, portions of asynchronous code are on the call stack whenever they are actively executing. The key difference from synchronous code is that an async function will be removed from the call stack when it hits an await (or similar asynchronous operation) and is waiting for an external operation to complete. 

***Here is how it generally works in environments like JavaScript ***

1. **Initial Execution:** When an asynchronous function is first called, it is placed on the call stack like any normal function.
2. **Delegation:** When the function encounters an await keyword or an asynchronous operation (like a network request or a timer), that operation is handed off to the runtime's background environment (e.g., Web APIs in a browser, or a thread pool in C#).
3. **Popped from the Stack:** At this point, the executing function is suspended and its execution context is popped off the main call stack, allowing the main thread to continue running other synchronous code.
4. **Resumption:** Once the asynchronous operation completes (e.g., the network request returns data), the callback function (or the continuation of the async function after the await) is placed into a queue (e.g., the callback queue or microtask queue).
5. **Back on the Stack:** The event loop monitors the call stack, and when it is empty, it pushes the waiting callback from the queue back onto the call stack for execution. 
