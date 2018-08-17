import {shallowMount, createLocalVue} from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'

const localVue = createLocalVue()

describe('TaskList.vue', () => {
  const taskList = [
    {id: 1, title: 'Task 1', done: false},
    {id: 2, title: 'Task 2', done: false},
    {id: 3, title: 'Task 3', done: false},
    {id: 4, title: 'Task 4', done: true}
  ]
  describe('template', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(TaskList, {
        localVue,
        stubs: {
          'task-list-item': {
            name: 'task-list-item',
            template: '<div class="task-list-item">{{task.id}}</div>',
            props: ['task']
          }
        },
        propsData: {
          tasks: taskList
        }
      })
    })

    it('should render the children tasks', () => {
      const taskListItems = wrapper.findAll('.task-list-item')
      expect(taskListItems.length).toEqual(4)

      const sourceTaskIds = taskList.map((task) => { return task.id.toString() })
      const renderedTaskIds = taskListItems.wrappers.map((task) => { return task.text() })

      expect(renderedTaskIds).toEqual(expect.arrayContaining(sourceTaskIds))
      expect(renderedTaskIds).toHaveLength(sourceTaskIds.length)
    })
  })
})
