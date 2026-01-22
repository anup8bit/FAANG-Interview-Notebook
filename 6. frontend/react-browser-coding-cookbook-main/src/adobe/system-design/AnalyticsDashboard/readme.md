


### Component Breakdown ###

Feature Page - 
  AnalyticsDashboard (folder)
  |--AnalyticsDashboardPage.tsx
   --index.tsx
   --type.ts
   --utils.ts

Components
  |--Table.tsx
   --Row.tsx
   --Columns.tsx
   --Cell.tsx
  
  |--Serach Input (Debounce)
  |--Filter

Hooks
  |--useFetchData.tsx
   --useDebounce

reducers
  |--analyticsDashboard.ts
  |--types.ts


State Management
 Local state - search text, filters
 reducer state - analytics data

 API Request
  |-- getAnalytics (pagination -> offset / cursor pagination)


