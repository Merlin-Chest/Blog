<template>
  <div class='container'>
    <!-- <div id="cursor" :style="'top:' + pos.top + 'px;left:' + pos.left + 'px'"></div> -->
    <div class="shapes">
      <div class='shape' :style="cssStyles[0]"></div>
      <div class='shape' :style="cssStyles[1]"></div>
      <div class='shape' :style="cssStyles[2]"></div>
    </div>
    <div class="content">
      <div class='word'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, onBeforeUnmount } from 'vue';
const pos = reactive({
  top: 0,
  left: 0
});

function mousemoveCb(evt: MouseEvent) {
  pos.left = evt.clientX;
  pos.top = evt.clientY;
}
onMounted(() => addEventListener('mousemove', mousemoveCb))
onBeforeUnmount(() => removeEventListener('mousemove', mousemoveCb))

// 生成三个遮罩层的样式
const cssArgs: [string, number][] = [['#005ffe', 450], ['#ffe5e3', 320], ['#ffcc57', 180]]
const cssStyles = computed(() => cssArgs.map(([color, size], index) => ({
  background: color,
  width: size + 'px',
  height: size + 'px',
  transform: `translate(${pos.left}px, ${pos.top}px)`,
  transition: `transform ${(2 - index) * 0.1}s`,
  margin: `-${size / 2}px 0 0 -${size / 2}px`
})))
</script>

<style scoped>
* {
  margin: 0
}

.container {
  /* 隐藏鼠标 */
  cursor: default;
  overflow: visible;
}

#cursor {
  position: fixed;
  background: #2128bd;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border-radius: 50%;
  will-change: transform;
  user-select: none;
  pointer-events: none;
  z-index: 10000;
}

.shapes {
  position: relative;
  width: 100vw;
  min-height: 60vh;
  max-height: 80vh;
  background: #2128bd;
  overflow: hidden;
}

.shape {
  will-change: transform;
  position: absolute;
  border-radius: 50%;
}

.word {
  line-height: 130px;
  font-size: 130px;
  color: #000;
  margin: 0;
  text-align: center;
  font-family: system-ui;
  font-weight: 900;
}


@media only screen and (max-width: 600px) {
  .word {
    font-size: 90px;
    line-height: 90px;
  }
}

.content {
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  max-height: 80vh;
  width: 100vw;
  background: #fff;
  mix-blend-mode: screen;
  padding: 20px;
}

::selection {
  color: #fff;
  background: #2128bd;
}
</style>
