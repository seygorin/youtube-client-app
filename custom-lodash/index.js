const isArray = (value) =>
  value === null || value === undefined
    ? false
    : typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      ('0' in value || value.length === 0)

const isFunction = (value) => typeof value === 'function'

const isObject = (value) =>
  typeof value === 'object' && value !== null && !isArray(value)

const isString = (value) => typeof value === 'string'

const isNaN = (value) => value !== value

const chunk = (array, size = 1) => {
  if (!isArray(array)) return []
  if (size < 1) return []

  const result = []
  let chunk = []

  for (const item of array) {
    chunk[chunk.length] = item
    chunk.length === size
      ? ((result[result.length] = chunk), (chunk = []))
      : null
  }

  chunk.length ? (result[result.length] = chunk) : null
  return result
}

const compact = (array) => {
  if (!isArray(array)) return []

  const result = []
  for (const item of array) {
    item ? (result[result.length] = item) : null
  }
  return result
}

const drop = (array, n = 1) => {
  if (!isArray(array)) return []

  const result = []
  let i = 0
  for (const item of array) {
    i >= n ? (result[result.length] = item) : null
    i++
  }
  return result
}

const dropWhile = (array, predicate) => {
  if (!isArray(array)) return []

  const predicateFunc = isFunction(predicate)
    ? predicate
    : isObject(predicate)
    ? (item) => {
        for (const key in predicate) {
          if (item[key] !== predicate[key]) return false
        }
        return true
      }
    : isArray(predicate)
    ? (item) => item[predicate[0]] === predicate[1]
    : isString(predicate)
    ? (item) => item[predicate]
    : () => false

  let dropIndex = 0
  let i = 0
  for (const item of array) {
    if (!predicateFunc(item, i, array)) {
      break
    }
    dropIndex++
    i++
  }

  const result = []
  i = 0
  for (const item of array) {
    if (i >= dropIndex) {
      result[result.length] = item
    }
    i++
  }

  return result
}

const take = (array, n = 1) => {
  if (!isArray(array)) return []
  if (n < 0) return []

  const result = []
  const limit = n > array.length ? array.length : n
  let count = 0

  for (const item of array) {
    if (count >= limit) break
    result[result.length] = item
    count++
  }

  return result
}

const find = (array, predicate) => {
  if (!isArray(array)) return false

  const predicateFunc = isFunction(predicate)
    ? predicate
    : isObject(predicate)
    ? (item) => {
        for (const key in predicate) {
          if (item[key] !== predicate[key]) return false
        }
        return true
      }
    : isArray(predicate) && predicate.length === 2
    ? (item) => item[predicate[0]] === predicate[1]
    : isString(predicate)
    ? (item) => item[predicate]
    : () => false

  let i = 0
  for (const item of array) {
    if (predicateFunc(item, i, array)) {
      return item
    }
    i++
  }

  return false
}

const includes = (collection, value, fromIndex = 0) => {
  if (collection == null) return false

  return isString(collection)
    ? (() => {
        for (let i = fromIndex; i < collection.length; i++) {
          let found = true
          for (let j = 0; j < value.length; j++) {
            if (collection[i + j] !== value[j]) {
              found = false
              break
            }
          }
          if (found) return true
        }
        return false
      })()
    : isArray(collection)
    ? (() => {
        for (let i = Math.max(fromIndex, 0); i < collection.length; i++) {
          const item = collection[i]
          if (item === value || (isNaN(item) && isNaN(value))) {
            return true
          }
        }
        return false
      })()
    : isObject(collection)
    ? (() => {
        for (const key in collection) {
          const item = collection[key]
          if (item === value || (isNaN(item) && isNaN(value))) {
            return true
          }
        }
        return false
      })()
    : false
}

module.exports = {
  chunk,
  compact,
  drop,
  dropWhile,
  take,
  find,
  includes,
}
