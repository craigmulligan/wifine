import Wifine from '../index'

let interval = 3000
let thresholdConfig = require('./thresholds.json')

const wifine = new Wifine(interval, thresholdConfig)

wifine.on('data', (data) => {
  console.log('Test results: ', data)
})

wifine.on('error', (data) => {
  console.log('Error: ', data)
})

wifine.on('breach', (data) => {
  console.log('Breach: ', data)
})
