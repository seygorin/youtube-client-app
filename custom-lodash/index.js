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

const createPredicateFunction = (predicate) =>
  isFunction(predicate)
    ? predicate
    : isObject(predicate) && !isArray(predicate)
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

const processCollection = (collection, defaultValue, processor) =>
  collection == null
    ? defaultValue
    : isArray(collection)
    ? processor(collection, [])
    : isObject(collection)
    ? processor(collection, {})
    : defaultValue

const createObjectOperation = (object, condition, defaultValue = {}) =>
  !isObject(object)
    ? defaultValue
    : (() => {
        const result = {}
        for (const key in object) {
          condition(key, object[key]) ? (result[key] = object[key]) : null
        }
        return result
      })()

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

  const predicateFunc = createPredicateFunction(predicate)

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

const filter = (collection, predicate) =>
  processCollection(collection, [], (coll) => {
    const result = []
    const predicateFunc = createPredicateFunction(predicate)

    if (isArray(coll)) {
      let i = 0
      for (const item of coll) {
        predicateFunc(item, i, coll) ? (result[result.length] = item) : null
        i++
      }
    } else if (isObject(coll)) {
      for (const key in coll) {
        predicateFunc(coll[key], key)
          ? (result[result.length] = coll[key])
          : null
      }
    }

    return result
  })

const find = (array, predicate) => {
  if (!isArray(array)) return false

  const predicateFunc = createPredicateFunction(predicate)

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

const map = (collection, iteratee) =>
  collection == null
    ? []
    : (() => {
        const func = isFunction(iteratee)
          ? iteratee
          : isString(iteratee)
          ? (item) => item[iteratee]
          : (item) => item

        return isArray(collection)
          ? (() => {
              const result = []
              let i = 0
              for (const item of collection) {
                result[result.length] = func(item, i, collection)
                i++
              }
              return result
            })()
          : isObject(collection)
          ? (() => {
              const result = []
              for (const key in collection) {
                result[result.length] = func(collection[key], key, collection)
              }
              return result
            })()
          : []
      })()

const zip = (...arrays) =>
  processCollection(arrays, [], (arrs) => {
    if (!arrs.length) return []

    let maxLength = 0
    for (const arr of arrs) {
      if (!isArray(arr)) return []
      maxLength = arr.length > maxLength ? arr.length : maxLength
    }

    const result = []
    for (let i = 0; i < maxLength; i++) {
      const group = []
      for (const arr of arrs) {
        group[group.length] = arr[i]
      }
      result[result.length] = group
    }
    return result
  })

const merge = (object, ...sources) =>
  !isObject(object)
    ? {}
    : (() => {
        const result = {}

        for (const key in object) {
          result[key] = isArray(object[key])
            ? [...object[key]]
            : isObject(object[key])
            ? merge(object[key])
            : object[key]
        }

        for (const source of sources) {
          if (!isObject(source)) continue

          for (const key in source) {
            const srcValue = source[key]
            const targetValue = result[key]

            result[key] =
              isArray(srcValue) && isArray(targetValue)
                ? targetValue.map((item, i) =>
                    isObject(item) && isObject(srcValue[i])
                      ? merge(item, srcValue[i])
                      : srcValue[i] || item
                  )
                : isObject(srcValue) && isObject(targetValue)
                ? merge(targetValue, srcValue)
                : srcValue
          }
        }

        return result
      })()

const omit = (object, paths) =>
  createObjectOperation(object, (key) => !includes(paths, key), {})

const omitBy = (object, predicate) =>
  createObjectOperation(object, (key, value) => !predicate(value, key), {})

const pick = (object, paths) =>
  createObjectOperation(object, (key) => includes(paths, key), {})

const pickBy = (object, predicate) =>
  createObjectOperation(object, (key, value) => predicate(value, key), {})

const toPairs = (object) =>
  !isObject(object)
    ? []
    : (() => {
        const result = []
        for (const key in object) {
          Object.getOwnPropertyDescriptor(object, key) &&
            (result[result.length] = [key, object[key]])
        }
        return result
      })()

module.exports = {
  chunk,
  compact,
  drop,
  dropWhile,
  take,
  filter,
  find,
  includes,
  map,
  zip,
  merge,
  omit,
  omitBy,
  pick,
  pickBy,
  toPairs,
}
