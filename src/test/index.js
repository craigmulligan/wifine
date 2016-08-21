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

wifine.on('breech', (data) => {
  console.log('breech!', data)
})
