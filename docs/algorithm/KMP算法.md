# KMP算法

## 字符串匹配

### 暴力匹配

```java
public class ViolenceMatch {

	public static void main(String[] args) {
		String str1 = "ABCDSABABCDE";
		String str2 = "ABCDE";
		int res = violenceMatch(str1,str2);
		System.out.print(res);
	}

	public static int violenceMatch(String str1, String str2) {
		char[] s1 = str1.toCharArray();
		char[] s2 = str2.toCharArray();

		int s1Len = s1.length;
		int s2Len = s2.length;

		int i = 0;
		int j = 0;

		while (i < s1Len && j < s2Len) {
			if (s1[i] == s2[j]) {
//				匹配成功
				i++;
				j++;
			} else {
//				没有匹配成功
				i = i - (j-1);
				j = 0;
			}
		}
//		判断是否匹配成功
		if(j == s2Len) {
			return i -j;
		}else {
			return -1;
		}
	}
}
```

### KMP算法

```java
package com.merlin.kmp;

public class KMPAlgorithm {
	public static void main(String[] args) {
		String str1 = "BBC ABCDAB ABCDABCDABDE";
		String str2 = "ABCDABD";
		int res  = kmpSearch(str1,str2,kmpNext(str2));
		System.out.print(res);
	}
	
	//写出kmp搜索算法
	public static int kmpSearch(String str1,String str2,int[] next) {
		//遍历
		for(int i = 0 ,j = 0;i<str1.length();i++) {
			//需要处理str1.charAt(i) != str2.charAt(j),去调整j的大小
			//这也是KMP算法的核心点
			while(j>0 && str1.charAt(i) != str2.charAt(j)) {
				j = next[j-1];
			}
			if(str1.charAt(i) == str2.charAt(j)) {
				j++;
			}
			
			if(j == str2.length()) {
				return i-j+1;
			}
		}
		return -1;
	}
	
	//获取一个字符串的部分匹配值
	public static int[] kmpNext(String dest) {
		int[] next = new int[dest.length()];
		next[0] = 0; //如果dest是长度为1，部分匹配值就是0
		for(int i = 1,j = 0;i<dest.length();i++) {
			//当dest.charAt(i) != dest.cahrAt(j)时，需要从next[j-1]获取新的j
			//直到我们发现有 dest.charAt(i) == dest.cahrAt(j)成立才退出
			//这是KMP算法的核心点
			while(j>0 && dest.charAt(i)!=dest.charAt(j)) {
				j = next[j-1];
			}
			//当dest.charAt(i) == dest.charAt(j)满足是，部分匹配值+1
			if(dest.charAt(i) == dest.charAt(j)) {
				j++;
			} 
			next[i] = j;
		}
		return next;
	}
}
```

