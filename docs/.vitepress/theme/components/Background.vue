<template>
  <div :class="containerClass">
    <Bulb></Bulb>
  </div>
</template>

<script setup>
import Bulb from './Bulb.vue'
import { useRoute } from 'vitepress'
import { ref, watch } from 'vue'

const router = useRoute();

const containerClass = ref(router.path === '/' ? 'container' : 'container filter')

watch(
  () => router.path,
  () => {
    if (router.path === '/') {
      containerClass.value = 'container'
    } else {
      containerClass.value = 'container filter'
    }
  },
)

</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.filter {
  filter: blur(40px);
  opacity: 80%;
}
</style>
