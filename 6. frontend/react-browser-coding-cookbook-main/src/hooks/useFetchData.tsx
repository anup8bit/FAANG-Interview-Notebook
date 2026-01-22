import { useEffect, useState } from "react";

type ResponseData = Record<string, any> | Record<string, any>[] | null;

interface Error {
  message: string;
  status: number;
}

export const useFetchData = (url: string, headers?: Record<string, any>) => {
    const [data, setData] = useState<ResponseData>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(!url) return;
        // let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            // isMounted = true;

            try {
                const resp = await fetch(url, { ...headers, cache: "no-store" });
                if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
                const res = await resp.json();

                setData(res);
            } catch(err) {
                setError(err as unknown as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return {
        data,
        error,
        loading
    };
}