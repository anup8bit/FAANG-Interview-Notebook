function maxProductSubArray(nums) {
  let currentMax = 1, currentMin = 1;
  let maxProduct = 1;

  for (let i = 0; i < nums.length; i++) {
    const tempMax = currentMax;
    currentMax = Math.max(
      currentMin * nums[i],
      currentMax *  nums[i],
    );

     currentMin = Math.min(
      currentMin * nums[i],
      tempMax *  nums[i],
    );

    if (nums[i] === 0) {
      currentMax = 1;
      currentMin = 1;
    }

    maxProduct = Math.max(maxProduct, currentMax);
  }

  return maxProduct;
}