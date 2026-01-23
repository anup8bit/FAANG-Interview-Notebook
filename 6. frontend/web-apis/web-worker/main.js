const worker = new Worker("worker.js");

worker.postMessage("Heello, Worker!");

worker.onmessage = (event) => {
    console.log("Message from worker:", event.data);
}
