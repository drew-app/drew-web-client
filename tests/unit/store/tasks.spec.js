import { createLocalVue } from '@vue/test-utils'
import tasks, { TaskSearch } from '@/store/tasks'
import { buildTask, buildTasks } from '../../factories/task-factory'
import { keyBy } from 'lodash'
import Vuex from 'vuex'

require('../../matchers')

const localVue = createLocalVue()
localVue.use(Vuex)

function buildStore (taskObjs = [], searchOverride = {}) {
  const store = new Vuex.Store({
    modules: { tasks },
    strict: true
  })
  store.replaceState({
    tasks: {
      all: keyBy(taskObjs, 'id'),
      search: new TaskSearch(searchOverride)
    }
  })
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

    describe('started', () => {
      let startedTasks
      let unstartedTasks

      beforeEach(() => {
        startedTasks = buildTasks(4, { started: true })
        unstartedTasks = buildTasks(5, { started: false })
        store = buildStore([...startedTasks, ...unstartedTasks])
      })

      it('should return only the started tasks', () => {
        const subject = store.getters['tasks/started']

        expect(subject).toContainExactly(startedTasks)
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

    describe('search', () => {
      const taggedTasks = buildTasks(2, { done: false, started: false, tags: [{ id: 1, name: 'home' }] })
      const untaggedTasks = buildTasks(3, { done: false, started: false, tags: [] })
      const undoneTasks = [...taggedTasks, ...untaggedTasks]
      const startedTasks = buildTasks(4, { done: false, started: true })
      const doneUnstartedTasks = buildTasks(5, { done: true, started: false })
      const doneStartedTasks = buildTasks(6, { done: true, started: true })
      const allTasks = [...undoneTasks, ...startedTasks, ...doneUnstartedTasks, ...doneStartedTasks]

      function search (params) {
        store = buildStore(allTasks, params)
        return store.getters['tasks/search']
      }

      it('should return the undone and started tasks by default', () => {
        const subject = search()

        expect(subject).toContainExactly([...undoneTasks, ...startedTasks])
      })

      it('should return all the tasks if the includeDone flag is set true', () => {
        const subject = search({ includeDone: true })

        expect(subject).toContainExactly(allTasks)
      })

      it('should return undone and started tasks if the started field is set true', () => {
        const subject = search({ started: true })

        expect(subject).toContainExactly(startedTasks)
      })

      it('should return undone and unstarted if the started field is set false', () => {
        const subject = search({ started: false })

        expect(subject).toContainExactly(undoneTasks)
      })

      it('should return all started tasks if the started field is set true and the includeDone flag is set true', () => {
        const subject = search({ started: true, includeDone: true })

        expect(subject).toContainExactly([...startedTasks, ...doneStartedTasks])
      })

      it('should return all tasks with the correct tag by name', () => {
        const subject = search({ tagName: 'home' })

        expect(subject).toContainExactly(taggedTasks)
      })

      it('should return all tasks with the correct tag by name even if capitalized differently', () => {
        const subject = search({ tagName: 'Home' })

        expect(subject).toContainExactly(taggedTasks)
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

    describe('filterDone', () => {
      it('should turn the includeDone flag on if off', () => {
        store = buildStore([], { includeDone: false })
        store.commit('tasks/filterDone')

        expect(store.state.tasks.search.includeDone).toEqual(true)
      })

      it('should turn the includeDone flag off if on', () => {
        store = buildStore([], { includeDone: true })
        store.commit('tasks/filterDone')

        expect(store.state.tasks.search.includeDone).toEqual(false)
      })
    })

    describe('filterStarted', () => {
      it('should turn the started flag on if off', () => {
        store = buildStore([], { started: false })
        store.commit('tasks/filterStarted')

        expect(store.state.tasks.search.started).toEqual(true)
      })

      it('should turn the started flag off if on', () => {
        store = buildStore([], { started: true })
        store.commit('tasks/filterStarted')

        expect(store.state.tasks.search.started).toEqual(false)
      })
    })

    describe('filterTagName', () => {
      it('should apply the tagNameFilter', () => {
        store = buildStore()
        store.commit('tasks/filterTagName', 'home')

        expect(store.state.tasks.search.tagName).toEqual('home')
      })

      it('should remove the fitler if called without a value', () => {
        store = buildStore({ tagName: 'home' })
        store.commit('tasks/filterTagName')

        expect(store.state.tasks.search.tagName).toEqual(null)
      })
    })

    describe('disableFilterStarted', () => {
      it('should disable the started filter', () => {
        store = buildStore([], { started: true })
        store.commit('tasks/disableFilterStarted')

        expect(store.state.tasks.search.started).toBe(null)

        store = buildStore({ started: false })
        store.commit('tasks/disableFilterStarted')

        expect(store.state.tasks.search.started).toEqual(null)
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

        store.dispatch('tasks/addTask', { task: { title: taskTitle } })
      })

      it('should commit the addTask mutation with the new task with tags', (done) => {
        const taskTitle = 'Do something!'
        const tags = ['tagName1', 'tagName2']
        const apiResponse = buildTask({ title: taskTitle, tags: [{name: 'tagName1'}, {name: 'tagName2'}] })

        const $axios = {
          post: jest.fn((resource, params) => {
            expect(resource).toEqual('tasks')
            expect(params).toEqual({ task: { title: taskTitle }, tags: tags })

            return new Promise((resolve, reject) => resolve({ data: apiResponse }))
          })
        }

        tasks.mutations.loadTask = jest.fn((_, payload) => {
          expect(payload).toEqual(apiResponse)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('tasks/addTask', { task: { title: taskTitle }, tags: tags })
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
