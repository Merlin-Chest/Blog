class EventBus {
  constructor() {
    this.namespaceCache = {};
    this.offlineStack = {};
    // eslint-disable-next-line no-constructor-return
    return {
      create: this.create.bind(this),
      ...this.create('defalut'),
    };
  }

  create(namespace) {
    if (!this.namespaceCache[namespace]) {
      this.namespaceCache[namespace] = {};
      this.offlineStack[namespace] = [];
    }
    return {
      listen: this.listen.bind(
        this,
        namespace,
      ),
      triggle: this.triggle.bind(
        this,
        namespace,
      ),
      remove: this.remove.bind(
        this,
        namespace,
      ),
    };
  }

  listen(namespace, key, fn) {
    const namespaceMap = this.namespaceCache[namespace];
    if (!namespaceMap[key]) {
      namespaceMap[key] = new Set();
    }
    namespaceMap[key].add(fn);
    if (this.offlineStack[namespace].length > 0) {
      this.offlineStack[namespace].forEach((offlineKey) => {
        this.triggle(namespace, offlineKey);
      });
      this.offlineStack[namespace] = [];
    }
  }

  triggle(namespace, key) {
    const namespaceMap = this.namespaceCache[namespace];
    if (!namespaceMap[key]) {
      this.offlineStack[namespace].push(key);
      return;
    }
    namespaceMap[key].forEach((fn) => fn());
  }

  remove(namespace, key, fn) {
    const namespaceMap = this.namespaceCache[namespace];
    if (!namespaceMap[key]) {
      return;
    }
    if (fn) {
      namespaceMap[key].delete(fn);
    }
    namespaceMap[namespace] = new Set();
  }
}

const eventBus = new EventBus();
const test1 = eventBus.create('test1');
const test2 = eventBus.create('test2');

eventBus.triggle('key1');
test1.triggle('key1');
test2.triggle('key1');

eventBus.listen('key1', () => {
  console.log('test:', 0);
});

const fn = () => {
  console.log('test:', 1);
};

test1.listen('key1', fn);

test2.listen('key1', () => {
  console.log('test:', 2);
});

test1.remove('key1', fn);

eventBus.triggle('key1');
test1.triggle('key1');
test2.triggle('key1');
