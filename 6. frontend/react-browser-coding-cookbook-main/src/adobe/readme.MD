### ✅ RADIO Framework — Frontend System Design Template ###

**R A D I O = Requirements → Architecture → Data → Interaction → Optimization**

Use this whenever they ask:

“Design a File Upload System”

“Design a Notification Panel”

"Design an Image Editor UI"

“Design a Dashboard”

“Design a Player UI”

“Design an Infinite Scroll Feed”

“Design a Drag-and-Drop Builder” (often asked in Captivate team!)


## ⭐ 1. R → Requirements (Functional + Non-Functional)

# Functional Requirements
**Define what the system must do.**
Example:
- Users can upload files
- Show progress per chunk
- Retry on failure
- Cancel upload
- Support parallel uploads

# Non-Functional Requirements
**Define constraints & quality:**

- Performance
- Accessibility (WCAG AA)
- Responsiveness
- Security (XSS, CSRF, CSP)
- Scalability of UI
- Local cache
- Memory usage (Adobe cares a lot!)
- Offline support (optional)
- Error resilience

Tip: Always clarify constraints (file size limit? concurrency? number of items?).


## ⭐ 2. A → Architecture (High Level + Low Level)

# Break it into UI → State → Business Logic → Integration → Rendering.

# High-Level Architecture

UI Layer (React Components)
↓
State Layer (React Query + Zustand/Redux)
↓
Service Layer (APIs, Web Workers, Utils)
↓
Storage Layer (LocalStorage/IndexedDB)
↓
Render Layer (Virtual DOM, Canvas, WebGL)

# Component Architecture (LLD)
Example (File Upload):
```tsx
<UploadContainer>
   <DropZone/>
   <FileList>
      <FileItem>
         <ProgressBar/>
         <RetryButton/>
         <CancelButton/>
      </FileItem>
   </FileList>
</UploadContainer>
```

# State Architecture
- UI State → local component state
- Server State → React Query / SWR
- Shared App State → Zustand/Redux
- Derivative State → memoized selectors

# Performance Architecture
- lazy load heavy components
- debounce + throttle
- avoid re-renders
- virtualization for lists


## ⭐ 3. D → Data (Flow + Models + Storage)

# Data Flow
Explain end-to-end:

Example (Chunk Upload):
```sql
File → slice() → create chunks → queue → upload concurrently → 
retry (backoff) → mark chunks done → commit API → success
```

# Data Models

```ts
type FileMeta = {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "uploading" | "failed" | "done";
  progress: number;
}

type Chunk = {
  chunkId: number;
  blob: Blob;
  retryCount: number;
}
```

# Where do we store what?
- Small UI state → React
- Large data (images, blobs) → Web Worker or IndexedDB
- List caching → React Query
- Prefetching → SWR



## ⭐ 4. I → Interaction (User Flows + Events + Edge Cases)

# User Interaction Flows
- drag and drop
- click to upload
- show preview
- retry on failure
- show toast on error
- optimistic updates
- skeleton loading

# Event Design
Examples:
- onChunkUploadStart
- onChunkUploadProgress
- onChunkUploadRetry
- onUploadAbort
- onUploadDone

# Accessibility
- aria-labels
- keyboard navigation
- focus trap for modals
- prefers-reduced-motion

# Edge Cases
- network loss
- slow network
- file too big
- duplicate file
- tab close (onbeforeunload)
- memory pressure (Adobe cares!)


## ⭐ 5. O → Optimization (Performance + Scalability + Reliability)

# Frontend Optimization Techniques
- Web Workers to process large files (Adobe likes this)
- SharedArrayBuffer for concurrent chunk processing
- Memoization + virtualization
- Suspense + lazy loading
- Reduce bundle size (code splitting)
- Cache API responses
- Preload critical assets

# Rendering Optimization
- avoid large DOM trees
- virtual scroll for long lists
- offload heavy rendering (Canvas/WebGL)

# Network Optimization
- parallel uploads
- exponential backoff retry
- pause/resume
- delta uploads



Example:

Below is an interview-ready ***Analytics Dashboard POC System Design*** with the three diagrams you must present:

High Level Architecture (HLA)

Sequence Diagram

Component Diagram

✅ 1. High-Level Architecture Diagram (HLA)

Analytics Dashboard POC — System Overview

                ┌────────────────────┐
                │   React Frontend   │
                │  (Dashboard UI)    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ API Gateway / BFF  │
                │  /analytics         │
                └─────────┬──────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Analytics API  │  │ Filter API   │  │ Pagination API   │
│ (Node/Java)    │  │ (metadata)   │  │ (batch loading)  │
└───────┬────────┘  └─────┬────────┘  └─────────┬────────┘
        │                 │                    │
        │                 │                    │
        ▼                 ▼                    ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Cache Layer   │  │   Search     │  │    Database       │
│ (Redis/Memc.)  │  │ (Elastic)    │  │ (Postgres/MySQL)  │
└────────────────┘  └──────────────┘  └──────────────────┘



Purpose
This diagram shows:

UI → BFF → microservices

Separation of analytics, filtering, and pagination

Cache + Search + DB

✅ 2. Sequence Diagram – Pagination + Filters

User                     UI (React)           BFF/API Gateway       Analytics API         DB/Cache
 |                          |                        |                    |                  |
 |---Open Dashboard-------->|                        |                    |                  |
 |                          |---Fetch Filters------->|---Get Filters----->|---Query DB------>|
 |                          |                        |                    |<--Filter Data----|
 |                          |<-------Filters---------|                    |                  |
 |                          |                        |                    |                  |
 |---Scroll/Next Page------>|                        |                    |                  |
 |                          |---GET /analytics?page=2&size=20------------>|                  |
 |                          |                        |---Check Cache----->|---Hit Redis?---->|
 |                          |                        |       │miss        |                  |
 |                          |                        |---Query DB-------->|---SQL Query----->|
 |                          |                        |                    |<---20 rows-------|
 |                          |<------20 records-------|                    |                  |
 |                     Renders Charts & Table        |                    |                  |



Purpose
Shows step-by-step:

Load filters

Pagination request

Cache-first

DB fallback

Response to UI

This is the expected sequence diagram in interviews.


✅ 3. Component Diagram (Frontend & Backend)
🔹 React Component Diagram

┌────────────────────────────┐
│     Dashboard Page         │
│────────────────────────────│
│ - fetchSummary()           │
│ - fetchPaginatedData()     │
│ - handleFilterChange()     │
└───────────┬────────────────┘
            │
            ▼
  ┌──────────────────────┐
  │  FilterPanel         │
  │  - Dropdowns         │
  └──────────────────────┘
            │
            ▼
  ┌──────────────────────┐
  │ ChartContainer        │
  │ - BarChart            │
  │ - PieChart            │
  └──────────────────────┘
            │
            ▼
  ┌──────────────────────┐
  │ PaginatedTable       │
  │ - rows, page, size   │
  └──────────────────────┘



⭐ What You Present in Interview

Start with HLA → Show the full ecosystem

Move to Sequence Diagram → Explain how data flows

End with Component Diagram → Show UI/API internals

This is exactly what FAANG + Goldman Sachs expect.


1. useDebounce
2. useThrottle


1. Search using useDebounce


*** scrollTop means: “How much the user has scrolled inside the element.”** - This is not the content’s height.


***scrollHeight - The total height of the element’s content (even if hidden).***

