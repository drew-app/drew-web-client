import { createLocalVue } from '@vue/test-utils'
import tasks from '@/store/tasks'
import { buildTask, buildTasks } from '../../factories/task-factory'
import { keyBy } from 'lodash'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

function buildStore (taskObjs = []) {
  const store = new Vuex.Store({
    modules: { tasks },
    strict: true
  })
  store.replaceState({ tasks: { all: keyBy(taskObjs, 'id') } })
  return store
}

describe('tasks store', () => {
  let store
  describe('getters', () => {
    describe('all', () => {
      let tasks

      beforeEach(() => {
        tasks = buildTasks(4)
        store = buildStore(tasks)
      })

      it('should return all tasks', () => {
        const subject = store.getters['tasks/all']

        expect(subject).toEqual(tasks)
        expect(subject.length).toEqual(4)
      })
    })

    describe('find', () => {
      let task
      let tasks

      beforeEach(() => {
        task = buildTask()

        tasks = buildTasks(3)
        tasks.push(task)
        tasks.concat(buildTasks(3))

        store = buildStore(tasks)
      })

      it('should return the task by id', () => {
        const subject = store.getters['tasks/find'](task.id)

        expect(subject).toEqual(task)
      })
    })

    describe('todo', () => {
      const undoneTasks = buildTasks(3)
      const doneTasks = buildTasks(2, { done: true })
      const tasks = undoneTasks.concat(doneTasks)

      beforeEach(() => {
        store = buildStore(tasks)
      })

      it('should return tasks that are undone', () => {
        const subject = store.getters['tasks/todo']

        expect(subject.length).toEqual(3)

        const ids = subject.map((task) => task.id)
        const expectedIds = undoneTasks.map((task) => task.id)

        expect(ids).toEqual(expect.arrayContaining(expectedIds))
      })
    })
  })

  describe('mutations', () => {
    describe('loadAll', () => {
      let loadedTasks

      beforeEach(() => {
        loadedTasks = buildTasks(4)
      })

      it('with default state', () => {
        store = buildStore()
        store.commit('tasks/loadAll', loadedTasks)

        expect(store.state.tasks.all).toEqual(keyBy(loadedTasks, 'id'))
      })

      it('with stale tasks', () => {
        store = buildStore(buildTasks(3))
        store.commit('tasks/loadAll', loadedTasks)

        expect(store.state.tasks.all).toEqual(keyBy(loadedTasks, 'id'))
      })
    })

    describe('loadTask', () => {
      let loadedTask

      beforeEach(() => {
        loadedTask = buildTask({ id: 5, title: 'Updated from server' })
      })

      it('with default state', () => {
        store = buildStore()
        store.commit('tasks/loadTask', loadedTask)

        expect(store.state.tasks.all[loadedTask.id]).toEqual(loadedTask)
      })

      it('replacing existing task', () => {
        const existingTask = buildTask({ id: 5, title: 'Old and busted' })
        store = buildStore([existingTask])
        store.commit('tasks/loadTask', loadedTask)

        const subject = store.getters['tasks/find'](5)

        expect(subject.title).toEqual('Updated from server')
      })

      it('should update the getters', () => {
        const someTasks = buildTasks(3)
        store = buildStore(someTasks)
        store.commit('tasks/loadTask', loadedTask)

        const subject = store.getters['tasks/all']

        expect(subject.length).toEqual(4)
      })
    })

    describe('updateTask', () => {
      let taskToBeUpdated

      beforeEach(() => {
        taskToBeUpdated = buildTask({ id: 1, title: 'Foo task' })
        store = buildStore([taskToBeUpdated])
      })

      it('should change the done flag', () => {
        store.commit('tasks/updateTask', { id: 1, done: true })

        let updatedTask = store.state.tasks.all[1]

        // Updated attributes
        expect(updatedTask.done).toEqual(true)

        // Unchanged Attributes
        expect(updatedTask.title).toEqual('Foo task')
        expect(updatedTask.id).toEqual(1)
      })

      it('should change the title', () => {
        store.commit('tasks/updateTask', { id: 1, title: 'Bar task' })

        let updatedTask = store.state.tasks.all[1]

        expect(updatedTask.title).toEqual('Bar task')
      })

      it('should change the started flag', () => {
        store.commit('tasks/updateTask', { id: 1, started: true })

        let updatedTask = store.state.tasks.all[1]

        expect(updatedTask.started).toEqual(true)
      })
    })
  })

  describe('actions', () => {
    describe('loadAll', () => {
      it('should commit the loadAll mutation with the tasks', (done) => {
        const taskList = buildTasks(4)

        const $axios = {
          get: jest.fn((resource) => {
            expect(resource).toEqual('tasks')

            return new Promise((resolve, reject) => resolve({ data: taskList }))
          })
        }

        tasks.mutations.loadAll = jest.fn((_, tasks) => {
          expect(tasks).toEqual(taskList)
          done()
        })
        store = buildStore()
        store.$axios = $axios

        store.dispatch('tasks/loadAll')
      })
    })

    describe('loadTask', () => {
      it('should commit the load mutation with the task', (done) => {
        const task = buildTask({ id: 5 })
        const $axios = {
          get: jest.fn((resource) => {
            expect(resource).toEqual('tasks/5')

            return new Promise((resolve, reject) => resolve({ data: task }))
          })
        }

        tasks.mutations.loadTask = jest.fn((_, payload) => {
          expect(payload).toEqual(payload)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('tasks/loadTask', 5)
      })
    })

    describe('addTask', () => {
      it('should commit the addTask mutation with the new task', (done) => {
        const taskTitle = 'Do something!'
        const apiResponse = buildTask({ title: taskTitle })
        const $axios = {
          post: jest.fn((resource, params) => {
            expect(resource).toEqual('tasks')
            expect(params).toEqual({ task: { title: taskTitle } })

            return new Promise((resolve, reject) => resolve({ data: apiResponse }))
          })
        }

        tasks.mutations.loadTask = jest.fn((_, payload) => {
          expect(payload).toEqual(apiResponse)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('tasks/addTask', { title: taskTitle })
      })
    })

    describe('updateTask', () => {
      it('should commit the updateTask mutation with the updated attributes', (done) => {
        let apiResponse = { id: 1, title: 'Foo task', done: true }

        const $axios = {
          put: jest.fn((resource, params) => {
            expect(resource).toEqual('tasks/1')
            expect(params).toEqual({ task: { done: true } })

            return new Promise((resolve, reject) => {
              resolve({ data: apiResponse })
            })
          })
        }

        tasks.mutations.updateTask = jest.fn((_, payload) => {
          expect(payload).toEqual(apiResponse)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('tasks/updateTask', { id: 1, updatedAttributes: { done: true } })
      })
    })
  })
})
