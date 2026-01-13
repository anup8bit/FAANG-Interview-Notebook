function TwoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const reqValue = target - nums[i];
    if (reqValue >= 0) {
      const index = map.get(reqValue);
      if (index !== undefined) return [i, index];
      map.set(nums[i], i);
    }
  }
}