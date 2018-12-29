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

export class TaskSearch {
  filterDone (task) { return this.includeDone || !task.done }
  filterStarted (task) { return task.started === this.started }
  filterTagName (task) {
    return task.tags.some((tag) => {
      return tag.name.localeCompare(this.tagName, 'en', { sensitivity: 'base' }) === 0
    })
  }

  constructor ({ includeDone = null, started = null, tagName = null } = {}) {
    this.includeDone = includeDone
    this.started = started
    this.tagName = tagName
  }

  filter (task) {
    let included = this.filterDone(task)
    if (included && this.started !== null) { included = this.filterStarted(task) }
    if (included && this.tagName !== null) { included = this.filterTagName(task) }

    return included
  }

  filterAll (tasks) {
    return tasks.filter(task => this.filter(task))
  }
}

export const state = {
  search: new TaskSearch(),
  all: {}
}

export const getters = {
  all: state => {
    return Object.values(state.all)
  },

  started: (state, getters) => {
    return getters.all.filter(task => task.started && !task.done)
  },

  search: (state, getters) => {
    return state.search.filterAll(getters.all)
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
  },

  filterDone (state) { state.search.includeDone = !state.search.includeDone },

  filterStarted (state) { state.search.started = !state.search.started },
  disableFilterStarted (state) { state.search.started = null },

  filterTagName (state, newTagName = null) { state.search.tagName = newTagName }
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
      task: payload.task,
      tags: payload.tags
    }).then(({ data }) => {
      commit('loadTask', data)
    })
  },

  updateTask ({ commit }, { id, updatedAttributes, tags = [] }) {
    const tagNames = tags.map((tag) => tag.name)
    this.$axios.put(`tasks/${id}`, {
      task: updatedAttributes,
      tags: tagNames
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
