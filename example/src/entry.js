import Vue from 'vue'
import ZarmVue from 'zarm-vue'
import App from './app.vue'
import 'zarm-vue/zarm-vue.default.css'

Vue.use(ZarmVue);

new Vue({
  el: '#app',
  render: h => h(App)
})