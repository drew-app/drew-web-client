import { merge, keyBy } from 'lodash'
import Vue from 'vue'

export function newTracker (attrs = {}) {
  return merge({
    title: '',
    tracker_records: []
  }, attrs)
}

export const state = {
  all: {}
}

export const getters = {
  all: (state) => Object.values(state.all),
  find: (state) => (id) => state.all[id]
}

export const mutations = {
  loadAll (state, trackers) {
    state.all = keyBy(trackers, 'id')
  },

  loadTracker (state, loadedTracker) {
    Vue.set(state.all, loadedTracker.id, loadedTracker)
  },

  addTrackerRecord (state, addedTrackerRecord) {
    state.all[addedTrackerRecord.tracker_id].tracker_records.push(addedTrackerRecord)
  }
}

export const actions = {
  loadAll ({ commit }) {
    this.$axios.get('trackers').then(({ data }) => {
      commit('loadAll', data)
    })
  },
  loadTracker ({ commit }, id) {
    this.$axios.get(`trackers/${id}`).then(({ data }) => {
      commit('loadTracker', data)
    })
  },
  addTracker ({ commit }, payload) {
    this.$axios.post('trackers', payload).then(({ data }) => {
      commit('loadTracker', data)
    })
  },
  addTrackerRecord ({ commit }, id) {
    this.$axios.post(`trackers/${id}/tracker_records`).then(({ data }) => {
      commit('addTrackerRecord', data)
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
