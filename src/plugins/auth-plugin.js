import auth0 from 'auth0-js'
import router from '@/router'
import store from '@/store'

const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'

export class AuthService {
  authSuccess = '/'
  authFailure = '/login'

  auth0 = new auth0.WebAuth({
    domain: process.env.VUE_APP_AUTH_0_DOMAIN,
    clientID: process.env.VUE_APP_AUTH_0_CLIENT_ID,
    redirectUri: process.env.VUE_APP_AUTH_0_REDIRECT_URI,
    audience: 'https://drew-app.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })

  login () {
    this.auth0.authorize()
  }

  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        router.replace(this.authSuccess)
      } else if (err) {
        if (err) { console.log(err) }
        router.replace(this.authFailure)
      }
    })
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify(authResult.idTokenPayload.exp * 1000)
    localStorage.setItem(ACCESS_TOKEN, authResult.accessToken)
    localStorage.setItem(ID_TOKEN, authResult.idToken)
    localStorage.setItem(EXPIRES_AT, expiresAt)
    this.updateAuthdUser()
  }

  logout () {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(ID_TOKEN)
    localStorage.removeItem(EXPIRES_AT)

    store.commit('user/logout')
    router.push('/landing')
  }

  isAuthenticated () {
    const expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT))
    return new Date().getTime() < expiresAt
  }

  updateAuthdUser () {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const idToken = localStorage.getItem(ID_TOKEN)

    if (!!accessToken && !!idToken && this.isAuthenticated()) {
      this.auth0.client.userInfo(accessToken, (err, user) => {
        if (err) { console.log(err) }
        store.commit('user/login', { name: user.name, avatarUrl: user.picture })
      })
      store.$axios.defaults.headers.common['Authorization'] = `Bearer: ${idToken}`
    }
  }
}

export const authService = new AuthService()

export default {
  install: function (Vue, options) {
    Vue.prototype.$auth = authService
    authService.updateAuthdUser()
  }
}
