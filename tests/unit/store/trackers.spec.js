import { createLocalVue } from '@vue/test-utils'
import trackers from '@/store/trackers'
import Vuex from 'vuex'
import { keyBy } from 'lodash'
import { buildTrackers, buildTracker } from '../../factories/tracker-factory'

require('../../matchers')

const localVue = createLocalVue()
localVue.use(Vuex)

function buildStore (trackerObjs) {
  const store = new Vuex.Store({
    modules: { trackers },
    strict: true
  })
  store.replaceState({
    trackers: {
      all: keyBy(trackerObjs, 'id')
    }
  })
  return store
}

describe('trackers store', () => {
  let store
  describe('getters', () => {
    describe('all', () => {
      let trackers

      beforeEach(() => {
        trackers = buildTrackers(4)
        store = buildStore(trackers)
      })

      it('should return all trackers', () => {
        const subject = store.getters['trackers/all']

        expect(subject).toEqual(trackers)
        expect(subject.length).toEqual(4)
      })
    })

    describe('find', () => {
      let tracker

      beforeEach(() => {
        tracker = buildTracker()

        let trackers = buildTrackers(3)
        trackers.push(tracker)
        trackers.concat(buildTrackers(3))

        store = buildStore(trackers)
      })

      it('should return the tracker by id', () => {
        const subject = store.getters['trackers/find'](tracker.id)

        expect(subject).toEqual(tracker)
      })
    })
  })

  describe('mutations', () => {
    describe('loadAll', () => {
      let loadedTrackers

      beforeEach(() => {
        loadedTrackers = buildTrackers(4)
      })

      it('with default state', () => {
        store = buildStore()
        store.commit('trackers/loadAll', loadedTrackers)

        expect(store.state.trackers.all).toEqual(keyBy(loadedTrackers, 'id'))
      })

      it('with stale trackers', () => {
        store = buildStore(buildTrackers(3))
        store.commit('trackers/loadAll', loadedTrackers)

        expect(store.state.trackers.all).toEqual(keyBy(loadedTrackers, 'id'))
      })
    })

    describe('loadTracker', () => {
      let loadedTracker

      beforeEach(() => {
        loadedTracker = buildTracker({ id: 5, title: 'Updated from server' })
      })

      it('with default state', () => {
        store = buildStore()
        store.commit('trackers/loadTracker', loadedTracker)

        expect(store.state.trackers.all[loadedTracker.id]).toEqual(loadedTracker)
      })

      it('replacing existing tracker', () => {
        const existingTracker = buildTracker({ id: 5, title: 'Old and busted' })
        store = buildStore([existingTracker])
        store.commit('trackers/loadTracker', loadedTracker)

        const subject = store.getters['trackers/find'](5)

        expect(subject.title).toEqual('Updated from server')
      })

      it('should update the getters', () => {
        const someTrackers = buildTrackers(3)
        store = buildStore(someTrackers)
        store.commit('trackers/loadTracker', loadedTracker)

        const subject = store.getters['trackers/all']

        expect(subject.length).toEqual(4)
      })
    })

    describe('addTrackerRecord', () => {
      let addedTrackerRecord
      let tracker

      beforeEach(() => {
        tracker = buildTracker()
        addedTrackerRecord = { tracker_id: tracker.id, createdAt: Date() }
      })

      it('should add the trackerRecord to the tracker', () => {
        store = buildStore([tracker])
        store.commit('trackers/addTrackerRecord', addedTrackerRecord)

        const subject = store.getters['trackers/find'](tracker.id)

        expect(subject.tracker_records).toContain(addedTrackerRecord)
      })
    })

    describe('destroyTracker', () => {
      let doomedTracker

      beforeEach(() => {
        doomedTracker = buildTracker({ id: 5 })
      })

      it('with default state', () => {
        store = buildStore([doomedTracker])
        store.commit('trackers/destroyTracker', '5')

        const subject = store.getters['trackers/find'](5)

        expect(subject).toBeFalsy()
      })
    })
  })

  describe('actions', () => {
    describe('loadAll', () => {
      it('should commit the loadAll mutation with the trackers', (done) => {
        const trackerList = buildTrackers(4)

        const $axios = {
          get: jest.fn((resource) => {
            expect(resource).toEqual('trackers')

            return new Promise((resolve, reject) => resolve({ data: trackerList }))
          })
        }

        trackers.mutations.loadAll = jest.fn((_, trackers) => {
          expect(trackers).toEqual(trackerList)
          done()
        })
        store = buildStore()
        store.$axios = $axios

        store.dispatch('trackers/loadAll')
      })
    })

    describe('loadTracker', () => {
      it('should commit the load mutation with the tracker', (done) => {
        const tracker = buildTracker({ id: 5 })
        const $axios = {
          get: jest.fn((resource) => {
            expect(resource).toEqual('trackers/5')

            return new Promise((resolve, reject) => resolve({ data: tracker }))
          })
        }

        trackers.mutations.loadTracker = jest.fn((_, payload) => {
          expect(payload).toEqual(payload)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('trackers/loadTracker', 5)
      })
    })

    describe('addTracker', () => {
      it('should commit the addTracker mutation with the new tracker', (done) => {
        const trackerTitle = 'Go to bed on time'
        const apiResponse = buildTracker({ title: trackerTitle })
        const $axios = {
          post: jest.fn((resource, params) => {
            expect(resource).toEqual('trackers')
            expect(params).toEqual({ title: trackerTitle })

            return new Promise((resolve, reject) => resolve({ data: apiResponse }))
          })
        }

        trackers.mutations.loadTracker = jest.fn((_, payload) => {
          expect(payload).toEqual(apiResponse)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('trackers/addTracker', { title: trackerTitle })
      })
    })

    describe('destroyTracker', () => {
      it('should commit the destroy mutation with the tracker id', (done) => {
        const tracker = buildTracker({ id: 5 })
        const $axios = {
          delete: jest.fn((resource) => {
            expect(resource).toEqual('trackers/5')

            return new Promise((resolve, reject) => resolve({ }))
          })
        }

        trackers.mutations.destroyTracker = jest.fn((_, id) => {
          expect(id).toEqual(5)
          done()
        })

        store = buildStore([tracker])
        store.$axios = $axios

        store.dispatch('trackers/destroyTracker', 5)
      })
    })

    describe('addTrackerRecord', () => {
      it('should commit the addTrackerRecord mutation with the new tracker record', (done) => {
        const tracker = buildTracker()
        const apiResponse = { tracker_id: tracker.id }
        const $axios = {
          post: jest.fn((resource, params) => {
            expect(resource).toEqual(`trackers/${tracker.id}/tracker_records`)

            return new Promise((resolve, reject) => resolve({ data: apiResponse }))
          })
        }

        trackers.mutations.addTrackerRecord = jest.fn((_, payload) => {
          expect(payload).toEqual(apiResponse)
          done()
        })

        store = buildStore()
        store.$axios = $axios

        store.dispatch('trackers/addTrackerRecord', tracker.id)
      })
    })
  })
})
