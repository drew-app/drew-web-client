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
  let wrapper
  let store

  const id = 1234
  const tracker = buildTracker({
    id: id,
    title: 'The title'
  })

  beforeEach(() => {
    loadTrackerMock = jest.fn()
    addTrackerRecordMock = jest.fn()

    trackers.actions = {
      loadTracker: loadTrackerMock,
      addTrackerRecord: addTrackerRecordMock
    }
    trackers.state = { all: { [id]: tracker } }
    store = new Vuex.Store({ modules: { trackers } })

    wrapper = mount(Tracker, {
      store,
      localVue,
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

  describe('Add tracker', () => {
    it('should trigger the trackers/AddTrackerRecord action when you click add record', () => {
      wrapper.find('#tracker__actions-add-record').trigger('click')

      expect(addTrackerRecordMock).toHaveBeenCalled()
      expect(addTrackerRecordMock.mock.calls[0][1]).toEqual(id)
    })
  })
})
