function debounce(fn, delay: number) {
  let timerId;

  return function(...args: any[]) {
    if(timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  }
}

export {
  debounce
}