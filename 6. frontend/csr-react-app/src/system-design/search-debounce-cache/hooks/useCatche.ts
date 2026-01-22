const cache = new Map();
 
const useCatche = (fn, key: string) => {
    if (cache.has(key)) {
        return cache.get(key);
    }

    const data = fn(key);
    cache.set(key, data);

    return data;
}

export default useCatche;

/***
 * ❌ 1. useCatche (cache) is NOT React-safe
 * 
 * 🚨 Major issue:

This is named like a hook (useX) but:

It does not use hooks

It is called conditionally

It violates Rules of Hooks semantics

📌 At Meta, this would trigger:

“Why is this named a hook? This is misleading.”


✅ Correct approach

Either:

Rename it to cacheFetch

OR make it a real hook using useRef



❌ 2. Cache stores a Promise, not resolved data (BUG)

✅ Correct approach

Either:

Rename it to cacheFetch

OR make it a real hook using useRef


❌ 3. AbortController is ineffective with cache

This is very important.

Flow:

First request starts

You cache the Promise

Component unmounts → controller.abort()

Cache still holds aborted Promise

Next time → cached aborted Promise returned

❌ Race conditions are NOT actually solved.
 */
