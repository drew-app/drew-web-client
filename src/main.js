import Vue from 'vue'
import DrewApp from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(DrewApp)
}).$mount('#drew-app')
