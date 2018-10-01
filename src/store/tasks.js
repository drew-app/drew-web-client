import Vue from 'vue'
import { keyBy, merge } from 'lodash'

export function newTask (attrs = {}) {
  return merge(
    {
      title: '',
      done: false,
      started: false
    }, attrs)
}

export const state = {
  all: {}
}

export const getters = {
  all: state => {
    return Object.values(state.all)
  },
  todo: (state, getters) => {
    return getters.all.filter(task => !task.done)
  },

  find: state => id => {
    return state.all[id]
  }
}

export const mutations = {
  loadAll (state, tasks) {
    state.all = keyBy(tasks, 'id')
  },

  loadTask (state, loadedTask) {
    Vue.set(state.all, loadedTask.id, loadedTask)
  },

  updateTask (state, taskAttributes) {
    merge(
      state.all[taskAttributes.id],
      taskAttributes
    )
  }
}

export const actions = {
  loadAll ({ commit }) {
    this.$axios.get('tasks').then(({ data }) => {
      commit('loadAll', data)
    })
  },

  loadTask ({ commit }, id) {
    this.$axios.get(`tasks/${id}`).then(({ data }) => {
      commit('loadTask', data)
    })
  },

  addTask ({ commit }, payload) {
    this.$axios.post('tasks', {
      task: payload
    }).then(({ data }) => {
      commit('loadTask', data)
    })
  },

  updateTask ({ commit }, { id, updatedAttributes }) {
    this.$axios.put(`tasks/${id}`, {
      task: updatedAttributes
    }).then(({ data }) => {
      commit('updateTask', data)
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
