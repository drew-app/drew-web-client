export const state = {
  all: []
}

export const getters = {
  all: state => state.tasks.all
}

export const mutations = {
  loadAll (state, tasks) {
    state.all = tasks
  }
}

export const actions = {
  loadAll (context) {
    this.$axios.get('tasks').then(response => {
      context.commit('loadAll', response.data)
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
