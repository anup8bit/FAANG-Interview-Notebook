# 1. document.querySelector / document.querySelectorAll

👉 Used to select elements in the DOM using CSS selectors.

querySelector → returns the first matching element.

querySelectorAll → returns all matching elements (NodeList).

Interview Tip: Be ready to compare with getElementById / getElementsByClassName.

Example (Vanilla JS):

const firstButton = document.querySelector("button");
const allButtons = document.querySelectorAll("button");


# React Example – Accessing DOM Node via useRef:

```
import { useEffect, useRef } from "react";

export default function QuerySelectorDemo() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = divRef.current?.querySelector("button");
    if (btn) {
      btn.style.background = "lightblue";
    }
  }, []);

  return (
    <div ref={divRef}>
      <button>Click me</button>
      <button>Another</button>
    </div>
  );
}
```

# 2. classList

👉 Manipulate element classes.

element.classList.add("active")

element.classList.remove("hidden")

element.classList.toggle("dark-mode")

element.classList.contains("open")

Interview Tip: Expect “How do you toggle dark mode?”

# React Example – Toggle Dark Mode

```
import { useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <button onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
      <p>Hello World!</p>
    </div>
  );
}
```

# 3. getBoundingClientRect

👉 Returns size & position of an element relative to viewport.
Used for tooltips, drag-drop, sticky headers.

# Interview Tip: Often asked in “how to position tooltip under button” questions.

# Example:

```
const box = document.querySelector(".box");
const rect = box.getBoundingClientRect();
console.log(rect.top, rect.left, rect.width, rect.height);
```

# React Example – Tooltip Position

```
import { useRef, useState } from "react";

export default function TooltipDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const showTooltip = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 5, left: rect.left });
    }
  };

  return (
    <div>
      <button ref={btnRef} onMouseEnter={showTooltip} onMouseLeave={() => setPos(null)}>
        Hover me
      </button>
      {pos && (
        <div style={{ position: "absolute", top: pos.top, left: pos.left, background: "yellow" }}>
          Tooltip text
        </div>
      )}
    </div>
  );
}
```