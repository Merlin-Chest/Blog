# LRU缓存机制
### LRU 缓存淘汰算法

计算机的缓存容量有限，如果缓存满了就要删除一些内容，给新内容腾位置。但问题是，删除哪些内容呢？我们肯定希望删掉哪些没什么用的缓存，而把有用的数据继续留在缓存里，方便之后继续使用。**那么，什么样的数据，我们判定为「有用的」的数据呢？**

`LRU 缓存淘汰算法`是一种常用策略。LRU 的全称是 Least Recently Used，也就是说我们认为最近使用过的数据应该是是「有用的」，很久都没用过的数据应该是无用的，内存满了就优先删那些很久没用过的数据。

LRU 缓存算法的核心数据结构就是哈希链表，双向链表和哈希表的结合体。

![](https://raw.githubusercontent.com/Merlin218/image-storage/master/picGo/202201141549456.png)

### LRU 算法设计

手动实现`LRU算法`

```java
class Node {
	// 记录哈希表的key和value
	public int key,val;
	// 记录前后结点
	public Node next,prev;
	public Node(int k,int v){
		this.key = k;
		this.val = v;
	}
}

class DoubleList{
	// 头尾虚拟结点
	private Node Head,tail;
	// 链表元素数
	private int size;
	
	public DoubleList(){
		// 初始化双向链表
		head = new Node(0.0);
		tail = new Node(0.0);
		head.next = tail;
		tail.next = head;
		size = 0;
	}
	
	// 在链表尾部添加结点x,时间O(1)
	public void addNode(){
		x.prev = tail.prev;
		x.next = tail;
		tail.prev.next =x;
		tail.prev = x;
		size++;
	}
	
	// 删除链表中的x结点（x结点一定存在）
	// 由于是双链表且给的是目标Node结点，时间O(1)
	public void remove(Node x){
		x.prev.next = x.next;
		x.next.prev = x.prev;
		size--;
	}
	
	// 删除链表中第一个节点，并返回该结点，时间O(1)
	public Node removeFirst(){
		if(head.next == tail){
			return null;
		}
		Node first = head.next;
		remove(first);
		return first;
	}
	
	public int size(){
		return size;
	}
}

```
>**我们实现的双链表 API 只能从尾部插入，也就是说靠尾部的数据是最近使用的，靠头部的数据是最久为使用的**。

结合`哈希表`实现`LRU算法`，对于`get`和`put`的方法，应该避免直接对哈希表和双向链表进行操作。我们可以在这**两种数据结构之上**提供一层`抽象API`

```java
class LRUCache{
	// key => Node(key,val)
	private HashMap<Integer, Node> map;
	// 双向链表
	private DoubleList cache;
	// 最大容量
	private int cap;
	
	public LRUCache(int capacity){
		this.cap = capacity;
		map = new HashMap<>();
		cache = new DoubleList();
	}
	
	// 抽象API
	// 将某个key提升为最近使用的
	private void makeRecently(int key){
		Node x = map.get(key);
		// 先从链表中删除这个节点
    	cache.remove(x);
    	// 重新插到队尾
    	cache.addLast(x);
	}
	
	// 添加最近使用的元素
	private void addRecently(int key, int val){
		Node x = new Node(key,val);
		// 链表尾部就是最近使用的元素
    	cache.addLast(x);
    	// 别忘了在 map 中添加 key 的映射
    	map.put(key, x);
	}
	
	// 删除某个key
	private void deleteKey(int key){
		Node x = map.get(key);
		// 从链表中删除
   	 	cache.remove(x);
    	// 从 map 中删除
    	map.remove(key);
	}
	
	// 删除最久未使用的元素
	private void removeLeastRecently(){
		Node deleteNode = cache.removeFirst();
		int deleteKey = deleteNode.key;
		map.remove(deleteKey);
	}
	
	// 公用方法
	public void get(int key){
		// 元素不存在
		if(!map.containsKey(key){
			return -1;
		}
		// 提升为最近使用的
		makeRecently(key);
		return map.get(key).val;
	}
	
	public int put(int key, int val){
		// 已经存在
		if(map.containsKey(key)){
			deletekey(key);
			addRecently(key,val);
			return;
		}
		// 已经达到最大容量
		if(cap == cache.size()){
			removeLeastRecently();
		}
		addRecently(key, val);
	}
}
```

## 使用Java内置`LinkedHashMap`

```java
class LRUCache {
    private int cap;
    private LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>();
    public LRUCache(int capacity) {
        cap = capacity;
    }
    
    public int get(int key) {
        // 如果不存在
        if(!cache.containsKey(key)){
            return -1;
        }
        // 提升为最近使用
        makeRecently(key);
        return cache.get(key);
    }
    
    public void put(int key, int value) {
        // 存在这个key
        if(cache.containsKey(key)){
            // 更新这个key
            cache.put(key,value);
            // 提升为最近使用
            makeRecently(key);
            return;
        }
        // 达到最大容量
        if(cache.size()>=this.cap){
            int oldKey = cache.keySet().iterator().next();
            cache.remove(oldKey);
        }
        cache.put(key,value);
    }
    // 提升为最近使用
    private void makeRecently(int key) {
        // 获取key
        int val = cache.get(key);
        // 移除这个key
        cache.remove(key);
        // 重新插入这个key
        cache.put(key, val);
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
```