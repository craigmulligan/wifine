import sith from 'sith'
import Promise from 'bluebird'
import ping from 'ping'
import speedTest from'speedtest-net'

Promise.promisify(sith)

function getStrength() {
  return sith()
}

function getSpeed() {
  return new Promise((resolve, reject) => {
    const test = speedTest({maxTime: 5000});

    test.on('data', (data) => {
      resolve(data.speeds)
    })

    test.on('error', (err) => {
      reject(err)
    })
  })
}

function getPacketLoss() {
  // TODO PR to ping module to parse res.output to json
  return new Promise((resolve, reject) => {
    return ping.promise.probe('google.com').then((res) => {
      resolve({ packetLoss: parseFloat(res.output.match(/\d+\.+\d+%/img)[0].slice(0, -1))})
    }).catch((err) => {
      reject(err)
    })
  })
}

export { getStrength, getSpeed, getPacketLoss }
