import { merge } from 'lodash'
import { newTracker } from '@/store/trackers'

let trackerFactoryIdSequenceNum = 1

export function buildTracker (overrideAttrs = {}) {
  let returnVal = merge(
    newTracker({
      id: trackerFactoryIdSequenceNum,
      title: `Tracker number ${trackerFactoryIdSequenceNum}`,
      tracker_records: []
    }),
    overrideAttrs
  )

  trackerFactoryIdSequenceNum++

  return returnVal
}

export function buildTrackers (count, overrideAttrs = {}) {
  let returnVal = []

  for (let i = 0; i < count; i++) {
    returnVal.push(buildTracker(overrideAttrs))
  }

  return returnVal
}

export function resetTrackerFactorySequence () {
  trackerFactoryIdSequenceNum = 1
}
