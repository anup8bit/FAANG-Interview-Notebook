function findSubstringIndex(s1, s2) {
  const n1 = s1.lenght;
  const n2 = s2.length;

  let startIndex = -1;

  for (let i = 0; i < n1; i++) {
    if (startIndex === -1 && s1[i] === s2[startIndex+i+1]) {
      startIndex = i;
    // } else if (s)
  }
}