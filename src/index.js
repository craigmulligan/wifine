/** Module monitors network */
import EventEmitter from 'events'
import _ from 'lodash'
import Promise from 'bluebird'
import ping from 'ping'

import { getStrength, getSpeed, getPacketLoss } from './utils/networkTests'

export default class Wifine extends EventEmitter {
  constructor ( interval , thresholdConfig ) {
    super()
    this.interval = interval
    this.thresholdConfig = thresholdConfig
    this._test()
  }

  _test () {
    setInterval(() => {
      Promise.join(
        getStrength(),
        getPacketLoss(),
        getSpeed(),
        (strength, packetLoss, speed) => {
          let results = _.merge(strength, packetLoss, speed)
          this.emit("data", results)
          this._monitor(results)
        }
      ).catch((err) => {
        this.emit('error', err)
      })
    }, this.interval)
  }

  _monitor (results) {
    _.forOwn(results, (value, key) => {
      if (value > this.thresholdConfig[key])
        this.emit('breech', { test: { [key]: value }, threshold: { [key]: this.thresholdConfig[key] }})
    })
  }
}
