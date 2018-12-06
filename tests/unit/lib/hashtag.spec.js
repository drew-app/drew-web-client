import { getHashTags, excludeHashTags } from '@/lib/hashtag'

require('../../matchers')

describe('getHashTags', () => {
  it('should extract hash tags from a string', () => {
    const input = '#helloWorld, this is a #test'

    expect(getHashTags(input)).toContainExactly(['helloWorld', 'test'])
  })

  it('should allow some special characters in hash strings', () => {
    const input = '#dash-is-cool #so_is_underscore'

    expect(getHashTags(input)).toContainExactly([
      'dash-is-cool',
      'so_is_underscore'
    ])
  })
})

describe('excludeHashTags', () => {
  it('should return the string without the hash tags', () => {
    const input = 'Fix the roof #home #long'

    expect(excludeHashTags(input)).toEqual('Fix the roof')
  })
})
