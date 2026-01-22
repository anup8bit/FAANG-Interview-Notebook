import { useEffect, useMemo, useRef, useState } from "react";
import useFetchData from "./useFetchData";
import { User } from "./types";
import Card from "./Card";
import useDebounce from "../useDebounce";

let url = "https://api.github.com/search/users?q=anupkr&per_page=10";

const InfiniteScroll = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  const usersListRef = useRef(null);
  const fetchingRef = useRef(false);

  // debounced url can be ignored as we are using fetchingRef
  const debouncedUrl = useDebounce(`${url}&page=${page}`, 500);


  const {data, loading, error} = useFetchData(debouncedUrl);


  useEffect(() => {
    if (data?.items) {
      setUsersData(prev => [...prev, ...data?.items]);
    }
    if (!loading) {
      fetchingRef.current = false;
    }
  }, [data, loading]);

  console.log("page : ", page);

  useEffect(() => {
    const callback = function(enteries: IntersectionObserverEntry[]) {
      console.log("enteries : ", enteries);
      enteries.forEach((entry) => {
        console.log("entry : ", entry);
        console.log("fetchingRef : ", fetchingRef);
        console.log("loading : ", loading);
        if (entry.isIntersecting && !loading && !fetchingRef.current) {
          setPage(prev => prev+1);
          fetchingRef.current = true;
        }
      })
    };

    const options: IntersectionObserverInit = {
      rootMargin: "0px 0px 200px 0px",
      threshold: 0,
      root: null,
    }

    const observer = new IntersectionObserver(callback, options);

    if (usersListRef.current) {
      observer.observe(usersListRef.current);
    }

    return () => {
      if (usersListRef.current) {
        observer.unobserve(usersListRef.current);
        observer.disconnect();
      }
    }
  }, [usersData]);

  if (usersData.length === 0) return <div>No Users found</div>

  if (data?.total_count && page * 10 >= data?.total_count) return <div>No more data</div>



  return (
    <div>
      <header>
        <h1>Github Users</h1>
      </header>
      <div className="users-list-container">
        {usersData.map((user) => (
          <Card userData={user} />
        )
        )}
        {usersData.length > 0 && <div ref={usersListRef} style={{ height: "20px" }} />}
        {fetchingRef.current && <div style={{ background: "#000", padding: "48px", color: "#fff", fontWeight: "bold"}}>Loading more users.....</div>}
      </div>
    </div>
  )

}

export default InfiniteScroll;