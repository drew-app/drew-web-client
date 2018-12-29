import Vue from 'vue'
import Vuex from 'vuex'
import tasks from './store/tasks'
import user from './store/user'
import tags from './store/tags'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { tasks, user, tags }
})

store.$axios = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
})

export default store
