// .default because ES6 http://stackoverflow.com/questions/36388766/unexpected-uncaught-typeerror-xxx-is-not-a-constructor-errors-with-babel-and
var Wifine = require('../../dist/index.js').default
var interval = 15000

const wifine = new Wifine(interval, null, { on: true, level: 'silly' })

wifine.on('data', function(data) {
  // Emits on result object on every test
  // console.log('Test results: ', data)
})


wifine.on('breach', function(data) {
  // Emits on a test result breaches the threshold config
  // returns single result object with offended threshold config
  // console.log('Breach: ', data)
})

wifine.on('error', function(data) {
  // Emits on error when error thrown
  // console.log('Error: ', data)
})
