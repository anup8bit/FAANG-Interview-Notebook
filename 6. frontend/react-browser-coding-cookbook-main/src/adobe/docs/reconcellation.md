### Reconcilation ###

## 🚀 React Reconciliation — Deep Dive (Interview Ready) ##

Reconciliation is the process in which React figures out what has changed in the UI and updates the DOM efficiently.

React never updates the DOM directly.
It creates a Virtual DOM and then performs a diffing process using reconciliation.


## ✅ 1. Why Reconciliation Is Needed

Updating the browser DOM is expensive.

If UI has 1000 nodes, React does not redraw everything.
It figures out “what exactly changed?” and updates only that part.

This diffing + updating process is called:

⭐ Reconciliation = Virtual DOM diffing + applying minimal DOM mutations


## ✅ 2. Two Core Principles of React Reconciliation

React uses two assumptions to optimize comparisons:

A. Different Types → Completely Replace

If element.type changes, React throws away the old tree.

```jsx
<div> → <span>
```

React unmounts <div> and mounts <span> — no reuse.

Even component types:
 ```jsx
<MyComponent /> → <OtherComponent />
```

React unmounts old component, mounts new one.

B. Same Type → Reuse Node & Update In-Place

If type is same:

```jsx
<div className="red"> → <div className="blue">
```

React updates only changed attributes.

✅ 3. Reconciliation of Component Trees
(1) Class / Function Components

If component identity stays same:

```jsx
<MyComponent a={1} /> → <MyComponent a={2} />
```

React does NOT recreate the component,
it re-renders it with new props.

State is preserved.

(2) Keys for Lists — MOST IMPORTANT

Keys tell React how to match elements across renders.

❌ Without keys:

React compares items by index
→ causes unnecessary unmount/mount, losing state.

✔ With keys:

React matches correct elements
→ minimal DOM updates
→ state inside list items remains correct.

Example:

```jsx
<ul>
  {items.map(i => <li key={i.id}>{i.name}</li>)}
</ul>
```

If items reorder, React reuses nodes correctly.

💥 Keys exist ONLY for reconciliation performance.



✅ 4. Reconciliation Steps (Deep Internal Explanation)
Step 1 — Render Phase

React builds a new Virtual DOM tree.

Step 2 — Diffing Phase

React compares:

old VDOM ↔ new VDOM


Using the rules:

Different type → replace

Same type → update

Lists → use keys to match children

Step 3 — Commit Phase

React computes the minimal DOM operations and applies them:

Update attributes

Insert nodes

Remove nodes

Update text content

This phase is synchronous.


✅ 5. React Fiber — Modern Reconciliation Engine

React 16+ introduced Fiber, a reimplementation of reconciliation allowing:

✔ interruptible rendering
✔ prioritization
✔ scheduling
✔ splitting work over multiple frames

The Fiber architecture breaks component tree into units of work.

React can:

Pause work

Resume work

Abort work

Prioritize urgent updates (like typing)

This is a massive improvement over old stack-based reconciliation.

✅ 6. Costly Operations in Reconciliation

React tries to avoid these:

Changing element type

Reordering large lists without keys

Using index as key → bad diffing

Unnecessary re-rendering of big components


✅ 7. Interview-Level Summary

React reconciliation is the algorithm used to update the DOM efficiently by:

Using a Virtual DOM

Diffing old vs new trees

Applying minimal DOM updates

Using keys for list matching

Reusing nodes when possible

Leveraging Fiber to schedule and break rendering work

