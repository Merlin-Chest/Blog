# bytedance-016.最短移动距离

## 题目描述

给定一棵 n 个节点树。节点 1 为树的根节点，对于所有其他节点 i，它们的父节点编号为 floor(i/2) (i 除以 2 的整数部分)。在每个节点 i 上有 a[i] 个房间。此外树上所有边均是边长为 1 的无向边。
树上一共有 m 只松鼠，第 j 只松鼠的初始位置为 b[j]，它们需要通过树边各自找到一个独立的房间。请为所有松鼠规划一个移动方案，使得所有松鼠的总移动距离最短。

格式：


输入：
- 输入共有三行。
- 第一行包含两个正整数 n 和 m，表示树的节点数和松鼠的个数。
- 第二行包含 n 个自然数，其中第 i 个数表示节点 i 的房间数 a[i]。
- 第三行包含 m 个正整数，其中第 j 个数表示松鼠 j 的初始位置 b[j]。
输出：
- 输出一个数，表示 m 只松鼠各自找到独立房间的最短总移动距离。
示例：


输入：
     5 4
     0 0 4 1 1
     5 4 2 2
输出：4
解释：前两只松鼠不需要移动，后两只松鼠需要经节点 1 移动到节点 3
提示：

对于 30% 的数据，满足 n,m <=100。
对于 50% 的数据，满足 n,m <=1000。
对于所有数据，满足 n,m<=100000，0<=a[i]<=m, 1<=b[j]<=n。

## 思路分析

1.  > 这道题考察了什么思想？你的思路是什么？
    
2.  > 做题的时候是不是一次通过的，遇到了什么问题，需要注意什么细节？
    
3.  > 有几种解法，哪种解法时间复杂度最低，哪种解法空间复杂度最低，最优解法是什么？其他人的题解是什么，谁的效率更好一些？用不同语言实现的话，哪个语言速度最快？
    

## AC 代码

参考代码

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxn = 0x7f7f7f7f;
int a[500500];// 房间
int ans;
int n, m;
int lca; // 最近公共祖先
pair<int, int> f[500500];// 结点i到其子树中房屋的最短距离及编号
int dir[500500];// 标记路径方向
pair<int, int> now; // 当前最近有房屋的结点信息
int cal(int x, int y) {
    return x * y < 0 ? -1 : 1; //判断当前路径方向
}

void update(int x) {
    if(a[x]) { // 当前结点x有房间
        f[x] = make_pair(0, x);// 则最小距离为零
    }
    else {
        f[x] = make_pair(maxn, maxn); // 否则在初始化时初始化为极大值
    }
    int y = x * 2; //左孩子
    if(y <= n && f[y].first + cal(dir[y], 1) < f[x].first) {
        f[x] = make_pair(f[y].first + cal(dir[y], 1), f[y].second);//  更新当前结点最新值
    }
    if(++y <= n && f[y].first + cal(dir[y], 1) < f[x].first) {
        f[x] = make_pair(f[y].first + cal(dir[y], 1), f[y].second);//  更新当前结点最新值
    }
}

void query(int x, int w) {
    if(f[x].first + w < now.first){ // 维护最短路径
        lca = x; now = make_pair(f[x].first + w, f[x].second);
    }// 更新松鼠位置和最近房屋位置的最近公共祖先
    if(x != 1) {// 标记路径方向决定更新方式
        query(x / 2, w + cal(dir[x],-1)); //判断其父节点是否更优, 
    }// 若更优将其父亲更新为新的 lca
}

void shang(int x) {// 当前松鼠选择上面的房屋
    update(x);// 为了防止更上面的松鼠绕远到更下面的房屋
    if(x == lca) return;// 交换两个松鼠的选择
    dir[x]--;//即 标记路径方向
    shang(x / 2);// 更新他的父亲 直到当前 lca 为止
}

void xia(int x) {
    update(x);// 当前松鼠选择了 lca 下面的房屋
    if(x == lca) return;// 为防止下个松鼠绕远到前一个松鼠下面
    dir[x]++;// 交换两个松鼠的选择
    xia(x / 2);//利用 标记路径方向维护两个松鼠的最小路径和
}

int main() {
    cin>> n >> m;
    for(int i = 1; i <= n; i++){
        cin >> a[i];// 录入房屋信息
    }
    for(int i = n; i >= 1; i--) {
        update(i); // 初始化当前结点到最近房间距离以及房间编号
    }//             从下往上更新
    for(int i = 1; i <= m; i++) {
        int x;
        cin >> x;// 读入一个松鼠的位置
        now = make_pair(maxn, maxn);
        query(x, 0); // 根据松鼠位置找最近房屋, 赋值给now
        ans += now.first; // 将now中的最短距离计入ans中
        shang(x);
        a[now.second]--; // 当前now标记的结点位置, 房屋数量 - 1
        xia(now.second);
        for(; x; x >>= 1) {// 由于减少了房屋
            update(x); // 更新其祖先节点的值
        }
    }
    cout << ans << endl;
    // system("pause");
    return 0;
}
```

## 总结

> 如果你还有更多的思考、分析、总结，通通都加上来吧~
