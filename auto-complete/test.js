const {createAutoComplete} = require('./index.js')

const data = ['java', 'javascript', 'python']

const autocomplete = createAutoComplete(data)

console.log('ja')
console.log(autocomplete('ja'))

console.log('javas')
console.log(autocomplete('javas'))

console.log('p')
console.log(autocomplete('p'))

console.log('yes')
console.log(autocomplete('yes'))
