# Simple network monitor for OSX/linux

Pass an interval and threshold config object and listen for events.

### Usage:

```
npm i wifine
```

### Tests:

Currently tests `signal`, `noise`, `rate`, `snr`, `quality`, `packetLoss`, `download` , `upload`

To set threshold values pass an object to the Wifine constructor with key, value and operator:
``` javascript
{
  signal: {
    value:-66,
    operator: >
  },
  quality: {
    value: 70,
    operator: >
  },
  packetLoss: {
    value: 0,
    operator: >
  },
  download: {
    value: 4,
    operator: >
  }
}
```

### Events:
* `data` - Fires for every reading, returns all results.
* `breach` - Fires when a result Value exceeds the value defined in the threshold config.
* `error` - Fires for all caught errors.

### Logging
Logging is configured by passing a config object to the constructor.
eg: `{ on: true, level: 'silly' }`

Logs will be written to: `.wifine/wifine.log`

### Example

``` javascript
var Wifine = require('wifine').default
var interval = 15000
var thresholdConfig = require('./thresholds.json')
var loggingConf = { on: true, level: 'silly' }

const wifine = new Wifine(interval, thresholdConfig, loggingConf)

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
```
