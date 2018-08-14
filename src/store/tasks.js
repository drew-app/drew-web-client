import { merge } from 'lodash'

export const state = {
  all: []
}

export const getters = {
  all: state => state.all,

  todo: state => state.all.filter(task => !task.done)
}

export const mutations = {
  loadAll (state, tasks) {
    state.all = tasks
  },
  addTask (state, task) {
    state.all.push(task)
  },
  updateTask (state, taskAttributes) {
    let { id } = taskAttributes
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
  addTask (context, payload) {
    this.$axios.post('tasks', {
      task: {
        title: payload.title
      }
    }).then(response => {
      context.commit('addTask', response.data)
    })
  },
  updateTask (context, { id, updatedAttributes }) {
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
