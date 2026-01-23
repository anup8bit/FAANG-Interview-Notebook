function isAnagram(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  if (m !== n) return false;
  const map1 = new Map();
  const map2 = new Map();

  for (let i = 0; i < m; i++) {
    map1.set((map1.get(s1[i]) ?? 0) + 1);
    map2.set((map2.get(s2[i]) ?? 0) + 1);
  }

  for (let [ch, freq] of map1) {
    if (map2.get(ch) !== freq) return false;
  }

  return true;
}