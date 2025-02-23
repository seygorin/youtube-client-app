const _ = require('./index.js')

console.log('chunk:')
console.log(_.chunk(['a', 'b', 'c', 'd']))
console.log(_.chunk(['a', 'b', 'c', 'd'], 2))
console.log(_.chunk(['a', 'b', 'c', 'd'], 3))

console.log('\ncompact:')
console.log(_.compact([0, 1, false, 2, '', null, NaN, undefined, 3]))
