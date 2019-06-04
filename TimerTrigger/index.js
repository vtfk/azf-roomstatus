const { logger } = require('@vtfk/logger')

const axios = require('axios')

module.exports = async function (context, myTimer) {
  try {
    const res = await axios.get('http://localhost:7071/api/SensorPoller')
    if (res.status !== 200 && res.status !== 202) {
      throw Error(res.data)
    }
    logger('info', ['time trigger', res.data])
  } catch (err) {
    logger('error', ['time trigger', 'an error occured', err])
  }
}
