import { mount } from '@vue/test-utils'
import AddTask from '@/components/AddTask.vue'

describe('AddTask.vue', () => {
  describe('submitting new task', () => {
    let store
    let wrapper
    let titleInput
    let scrollMock

    function mountWrapper (done = () => {}) {
      store = {
        dispatch: jest.fn((action, payload) => {
          expect(action).toEqual('tasks/addTask')
          expect(payload).toEqual({ title: 'Some Title' })
          done()
        })
      }

      wrapper = mount(AddTask, { mocks: { $store: store } })

      scrollMock = jest.fn()
      wrapper.vm.$el.scrollIntoView = scrollMock

      titleInput = wrapper.find('input[name="task_title"]')
    }

    function submitNewTask () {
      titleInput.setValue('Some Title')
      wrapper.find('form').trigger('submit')
    }

    function addNewTask (done = () => {}) {
      mountWrapper(done)
      submitNewTask()
    }

    it('dispatches the addTask action with the provided title', (done) => {
      addNewTask(done)

      expect(store.dispatch).toHaveBeenCalled()
    })

    it('clears the input upon submission', () => {
      addNewTask()

      expect(titleInput.element.value).toEqual('')
    })

    it('focuses the the new title field even if you click the action div', () => {
      mountWrapper()

      wrapper.trigger('click')

      expect(wrapper.contains('input[name="task_title"]:focus')).toBe(true)
    })
  })
})
