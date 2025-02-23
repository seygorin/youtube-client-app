const isArray = (value) =>
  value === null || value === undefined
    ? false
    : typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      ('0' in value || value.length === 0)

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

module.exports = {
  chunk,
  compact,
}
