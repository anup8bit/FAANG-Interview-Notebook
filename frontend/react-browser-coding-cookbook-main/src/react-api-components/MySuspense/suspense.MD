### Definition ###

<Suspense> allow us to display a fallback until its children have finished loading.

```tsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

# Props #

1. children: The actual UI you intend to render. If children suspends while rendering, the Suspense boundary will switch to rendering fallback.

2. fallback: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted.

### Note
 Suspense will automatically switch to fallback when children suspends, and back to children when the data is ready. If fallback suspends while rendering, it will activate the closest parent Suspense boundary.


 React includes under-the-hood optimizations like Streaming Server Rendering and Selective Hydration that are integrated with Suspense

