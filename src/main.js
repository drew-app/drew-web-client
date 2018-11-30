import Vue from 'vue'
import DrewApp from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import './assets/stylesheets/main.styl'

import Filters from './plugins/filters-plugin'
import Icons from './plugins/icons-plugin'
import Auth from './plugins/auth-plugin'
import VueMq from 'vue-mq'

import './base-component-import'

Vue.use(Filters)
Vue.use(Icons)
Vue.use(Auth)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    desktop: Infinity
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(DrewApp)
}).$mount('#drew-app')
