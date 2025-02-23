const _ = require('./index.js')

console.log('chunk:')
console.log(_.chunk(['a', 'b', 'c', 'd']))
console.log(_.chunk(['a', 'b', 'c', 'd'], 2))
console.log(_.chunk(['a', 'b', 'c', 'd'], 3))
