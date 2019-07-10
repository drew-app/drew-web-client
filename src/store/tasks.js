import Vue from 'vue'
import { keyBy, merge } from 'lodash'

export function newTask (attrs = {}) {
  return merge(
    {
      title: '',
      done: false,
      focused: false
    }, attrs)
}

export class TaskSearch {
  filterDone (task) { return this.includeDone || !task.done }
  filterFocused (task) { return task.focused === this.focused }
  filterTagName (task) {
    return task.tags.some((tag) => {
      return tag.name.localeCompare(this.tagName, 'en', { sensitivity: 'base' }) === 0
    })
  }

  constructor ({ includeDone = null, focused = null, tagName = null } = {}) {
    this.includeDone = includeDone
    this.focused = focused
    this.tagName = tagName
  }

  filter (task) {
    let included = this.filterDone(task)
    if (included && this.focused !== null) { included = this.filterFocused(task) }
    if (included && this.tagName !== null) { included = this.filterTagName(task) }

    return included
  }

  filterAll (tasks) {
    return tasks.filter(task => this.filter(task)).sort((task1, task2) => task2.focused - task1.focused)
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

  focused: (state, getters) => {
    return getters.all.filter(task => task.focused && !task.done)
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
    let updated = {
      ...state.all[taskAttributes.id],
      ...taskAttributes
    }
    Vue.set(state.all, taskAttributes.id, updated)
  },

  filterDone (state) { state.search.includeDone = !state.search.includeDone },

  filterFocused (state) { state.search.focused = !state.search.focused },
  disableFilterFocused (state) { state.search.focused = null },

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
