import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Tasks from '@/views/Tasks.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Tasks.vue', () => {
  let taskActions
  let taskGetters
  let store
  let wrapper
  let route

  beforeEach(() => {
    taskActions = {
      loadAll: jest.fn()
    }
    taskGetters = {
      search: () => (options) => Object.keys(options).map((key) => `${key}:${options[key]}`).join(',')
    }
    store = new Vuex.Store({
      modules: {
        tasks: {
          namespaced: true,
          state: {},
          actions: taskActions,
          getters: taskGetters
        }
      }
    })
    route = {
      matched: [{ path: '/tasks' }]
    }
  })

  const mountWrapper = () => {
    wrapper = shallowMount(Tasks, {
      store,
      localVue,
      mocks: {
        $route: route
      },
      stubs: {
        'add-task': true,
        'router-view': true,
        'd-icon': true,
        'task-list': {
          name: 'task-list',
          template: '<div class="task-list-stub">{{tasks}}</div>',
          props: ['tasks']
        }
      }
    })
  }

  describe('created', () => {
    it('should trigger the tasks/loadAll action', () => {
      mountWrapper()

      expect(taskActions.loadAll).toHaveBeenCalled()
    })
  })

  describe('tasks', () => {
    it('should render a task-list with the todo tasks', () => {
      mountWrapper()

      const taskList = wrapper.find('.task-list-stub')
      expect(taskList.text()).toEqual('includeDone:false')
    })

    it('should render a task-list with all the tasks if showDone is checked', () => {
      mountWrapper()
      wrapper.find('#tasks__show-done').trigger('click')

      const taskList = wrapper.find('.task-list-stub')
      expect(taskList.text()).toEqual('includeDone:true')
    })

    it('should render a task-list with just the started tasks if focusStarted is checked', () => {
      mountWrapper()
      wrapper.find('#tasks__focus-started').trigger('click')

      const taskList = wrapper.find('.task-list-stub')
      expect(taskList.text()).toEqual('includeDone:false,started:true')
    })
  })

  describe('showDetails', () => {
    it('should hide the details if there is no sub-route matched', () => {
      mountWrapper()
      expect(wrapper.find('#tasks__details').exists()).toBe(false)
    })

    it('should show the details with a sub route', () => {
      route = {matched: [{path: '/'}, {path: '/tasks'}, {path: '/tasks/:id'}]}
      mountWrapper()

      expect(wrapper.find('#tasks__details').exists()).toBe(true)
    })
  })
})
