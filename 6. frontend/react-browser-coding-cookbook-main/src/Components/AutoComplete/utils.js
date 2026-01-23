export const debounce = (fn, delay) => {
    let timerId = null;

    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
            timerId = null;
        }, delay);
    }
}

export const formatedData = (data) => {
    if(!data) return [];
    console.log(data)
    return data.items.map((user)=> ({
        label: user.login,
        value: user.html_url,
        id: user.id
    }));
}