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

const filter = (collection, predicate) =>
  collection == null || (!isArray(collection) && !isObject(collection))
    ? []
    : (() => {
        const result = []

        const predicateFunc = isFunction(predicate)
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
          ? (item) => !!item[predicate]
          : () => false

        if (isArray(collection)) {
          let i = 0
          for (const item of collection) {
            if (predicateFunc(item, i, collection)) {
              result[result.length] = item
            }
            i++
          }
        }

        return result
      })()

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

const map = (collection, iteratee) => {
  if (collection == null) return []

  const result = []

  const func = isFunction(iteratee)
    ? iteratee
    : isString(iteratee)
    ? (item) => item[iteratee]
    : (item) => item

  return isArray(collection)
    ? (() => {
        let i = 0
        for (const item of collection) {
          result[result.length] = func(item, i, collection)
          i++
        }
        return result
      })()
    : isObject(collection)
    ? (() => {
        for (const key in collection) {
          result[result.length] = func(collection[key], key, collection)
        }
        return result
      })()
    : []
}

const zip = (...arrays) =>
  !arrays.length
    ? []
    : (() => {
        let maxLength = 0
        for (const arr of arrays) {
          if (!isArray(arr)) return []
          maxLength = arr.length > maxLength ? arr.length : maxLength
        }

        const result = []

        for (let i = 0; i < maxLength; i++) {
          const group = []
          for (const arr of arrays) {
            group[group.length] = arr[i]
          }
          result[result.length] = group
        }

        return result
      })()

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
  !isObject(object) || !isArray(paths)
    ? {}
    : (() => {
        const result = {}

        for (const key in object) {
          !includes(paths, key) ? (result[key] = object[key]) : null
        }

        return result
      })()

const omitBy = (object, predicate) =>
  !isObject(object) || !isFunction(predicate)
    ? {}
    : (() => {
        const result = {}

        for (const key in object) {
          !predicate(object[key], key) ? (result[key] = object[key]) : null
        }

        return result
      })()

const pick = (object, paths) =>
  !isObject(object) || !isArray(paths)
    ? {}
    : (() => {
        const result = {}

        for (const path of paths) {
          path in object ? (result[path] = object[path]) : null
        }

        return result
      })()

const pickBy = (object, predicate) =>
  !isObject(object) || !isFunction(predicate)
    ? {}
    : (() => {
        const result = {}

        for (const key in object) {
          predicate(object[key], key) ? (result[key] = object[key]) : null
        }

        return result
      })()

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
