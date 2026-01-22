import { useEffect, useRef, useState } from "react";

const useThrottle = <T, >(value: T, limit = 300): T => {
    const [throttledValue, setThrottledValue] = useState(value);

    // stores the timestamp of last update
    const last = useRef(0);

    useEffect(() => {
        // current time
        const now = Date.now();
        const lastTime = last.current;

        const timeElapsed = now - lastTime;

         // 1️⃣ Case A: Enough time has passed → update immediately
        if (timeElapsed >= limit) {
            setThrottledValue(value);
            last.current = now;
        } else { // 2️⃣ Case B: Too soon → schedule update for later
            const id = setTimeout(() => {
                setThrottledValue(value);
                last.current = now;
            }, limit-timeElapsed);

            return () => clearTimeout(id); // cleanup if value changes again
        }

    }, [value, limit]);

    return throttledValue;
}

export default useThrottle;
