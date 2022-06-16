# 2Sum 3Sum 4Sum问题

# two sum

如果假设输入一个数组 `nums` 和一个目标和 `target`，**请你返回 `nums` 中能够凑出 `target` 的两个元素的值**，比如输入 `nums = [5,3,1,6], target = 9`，那么算法返回两个元素 `[3,6]`。可以假设只有且仅有一对儿元素可以凑出 `target`。

思路：先对nums进行排序，利用左右双指针的技巧，从两端相向而行就可以。

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
	    // 先对数组排序
	    Arrays.sort(nums);
	    // 左右指针
	    int l = 0, r = nums.length - 1;
	    while (l < r) {
	        int sum = nums[l] + nums[r];
	        // 根据 sum 和 target 的比较，移动左右指针
	        if (sum < target) {
	            l++;
	        } else if (sum > target) {
	            r--;
	        } else if (sum == target) {
	            return new int[]{nums[lo], nums[hi]};
	        }
	    }
	    return new int[0];
    }
}
```

变型：`nums` 中可能有多对儿元素之和都等于 `target`，请你的算法返回所有和为 `target` 的元素对儿，其中不能出现重复。

比如 `[1,3]` 和 `[3,1]` 就算重复

比如 `nums = [1,1,1,2,2,3,3], target = 4`，得到的结果中 `[1,3]` 肯定会重复。

```java
public List<List<Integer>> twoSumTarget(int[] nums, int target) {
    // nums 数组必须有序
    Arrays.sort(nums);
    int l = 0, r = nums.length - 1;
    List<List<Integer>> res = new ArrayList<>();
    while (l < r) {
        int sum = nums[l] + nums[r];
        int left = nums[l], right = nums[r];
        if (sum < target) {
            while (l < r && nums[l] == left) l++;
        } else if (sum > target) {
            while (l < r && nums[r] == right) r--;
        } else {
	        List<Integer> ans = new ArrayList<>();
	        ans.add(left);
	        ans.add(right);
            res.add(ans);
            while (l < r && nums[l] == left) l++;
            while (l < r && nums[r] == right) r--;
        }
    }
    return res;
}
```

这样就可以保证一个答案只被添加一次，重复的结果都会被跳过，可以得到正确的答案。

## three sum

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```java
class Solution {
    public List<List<Integer>> threeSumTarget(int[] nums, int target) {
        // 先对数组进行排序
        Arrays.sort(nums);
        int n = nums.length;
        List<List<Integer>> res = new ArrayList<>();
        // 当确定三个数中的第一个数
        for(int i = 0; i < n; i++){
            // 那么求 两数之和为 target - nums[i] 的所有结果，起点为该数的下一个，之前的数已经列举过不能再算
            List<List<Integer>> ans = twoSum(nums, i + 1, target - nums[i]);
            // 拿到所有结果后，把该数加进去就是结果
            for(List<Integer> tmp : ans){
                // 把该数加进去形成三元组
                tmp.add(nums[i]);
                // 新增一个答案
                res.add(tmp);
            }
            // 跳过与当前值相同的数
            while(i < n - 1 && nums[i] == nums[i + 1]) i++;
        }
        return res;
    }
    // 计算数组中和为目标值的不重复两元组
    public List<List<Integer>> twoSumTarget(int[] nums, int start, int target){
        // 左右指针
        int l = start, r = nums.length - 1;
        List<List<Integer>> res = new ArrayList<>();
        while (l < r) {
            // 两数之和
            int sum = nums[l] + nums[r];
            int left = nums[l], right = nums[r];
            // 与target作比较
            if (sum < target) {
                // 跳过重复的值，下同
                while (l < r && nums[l] == left) l++;
            } else if (sum > target) {
                while (l < r && nums[r] == right) r--;
            } else if (sum == target) {
                List<Integer> ans = new ArrayList<>();
                ans.add(left);
                ans.add(right);
                res.add(ans);
                while (l < r && nums[l] == left) l++;
                while (l < r && nums[r] == right) r--;
            }
        }
        return res;
    }
}
```

`3Sum` 问题就解决了，时间复杂度不难算，排序的复杂度为 `O(NlogN)`，`twoSumTarget` 函数中的双指针操作为 `O(N)`，`threeSumTarget` 函数在 for 循环中调用 `twoSumTarget` 所以总的时间复杂度就是 `O(NlogN + N^2) = O(N^2)`。

# four sum

`4Sum` 完全就可以用相同的思路：穷举第一个数字，然后调用 `3Sum` 函数计算剩下三个数，最后组合出和为 `target` 的四元组。

总的时间复杂度就是 `O(N^3)`。

## 100 sum

观察上面这些解法，统一出一个 `nSum` 函数：

```java
/* 注意：调用这个函数之前一定要先给 nums 排序 */
vector<vector<int>> nSumTarget(
    vector<int>& nums, int n, int start, int target) {

    int sz = nums.size();
    vector<vector<int>> res;
    // 至少是 2Sum，且数组大小不应该小于 n
    if (n < 2 || sz < n) return res;
    // 2Sum 是 base case
    if (n == 2) {
        // 双指针那一套操作
        int lo = start, hi = sz - 1;
        while (lo < hi) {
            int sum = nums[lo] + nums[hi];
            int left = nums[lo], right = nums[hi];
            if (sum < target) {
                while (lo < hi && nums[lo] == left) lo++;
            } else if (sum > target) {
                while (lo < hi && nums[hi] == right) hi--;
            } else {
                res.push_back({left, right});
                while (lo < hi && nums[lo] == left) lo++;
                while (lo < hi && nums[hi] == right) hi--;
            }
        }
    } else {
        // n > 2 时，递归计算 (n-1)Sum 的结果
        for (int i = start; i < sz; i++) {
            vector<vector<int>> 
                sub = nSumTarget(nums, n - 1, i + 1, target - nums[i]);
            for (vector<int>& arr : sub) {
                // (n-1)Sum 加上 nums[i] 就是 nSum
                arr.push_back(nums[i]);
                res.push_back(arr);
            }
            while (i < sz - 1 && nums[i] == nums[i + 1]) i++;
        }
    }
    return res;
}
```