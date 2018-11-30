import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Task from '@/views/Task.vue'
import { buildTask } from '../../factories/task-factory'

import Icons from '@/plugins/icons-plugin.js'
import tasks from '@/store/tasks.js'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Icons)

describe('Task.vue', () => {
  let loadTaskMock
  let updateTaskMock
  let wrapper

  const id = 1234
  const task = buildTask({ id: id, title: 'The title' })

  beforeEach(() => {
    localVue.filter('date-format', (date) => date)

    loadTaskMock = jest.fn()
    updateTaskMock = jest.fn()
    tasks.actions = {
      loadTask: loadTaskMock,
      updateTask: updateTaskMock
    }
    tasks.state = { all: { [id]: task } }

    const store = new Vuex.Store({ modules: { tasks } })

    wrapper = mount(Task, {
      store,
      localVue,
      propsData: { id },
      stubs: {
        'd-icon': true
      }
    })
  })

  describe('created', () => {
    it('should trigger the tasks/loadTask action', () => {
      expect(loadTaskMock).toHaveBeenCalled()
      expect(loadTaskMock.mock.calls[0][1]).toEqual(id)
    })
  })

  describe('computed', () => {
    describe('task', () => {
      it('should find the task', () => {
        expect(wrapper.find('#task__details h2').text()).toEqual(task.title)
        expect(wrapper.find('#task__loading-indicator').exists()).toBe(false)
      })

      it('should show a loading screen if the task is missing', () => {
        wrapper.vm.$store.replaceState({ tasks: { all: {} } })

        expect(wrapper.find('#task__loading-indicator').exists()).toBe(true)
        expect(wrapper.find('#task__details').exists()).toBe(false)
      })
    })
  })

  describe('edit mode', () => {
    it('should default the edit mode off', () => {
      expect(wrapper.find('#task__edit-form').exists()).toBe(false)
      expect(wrapper.find('#task__details').exists()).toBe(true)
    })

    describe('edit mode open', () => {
      let editForm
      let titleField

      beforeEach(() => {
        wrapper.find('#task__edit').trigger('click')
        titleField = wrapper.find("#task__edit-form input[name='title']")
        editForm = wrapper.find('form#task__edit-form')
      })

      it('should show the edit mode if you click the edit button', () => {
        expect(editForm.exists()).toBe(true)
        expect(wrapper.find('#task__details').exists()).toBe(false)
      })

      it('should automatically focus the title field', () => {
        expect(wrapper.contains('input[name="title"]:focus')).toBe(true)
      })

      it('should load the data from the model into the form', () => {
        expect(titleField.element.value).toEqual(task.title)
      })

      it('should not change the base object when updating the title without a mutation', () => {
        titleField.setValue('The new title')

        expect(task.title).toEqual('The title')
      })

      it('should submit an update action upon submit', () => {
        titleField.setValue('The new title')
        editForm.trigger('submit')

        expect(updateTaskMock).toHaveBeenCalled()
        expect(updateTaskMock.mock.calls[0][1]).toEqual({ id: 1234, updatedAttributes: { title: 'The new title' } })
      })

      it('should close the form upon submit', () => {
        titleField.setValue('The new title')
        editForm.trigger('submit')

        expect(wrapper.find('#task__edit-form').exists()).toBe(false)
        expect(wrapper.find('#task__details').exists()).toBe(true)
      })
    })
  })
})
