<template>
  <div style="display:flex;flex-flow:column nowrap;">
    <div class="container">
      <codemirror style="overflow:hidden;height:300px;flex:1;margin-right:20px;" v-model="editableCode"
        placeholder="Edit code here..." :autofocus="true" :indent-with-tab="true" :tabSize="4"
        :extensions="extensions" />
      <div class="btn__container">
        <button class="button" style="margin-bottom:10px;" @click="reset">重置</button>
        <button class="button" @click="exec">执行</button>
      </div>
      <p class="warn">{{ warnText }}</p>
    </div>
    <iframe v-if="type === 'html'" id="subApp" ref="subApp" class="html__view"></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { html_decode } from './utils/html-transform.js'
import { Codemirror } from "vue-codemirror";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const props = defineProps({
  type: {
    type: String,
    default: 'js'
  },
})


const isHtml = () => {
  return props.type === 'html';
}

const extensions = [props.type === 'js' ? javascript() : html(), oneDark];

const getContent = () => {
  const instance = getCurrentInstance();
  return instance.slots.default()[0].children;
}

const original = getContent();
const editableCode = ref(original)
const warnText = ref('');

const reset = () => {
  editableCode.value = html_decode(original);
}

const subApp = ref(null)

const execJs = async () => {
  await new Function(editableCode.value)();
  warnText.value = 'Tip: 你可在控制台看到代码输出！';
};

const removeFrameContent = () => {
  const document = subApp.value.contentWindow.document;
  if (!document) return;
  const content = document.querySelector('#content');
  if (content) {
    content.remove();
  }
  const style = document.querySelector('style');
  if (style) {
    style.remove();
  }
}

const execHtml = () => {
  removeFrameContent();
  const document = subApp.value.contentWindow.document;
  if (!document) return;
  const value = editableCode.value;
  const head = document.querySelector('head');
  const style = document.createElement('style');
  style.textContent = value.match(/\<style\>.*\<\/style\>/g)?.join('')?.replace(/\<style\>/g, '').replace(/\<\/style\>/g, '');
  head.appendChild(style);
  document.body.innerHTML = value.replace(/\<style\>.*\<\/style\>/g, '').replace(/\<head\>.*\<\/head\>/g, '');
  warnText.value = 'Tip: 你可在下方看到预览效果！';
}

onMounted(() => {
  if (isHtml()) {
    execHtml();
  }
})

const exec = async () => {
  try {
    if (props.type === 'js' || props.type === 'javascript') {
      await execJs()
    } else if (props.type === 'html') {
      execHtml()
    }
  } catch (e) {
    warnText.value = e;
    throw new Error(e)
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

.html__view {
  width: 100%;
  height: 300px;
  border: 1px solid #eee;
  border-radius: 10px;
}
</style>
