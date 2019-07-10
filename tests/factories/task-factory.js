import { merge, omit } from 'lodash'
import { newTask } from '@/store/tasks'

let taskFactoryIdSequenceNum = 1

export function buildTask (overrideAttrs = {}) {
  const attrs = omit(overrideAttrs, ['withTags'])

  let returnVal = merge(
    newTask({
      id: taskFactoryIdSequenceNum,
      title: `Task number ${taskFactoryIdSequenceNum}`,
      done: false,
      focused: false,
      tags: []
    }),
    attrs
  )

  taskFactoryIdSequenceNum++

  return returnVal
}

export function buildTasks (count, overrideAttrs = {}) {
  let returnVal = []

  for (let i = 0; i < count; i++) {
    returnVal.push(buildTask(overrideAttrs))
  }

  return returnVal
}

export function resetTaskFactorySequence () {
  taskFactoryIdSequenceNum = 1
}
