import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Tasks from './views/Tasks.vue'
import Task from './views/Task.vue'
import Layout from './views/Layout.vue'

import { authService } from './plugins/auth-plugin'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { unsecured: true }
    },
    {
      path: '/auth_callback',
      name: 'auth callback',
      beforeEnter: (to, from, next) => {
        authService.handleAuthentication()
      },
      meta: { unsecured: true }
    },
    {
      path: '/',
      component: Layout,
      children: [
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
    }
  ]
})

router.beforeEach(function (to, from, next) {
  if (to.meta.unsecured || authService.isAuthenticated()) {
    next()
  } else {
    next('/login')
  }
})

export default router
