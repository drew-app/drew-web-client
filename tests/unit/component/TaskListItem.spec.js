import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TaskListItem from '@/components/TaskListItem'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('TaskListItem.vue', () => {
  describe('template', () => {
    it('should render an li with the task title', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: false }
        }
      })
      expect(wrapper.find('li.task-list-item').exists()).toBe(true)
      expect(wrapper.text()).toContain('A task')
    })

    it('should apply the done class if it is done', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: true }
        }
      })
      expect(wrapper.find('li.task-list-item.done').exists()).toBe(true)
    })
  })

  describe('Mark done', () => {
    it('should send the updateTask action with the data for the task when the done button is clicked', () => {
      const actions = {
        updateTask: jest.fn()
      }
      const store = new Vuex.Store({
        modules: {
          tasks: {
            namespaced: true,
            state: {},
            actions: actions
          }
        }
      })
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        store,
        propsData: {
          task: { id: 1, title: 'A task', done: false }
        }
      })

      wrapper.find('button.mark-done').trigger('click')

      expect(actions.updateTask).toHaveBeenCalled()

      const payload = actions.updateTask.mock.calls[0][1]

      expect(payload.id).toEqual(1)
      expect(payload.updatedAttributes).toEqual({ done: true })
    })
  })
})
