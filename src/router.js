import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Login from './views/Login'
import Tasks from './views/Tasks'
import Task from './views/Task'
import Layout from './views/Layout'
import Trackers from './views/Trackers'
import TrackerNew from './views/TrackerNew'
import Tracker from './views/Tracker'

import { authService } from './plugins/auth-plugin'

Vue.use(Router)

const showPropFunc = (route) => ({ id: parseInt(route.params.id) })

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
        { path: '/', name: 'dashboard', component: Dashboard },
        {
          path: '/tasks',
          name: 'tasks',
          component: Tasks,
          children: [
            { path: ':id', name: 'task', component: Task, props: showPropFunc }
          ]
        },
        { path: '/trackers', name: 'trackers', component: Trackers },
        { path: '/trackers/new', name: 'trackers-new', component: TrackerNew },
        { path: '/trackers/:id', name: 'tracker', component: Tracker, props: showPropFunc }
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
