import { useEffect, useState } from "react";

export const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(!url) return;
        let isMounted = true;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            isMounted = true;

            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
                const res = await resp.json();

                if(isMounted)setData(res);
            } catch(err) {
                if(isMounted)setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false; // cleanup
        };
    }, [url]);


    return {
        data,
        error,
        loading
    };
}