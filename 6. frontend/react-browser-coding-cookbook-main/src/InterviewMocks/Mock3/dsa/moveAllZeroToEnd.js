function moveAllZeroToEnd(nums) {
  const n = nums.length;
  let i = 0, j =1;

  while (j < n) {
    if (nums[i] === 0 && nums[j] !== 0) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
      j++;
    } else if (nums[j] === 0) {
      j++;
    } else {
      i++;
      j++;
    }
  }

  return nums;
}