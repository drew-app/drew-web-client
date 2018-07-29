import {state, mutations, getters, actions} from '@/store/tasks'

const defaultState = {...state}

describe('tasks store', () => {
  describe('getters', () => {
    describe('all', () => {
      const {all} = getters
      const tasks = [
        {id: 1, title: 'One task', done: false},
        {id: 2, title: 'Two task', done: true},
        {id: 3, title: 'Red tasks', done: false},
        {id: 4, title: 'Blue tasks', done: false}
      ]

      let currentState
      beforeEach(() => {
        currentState = {tasks: {...defaultState, all: tasks}}
      })

      it('should return all tasks', () => {
        const subject = all(currentState)

        expect(subject).toEqual(tasks)
        expect(subject.length).toEqual(4)
      })
    })
  })

  describe('mutations', () => {
    describe('loadAll', () => {
      const {loadAll} = mutations
      let currentState
      let loadedTasks

      beforeEach(() => {
        currentState = {...defaultState}
        loadedTasks = [
          {id: 1, title: 'One task', done: false},
          {id: 2, title: 'Two task', done: true},
          {id: 3, title: 'Red tasks', done: false},
          {id: 4, title: 'Blue tasks', done: false}
        ]
      })

      it('with default state', () => {
        loadAll(currentState, loadedTasks)
        expect(currentState.all).toEqual(loadedTasks)
      })
    })

    describe('addTask', () => {
      const {addTask} = mutations
      let currentState
      let savedTask

      beforeEach(() => {
        currentState = {...defaultState}
        savedTask = { id: 5, title: 'Foo task', done: false }
      })

      it('with default state', () => {
        addTask(currentState, savedTask)
        expect(currentState.all).toEqual([savedTask])
      })
    })
  })

  describe('actions', () => {
    describe('loadAll', () => {
      const {loadAll} = actions
      const taskList = [
        {id: 1, title: 'One task', done: false},
        {id: 2, title: 'Two task', done: true},
        {id: 3, title: 'Red task', done: false},
        {id: 4, title: 'Blue task', done: false}
      ]

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

    describe('addTask', () => {
      const {addTask} = actions
      const taskName = 'Do something!'
      const taskHash = {id: 1, title: taskName, done: false}

      it('should commit the addTask mutation with the new task', (done) => {
        const apiPromise = new Promise((resolve, reject) => resolve({data: taskHash}))

        const bindingContext = {
          $axios: {
            post: jest.fn((resource, params) => {
              expect(resource).toEqual('tasks')
              expect(params).toEqual({ task: { title: taskName } })
              return apiPromise
            })
          }
        }

        const storeContext = {
          commit: jest.fn((mutation, payload) => {
            expect(mutation).toEqual('addTask')
            expect(payload).toEqual(taskHash)
            done()
          })
        }

        addTask.call(bindingContext, storeContext, { title: taskName })
      })
    })
  })
})
