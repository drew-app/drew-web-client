import {state, mutations, getters, actions} from '@/store/tasks'

const defaultState = state

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
        currentState = defaultState
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
  })

  describe('actions', () => {
    describe('loadAll', () => {
      const {loadAll} = actions
      const taskList = [
        {id: 1, title: 'One task', done: false},
        {id: 2, title: 'Two task', done: true},
        {id: 3, title: 'Red tasks', done: false},
        {id: 4, title: 'Blue tasks', done: false}
      ]

      it('should commit the loadAll mutation with the tasks', (done) => {
        const apiPromise = new Promise((resolve, reject) => resolve({data: taskList}))

        const bindingContext = {
          $axios: {
            get: jest.fn((res) => {
              expect(res).toEqual('tasks')
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
  })
})
