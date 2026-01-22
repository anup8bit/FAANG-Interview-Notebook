import {
    onLCP,
    onINP,
    onCLS,
} from "web-vitals";

export const reportWebVitals = (callback: (metrics: any) => void) => {
    onLCP(callback);
    onINP(callback);
    onCLS(callback);
}

