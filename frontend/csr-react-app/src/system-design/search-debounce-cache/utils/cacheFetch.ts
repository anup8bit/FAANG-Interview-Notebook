const cache = new Map<string, any>();

const cacheFetch = async <T>(fn: (key: string) => Promise<T>, key: string): Promise<T> => {
    if (cache.has(key)) {
        return cache.get(key) as T;
    }

    try {
        const data = await fn(key);
        cache.set(key, data);

        return data;
    } catch (err) {
        throw new Error(String(err));
    }
}

export default cacheFetch;

/**
const cache = new Map();
 
const cacheFetch = async (fn, key: string) => {
    if (cache.has(key)) {
        return cache.get(key);
    }

    try {
        const data = await fn(key);
        cache.set(key, data);

        return data;
    } catch(err) {
        throw new Error(err);
    }
}

export default cacheFetch;
**/
