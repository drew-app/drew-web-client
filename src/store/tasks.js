export const state = {
  all: []
}

export const getters = {
  all: state => state.tasks.all
}

export const mutations = {
  loadAll (state, tasks) {
    state.all = tasks
  },
  addTask (state, task) {
    state.all.push(task)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
