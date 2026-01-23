import { useEffect, useReducer, useRef } from "react";
import postReducer, { initialState } from "./reducer";
import { fetchPosts } from "./hooks/fetchPost";
import Post from "./components/Post";
import "./index.css";
import { INCREMENT_PAGE } from "./type";
import { useThrottle } from "./hooks/useThrottle";
import { useThrottleFn } from "./hooks/useThrottleFn";

const NewsFeed = () => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const ref = useRef<HTMLDivElement>(null);

  const throttledPage = useThrottle(state.page, 1000);
  const setNextPage = () => dispatch({ type: INCREMENT_PAGE, payload: null});

  // const throttledNextPage = useThrottleFn(setNextPage, 1000);
  
  // useEffect(() => {
  //   fetchPosts(`https://jsonplaceholder.typicode.com/posts?_start=${state.page*10+1}&_limit=10`, dispatch);
  // }, [state.page]);

  useEffect(() => {
    fetchPosts(`https://jsonplaceholder.typicode.com/posts?_start=${throttledPage*10+1}&_limit=10`, dispatch);
  }, [throttledPage]);

  console.log("state : ", state);
  // console.log("throttledPage : ", throttledPage);


    useEffect(() => {
    const callback: IntersectionObserverCallback = (entries, obs) => {
      console.log("--entries------", entries);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("entry : ", entry);
          // throttledNextPage();
          setNextPage();
          obs.unobserve(entry.target);
        }
      })
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-2px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver(callback, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
    if (ref.current) observer.unobserve(ref.current);
    observer.disconnect();

    }
  }, [state.posts.length]);

  return (
    <div className="news-feed-container">
      <h3>News Feed</h3>
      {state.posts.map((post, index) => (
        <Post post={post} ref={ref} isLastPost={index===state.posts.length-1} />
      ))}
    </div>
  )
}

export default NewsFeed;
