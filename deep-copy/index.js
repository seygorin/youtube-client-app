function copy(obj) {
  if (obj === null) return null
  if (obj === undefined) return undefined
  if (
    typeof obj === 'string' ||
    typeof obj === 'number' ||
    typeof obj === 'boolean'
  ) {
    return obj
  }

  if (typeof obj === 'function') {
    return obj.bind({})
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Set) {
    const newSet = new Set()
    obj.forEach((item) => newSet.add(copy(item)))
    return newSet
  }

  if (obj instanceof Map) {
    const newMap = new Map()
    obj.forEach((val, key) => newMap.set(copy(key), copy(val)))
    return newMap
  }

  const newObj = Array.isArray(obj) ? [] : {}

  const descriptors = Object.getOwnPropertyDescriptors(obj)

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const descriptor = descriptors[key]

      if (descriptor.get || descriptor.set) {
        Object.defineProperty(newObj, key, {
          get: descriptor.get,
          set: descriptor.set,
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        })
      } else {
        newObj[key] = copy(obj[key])
      }
    }
  }

  return newObj
}
