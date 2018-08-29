import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import Tasks from '@/views/Tasks.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Tasks.vue', () => {
  let taskActions
  let taskGetters
  let store
  let wrapper

  beforeEach(() => {
    taskActions = {
      loadAll: jest.fn()
    }
    taskGetters = {
      todo: () => 'todoTasks',
      all: () => 'allTasks'
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
    wrapper = shallowMount(Tasks, {
      store,
      localVue,
      stubs: {
        'add-task': true,
        'router-view': true,
        'task-list': {
          name: 'task-list',
          template: '<div class="task-list-stub">{{tasks}}</div>',
          props: ['tasks']
        }
      }
    })
  })

  describe('created', () => {
    it('should trigger the tasks/loadAll action', () => {
      expect(taskActions.loadAll).toHaveBeenCalled()
    })
  })

  it('should render a task-list with the todo tasks', () => {
    const taskList = wrapper.find('.task-list-stub')
    expect(taskList.text()).toEqual('todoTasks')
  })

  it('should render a task-list with all the tasks if showDone is checked', () => {
    wrapper.find('#show-done').trigger('click')

    const taskList = wrapper.find('.task-list-stub')
    expect(taskList.text()).toEqual('allTasks')
  })
})
