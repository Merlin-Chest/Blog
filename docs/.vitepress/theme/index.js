import DefaultTheme from 'vitepress/theme'
import RunCode from './plugins/run-code/RunCode.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('RunCode', RunCode)
  }
}
