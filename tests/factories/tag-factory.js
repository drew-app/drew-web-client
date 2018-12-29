import { merge } from 'lodash'
import { newTag } from '@/store/tags'

let tagFactoryIdSequenceNum = 1

export function buildTag (overrideAttrs = {}) {
  let returnVal = merge(
    newTag({
      id: tagFactoryIdSequenceNum,
      name: `Tag number ${tagFactoryIdSequenceNum}`
    }),
    overrideAttrs
  )

  tagFactoryIdSequenceNum++

  return returnVal
}

export function buildTags (count, overrideAttrs = {}) {
  let returnVal = []

  for (let i = 0; i < count; i++) {
    returnVal.push(buildTag(overrideAttrs))
  }

  return returnVal
}

export function resetTagFactorySequence () {
  tagFactoryIdSequenceNum = 1
}
