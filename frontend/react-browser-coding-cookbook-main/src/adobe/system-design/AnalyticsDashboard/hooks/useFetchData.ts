import { useEffect, useState } from "react";

export const useFetchData = (url: string) => {
  const [paginatedData, setPaginatedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error|null>(null);


useEffect(() => {
  if (!url) return;

  const callApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(url);
      const res = await resp.json();
      // if (!res.OK) return new Error("API Failed");

      setPaginatedData(res);
    } catch(err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  callApi();

}, [url]);

  return {
    paginatedData,
    loading,
    error
  };
}
