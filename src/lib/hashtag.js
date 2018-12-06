const hashTagRegex = /(?:^|\s)(?:#)([a-zA-Z\-_\d]+)/gm

export function getHashTags (inputString) {
  let result = []
  let match

  while ((match = hashTagRegex.exec(inputString))) {
    result.push(match[1])
  }

  return result
}

export function excludeHashTags (inputString) {
  return inputString.replace(hashTagRegex, '')
}
