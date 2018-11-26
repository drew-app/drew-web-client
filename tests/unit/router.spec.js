import router from '../../src/router'
import { authService } from '../../src/plugins/auth-plugin'

describe('router', () => {
  describe('unesecured routes', () => {
    it('should always allow you to navigate to unsecured routes', () => {
      router.push('/login')

      expect(router.history.current.path).toEqual('/login')
    })
  })

  describe('secured routes', () => {
    describe('unauthenticated', () => {
      it('should redirect to /login if navigating to a secured route', () => {
        authService.isAuthenticated = jest.fn(() => false)

        router.push('/')

        expect(router.history.current.path).toEqual('/login')
      })
    })

    describe('authenticated', () => {
      it('should allow you to navigate to a secured route if you are authenticated', () => {
        authService.isAuthenticated = jest.fn(() => true)

        router.push('/')

        expect(router.history.current.path).toEqual('/')
      })
    })
  })
})
