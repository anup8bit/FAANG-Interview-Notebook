import { useEffect, useState } from "react"
import cacheFetch from "../utils/cacheFetch";

const useFetch = (url: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!url) {
            setData(null);
            return;
        }
        const controller = new AbortController();

        const fetchData = async () => {
            const resp = await fetch(url, {
                    signal: controller.signal
                });
                if (!resp.ok) throw new Error("error in fetching data");

                const res = await resp.json();

                return res;
        }

        const callAPi = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await cacheFetch(fetchData, url)

                setData(data);
            } catch (err) {
                // if error is due to abort, do nothing
                if ((err as DOMException).name === "AbortError") return;
                setError(err as unknown as Error);
            } finally {
                setLoading(false);
            }
        }

        callAPi();

        return () => {
            controller.abort();
        }
    }, [url]);

    return {
        data,
        error,
        loading,
    };
}

export default useFetch;

/**
 * Feedback:
 * 
 * ❌ 4. GitHub API rate-limiting (real-world issue)
    https://api.github.com/search/users


    Meta interviewers often test realism.

    Issues:

    GitHub API has strict rate limits

    No headers

    No handling of 403

    📌 They might say:

    “This will break in production very fast.”
 */
