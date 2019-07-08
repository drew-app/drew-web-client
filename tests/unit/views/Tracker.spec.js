import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Tracker from '@/views/Tracker.vue'
import { buildTracker } from '../../factories/tracker-factory'

import trackers from '@/store/trackers.js'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Tracker.vue', () => {
  let loadTrackerMock
  let addTrackerRecordMock
  let destroyTrackerPromise
  let destroyTrackerMock
  let wrapper
  let router
  let store

  const id = 1234
  let tracker

  beforeEach(() => {
    localVue.filter('date-format', (date) => date)

    tracker = buildTracker({
      id: id,
      title: 'The title'
    })

    loadTrackerMock = jest.fn()
    addTrackerRecordMock = jest.fn()
    destroyTrackerMock = jest.fn()
    destroyTrackerPromise = Promise.resolve({})
    destroyTrackerMock.mockReturnValue(destroyTrackerPromise)

    trackers.actions = {
      loadTracker: loadTrackerMock,
      addTrackerRecord: addTrackerRecordMock,
      destroyTracker: destroyTrackerMock
    }
    trackers.state = { all: { [id]: tracker } }
    store = new Vuex.Store({ modules: { trackers } })

    router = { push: jest.fn() }
    wrapper = mount(Tracker, {
      store,
      localVue,
      mocks: {
        $router: router
      },
      propsData: { id }
    })
  })

  describe('created', () => {
    it('should trigger the trackers/loadTracker action', () => {
      expect(loadTrackerMock).toHaveBeenCalled()
      expect(loadTrackerMock.mock.calls[0][1]).toEqual(id)
    })
  })

  describe('computed', () => {
    describe('tracker', () => {
      it('should find the tracker', () => {
        expect(wrapper.find('#tracker__details h2').text()).toEqual(tracker.title)
        expect(wrapper.find('#tracker__loading-indicator').exists()).toBe(false)
      })

      it('should show a loading screen if the tracker has not been loaded', () => {
        wrapper.vm.$store.replaceState({ trackers: { all: {} } })

        expect(wrapper.find('#tracker__loading-indicator').exists()).toBe(true)
        expect(wrapper.find('#tracker__details').exists()).toBe(false)
      })
    })
  })

  describe('Add tracker record', () => {
    it('should trigger the trackers/AddTrackerRecord action when you click add record', () => {
      wrapper.find('#tracker__actions-add-record').trigger('click')

      expect(addTrackerRecordMock).toHaveBeenCalled()
      expect(addTrackerRecordMock.mock.calls[0][1]).toEqual(id)
    })
  })

  describe('Delete tracker', () => {
    describe('with no existing tracker records', () => {
      it('should trigger the trackers/destroyTracker action then take you back to the list when you click delete', (done) => {
        wrapper.find('#tracker__delete').trigger('click')

        wrapper.vm.$nextTick(() => {
          expect(destroyTrackerMock).toHaveBeenCalled()
          expect(destroyTrackerMock.mock.calls[0][1]).toEqual(id)

          expect(router.push).toHaveBeenCalled()
          let routerPayload = router.push.mock.calls[0][0]
          expect(routerPayload.path).toEqual('/trackers')

          done()
        })
      })
    })

    describe('with existing tracker records', () => {
      beforeEach(() => {
        tracker = buildTracker({
          id: id,
          title: 'The title',
          tracker_records: [
            { id: 1, tracker_id: id, created_at: '2019-01-01T03:15:26.557Z' },
            { id: 2, tracker_id: id, created_at: '2019-01-02T03:15:26.557Z' }
          ]
        })
        let trackerHash = {}
        trackerHash[id] = tracker
        wrapper.vm.$store.replaceState({ trackers: { all: trackerHash } })
      })

      it('should launch the delete confirmation modal', (done) => {
        wrapper.find('#tracker__delete').trigger('click')

        expect(wrapper.find('#tracker_delete').exists()).toBe(true)

        wrapper.find('#tracker_delete__cancel').trigger('click')

        expect(wrapper.find('#tracker_delete').exists()).toBe(false)

        wrapper.vm.$nextTick(() => {
          expect(destroyTrackerMock).not.toHaveBeenCalled()
          expect(router.push).not.toHaveBeenCalled()
          done()
        })
      })

      it('should delete the record if you confirm the delete box', (done) => {
        wrapper.find('#tracker__delete').trigger('click')

        expect(wrapper.find('#tracker_delete').exists()).toBe(true)

        wrapper.find('#tracker_delete__confirm').trigger('click')

        expect(wrapper.find('#tracker_delete').exists()).toBe(false)

        wrapper.vm.$nextTick(() => {
          expect(destroyTrackerMock).toHaveBeenCalled()
          expect(destroyTrackerMock.mock.calls[0][1]).toEqual(id)

          expect(router.push).toHaveBeenCalled()
          let routerPayload = router.push.mock.calls[0][0]
          expect(routerPayload.path).toEqual('/trackers')

          done()
        })
      })
    })
  })
})
