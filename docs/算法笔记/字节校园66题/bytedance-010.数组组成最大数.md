# bytedance-006.夏季特惠

给定一组非负整数，重新排列它们的顺序使之组成一个最大的整数。

示例 1：


输入：[10,1,2]
输出：2110
示例 2：


输入：[3,30,34,5,9]
输出：9534330

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.next();
        str = str.substring(1,str.length() - 1);
        String[] arr = str.split(",");
        // 以上处理数据
        quickSort(arr,0,arr.length - 1);
        // 以下拼接数据
        StringBuffer ans = new StringBuffer();
        for(String s:arr){
            ans.append(s);
        }
        System.out.print(ans.toString());
    }
    public static void quickSort(String[] arr, int l, int r){
        if(r <= l) return;
        int i = l, j = r;
        // 以第一个值作为基准值
        String p = arr[l];
        while(i < j){
        // 这里一定要右边先走，才能保证后续交换基准值的左右两边的值分别小于和大于基准值
            while(i < j && (arr[j] + p).compareTo(p + arr[j]) <= 0 ) j--;
            while(i < j && (arr[i] + p).compareTo(p + arr[i]) >= 0) i++;
            String tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        // i,j停下的位置，与基准值互换
        arr[l] = arr[i];
        arr[i] = p;
        quickSort(arr,l, j - 1);
        quickSort(arr,j + 1, r);
    }
}
```

![](https://pic2.zhimg.com/80/v2-eab38abd2d918c9a476c9aee650866fd_720w.jpg)