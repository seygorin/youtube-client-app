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
var users = [
  {user: 'barney', age: 36, active: true},
  {user: 'fred', age: 40, active: false},
  {user: 'pebbles', age: 1, active: true},
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

console.log('\nfind:')
console.log(_.find(users, (o) => o.age < 40))
console.log(_.find(users, {age: 1, active: true}))
console.log(_.find(users, ['active', false]))
console.log(_.find(users, 'active'))

console.log('\nincludes:')
console.log(_.includes([1, 2, 3], 1))
console.log(_.includes([1, 2, 3], 1, 2))
console.log(_.includes({a: 1, b: 2}, 1))
console.log(_.includes('abcd', 'bc'))

console.log('\nmap:')
console.log(_.map([4, 8], (n) => n * n))
console.log(_.map({a: 4, b: 8}, (n) => n * n))
console.log(_.map(users, 'user'))

console.log('\nzip:')
console.log(_.zip(['a', 'b'], [1, 2], [true, false]))

console.log('\nmerge:')
const object = {a: [{b: 2}, {d: 4}]}
const other = {a: [{c: 3}, {e: 5}]}
console.log(_.merge(object, other))

console.log('\nomit:')
console.log(_.omit({a: 1, b: '2', c: 3}, ['a', 'c']))

console.log('\nomitBy:')
console.log(
  _.omitBy({a: 1, b: '2', c: 3}, (value) => typeof value === 'number')
)

console.log('\npick:')
console.log(_.pick({a: 1, b: '2', c: 3}, ['a', 'c']))

console.log('\npickBy:')
console.log(
  _.pickBy({a: 1, b: '2', c: 3}, (value) => typeof value === 'number')
)
