<template>
  <div ref="xmind"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: String(Date.now())
  }
})

const xmind = ref(null)

onMounted(() => {

  const viewer = new XMindEmbedViewer({
    el: xmind.value,
  })
  // const url = new URL(props.src, window.location.href)
  fetch(props.src)
    // import(props.src)
    // import(url.href)
    .then(res => {
      return res.arrayBuffer()
    })
    .then(file => {
      return viewer.load(file)
    })

  viewer.addEventListener('map-ready', () => {
    viewer.setZoomScale(60);
    viewer.setStyles({
      'width': '100%',
    })
  })
})
</script>

<style scoped>

</style>
