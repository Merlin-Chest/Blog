# BFS算法基础

### BFS 的核心思想

把一些问题抽象成图，从一个点开始，向四周开始扩散。一般来说，我们写 BFS 算法都是用「队列」这种数据结构，每次将一个节点周围的所有节点加入队列。

BFS 相对 DFS 的最主要的区别是：**BFS 找到的路径一定是最短的，但代价就是空间复杂度可能比 DFS 大很多**。

### 算法框架

```java
// 计算从起点 start 到终点 target 的最近距离
int BFS(Node start, Node target) {
    Queue<Node> q; // 核心数据结构
    Set<Node> visited; // 避免走回头路
    
    q.offer(start); // 将起点加入队列
    visited.add(start);
    int step = 0; // 记录扩散的步数

    while (q not empty) {
        int sz = q.size();
        /* 将当前队列中的所有节点向四周扩散 */
        for (int i = 0; i < sz; i++) {
            Node cur = q.poll();
            /* 划重点：这里判断是否到达终点 */
            if (cur is target)
                return step;
            /* 将 cur 的相邻节点加入队列 */
            for (Node x : cur.adj()) {
                if (x not in visited) {
                    q.offer(x);
                    visited.add(x);
                }
            }
        }
        /* 划重点：更新步数在这里 */
        step++;
    }
}

```

### 二叉树的最小深度

```java
class Solution {
    public int minDepth(TreeNode root) {
        if(root == null){
            return 0;
        }

        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int dep = 1;

        while(!q.isEmpty()){
            // 将q中所有结点都取出
            int sz = q.size();
            for(int i = 0; i < sz; i++){
                // 取出当前结点
                TreeNode cur = q.poll();
                // 判断结点的临近结点
                if(cur.left == null && cur.right == null){
                    return dep;
                }
                // 将左右结点加入队列中
                if(cur.left != null){
                    q.offer(cur.left);
                }
                if(cur.right != null){
                    q.offer(cur.right);
                }
            }
            // 深度加1
            dep++;
        }
        return dep;
    }
}
```

 BFS 的逻辑，`depth` 每增加一次，队列中的所有节点都向前迈一步，这保证了第一次到达终点的时候，走的步数是最少的。可以在不遍历完整棵树的条件下找到最短距离的。
 
 形象点说，DFS 是线，BFS 是面；DFS 是单打独斗，BFS 是集体行动。
 
 > BFS 可以找到最短距离，但是空间复杂度高，而 DFS 的空间复杂度较低。
 > 
 > 假设是满二叉树，节点数为 `N`：
 > 
 > - 对于 DFS 算法来说，空间复杂度无非就是递归堆栈，最坏情况下顶多就是树的高度，也就是 `O(logN)`。
 > 
 > - 对于BFS 算法，队列中每次都会储存着二叉树一层的节点，这样的话最坏情况下空间复杂度应该是树的最底层节点的数量，也就是 `N/2`，用 Big O 表示的话也就是 `O(N)`。

一般来说在找最短路径的时候使用 BFS，其他时候还是 DFS 使用得多一些（主要是递归代码好写）。

### 解开密码锁的最少次数

```java
class Solution {
    // 向上拨动一格
    public String plusOne(String s,int j){
        char[] ch = s.toCharArray();
        if(ch[j] == '9'){
            ch[j] = '0';
        }else{
            ch[j] += 1;
        }
        return new String(ch);
    }
    // 向下拨动一格
    public String minusOne(String s,int j){
        char[] ch = s.toCharArray();
        if(ch[j] == '0'){
            ch[j] = '9';
        }else{
            ch[j] -= 1;
        }
        return new String(ch);
    }

    public int openLock(String[] deadends, String target) {
        // 记录穷举过的密码和死亡密码，因为我们在遍历过程中遇到死亡密码需要跳过
        // 我们可以直接加入visited，这样子遍历过程中就不会把死亡密码加入到队列中
        Set<String> visited = new HashSet<>();
        for(String s:deadends) visited.add(s);
        // 如果死亡密码包含初始密码，直接返回-1
        if(visited.contains("0000"))return -1;
        Queue<String> q = new LinkedList<>();
        q.offer("0000");
        visited.add("0000");
        int step = 0;

        while(!q.isEmpty()){
            // 遍历当前所有q中元素
            int sz = q.size();
            for(int i = 0; i < sz; i++){
                // 取出当前的密码
                String cur = q.poll();
                // 判断密码的正确性
                if(cur.equals(target)){
                    return step;
                }
                // 遍历相邻的密码（8个），如果没有穷举过，加入队列
                for(int j = 0; j < 4; j++){
                    String up = plusOne(cur, j);
                    if(!visited.contains(up)){
                        q.offer(up);
                        visited.add(up);
                    }
                    String down = minusOne(cur, j);
                    if(!visited.contains(down)){
                        q.offer(down);
                        visited.add(down);
                    }
                }
            }
            // 增加步长
            step++;
        }
        return -1;
    }
}
```

### 双向BFS

**传统的 BFS 框架就是从起点开始向四周扩散，遇到终点时停止；而双向 BFS 则是从起点和终点同时开始扩散，当两边有交集的时候停止**。

**不过，双向 BFS 也有局限，因为你必须知道终点在哪里**。比如我们刚才讨论的二叉树最小高度的问题，你一开始根本就不知道终点在哪里，也就无法使用双向 BFS；但是第二个密码锁的问题，是可以使用双向 BFS 算法来提高效率的，代码稍加修改即可。

双向 BFS 还是遵循 BFS 算法框架的，只是**不再使用队列，而是使用 HashSet 方便快速判断两个集合是否有交集**。

另外的一个技巧点就是 **while 循环的最后交换 `q1` 和 `q2` 的内容**，所以只要默认扩散 `q1` 就相当于轮流扩散 `q1` 和 `q2`。

```java
int openLock(String[] deadends, String target) {
    Set<String> deads = new HashSet<>();
    for (String s : deadends) deads.add(s);
    // 用集合不用队列，可以快速判断元素是否存在
    Set<String> q1 = new HashSet<>();
    Set<String> q2 = new HashSet<>();
    Set<String> visited = new HashSet<>();
    
    int step = 0;
    q1.add("0000");
    q2.add(target);
    
    while (!q1.isEmpty() && !q2.isEmpty()) {
        // 哈希集合在遍历的过程中不能修改，用 temp 存储扩散结果
        Set<String> temp = new HashSet<>();

        /* 将 q1 中的所有节点向周围扩散 */
        for (String cur : q1) {
            /* 判断是否到达终点 */
            if (deads.contains(cur))
                continue;
            if (q2.contains(cur))
                return step;
            visited.add(cur);

            /* 将一个节点的未遍历相邻节点加入集合 */
            for (int j = 0; j < 4; j++) {
                String up = plusOne(cur, j);
                if (!visited.contains(up))
                    temp.add(up);
                String down = minusOne(cur, j);
                if (!visited.contains(down))
                    temp.add(down);
            }
        }
        /* 在这里增加步数 */
        step++;
        // temp 相当于 q1
        // 这里交换 q1 q2，下一轮 while 就是扩散 q2
        q1 = q2;
        q2 = temp;
    }
    return -1;
}
```