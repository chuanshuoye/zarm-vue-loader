import Vue from 'vue'
import zarmVue from 'zarm-vue'
import App from './app.vue'

import 'zarm-vue/zarm-vue.default.css'
Vue.use(zarmVue)
new Vue({
  el: '#app',
  render: h => h(App)
})