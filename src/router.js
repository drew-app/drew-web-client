import Vue from 'vue'
import Router from 'vue-router'
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
      component: Dashboard
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      children: [
        {
          path: ':id',
          name: 'task',
          component: Task,
          props: (route) => ({ id: parseInt(route.params.id) })
        }
      ]
    }
  ]
})
