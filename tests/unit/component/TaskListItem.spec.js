import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TaskListItem from '@/components/TaskListItem'
import { buildTask, resetTaskFactorySequence } from '../../factories/task-factory'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('TaskListItem.vue', () => {
  let store
  let router
  let taskStubs

  beforeEach(() => {
    router = { push: jest.fn() }
    taskStubs = {
      namespaced: true,
      state: {},
      actions: {
        updateTask: jest.fn()
      },
      mutations: {
        filterTagName: jest.fn()
      }
    }

    store = new Vuex.Store({
      modules: {
        tasks: taskStubs
      }
    })
  })

  afterEach(() => {
    resetTaskFactorySequence()
  })

  function createWrapper (taskProps) {
    return shallowMount(TaskListItem, {
      localVue,
      store,
      mocks: {
        $router: router
      },
      stubs: {
        'd-icon': true
      },
      propsData: { task: buildTask(taskProps) }
    })
  }

  describe('template', () => {
    it('should render an li with the task title', () => {
      const wrapper = createWrapper({ title: 'A task' })

      expect(wrapper.find('li.task-list-item').exists()).toBe(true)
      expect(wrapper.text()).toContain('A task')
    })

    it('should apply the done class if it is done', () => {
      const wrapper = createWrapper({ done: true })

      expect(wrapper.classes()).toContain('done')
    })

    it('should hide the action buttons if it is done', () => {
      const wrapper = createWrapper({ done: true })

      expect(wrapper.find('.actions').exists()).toBe(false)
    })

    it('should apply the focus class if it has been focused', () => {
      const wrapper = createWrapper({ focused: true })

      expect(wrapper.classes()).toContain('focused')
    })

    it('should apply the tagged class if it has tags', () => {
      const wrapper = createWrapper({ tags: [{ name: 'tagName1' }] })

      expect(wrapper.classes()).toContain('tagged')
    })

    it('should render a .tag for each tag', () => {
      const wrapper = createWrapper({ tags: [{ name: 'tagName1' }, { name: 'tagName2' }] })

      expect(wrapper.find('.tag[data-tag-name=\'tagName1\']').exists()).toBe(true)
      expect(wrapper.find('.tag[data-tag-name=\'tagName2\']').exists()).toBe(true)
    })
  })

  describe('Open details', () => {
    it('should navigate to the task page if clicked', () => {
      const wrapper = createWrapper({ id: 5 })

      wrapper.find('li.task-list-item').trigger('click')

      expect(router.push).toHaveBeenCalled()

      const payload = router.push.mock.calls[0][0]

      expect(payload.path).toEqual('/tasks/5')
    })
  })

  function verifyUpdate (updateAttrs) {
    expect(taskStubs.actions.updateTask).toHaveBeenCalled()

    const payload = taskStubs.actions.updateTask.mock.calls[0][1]

    expect(payload.id).toEqual(1)
    expect(payload.updatedAttributes).toEqual(updateAttrs)
  }

  describe('Mark done', () => {
    it('should send the updateTask action with {done: true} for the task when the done button is clicked', () => {
      const wrapper = createWrapper()

      wrapper.find('button.mark-done').trigger('click')

      verifyUpdate({ done: true })
    })
  })

  describe('markFocused', () => {
    it('should send the updateTask action with {focused: true} for the task when the done button is clicked', () => {
      const wrapper = createWrapper()

      wrapper.find('button.focus').trigger('click')

      verifyUpdate({ focused: true })
    })
  })

  describe('markUnfocused', () => {
    it('should remove the focused flag when the unfocus button is clicked', () => {
      const wrapper = createWrapper({ focused: true })

      wrapper.find('button.unfocus').trigger('click')

      verifyUpdate({ focused: false })
    })
  })

  describe('Filter by Tag', () => {
    it('should commit the filterTagName mutation with the tag name', () => {
      const wrapper = createWrapper({ tags: [{ id: 1, name: 'Home' }] })

      wrapper.find('.tag').trigger('click')

      expect(taskStubs.mutations.filterTagName).toHaveBeenCalled()

      const payload = taskStubs.mutations.filterTagName.mock.calls[0][1]

      expect(payload).toEqual('Home')
    })
  })
})
