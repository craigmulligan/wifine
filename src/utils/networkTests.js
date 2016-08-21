import sith from 'sith'
import Promise from 'bluebird'
import ping from 'ping'
import speedTest from'speedtest-net'

Promise.promisify(sith);

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
  return ping.promise.probe('google.com').then((res) => {
       return new Promise((resolve, reject) => {
        resolve({ packetLoss: parseFloat(res.output.match(/\d+\.+\d+%/img)[0].slice(0, -1))})
      })
  })
}

export { getStrength, getSpeed, getPacketLoss }
