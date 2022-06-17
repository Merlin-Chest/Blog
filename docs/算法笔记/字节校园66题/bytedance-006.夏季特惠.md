# bytedance-006.夏季特惠

![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.21oqgi3dwzcw.jpg)

格式：

输入：
- 第一行包含两个数 n 和 X 。
- 接下来 n 行包含每个游戏的信息，原价 ai,现价 bi，能获得的快乐值为 wi 。
输出：
- 输出一个数字，表示你能获得的最大快乐值。
示例 1：

输入：
     4 100
     100 73 60
     100 89 35
     30 21 30
     10 8 10
输出：100
解释：买 1、3、4 三款游戏，获得总优惠 38 元，总金额 102 元超预算 2 元，满足条件，获得 100 快乐值。
示例 2：


输入：
     3 100
     100 100 60
     80 80 35
     21 21 30
输出：60
解释：只能买下第一个游戏，获得 60 的快乐值。
示例 3：


输入：
     2 100
     100 30 35
     140 140 100
输出：135
解释：两款游戏都买，第一款游戏获得优惠 70 元，总开销 170 元，超过预算 70 元，超出预算金额不大于获得优惠金额满足条件，因此可以获得最大快乐值为 135。
提示：

所有输入均为整型数
- 1 <= n <= 500
- 0 <= x <= 10,000
- 0 <= b_i <= a_i <= 500
- 1 <= w_i <= 1,000,000,000
关于数据集：
- 前 30% 的数据， 小数据集 (n<=15)
- 中间 30% 的数据，中等数据集 (n<=100)
- 后 40% 的数据，大数据集 (n<=500)

## AC

```text
总优惠金额不低于超过预算的总金额

==> 总优惠金额 >= 总金额 - 总预算
==> 总金额-总优惠金额 <= 总预算
==> sum(产品现价 - 产品的优惠价格) <= 总预算
==> sum(产品现价 - (产品原价 - 产品现价)) <= 总预算
于是就转化为01背包问题。重量为(产品现价 - (产品原价 - 产品现价))，价值为快乐值
```

```java
import java.util.Scanner;

class Solution {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int gameCount = scanner.nextInt();
        int money = scanner.nextInt();
        int[] previousValue = new int[gameCount];
        int[] nowValue = new int[gameCount];
        int[] happiness = new int[gameCount];
        for (int i = 0; i < gameCount; i++) {
            previousValue[i] = scanner.nextInt();
            nowValue[i] = scanner.nextInt();
            happiness[i] = scanner.nextInt();
        }
        // 获取现价-优惠金额的一个数组
        int[] values = new int[gameCount];
        for (int i = 0; i < values.length; i++) {
            values[i] = nowValue[i] - (previousValue[i] - nowValue[i]);
        }
        // 这里values的范围是[-500, 500],我们首先取所有<0的数
        int otherMoney = 0;
        long otherHappiness = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i] <= 0) {
                otherMoney += -values[i];
                otherHappiness += happiness[i];
            }
        }

        long res = otherHappiness + fun(values, money + otherMoney, happiness);
        System.out.println(res);
    }

    /**
     * volumes、values为每个物品的体积、价值，背包容量为capacity，求背包可以装的物品的最大价值
     */
    private static long fun(int[] volumes, int capacity, int[] values) {
        int count = volumes.length;
        // memo[i][j] 前i个物品，装在体积为j的背包中，可以得到的最大价值
        long[][] memo = new long[count + 1][capacity + 1];
        for (int i = 1; i < count + 1; i++) {
            for (int j = 1; j < capacity + 1; j++) {
                // 不选第i - 1个物品
                long num = memo[i - 1][j];
                if (volumes[i - 1] > 0 && j >= volumes[i - 1]) {
                    // 选择第i - 1个物品
                    num = Math.max(num, memo[i - 1][j - volumes[i - 1]] + values[i - 1]);
                }
                memo[i][j] = num;
            }
        }
        return memo[count][capacity];
    }
}
```
