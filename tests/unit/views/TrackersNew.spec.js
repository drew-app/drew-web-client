import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import TrackerNew from '@/views/TrackerNew.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('TrackerNew.vue', () => {
  let store
  let wrapper

  let stubs = {
    actions: {
      addTracker: jest.fn()
    }
  }

  let routerStub = {
    push: jest.fn()
  }

  const mountWrapper = (
    storeOverrides = {}
  ) => {
    store = new Vuex.Store({ modules: { trackers: { ...stubs, ...storeOverrides, namespaced: true } } })

    wrapper = shallowMount(TrackerNew, {
      store,
      localVue,
      mocks: {
        $router: routerStub
      }
    })
  }

  describe('new tracker form', () => {
    let titleField
    let newForm

    beforeEach(() => {
      mountWrapper()

      newForm = wrapper.find('#tracker-new form')
      titleField = wrapper.find("#tracker-new form input[name='title']")
    })

    it('should automatically focus the title field', () => {
      expect(wrapper.contains('input[name="title"]:focus')).toBe(true)
    })

    it('should submit an addTracker action upon submit', () => {
      titleField.setValue('The new title')
      newForm.trigger('submit')

      expect(stubs.actions.addTracker).toHaveBeenCalled()
      expect(stubs.actions.addTracker.mock.calls[0][1]).toEqual({ title: 'The new title' })
    })

    it('should close the form upon submit', () => {
      titleField.setValue('The new title')
      newForm.trigger('submit')

      expect(routerStub.push).toHaveBeenCalled()
      expect(routerStub.push.mock.calls[0][0].path).toEqual('/trackers')
    })
  })
})
