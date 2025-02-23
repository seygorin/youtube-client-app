const _ = require('./index.js')

console.log('chunk:')
console.log(_.chunk(['a', 'b', 'c', 'd']))
console.log(_.chunk(['a', 'b', 'c', 'd'], 2))
console.log(_.chunk(['a', 'b', 'c', 'd'], 3))

console.log('\ncompact:')
console.log(_.compact([0, 1, false, 2, '', null, NaN, undefined, 3]))

console.log('\ndrop:')
console.log(_.drop([1, 2, 3]))
console.log(_.drop([1, 2, 3], 2))
console.log(_.drop([1, 2, 3], 5))
console.log(_.drop([1, 2, 3], 0))

console.log('\ndropWhile:')
const users = [
  {user: 'barney', active: false},
  {user: 'fred', active: false},
  {user: 'pebbles', active: true},
]
console.log(
  _.dropWhile(users, function (o) {
    return !o.active
  })
)
console.log(_.dropWhile(users, {user: 'barney', active: false}))
console.log(_.dropWhile(users, ['active', false]))
console.log(_.dropWhile(users, 'active'))

console.log('\ntake:')
console.log(_.take([1, 2, 3]))
console.log(_.take([1, 2, 3], 2))
console.log(_.take([1, 2, 3], 5))
console.log(_.take([1, 2, 3], 0))
