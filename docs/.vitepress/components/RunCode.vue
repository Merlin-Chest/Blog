<template>
  <div class="container">
    <textarea class="code__textarea" v-model="editableCode" placeholder="edit your code!" />
    <div class="btn__container">
      <button class="button" style="margin-bottom:10px;" @click="reset">重置</button>
      <button class="button" @click="exec">执行</button>
    </div>
    <p v-if="type === 'js' || type === 'javascript'" class="warn">{{ warnText }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineComponent, getCurrentInstance } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'js'
  },
})

const original = getCurrentInstance().slots.default()[0].children;
const editableCode = ref(original)
const warnText = ref('Tip: 你可在控制台看到代码输出！');

const reset = () => {
  editableCode.value = original;
}

const exec = () => {
  try {
    if (props.type === 'js' || props.type === 'javascript') {
      eval(editableCode.value);
      warnText.value = '';
    } else {
      warnText.value = '暂不支持' + props.type + '语言！';
      return;
    }
  } catch (e) {
    warnText.value = e;
  }
}

</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 30px 10px;
  position: relative;
}

.code__textarea {
  width: 85%;
  height: 200px;
  border: 1px solid #eee;
  font-size: 14px;
  padding: 10px;
  border-radius: 4px;
}

.button {
  border: 1px solid #eee;
  padding: 8px 10px;
  border-radius: 10px;
}

.button:hover {
  background-color: rgba(165, 165, 165, 0.511);
}

.tip {
  font-size: 12px;
  position: absolute;
  bottom: -16px;
  left: 30px;
}

.warn {
  font-size: 12px;
  position: absolute;
  bottom: -16px;
  right: 90px;
  color: rgba(154, 154, 154, 0.7)
}

.btn__container {
  display: flex;
  flex-flow: column nowrap;
}

.html__view {}
</style>
