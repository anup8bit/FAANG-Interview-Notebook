function firstNonRepeating(nums) {
  const set = new Set();
  const dup = new Set();

  for (let num of nums) {
    if (dup.has(num)) continue;
    if (set.has(num)) {
      set.delete(num);
      dup.add(num);
    }
    set.add(num);
  }

  if (set.size === 0) return -1;

  return set.values().next().value;
}