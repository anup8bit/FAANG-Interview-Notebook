import { useEffect, useState } from "react";
import { GithubSearchResponse, User } from "./types";

const useFetchData = (url :  string) => {
    const [data, setData] = useState<GithubSearchResponse<User>|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error|null>(null);

    console.log("url : ", url)

    useEffect(() => {
      if (!url) return;

      const fetchData = async() => {
        setLoading(true);
        setError(null);

        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error("http error");
          const resData = await res.json();
          setData(resData);
        } catch(err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [url]);

    return {
      data, loading, error
    }
}

export default useFetchData;