# Simple network monitor for osx/linux

Pass an interval and threshold config object and listen for events.

### Events:
* `data` - Fires for every reading, returns all results.
* `breach` - Fires when a result Value exceeds the value defined in the threshold config.
* `error` - Fires for all caught errors.

```
import Wifine from '../index'

let interval = 3000
let thresholdConfig = {
                        signal: -66,
                        noise: -99,
                        rate: 20,
                        snr: 33,
                        quality: 70,
                        packetLoss: 0,
                        download: 4,
                        upload: 6
                      }

const wifine = new Wifine(interval, thresholdConfig)

wifine.on('data', (data) => {
  console.log('triggered!', data)
})

wifine.on('error', (data) => {
  console.log('error!', data)
})

wifine.on('breach', (data) => {
  console.log('breach!', data)
})
```
