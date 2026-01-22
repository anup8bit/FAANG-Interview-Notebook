# Improvement
1. on change event type -> e: ChangeEvent<HTMLInputElement>

# 2. AutoComplete | Debounce Search
`debounce function` must be wrapped in `useCallback` or `useMemo`. so that new referrence will not be created after re renders (otherwise function will be called with delay)

# Infinite Scroll (Intersection Observer)
  Two refs are required
  1. <div ref={targetElementRef}></div>
  2. ref to control the api call when observer intersection is true 
      (generally when entry.isIntersection becomes true) 
      User may scroll multiple time at the end before api fetches the next data,
      so multiple event / set state will be fired and this will lead to call multiple api call
      -> SetState() / setPage(prev => prev+1) 
    
    const fetchApiRef = useRef(false);

    if (entry.isIntersecting && !loading && !fetchingRef.current) {
          setPage(prev => prev+1);
          fetchingRef.current = true;
          setCallApi(true);
    }

    useEffect(() => {
      setUsersData(prev => [...prev, ...data]);
      if (!loading) {
        fetchingRef.current = false;
      }
    }, [data, loading]);



    



String method -> how to get substring (s.substring(startIndex, endIndex))

