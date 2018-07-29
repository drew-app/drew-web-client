import { mount } from '@vue/test-utils'
import AddTask from '@/components/AddTask.vue'

describe('AddTask.vue', () => {
  it('dispatches the addTask action with the provided title', (done) => {
    const $store = {
      dispatch: jest.fn((action, payload) => {
        expect(action).toEqual('tasks/addTask')
        expect(payload).toEqual({ title: 'Some Title' })
        done()
      })
    }

    const wrapper = mount(AddTask, {mocks: { $store }})

    wrapper.find('#tasks--add-task-task-title').setValue('Some Title')
    wrapper.find('#tasks--add-task').trigger('submit')

    expect($store.dispatch).toHaveBeenCalled()
  })
})
