function copy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  const newObj = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = copy(obj[key])
    }
  }

  return newObj
}

function shallowCopy(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  return Array.isArray(obj) ? [...obj] : {...obj}
}

const complexObject = {
  stringValue: 'Hello, World!',
  numberValue: 42,
  booleanValue: true,
  nullValue: null,
  undefinedValue: undefined,
  symbolValue: Symbol('unique'),
  bigIntValue: BigInt(9007199254740991),
  arrayValue: [1, 2, 3, 'four', {nestedKey: 'nestedValue'}],
  nestedObject: {
    level1: {
      level2: {
        level3: {
          stringValue: 'Deep Nesting',
          numberValue: 3.14,
          booleanValue: false,
          arrayValue: [true, false, null],
          anotherNestedObject: {
            level4: 'Final Level',
            functionValue: function () {
              return 'I am a function!'
            },
          },
        },
      },
    },
  },
  functionValue: function () {
    return 'I am a function!'
  },
}

complexObject.testDate = new Date('2023-05-15')
complexObject.testRegex = /example/gi
complexObject.testNested = {
  value: 'original',
  inner: {flag: false},
}

const complexCopy = copy(complexObject)
const shallowsCopy = shallowCopy(complexObject)

complexCopy.stringValue = 'Deep Modified'
shallowsCopy.stringValue = 'Shallow Modified'

complexCopy.arrayValue.push('deep new')
complexCopy.nestedObject.level1.level2.level3.numberValue = 0
complexCopy.testDate.setFullYear(2050)

console.log('deep')
console.log(complexObject.stringValue === 'Hello, World!')
console.log(complexObject.arrayValue.length === 5)
console.log(
  complexObject.nestedObject.level1.level2.level3.numberValue === 3.14
)
console.log(complexObject.testDate.getFullYear() === 2023)

console.log('shallow')
console.log(complexObject.stringValue === 'Hello, World!')

shallowsCopy.arrayValue.push('shallow new')
console.log(complexObject.arrayValue.length === 6)

shallowsCopy.nestedObject.level1.level2.level3.numberValue = 0
console.log(complexObject.nestedObject.level1.level2.level3.numberValue === 0)

shallowsCopy.testDate.setFullYear(2050)
console.log(complexObject.testDate.getFullYear() === 2050)
