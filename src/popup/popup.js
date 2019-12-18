import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import Element from 'element-ui'




global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser
Vue.use(Element)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  beforeCreate () {
    this.$store.commit('initialiseStore')
  },
  render: h => h(App)
})
