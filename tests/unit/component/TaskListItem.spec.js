import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import TaskListItem from '@/components/TaskListItem'
import {buildTask, resetTaskFactorySequence} from '../../factories/task-factory'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('TaskListItem.vue', () => {
  let actions
  let store
  let router

  beforeEach(() => {
    router = {push: jest.fn()}
    actions = {updateTask: jest.fn()}

    store = new Vuex.Store({
      modules: {
        tasks: {
          namespaced: true,
          state: {},
          actions: actions
        }
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
      propsData: {task: buildTask(taskProps)}
    })
  }

  describe('template', () => {
    it('should render an li with the task title', () => {
      const wrapper = createWrapper({title: 'A task'})

      expect(wrapper.find('li.task-list-item').exists()).toBe(true)
      expect(wrapper.text()).toContain('A task')
    })

    it('should apply the done class if it is done', () => {
      const wrapper = createWrapper({done: true})

      expect(wrapper.classes()).toContain('done')
    })

    it('should hide the action buttons if it is done', () => {
      const wrapper = createWrapper({done: true})

      expect(wrapper.find('.actions').exists()).toBe(false)
    })

    it('should apply the start class if it has been started', () => {
      const wrapper = createWrapper({started: true})

      expect(wrapper.classes()).toContain('started')
    })
  })

  describe('Open details', () => {
    it('should navigate to the task page if clicked', () => {
      const wrapper = createWrapper({id: 5})

      wrapper.find('li.task-list-item').trigger('click')

      expect(router.push).toHaveBeenCalled()

      const payload = router.push.mock.calls[0][0]

      expect(payload.path).toEqual('/tasks/5')
    })
  })

  function verifyUpdate (updateAttrs) {
    expect(actions.updateTask).toHaveBeenCalled()

    const payload = actions.updateTask.mock.calls[0][1]

    expect(payload.id).toEqual(1)
    expect(payload.updatedAttributes).toEqual(updateAttrs)
  }

  describe('Mark done', () => {
    it('should send the updateTask action with {done: true} for the task when the done button is clicked', () => {
      const wrapper = createWrapper()

      wrapper.find('button.mark-done').trigger('click')

      verifyUpdate({done: true})
    })
  })

  describe('Start', () => {
    it('should send the updateTask action with {started: true} for the task when the done button is clicked', () => {
      const wrapper = createWrapper()

      wrapper.find('button.start').trigger('click')

      verifyUpdate({started: true})
    })
  })

  describe('Stop', () => {
    it('should remove the started flag when the stop button is clicked', () => {
      const wrapper = createWrapper({started: true})

      wrapper.find('button.stop').trigger('click')

      verifyUpdate({started: false})
    })
  })
})
