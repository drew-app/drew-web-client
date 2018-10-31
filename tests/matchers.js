expect.extend({ // eslint-disable-line no-undef
  toContainExactly (received, expected) {
    const messageHeader = this.utils.matcherHint(this.isNot ? '.not.toContainExactly' : '.toContainExactly') + '\n\n'
    const { printReceived, printExpected } = this.utils
    const receivedStr = printReceived(received)
    const expectedStr = printExpected(expected)

    let badArray = null
    if (!Array.isArray(expected)) { badArray = expectedStr }
    if (!Array.isArray(received)) { badArray = receivedStr }

    if (badArray) {
      return {
        pass: this.isNot,
        message: () => messageHeader + `Expected ${expectedStr} to be an Array.`
      }
    }

    let extraElements = received.filter((item) => !expected.includes(item))
    let missingElements = expected.filter((item) => !received.includes(item))

    if (extraElements.length || missingElements.length) {
      let message = messageHeader + `Expected ${receivedStr} to contain exactly ${expectedStr}` + '\n'

      if (extraElements.length) { message = message + '\n' + `Extra elements are: ${printReceived(extraElements)}` }
      if (missingElements.length) { message = message + '\n' + `Missing elements are: ${printExpected(missingElements)}` }

      return {
        pass: false,
        message: () => message
      }
    }

    return {
      pass: true,
      message: () => messageHeader + `Expected ${receivedStr} to ${printReceived('not')} contain exactly ${expectedStr}`
    }
  }
})
