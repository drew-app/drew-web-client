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

    describe('focused', () => {
      let focusedTasks
      let unfocusedTasks
      let doneTasks

      beforeEach(() => {
        focusedTasks = buildTasks(4, { focused: true })
        unfocusedTasks = buildTasks(5, { focused: false })
        doneTasks = buildTasks(6, { done: true, focused: true })
        store = buildStore([...focusedTasks, ...unfocusedTasks, ...doneTasks])
      })

      it('should return only the focused undone tasks', () => {
        const subject = store.getters['tasks/focused']

        expect(subject).toContainExactly(focusedTasks)
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
      const taggedTasks = buildTasks(2, { done: false, focused: false, tags: [{ id: 1, name: 'home' }] })
      const untaggedTasks = buildTasks(3, { done: false, focused: false, tags: [] })
      const undoneTasks = [...taggedTasks, ...untaggedTasks]
      const focusedTasks = buildTasks(4, { done: false, focused: true })
      const doneUnfocusedTasks = buildTasks(5, { done: true, focused: false })
      const doneFocusedTasks = buildTasks(6, { done: true, focused: true })
      const allTasks = [...undoneTasks, ...focusedTasks, ...doneUnfocusedTasks, ...doneFocusedTasks]

      function search (params) {
        store = buildStore(allTasks, params)
        return store.getters['tasks/search']
      }

      it('should return the undone and focused tasks by default', () => {
        const subject = search()

        expect(subject).toEqual([...focusedTasks, ...undoneTasks])
      })

      it('should return all the tasks if the includeDone flag is set true', () => {
        const subject = search({ includeDone: true })

        expect(subject).toContainExactly(allTasks)
      })

      it('should return undone and focused tasks if the focused field is set true', () => {
        const subject = search({ focused: true })

        expect(subject).toContainExactly(focusedTasks)
      })

      it('should return undone and unfocused if the focused field is set false', () => {
        const subject = search({ focused: false })

        expect(subject).toContainExactly(undoneTasks)
      })

      it('should return all focused tasks if the focused field is set true and the includeDone flag is set true', () => {
        const subject = search({ focused: true, includeDone: true })

        expect(subject).toContainExactly([...focusedTasks, ...doneFocusedTasks])
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

      it('should change the focused flag', () => {
        store.commit('tasks/updateTask', { id: 1, focused: true })

        let updatedTask = store.state.tasks.all[1]

        expect(updatedTask.focused).toEqual(true)
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

    describe('filterFocused', () => {
      it('should turn the focused flag on if off', () => {
        store = buildStore([], { focused: false })
        store.commit('tasks/filterFocused')

        expect(store.state.tasks.search.focused).toEqual(true)
      })

      it('should turn the focused flag off if on', () => {
        store = buildStore([], { focused: true })
        store.commit('tasks/filterFocused')

        expect(store.state.tasks.search.focused).toEqual(false)
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

    describe('disableFilterFocused', () => {
      it('should disable the focused filter', () => {
        store = buildStore([], { focused: true })
        store.commit('tasks/disableFilterFocused')

        expect(store.state.tasks.search.focused).toBe(null)

        store = buildStore({ focused: false })
        store.commit('tasks/disableFilterFocused')

        expect(store.state.tasks.search.focused).toEqual(null)
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
        const apiResponse = buildTask({ title: taskTitle, tags: [{ name: 'tagName1' }, { name: 'tagName2' }] })

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
            expect(params).toEqual({ tags: [], task: { done: true } })

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
