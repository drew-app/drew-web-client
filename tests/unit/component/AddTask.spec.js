import { mount } from '@vue/test-utils'
import AddTask from '@/components/AddTask.vue'

describe('AddTask.vue', () => {
  let store
  let wrapper
  let titleInput

  function mountWrapper (
    done = () => {},
    props = {},
    expectedPayload = { task: { title: 'Some Title', focused: false }, tags: [] }
  ) {
    store = {
      dispatch: jest.fn((action, payload) => {
        expect(action).toEqual('tasks/addTask')
        expect(payload).toEqual(expectedPayload)
        done()
      })
    }

    wrapper = mount(AddTask, { mocks: { $store: store }, propsData: props })

    titleInput = wrapper.find('input[name="task-input"]')
  }

  function submitNewTask (inputValue = 'Some Title') {
    titleInput.setValue(inputValue)
    wrapper.find('form').trigger('submit')
  }

  describe('submitting new task', () => {
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
    it('dispatches the addTask action with the provided title and tags', (done) => {
      mountWrapper(done,
        {},
        { task: { title: 'Some Title', focused: false }, tags: ['tagName1', 'tagName2'] }
      )

      submitNewTask('Some Title #tagName1 #tagName2')

      expect(store.dispatch).toHaveBeenCalled()
    })
  })

  describe('included newTaskContext in payload', () => {
    it('should include the focused value', (done) => {
      mountWrapper(done,
        { newTaskContext: { focused: true } },
        { task: { title: 'Some Title', focused: true }, tags: [] }
      )

      submitNewTask()

      expect(store.dispatch).toHaveBeenCalled()
    })

    it('should include the tag', (done) => {
      mountWrapper(done,
        { newTaskContext: { tag: 'home' } },
        { task: { title: 'Some Title', focused: false }, tags: ['home'] }
      )

      submitNewTask()

      expect(store.dispatch).toHaveBeenCalled()
    })

    it('should not double a tag', (done) => {
      mountWrapper(done,
        { newTaskContext: { tag: 'home' } },
        { task: { title: 'Some Title', focused: false }, tags: ['home'] }
      )

      submitNewTask('Some Title #home')

      expect(store.dispatch).toHaveBeenCalled()
    })
  })
})
