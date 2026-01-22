import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay = 300): T => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

export default useDebounce;
