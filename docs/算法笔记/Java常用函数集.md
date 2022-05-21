# Java常用函数集
```java
import java.util.*;
public class Main{
	public static void main(String[] args){
		Scanner sc = new Scanner(System.in);
		
	}
}
```

### Integer

`Integer_MAX_VALUE`
`Integer_MIN_VALUE`

## 字符

- `Character.isDigit`是否是数字
- `Character.isLetter`是否是字母
- `Character.isLowerCase`是否是小写字母
- `Character.isUpperCase`是否是大写字母
- `Character.getNumericValue`char字符转化为数字 （char - '0'也可以）

## 字符串(String)

- `new String(内容，开始索引，长度)`内容可以是byte数组，StringBuffer，StringBuilder，char数组，string
- `str.substring`截取值字符串
- `str.charAt`取字符串第几个字符
- `str.length`取字符串的长度
- `str.toCharArray`转化为字符数组
- `str.concat`连接，或者字符串直接相加

## StringBuffer

- `str.append(ch)`在尾部添加一个字符
- `toString()`转化为字符串

## Queue队列

`new LinkedList<>()`初始化
`add()`添加某个值
`poll()`移除并返回该值

## Deque双端队列

`new LinkedList<>()`初始化
-   将元素添加到队尾或队首：`addLast()`/`offerLast()`/`addFirst()`/`offerFirst()`；
-   从队首／队尾获取元素并删除：`removeFirst()`/`pollFirst()`/`removeLast()`/`pollLast()`；
-   从队首／队尾获取元素但不删除：`getFirst()`/`peekFirst()`/`getLast()`/`peekLast()`；
-   总是调用`xxxFirst()`/`xxxLast()`以便与`Queue`的方法区分开；
-   避免把`null`添加到队列。

## ArrayList

`new ArrayList<>()`初始化
`add()`添加某个值
`get()`根据下标获取某个值
`size()`数组长度
`Collections.reverse(xxx)`反转数组

## Arrays

`Arrays.copyOf()`复制生成新数组，第一个参数接收原数组，第二个参数接收数组长度，长度超过原数组则保留数组默认值
`Arrays.sort(arr)`数组排序，默认从小到大
`Arrays.sort(int[] a, int fromIndex, int toIndex)`还可以进行部分排序
`Arrays.sort(int[] a, int fromIndex, int toIndex, Comparator<? super T> )`自定义比较

## Stack

- `Stack<Type> stack = new Stack<>();`
- `pop()`
- `push()`
- `size()`

## Set

- `add` 返回布尔值