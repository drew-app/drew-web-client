import {state, mutations, getters, actions} from '@/store/tasks'
import {buildTask, buildTasks} from '../../factories/task-factory'
import {clone, merge} from 'lodash'

const defaultState = {...state}

describe('tasks store', () => {
  describe('getters', () => {
    describe('all', () => {
      const {all} = getters
      const tasks = buildTasks(4)

      let currentState
      beforeEach(() => {
        currentState = {...defaultState, all: tasks}
      })

      it('should return all tasks', () => {
        const subject = all(currentState)

        expect(subject).toEqual(tasks)
        expect(subject.length).toEqual(4)
      })
    })

    describe('find', () => {
      const {find} = getters

      const task = buildTask()

      const tasks = buildTasks(3)
      tasks.push(task)
      tasks.concat(buildTasks(3))

      const currentState = {...defaultState, all: tasks}

      it('should return the task by id', () => {
        const subject = find(currentState)(task.id)

        expect(subject).toEqual(task)
      })
    })

    describe('todo', () => {
      const {todo} = getters

      const undoneTasks = buildTasks(3)
      const doneTasks = buildTasks(2, {done: true})
      const tasks = undoneTasks.concat(doneTasks)

      let currentState
      beforeEach(() => {
        currentState = {...defaultState, all: tasks}
      })

      it('should return tasks that are undone', () => {
        const subject = todo(currentState)

        expect(subject.length).toEqual(3)

        const ids = subject.map((task) => task.id)
        const expectedIds = undoneTasks.map((task) => task.id)

        expect(ids).toEqual(expect.arrayContaining(expectedIds))
      })
    })
  })

  describe('mutations', () => {
    describe('loadAll', () => {
      const {loadAll} = mutations
      let currentState
      let loadedTasks

      beforeEach(() => {
        loadedTasks = buildTasks(4)
      })

      it('with default state', () => {
        currentState = {...defaultState}

        loadAll(currentState, loadedTasks)
        expect(currentState.all).toEqual(loadedTasks)
      })

      it('with stale tasks', () => {
        currentState = merge({}, defaultState, {all: [buildTasks(3)]})

        loadAll(currentState, loadedTasks)
        expect(currentState.all).toEqual(loadedTasks)
      })
    })

    describe('loadTask', () => {
      const {loadTask} = mutations
      let currentState
      let existingTask
      let loadedTask

      beforeEach(() => {
        loadedTask = buildTask({id: 5, title: 'Updated from server'})
      })

      it('with default state', () => {
        currentState = {...defaultState}

        loadTask(currentState, loadedTask)

        expect(currentState.all).toEqual([loadedTask])
      })

      it('replacing existing task', () => {
        existingTask = buildTask({id: 5, title: 'Old and busted'})
        currentState = merge({}, defaultState, {all: [existingTask]})

        loadTask(currentState, loadedTask)

        expect(currentState.all.find((task) => task.id === 5).title).toEqual('Updated from server')
      })
    })

    describe('addTask', () => {
      const {addTask} = mutations
      let currentState
      let savedTask

      beforeEach(() => {
        currentState = {...defaultState}
        savedTask = buildTask({id: 5, title: 'Foo task', done: false})
      })

      it('with default state', () => {
        addTask(currentState, savedTask)
        expect(currentState.all).toEqual([savedTask])
      })
    })

    describe('updateTask', () => {
      const {updateTask} = mutations
      let currentState
      let taskToBeUpdated = buildTask({id: 1, title: 'Foo task'})

      beforeEach(() => {
        currentState = {...defaultState, all: [clone(taskToBeUpdated)]}
      })

      it('should change the done flag', () => {
        updateTask(currentState, {id: 1, done: true})

        let updatedTask = currentState.all.find((task) => task.id === 1)
        // Updated attributes
        expect(updatedTask.done).toEqual(true)

        // Unchanged Attributes
        expect(updatedTask.title).toEqual('Foo task')
        expect(updatedTask.id).toEqual(1)
      })

      it('should change the title', () => {
        updateTask(currentState, {id: 1, title: 'Bar task'})

        let updatedTask = currentState.all.find((task) => task.id === 1)
        expect(updatedTask.title).toEqual('Bar task')
      })

      it('should change the started flag', () => {
        updateTask(currentState, {id: 1, started: true})

        let updatedTask = currentState.all.find((task) => task.id === 1)
        expect(updatedTask.started).toEqual(true)
      })
    })
  })

  describe('actions', () => {
    describe('loadAll', () => {
      const {loadAll} = actions
      const taskList = buildTasks(4)

      it('should commit the loadAll mutation with the tasks', (done) => {
        const apiPromise = new Promise((resolve, reject) => resolve({data: taskList}))

        const bindingContext = {
          $axios: {
            get: jest.fn((resource) => {
              expect(resource).toEqual('tasks')
              return apiPromise
            })
          }
        }

        const storeContext = {
          commit: jest.fn((mutation, payload) => {
            expect(mutation).toEqual('loadAll')
            expect(payload).toEqual(taskList)
            done()
          })
        }

        loadAll.call(bindingContext, storeContext)
      })
    })

    describe('loadTask', () => {
      const {loadTask} = actions
      const task = buildTask({id: 5})

      it('should commit the load mutation with the task', (done) => {
        const apiPromise = new Promise((resolve, reject) => resolve({data: task}))

        const bindingContext = {
          $axios: {
            get: jest.fn((resource) => {
              expect(resource).toEqual('tasks/5')
              return apiPromise
            })
          }
        }

        const storeContext = {
          commit: jest.fn((mutation, payload) => {
            expect(mutation).toEqual('loadTask')
            expect(payload).toEqual(task)
            done()
          })
        }

        loadTask.call(bindingContext, storeContext, 5)
      })
    })

    describe('addTask', () => {
      const {addTask} = actions
      const taskTitle = 'Do something!'
      const apiResponse = buildTask({title: taskTitle})

      it('should commit the addTask mutation with the new task', (done) => {
        const apiPromise = new Promise((resolve, reject) => resolve({data: apiResponse}))

        const bindingContext = {
          $axios: {
            post: jest.fn((resource, params) => {
              expect(resource).toEqual('tasks')
              expect(params).toEqual({task: {title: taskTitle}})
              return apiPromise
            })
          }
        }

        const storeContext = {
          commit: jest.fn((mutation, payload) => {
            expect(mutation).toEqual('addTask')
            expect(payload).toEqual(apiResponse)
            done()
          })
        }

        addTask.call(bindingContext, storeContext, {title: taskTitle})
      })
    })

    describe('updateTask', () => {
      const {updateTask} = actions

      it('should commit the updateTask mutation with the updated attributes', (done) => {
        let apiResponse = {id: 1, title: 'Foo task', done: true}
        const apiPromise = new Promise((resolve, reject) => {
          resolve({data: apiResponse})
        })

        const bindingContext = {
          $axios: {
            put: jest.fn((resource, params) => {
              expect(resource).toEqual('tasks/1')
              expect(params).toEqual({task: {done: true}})
              return apiPromise
            })
          }
        }

        const storeContext = {
          commit: jest.fn((mutation, payload) => {
            expect(mutation).toEqual('updateTask')
            expect(payload).toEqual(apiResponse)
            done()
          })
        }

        updateTask.call(bindingContext, storeContext, {id: 1, updatedAttributes: {done: true}})
      })
    })
  })
})
