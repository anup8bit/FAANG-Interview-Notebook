# 🔥 Sliding Window – HARD Problems Mastery Guide

1️⃣ Sliding Window ≠ Just Two Pointers

In hard problems, the window is usually combined with:

- HashMap / Array frequency
- Deque
- Heap
- Binary Search
- Prefix sums
- Greedy invariants

# The key question is always:
**What invariant must always hold true inside the window?**


---------Patterns------------------

## 2️⃣ Core HARD Sliding Window Patterns

### 🧠 PATTERN 1: "Minimum Window with Constraints"
(Most common Google HARD pattern)

Examples
76. Minimum Window Substring
727. Minimum Window Subsequence
632. Smallest Range Covering Elements from K Lists

**Invariant** - Window must satisfy ALL required constraints

Skeleton

```java
while (right < n) {
    add(s[right]);

    while (windowValid()) {
        updateAnswer();
        remove(s[left]);
        left++;
    }

    right++;
}
```

**Key Insight**
- Hard part = windowValid()
- Optimize validation using:
    - matchedCount == requiredCount
    - **NOT scanning hashmap every time**


Google Interview Tip
❌ BAD: Iterating over map every time
✅ GOOD: Maintain a formed or matched counter



### 🧠 PATTERN 2: “At Most K” → “Exactly K” Trick

Examples
992. Subarrays with K Different Integers
1248. Count Number of Nice Subarrays

**Trick:**
    Exactly(K) = AtMost(K) - AtMost(K-1)

**Why HARD?**
- Requires two sliding windows
- Needs deep understanding of monotonic shrink logic

Skeleton
```java
int atMostK(int k) {
    while (right < n) {
        add(nums[right]);

        while (distinct > k) {
            remove(nums[left]);
            left++;
        }

        count += (right - left + 1);
        right++;
    }
}
```


### 🧠 PATTERN 3: Variable Window with "Dynamic Validity"

Examples
2958. Length of Longest Subarray With at Most K Frequency
424. Longest Repeating Character Replacement
1004. Max Consecutive Ones III

**Key Insight**
    Window validity changes dynamically as max frequency changes.

**Trick**
👉 Do NOT shrink aggressively.

Classic Example (424)
```java
maxCount = max(maxCount, freq[c]);

while (windowSize - maxCount > k) {
    shrink();
}
```

📌 maxCount is never decreased → critical optimization



### 🧠 PATTERN 4: Sliding Window + Monotonic Deque

**(Interviewers LOVE this)**

Examples
239. Sliding Window Maximum
1438. Longest Continuous Subarray With Abs Diff ≤ Limit
1696. Jump Game VI

**Deque Invariant**
- Monotonically increasing or decreasing
- Front always holds best candidate

Skeleton
```java
while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[right]) {
    deque.pollLast();
}
deque.addLast(right);

if (deque.peekFirst() < left) deque.pollFirst();
```

💡 Hard part = deciding what the deque stores (index vs value)


### 🧠 PATTERN 5: Sliding Window + Binary Search

(Very HARD – Google L5+)

Examples
1044. Longest Duplicate Substring
2261. K Divisible Elements Subarrays

**Approach**
1. Binary search on window size
2. Check if a valid window exists

Skeleton
```java
while (low <= high) {
    mid = (low + high) / 2;
    if (existsValidWindow(mid)) {
        low = mid + 1;
    } else {
        high = mid - 1;
    }
}
```

**existsValidWindow() → rolling hash + sliding window**


### 🧠 PATTERN 6: Sliding Window on Two Arrays / Multiple Sources

Examples
632. Smallest Range Covering Elements from K Lists
76. variant with multiple strings

**Trick**
- Merge arrays
- Track frequency per source
- Window must include all sources



3️⃣ How Google Evaluates Sliding Window

They check:
- Can you define window invariant?
- Do you shrink correctly?
- Do you avoid brute-force checks?
- Is the code clean and minimal?

❌ Red flags:
- Nested loops without invariant
- Rechecking entire map
- Overcomplicated logic



4️⃣ 10 HARD Sliding Window Problems (Must Solve)
Problem	Pattern
76	Min window
992	Exactly K
424	Dynamic validity
239	Monotonic deque
1438	Deque
632	Multi-source
727	Subsequence window
2958	Frequency bounded
1044	Binary search
2261	Hash + window

5️⃣ Interview Checklist (Use This Verbally)

Before coding, say:

“I’ll use a sliding window”

“The window invariant is ___”

“We expand right to include elements”

“We shrink left only when invariant breaks”

“Time complexity is O(n)”


🔥 TOP 25 SLIDING WINDOW – HARD (FAANG Focused)
🧠 Category 1: Prefix Sum + Monotonic Deque (Very High Yield)

862. Shortest Subarray with Sum at Least K ⭐⭐⭐

1425. Constrained Subsequence Sum

239. Sliding Window Maximum (gateway hard)

1438. Longest Continuous Subarray With Abs Diff ≤ Limit

1696. Jump Game VI

2944. Minimum Number of Coins for Fruits II

➡ Pattern: Prefix sum dominance + deque pruning

🧠 Category 2: Word-Level / Fixed-Size Window (Google Favorite)

30. Substring with Concatenation of All Words ⭐⭐⭐

76. Minimum Window Substring

727. Minimum Window Subsequence

395. Longest Substring with At Least K Repeating Characters

➡ Pattern: Strict window validity with frequency constraints

🧠 Category 3: “At Most K → Exactly K” Dual Window

992. Subarrays with K Different Integers ⭐⭐⭐

1248. Count Number of Nice Subarrays

3306. Count of Substrings Containing Every Vowel and K Consonants II

➡ Pattern: Two windows + subtraction trick

🧠 Category 4: Dynamic Validity / Lazy Shrinking

424. Longest Repeating Character Replacement

1004. Max Consecutive Ones III

2958. Length of Longest Subarray With at Most K Frequency

➡ Pattern: Window validity depends on max frequency

🧠 Category 5: Binary Search + Sliding Window (L5+)

1044. Longest Duplicate Substring ⭐⭐⭐

2261. K Divisible Elements Subarrays

2067. Number of Equal Count Substrings

➡ Pattern: Binary search on window size + rolling check

🧠 Category 6: Multi-Source / Multi-Constraint Windows

632. Smallest Range Covering Elements from K Lists ⭐⭐⭐

76 (Multi-set variants)

209. Minimum Size Subarray Sum (hard variant with negatives)

➡ Pattern: Multiple constraint satisfaction

🧠 Category 7: Rare but Brutal

1358. Number of Substrings Containing All Three Characters

2845. Count of Interesting Subarrays

2106. Maximum Fruits Harvested After at Most K Steps

➡ Pattern: Sliding window + prefix tricks

🎯 FAANG INTERVIEW PRIORITY (Top 8)

If you do only these, you’re still safe:

862

30

76

239

992

1438

424

1044

🧠 How FAANG Judges Sliding Window

They expect you to clearly state:

Window invariant

When & why shrinking happens

Why solution is linear

Why brute force fails

❌ Instant rejection signals:

Resetting window blindly

Rechecking entire map

Mixing Kadane with sliding window

Character-based logic for word problems