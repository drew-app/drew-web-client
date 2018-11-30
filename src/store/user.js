export const state = {
  name: '',
  avatarUrl: 'https://www.gravatar.com/avatar/0?d=mp'
}

export const getters = {
}

export const mutations = {
  login (state, { name, avatarUrl }) {
    state.name = name || ''
    state.avatarUrl = avatarUrl || 'https://www.gravatar.com/avatar/0?d=mp'
  },
  logout (state) {
    state.name = ''
    state.avatarUrl = 'https://www.gravatar.com/avatar/0?d=mp'
  }
}

export const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
