function longestStringWithoutRepeatingChar(s) {
  let startIndex = 0;
  const n = s.length;
  const map = new Map();
  map.set(s[0], 0);
  let longestString = "";

  for (let i = 0; i < n; i++) {
    const ch = s[i];
    const index = map.get(ch);

    if (index >= startIndex) {
      
      longestString = longestString.length > i - startIndex ? longestString : s.substring(startIndex, i);
        startIndex = index+1;
    }
    map.set(ch, i);
  }

    console.log("longestString : ", longestString, ", startIndex : ", startIndex, ", n : ", n)

  longestString = longestString.length > n - startIndex ? longestString : s.substring(startIndex, n);

  return longestString;
}