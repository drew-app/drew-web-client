import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Dashboard from '@/views/Dashboard'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Dashboard.vue', () => {
  let store
  let wrapper

  let stubs = {
    actions: {
      loadAll: jest.fn()
    },
    getters: {
      started: () => 'Tasks!'
    }
  }

  const mountWrapper = (
    storeOverrides = {}
  ) => {
    store = new Vuex.Store({ modules: { tasks: {...stubs, ...storeOverrides, namespaced: true} } })

    wrapper = shallowMount(Dashboard, {
      store,
      localVue,
      stubs: {
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

      expect(stubs.actions.loadAll).toHaveBeenCalled()
    })
  })

  describe('tasks', () => {
    it('should render a task-list with the started tasks', () => {
      mountWrapper()

      const emptyMessage = wrapper.find('.empty')
      const taskList = wrapper.find('.task-list-stub')

      expect(emptyMessage.exists()).toBe(false)
      expect(taskList.text()).toEqual('Tasks!')
    })

    it('should render an empty message if there are no tasks', () => {
      mountWrapper({ getters: { started: () => [] } })

      const emptyMessage = wrapper.find('.empty')
      const taskList = wrapper.find('.task-list-stub')

      expect(emptyMessage.exists()).toBe(true)
      expect(taskList.exists()).toBe(false)
    })
  })
})
