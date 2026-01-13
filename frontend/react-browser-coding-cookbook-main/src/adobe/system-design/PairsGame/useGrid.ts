export const useGrid = (n: number) => {
  return Array.from({length : n}, () => Array(n).fill(0));
}
