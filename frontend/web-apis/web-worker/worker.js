onmessage = (event) => {
    const message = event.data;
    console.log("Message from main script:", message);
    
    const response = `Hello, Main Script! Received your message: "${message}"`;
    postMessage(response);
}