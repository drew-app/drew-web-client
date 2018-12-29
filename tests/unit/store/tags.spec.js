import { createLocalVue } from '@vue/test-utils'
import tags from '@/store/tags'
import Vuex from 'vuex'
import { keyBy } from 'lodash'
import { buildTags } from '../../factories/tag-factory'

require('../../matchers')

const localVue = createLocalVue()
localVue.use(Vuex)

function buildStore (tagObjs) {
  const store = new Vuex.Store({
    modules: { tags },
    strict: true
  })
  store.replaceState({
    tags: {
      all: keyBy(tagObjs, 'id')
    }
  })
  return store
}

describe('tags store', () => {
  let store
  describe('getters', () => {
    describe('all', () => {
      let tags

      beforeEach(() => {
        tags = buildTags(4)
        store = buildStore(tags)
      })

      it('should return all tags', () => {
        const subject = store.getters['tags/all']

        expect(subject).toEqual(tags)
        expect(subject.length).toEqual(4)
      })
    })
  })

  describe('mutations', () => {
    describe('loadAll', () => {
      let loadedTags

      beforeEach(() => {
        loadedTags = buildTags(4)
      })

      it('with default state', () => {
        store = buildStore()
        store.commit('tags/loadAll', loadedTags)

        expect(store.state.tags.all).toEqual(keyBy(loadedTags, 'id'))
      })

      it('with stale tags', () => {
        store = buildStore(buildTags(3))
        store.commit('tags/loadAll', loadedTags)

        expect(store.state.tags.all).toEqual(keyBy(loadedTags, 'id'))
      })
    })
  })

  describe('actions', () => {
    describe('loadAll', () => {
      it('should commit the loadAll mutation with the tags', (done) => {
        const tagList = buildTags(4)

        const $axios = {
          get: jest.fn((resource) => {
            expect(resource).toEqual('tags')

            return new Promise((resolve, reject) => resolve({ data: tagList }))
          })
        }

        tags.mutations.loadAll = jest.fn((_, tags) => {
          expect(tags).toEqual(tagList)
          done()
        })
        store = buildStore()
        store.$axios = $axios

        store.dispatch('tags/loadAll')
      })
    })
  })
})
