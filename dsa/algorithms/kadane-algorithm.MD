Kadane’s Algorithm is a dynamic programming (and greedy) technique used to find the maximum sum of a contiguous subarray within a one-dimensional array of numbers in linear time.


### What Problems Does It Solve?
While its primary use is finding the Maximum Subarray Sum, it is adapted for several other technical and real-world challenges:

***Technical Variations***
- Maximum Product Subarray: Modified to track both minimum and maximum products at each step to handle negative numbers flipping the sign.
- Smallest Sum Subarray: Inverting the logic to find the minimum possible sum.
- Maximum Circular Subarray: Solving cases where a subarray can "wrap around" from the end of the array back to the beginning.
- 2D/3D Max Sum: Extended to find the maximum sum submatrix in a 2D grid or sub-cube in 3D space. 

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length, currentMax = nums[0], max = nums[0];
        if (n == 1) return nums[0];

        for (int i = 1; i < n; i++) {
            // at any point we can select element an element to existing array or we can start a fresh window
            currentMax = Math.max(nums[i], nums[i] + currentMax);

            max = Math.max(max, currentMax);

        }

        return max;
    }
}
```


152. Maximum Product Subarray

```java
class Solution {
    public int maxProduct(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        int max = nums[0], globalMax = nums[0], globalMin = nums[0];

        for (int  i = 1; i < n; i++) {
            int currentMax = IntStream.of(nums[i], nums[i] * globalMax, nums[i] * globalMin)
                                .max()
                                .getAsInt();

            int currentMin = IntStream.of(nums[i],  nums[i] * globalMax, nums[i] * globalMin)
                                .min()
                                .getAsInt();

            globalMax = currentMax;
            globalMin = currentMin;
            
            max = Math.max(max, globalMax);
        }

        return max;
    }
}
```