import { merge, keyBy } from 'lodash'

export function newTag (attrs = {}) {
  return merge({ name: '' }, attrs)
}

export const state = {
  all: {}
}

export const getters = {
  all (state) { return Object.values(state.all) }
}

export const mutations = {
  loadAll (state, tags) {
    state.all = keyBy(tags, 'id')
  }
}

export const actions = {
  loadAll ({ commit }) {
    this.$axios.get('tags').then(({ data }) => {
      commit('loadAll', data)
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
