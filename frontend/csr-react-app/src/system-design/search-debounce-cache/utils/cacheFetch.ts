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
