### Caching techniques and its implementation (in frontend) ###

🚀 Frontend Caching Techniques & Implementation

Caching in frontend improves:

- Performance
- Reduced network calls
- Lower page load times
- Better user experience
- Caching happens at multiple layers:

Browser → Service Worker → Memory Cache → Local Storage → IndexedDB → CDN → API layer


**✅ 1. Browser Cache (HTTP Cache)**

Uses HTTP headers to control caching.
Great for static assets: JS, CSS, images.

🔹 Headers

Cache-Control

ETag

Last-Modified

Expires

📌 Example: Cache-Control header

Cache-Control: max-age=31536000, immutable

When to use?

Versioned assets (like main.f43df9.js)

Static images


**✅ 2. Service Worker Cache (PWA Caching)**

Best for:

Offline support

Caching API responses

Caching dynamic pages

A Service Worker intercepts requests before they hit the network.

📌 Example: Cache API + Fetch Intercept

```javascript
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open("v1").then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
```

Popular strategies (important for R3):

- Cache First
- Network First
- Stale-While-Revalidate
- Cache Only
- Network Only


**🚀 3. In-Memory Cache**

Fastest but volatile (clears on refresh).

Best for:

Repeated API calls within a session

Storing UI state

List data that gets reused

📌 Simple in-memory cache implementation

```js
const memoryCache = {};

async function fetchWithCache(url) {
  if (memoryCache[url]) return memoryCache[url];

  const response = await fetch(url);
  const data = await response.json();

  memoryCache[url] = data;
  return data;
}
```

In React, you normally use:

- React Query
- SWR
- Apollo Client
- TanStack Query

**🚀 4. LocalStorage Cache**

Persistent storage (5MB limit).

Best for:

- Theme preference
- User settings
- Tokens
- Last visited items
- Small data blobs

📌 Implementation

```js
function getCachedValue(key, fetcher) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  return fetcher().then(data => {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  });
}
```

***🚀 5. SessionStorage***

Clears when the tab closes.

Good for:

Per-session tokens

Temporary form data

Single tab state

📌 Example
```js
sessionStorage.setItem("userSession", JSON.stringify({ name: "Anup" }));
```

***🚀 6. IndexedDB (Advanced Caching)***

Uses client-side database (structured data).

Best for:
- Large datasets
- Offline apps
- File blobs
- Complex object storage

📌 Example using idb wrapper:

```js
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('posts');
  }
});

await db.put('posts', { id: 1, title: "Hello" }, 1);
const post = await db.get('posts', 1);
```

***🚀 7. CDN Caching***

CDNs cache static assets near the user.

Cloudflare

Akamai

AWS CloudFront

Great for:

Asset delivery

Fonts

SSR output caching

No code needed on frontend — just leverage versioned filenames.

***🚀 8. React Query / SWR (Stale-While-Revalidate)***

These libraries implement intelligent caching.

📌 Example: React Query

```js
const { data, isLoading } = useQuery(
  ["posts"],
  () => fetch("/api/posts").then(res => res.json()),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  }
);
```

Features:
- prefetching
- deduping multiple requests
- stale-while-revalidate
- refetch on window focus

***🚀 9. Client-side GraphQL Cache***

Apollo Client & Relay maintain a normalized cache.

📌 Apollo example

```js
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});
```

Good for:
- automatically merging responses
- consistent data across UI
- offline support (on mobile apps)

***🚀 10. Cache Busting***

When deployed assets must be refreshed.

Use:

hashed filenames (app.123abd.js)

meta tags

service worker version bumps

Prevents users from seeing stale JS/CSS.


***✔ Implement the right strategy per use-case***

Product list → React Query + SWR

Heavy offline editor → IndexedDB

Static assets → CDN + Cache-Control

Theme → LocalStorage

User session → SessionStorage


✔ Cache Invalidation

“The 2 hardest problems in CS: naming things, cache invalidation, and off-by-one errors.”

Use:

versioning

timestamps

ETag + Last-Modified

SW version bump