### Web Application Performance

Problem:
You have a React SPA that is slow when loading large data tables. What techniques can you apply?

Notes:

Virtualization (react-window, react-virtualized)

Code-splitting + dynamic imports

Memoization (React.memo, useMemo)

Debouncing API calls

Avoid anonymous inline functions in large renders

Lazy image loading