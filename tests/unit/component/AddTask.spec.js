import { mount } from '@vue/test-utils'
import AddTask from '@/components/AddTask.vue'

describe('AddTask.vue', () => {
  let store
  let wrapper
  let titleInput

  describe('submitting new task', () => {
    function mountWrapper (done = () => {}) {
      store = {
        dispatch: jest.fn((action, payload) => {
          expect(action).toEqual('tasks/addTask')
          expect(payload).toEqual({ task: { title: 'Some Title' }, tags: [] })
          done()
        })
      }

      wrapper = mount(AddTask, { mocks: { $store: store } })

      titleInput = wrapper.find('input[name="task-input"]')
    }

    function submitNewTask () {
      titleInput.setValue('Some Title')
      wrapper.find('form').trigger('submit')
    }

    it('dispatches the addTask action with the provided title', (done) => {
      mountWrapper(done)

      submitNewTask()

      expect(store.dispatch).toHaveBeenCalled()
    })

    it('clears the input upon submission', () => {
      mountWrapper()

      submitNewTask()

      expect(titleInput.element.value).toEqual('')
    })

    it('focuses the the new title field even if you click the action div', () => {
      mountWrapper()

      wrapper.trigger('click')

      expect(wrapper.contains('input[name="task-input"]:focus')).toBe(true)
    })
  })

  describe('submitting a new task with tags', () => {
    function mountWrapper (done = () => {}) {
      store = {
        dispatch: jest.fn((action, payload) => {
          expect(action).toEqual('tasks/addTask')
          expect(payload).toEqual({ task: { title: 'Some Title' }, tags: ['tagName1', 'tagName2'] })
          done()
        })
      }

      wrapper = mount(AddTask, { mocks: { $store: store } })
      titleInput = wrapper.find('input[name="task-input"]')
    }

    function submitNewTask () {
      titleInput.setValue('Some Title #tagName1 #tagName2')
      wrapper.find('form').trigger('submit')
    }

    it('dispatches the addTask action with the provided title and tags', (done) => {
      mountWrapper(done)

      submitNewTask()

      expect(store.dispatch).toHaveBeenCalled()
    })
  })
})
