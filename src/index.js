/** Module monitors network */
import EventEmitter from 'events'
import _ from 'lodash'
import Promise from 'bluebird'
import ping from 'ping'
import compareFactory from 'compare-values'
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
          this._compare(results)
        }
      ).catch((err) => {
        this.emit('error', err)
      })
    }, this.interval)
  }

  _compare (results) {
    _.forOwn(results, (testValue, key) => {
      let threshold = this.thresholdConfig[key]
      if (!_.isUndefined(threshold)) {
        let breach = compareFactory(threshold.operator)
        if (breach(testValue, threshold.value)) {
          this.emit('breach', { test: { [key]: testValue },
          threshold: { [key]: threshold }})
        }
      }
    })
  }
}
