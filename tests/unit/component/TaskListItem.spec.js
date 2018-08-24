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
      expect(wrapper.classes()).toContain('done')
    })

    it('should hide the action buttons if it is done', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: true }
        }
      })

      expect(wrapper.find('.actions').exists()).toBe(false)
    })

    it('should apply the start class if it has been started', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: false }
        }
      })

      wrapper.setData({ started: true })

      expect(wrapper.classes()).toContain('started')
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

  describe('Start', () => {
    it('should flag the task started when the start button is clicked', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: false }
        }
      })

      wrapper.find('button.start').trigger('click')

      expect(wrapper.classes()).toContain('started')
    })
  })

  describe('Stop', () => {
    it('should remove the started flag when the stop button is clicked', () => {
      const wrapper = shallowMount(TaskListItem, {
        localVue,
        propsData: {
          task: { id: 1, title: 'A task', done: false }
        }
      })
      wrapper.setData({ started: true })

      wrapper.find('button.stop').trigger('click')

      expect(wrapper.classes()).not.toContain('started')
    })
  })
})
