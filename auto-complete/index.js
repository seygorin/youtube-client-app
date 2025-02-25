function createAutoComplete(data) {
  const prefixMap = new Map()

  for (const word of data) {
    const lowerCaseWord = word.toLowerCase()
    for (let i = 1; i <= lowerCaseWord.length; i++) {
      const prefix = lowerCaseWord.slice(0, i)
      if (!prefixMap.has(prefix)) {
        prefixMap.set(prefix, [])
      }
      prefixMap.get(prefix).push(word)
    }
  }

  return function autocomplete(request) {
    if (!request) return []
    return prefixMap.get(request.toLowerCase()) || []
  }
}

module.exports = {createAutoComplete}
