import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Trackers from '@/views/Trackers.vue'
import { buildTrackers } from '../../factories/tracker-factory'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Trackers.vue', () => {
  let store
  let wrapper
  let router

  let stubs = {
    actions: {
      loadAll: jest.fn()
    },
    getters: {
      all: () => buildTrackers(3)
    }
  }

  const mountWrapper = (storeOverrides = {}) => {
    store = new Vuex.Store({ modules: { trackers: { ...stubs, ...storeOverrides, namespaced: true } } })

    router = { push: jest.fn() }

    wrapper = shallowMount(Trackers, {
      store,
      localVue,
      mocks: { $router: router },
      stubs: {
        'router-link': true
      }
    })
  }

  describe('created', () => {
    it('should trigger the trackers/loadAll action', () => {
      mountWrapper()

      expect(stubs.actions.loadAll).toHaveBeenCalled()
    })
  })

  describe('trackers', () => {
    it('should render a tracker-list with the search results', () => {
      mountWrapper()

      const trackerList = wrapper.findAll('.tracker-list-item')
      expect(trackerList.length).toEqual(3)
    })

    describe('detail link', () => {
      it('should link to the tracker page', () => {
        mountWrapper()

        let trackerElem = wrapper.find('li.tracker-list-item')
        const id = trackerElem.attributes('data-id')
        trackerElem.trigger('click')

        expect(router.push).toHaveBeenCalled()
        expect(router.push.mock.calls[0][0]).toEqual(`/trackers/${id}`)
      })
    })
  })
})
