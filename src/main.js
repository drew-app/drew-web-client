import Vue from 'vue'
import DrewApp from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import './assets/stylesheets/main.styl'

import Filters from './plugins/filters-plugin'
import Icons from './plugins/icons-plugin'
import Auth from './plugins/auth-plugin'

Vue.use(Filters)
Vue.use(Icons)
Vue.use(Auth)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(DrewApp)
}).$mount('#drew-app')
