function flattenArray(ar) {
  let res = [];

  function flatten(arr) {
    for(let val of arr) {
      if (Array.isArray(val)) {
        flatten(val);
      } else {
        res.push(val);
      }
    }
  }

  flatten(ar);

  return res;
}