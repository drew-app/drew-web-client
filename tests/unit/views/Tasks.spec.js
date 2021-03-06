import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Tasks from '@/views/Tasks.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Tasks.vue', () => {
  let store
  let wrapper
  let route

  let stubs = {
    state: {
      search: {}
    },
    actions: {
      loadAll: jest.fn()
    },
    getters: {
      search: () => 'Tasks!'
    },
    mutations: {
      filterDone: jest.fn(),
      filterFocused: jest.fn(),
      disableFilterFocused: jest.fn(),
      filterTagName: jest.fn()
    }
  }

  const mountWrapper = (
    storeOverrides = {},
    route = { matched: [{ path: '/' }, { path: '/tasks' }] }
  ) => {
    store = new Vuex.Store({ modules: { tasks: { ...stubs, ...storeOverrides, namespaced: true } } })

    wrapper = shallowMount(Tasks, {
      store,
      localVue,
      mocks: {
        $route: route
      },
      stubs: {
        'add-task': {
          name: 'add-task',
          template: '<div class="add-task-stub">{{newTaskContextAsJson}}</div>',
          props: ['newTaskContext'],
          computed: {
            newTaskContextAsJson () { return JSON.stringify(this.newTaskContext) }
          }
        },
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

      expect(stubs.actions.loadAll).toHaveBeenCalled()
    })
  })

  describe('tasks', () => {
    it('should render a task-list with the search results', () => {
      mountWrapper()

      const taskList = wrapper.find('.task-list-stub')
      expect(taskList.text()).toEqual('Tasks!')
    })
  })

  describe('showDone', () => {
    it('should mirror the filter state', () => {
      mountWrapper({ state: { search: { includeDone: true } } })

      expect(wrapper.find('#tasks__show-done').element.checked).toBe(true)
    })

    it('should commit the filterDone mutation', () => {
      mountWrapper()
      wrapper.find('#tasks__show-done').trigger('click')

      expect(stubs.mutations.filterDone).toHaveBeenCalled()
    })
  })

  describe('focused', () => {
    it('should mirror the filter state', () => {
      mountWrapper({ state: { search: { focused: true } } })

      expect(wrapper.find('#tasks__focus-focused').element.checked).toBe(true)
    })

    it('should commit the filterFocused mutation when enabled', () => {
      mountWrapper()
      wrapper.find('#tasks__focus-focused').trigger('click')

      expect(stubs.mutations.filterFocused).toHaveBeenCalled()
    })

    it('should comit the disableFilterFocused mutation when disabled', () => {
      mountWrapper({ state: { search: { focused: true } } })
      wrapper.find('#tasks__focus-focused').trigger('click')

      expect(stubs.mutations.disableFilterFocused).toHaveBeenCalled()
    })
  })

  describe('tagFilter', () => {
    it('should show the clear tag filter button if filter is applied', () => {
      mountWrapper({ state: { search: { tagName: 'home' } } })

      expect(wrapper.find('.clear-tag-filter').exists()).toBe(true)
    })

    it('should hide the clear tag filter button if filter is applied', () => {
      mountWrapper()

      expect(wrapper.find('.clear-tag-filter').exists()).toBe(false)
    })

    it('should commit the filterTagName mutation', () => {
      mountWrapper({ state: { search: { tagName: 'home' } } })

      wrapper.find('.clear-tag-filter').trigger('click')

      expect(stubs.mutations.filterTagName).toHaveBeenCalled()
    })
  })

  describe('showDetails', () => {
    it('should hide the details if there is no sub-route matched', () => {
      mountWrapper()

      expect(wrapper.find('#tasks__details').exists()).toBe(false)
    })

    it('should show the details with a sub route', () => {
      route = { matched: [{ path: '/' }, { path: '/tasks' }, { path: '/tasks/:id' }] }
      mountWrapper({}, route)

      expect(wrapper.find('#tasks__details').exists()).toBe(true)
    })
  })

  describe('newTaskContext', () => {
    const checkNewTaskContext = (obj) =>
      expect(wrapper.find('.add-task-stub').text()).toEqual(JSON.stringify(obj))

    it('should be empty if no context is applied', () => {
      mountWrapper({ state: { search: { focused: null, tagName: null } } })

      checkNewTaskContext({})
    })

    it('should include focused: true if focused', () => {
      mountWrapper({ state: { search: { focused: true, tagName: null } } })

      checkNewTaskContext({ focused: true })
    })

    it('should include the tagName if one is selected', () => {
      mountWrapper({ state: { search: { focused: null, tagName: 'home' } } })

      checkNewTaskContext({ tag: 'home' })
    })

    it('should include both if both are set', () => {
      mountWrapper({ state: { search: { focused: true, tagName: 'phone' } } })

      checkNewTaskContext({ focused: true, tag: 'phone' })
    })
  })
})
