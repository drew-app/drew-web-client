import Vue from 'vue'
import Router from 'vue-router'
import AppHeader from './components/AppHeader'
import BackHeader from './components/BackHeader'
import Dashboard from './views/Dashboard.vue'
import Tasks from './views/Tasks.vue'
import Task from './views/Task.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      components: {
        header: AppHeader,
        main: Dashboard
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      components: {
        header: AppHeader,
        main: Tasks
      }
    },
    {
      path: '/tasks/:id',
      name: 'task',
      components: {
        header: BackHeader,
        main: Task
      },
      props: { main: true, header: false }
    }
  ]
})
