import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  const decrement = () => {
    if (count == 0) return;
    setCount(count-1);
  }

  return (
    <div className="counter-container">
      <div className="counter-wrapper">
        <button className="counter-cta" onClick={decrement}>-</button>
        <span className="counter-value">{count}</span>
        <button onClick={increment} className="counter-cta">+</button>
      </div>
      <button onClick={() => setCount(0)}>reser</button>
    </div>
  )
}

export default Counter;