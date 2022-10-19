<template>
  <div class="wire"></div>
  <div class="bulb">
    <span></span>
    <span></span>
  </div>
</template>

<script setup>

</script>

<style scoped>
.bulb {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: rgb(251, 251, 217);
  position: absolute;
  top: 400px;
  right: 20vw;
  box-shadow: 0 0 50px #fff,
    0 0 100px #fff,
    0 0 350px rgba(255, 255, 255, 0.86),
    0 0 600px rgb(251, 251, 217),
    0 0 1000px rgba(208, 208, 76, 0.51);
}

.dark .bulb {
  background-color: #fff;
  box-shadow: 0 0 50px #fff,
    0 0 100px #fff,
    0 0 250px #fff,
    0 0 1000px rgba(249, 249, 98, 0.321);
}


.bulb::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.656);
  border-radius: 50%;
  filter: blur(40px);
}

.dark .bulb::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 50%;
  filter: blur(40px);
}

.bulb::before {
  content: '';
  width: 80px;
  height: 200px;
  position: absolute;
  left: 60px;
  top: -100px;
  border-top: #444 solid 60px;
  border-radius: 30px;
  background-color: rgb(251, 251, 217);
}

.dark .bulb::before {
  background-color: #fff;
}

.bulb span:nth-child(1) {
  background-color: transparent;
  position: absolute;
  top: -28px;
  left: 16px;
  transform: rotate(344deg);
  width: 50px;
  height: 50px;
  border-bottom-right-radius: 100%;
  box-shadow: 30px 30px 0 15px rgb(251, 251, 217);
}

.bulb span:nth-child(2) {
  background-color: transparent;
  position: absolute;
  top: -28px;
  right: 16px;
  transform: rotate(16deg);
  width: 50px;
  height: 50px;
  border-bottom-left-radius: 100%;
  box-shadow: -30px 30px 0 15px rgb(251, 251, 217);
}

.dark .bulb span:nth-child(1) {
  box-shadow: 30px 30px 0 15px #fff;
}


.dark .bulb span:nth-child(2) {
  box-shadow: -30px 30px 0 15px #fff;
}

.wire {
  width: 3px;
  height: 50vh;
  background-color: #44444488;
  position: absolute;
  right: calc(20vw + 98.5px);
}
</style>
