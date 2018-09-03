import {merge} from 'lodash'

export function newTask (attrs = {}) {
  return merge(
    {
      title: '',
      done: false,
      started: false
    }, attrs)
}

export const state = {
  all: []
}

export const getters = {
  all: state => state.all,

  todo: state => state.all.filter(task => !task.done),

  find: state => id => {
    return state.all.find(task => task.id === id)
  }
}

export const mutations = {
  loadAll (state, tasks) {
    state.all = tasks
  },

  loadTask (state, loadedTask) {
    const tasks = state.all.filter((task) => task.id !== loadedTask.id)
    tasks.push(loadedTask)
    state.all = tasks
  },

  addTask (state, taskAttributes) {
    state.all.push(newTask(taskAttributes))
  },

  updateTask (state, taskAttributes) {
    let {id} = taskAttributes
    let taskToBeUpdated = state.all.find((task) => task.id === id)
    merge(taskToBeUpdated, taskAttributes)
  }
}

export const actions = {
  loadAll (context) {
    this.$axios.get('tasks').then(response => {
      context.commit('loadAll', response.data)
    })
  },

  loadTask (context, id) {
    this.$axios.get(`tasks/${id}`).then(response => {
      context.commit('loadTask', response.data)
    })
  },

  addTask (context, payload) {
    this.$axios.post('tasks', {
      task: {
        title: payload.title
      }
    }).then(response => {
      context.commit('addTask', response.data)
    })
  },

  updateTask (context, {id, updatedAttributes}) {
    this.$axios.put(`tasks/${id}`, {
      task: updatedAttributes
    }).then(response => {
      context.commit('updateTask', response.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
