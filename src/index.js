/** Module monitors network */
import EventEmitter from 'events'
import _ from 'lodash'
import Promise from 'bluebird'
import compareFactory from 'compare-values'
import isOnline from 'is-online'
import winston from 'winston'
import { getStrength, getSpeed, getPacketLoss } from './utils/networkTests'

export default class Wifine extends EventEmitter {
  constructor ( interval , thresholdConfig, loggerConf ) {
    super()
    this.interval = interval
    this.thresholdConfig = thresholdConfig || require('./thresholds.json')
    this._runTests()
    this._logger(loggerConf)
  }

  _runTests () {
    setInterval(() => {
      // run network tests
      isOnline((err, online) => {
        if (err) {
          this.emit('error', err)
        }
        if (online) {
          Promise.join(
            getStrength(),
            getPacketLoss(),
            getSpeed(),
            (strength, packetLoss, speed) => {
              let results = _.merge(strength, packetLoss, speed)
              this.emit("data", results)
              this._isBreaching(results)
            }
          ).catch((err) => {
            this.emit('error', err)
          })
        } else {
          this.emit('error', 'No internet connection')
        }
      })
    }, this.interval , true)
  }

  _isBreaching (results) {
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

  _logger (loggerConf) {
    if (loggerConf.on || process.env.WIFINE_LOG === 'true') {
      var logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)(),
          new (winston.transports.File)({ filename: './wifine.log' })
        ]
      });

      logger.level = loggerConf.level || process.env.WIFINE_LOG_LEVEL

      this.on('data', (data) => {
        logger.log('info', data);
      })

      this.on('breach', (data) => {
        logger.log('warn', data);
      })

      this.on('error', (data) => {
        logger.log('error', data);
      })
    }
  }
}
