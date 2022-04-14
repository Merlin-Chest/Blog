# bytedance-002.发下午茶
## 题目

有 K 名字节君，每天下午都要推着推车给字节的同学送下午茶，字节的同学分布在不同的工区，字节的工区分布和字节君的位置分布如下。



在上图中，每个方框内的单位长度为 1。已知字节君的推车可以装无限份下午茶，所以不需要字节君回到初始地点补充下午茶。每个字节君只有两个动作。

把推车向前移动一个单位。
把一份下午茶投放到当前工区。
现在告诉你字节君的数量以及每个工具需要的下午茶个数请问，所有的字节君最少花费多长时间才能送完所有的下午茶？

格式：

输入：
- 第一行是字节君的数量K和工区的数量 N
- 第二行 N 个数字是每个工区需要的下午茶数量 Ti
输出：
- 输出一个数字代表所有字节均最少花费多长时间才能送完所有的下午茶
示例 1：


输入：
     3 3
     7 1 1
输出：5
解释：
字节君1：右移->放置->放置->放置->放置
字节君2：右移->放置->放置->放置
字节君3：右移->右移->放置->右移->放置
示例 2：


输入：
     2 4
     3 3 1 1
输出：7
解释：
字节君1：右移->放置->放置->放置->右移->放置->放置
字节君2：右移->右移->放置->右移->放置->右移->放置
提示：

0< K, N <= 1000
0<= Ti <= 10000


## AC代码

```java
import java.util.*;
public class Main{
    public static int n, m; // 人数，工位数
    public static int[] a; // 每个工位需要的数量
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        m = sc.nextInt();
        a = new int[m + 1];
        int j = m; // 最长的时间 m + 全部杯数，只有一人
        for(int i = 1; i <= m; i++){
            a[i] = sc.nextInt();
            j += a[i];
        }
        int i = 0; // 最短时间
        while(i < j){
            int mid = (i + j) >> 1;
            if(check(mid)){
                j = mid;
            }else{
                i = mid + 1;
            }
        }
        System.out.println(i);
    }
    public static boolean check(int time){
        int b[] = Arrays.copyOf(a, m + 1);
        // 遍历所有人
        for(int i = 0; i < n; i++){
            int t = time;
            // 对每个工区头部进行移动
            for(int j = 1; j < b.length; j++){
                t--; // 前进一步
                if(t <= 0){
                    break;
                }
                if(b[j] >= t){
                    b[j] -= t;
                    break;
                }else{
                    t -= b[j];
                    b[j] = 0;
                }
            }
        }
        // 检查工位的情况
        for(int i = 1; i < b.length; i++){
            if(b[i] > 0){
                return false;
            }
        }
        return true;
    }
}
```