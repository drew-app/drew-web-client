import {merge} from 'lodash'
import {newTask} from '@/store/tasks'

let taskFactoryIdSequenceNum = 1

export function buildTask (overrideAttrs = {}) {
  let returnVal = merge(
    newTask({
      id: taskFactoryIdSequenceNum,
      title: `Task number ${taskFactoryIdSequenceNum}`,
      done: false,
      started: false
    }),
    overrideAttrs
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
